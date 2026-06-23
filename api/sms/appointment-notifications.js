import {
  buildConfirmationSms,
  normalizePakistaniMobile,
  sanitizeSmsError,
  sendVeevoTechSms,
} from './veevotech.js';

export function createSupabaseNotificationStore(supabase) {
  return {
    async claim({ appointmentId, notificationType, recipient, message }) {
      const { data, error } = await supabase.rpc('claim_sms_notification', {
        p_appointment_id: appointmentId,
        p_notification_type: notificationType,
        p_recipient: recipient,
        p_message: message,
        p_max_attempts: 3,
      });

      if (error) throw new Error(`Could not reserve SMS notification: ${error.code || 'DATABASE_ERROR'}`);
      const row = Array.isArray(data) ? data[0] : data;
      return row?.notification_id
        ? { claimed: true, id: row.notification_id, attemptCount: row.notification_attempt_count }
        : { claimed: false };
    },

    async markSent(id, providerMessageId) {
      const timestamp = new Date().toISOString();
      const { error } = await supabase
        .from('notifications')
        .update({
          status: 'sent',
          provider_message_id: providerMessageId,
          error_code: null,
          error_message: null,
          sent_at: timestamp,
          updated_at: timestamp,
        })
        .eq('id', id);
      if (error) {
        const logError = new Error('Could not record successful SMS delivery');
        logError.code = 'NOTIFICATION_LOG_ERROR';
        logError.ambiguous = true;
        throw logError;
      }
    },

    async markFailed(id, error) {
      const safeError = sanitizeSmsError(error);
      const { error: updateError } = await supabase
        .from('notifications')
        .update({
          status: safeError.ambiguous ? 'unknown' : 'failed',
          error_code: safeError.code,
          error_message: safeError.message,
          retryable: safeError.retryable && !safeError.ambiguous,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      if (updateError) throw new Error('Could not record failed SMS delivery');
    },
  };
}

export async function deliverSmsNotification({
  store,
  appointment,
  notificationType,
  buildMessage,
  sendSms,
}) {
  let recipient;
  let message;

  try {
    recipient = normalizePakistaniMobile(appointment.patient_phone);
    message = buildMessage(appointment);
  } catch (error) {
    const safeError = sanitizeSmsError(error);
    try {
      const claim = await store.claim({
        appointmentId: appointment.id,
        notificationType,
        recipient: String(appointment.patient_phone || 'invalid').trim().slice(0, 32) || 'invalid',
        message: 'SMS not generated because appointment contact data is invalid',
      });
      if (claim.claimed) await store.markFailed(claim.id, error);
    } catch {
      // The paid appointment remains valid even if failure logging is unavailable.
    }
    return { status: 'failed', error: safeError };
  }

  const claim = await store.claim({
    appointmentId: appointment.id,
    notificationType,
    recipient,
    message,
  });

  if (!claim.claimed) return { status: 'duplicate' };

  try {
    const result = await sendSms({ recipient, message });
    await store.markSent(claim.id, result.messageId);
    return { status: 'sent', messageId: result.messageId };
  } catch (error) {
    await store.markFailed(claim.id, error);
    return { status: error?.ambiguous ? 'unknown' : 'failed', error: sanitizeSmsError(error) };
  }
}

export function sendAppointmentConfirmationSms({ supabase, appointment, fetchImpl }) {
  if (appointment.status !== 'confirmed' || appointment.payment_status !== 'paid') {
    return Promise.resolve({ status: 'skipped_ineligible' });
  }

  const store = createSupabaseNotificationStore(supabase);
  return deliverSmsNotification({
    store,
    appointment,
    notificationType: 'appointment_confirmation',
    buildMessage: buildConfirmationSms,
    sendSms: ({ recipient, message }) => sendVeevoTechSms({
      apiHash: process.env.VEEVOTECH_API_HASH,
      senderId: process.env.VEEVOTECH_SENDER_ID || 'Default',
      recipient,
      message,
      fetchImpl,
    }),
  });
}
