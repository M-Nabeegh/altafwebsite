import { createClient } from 'npm:@supabase/supabase-js@2.108.2';
import {
  appointmentTimestamp,
  buildReminderSms,
  karachiDateKey,
  normalizePakistaniMobile,
  sendVeevoTechSms,
  SmsError,
} from '../_shared/appointment-sms.ts';

const WINDOW_BEFORE_MS = 55 * 60 * 1000;
const WINDOW_AFTER_MS = 65 * 60 * 1000;

Deno.serve(async (request) => {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const apiHash = Deno.env.get('VEEVOTECH_API_HASH');
  const senderId = Deno.env.get('VEEVOTECH_SENDER_ID') || 'Default';
  if (!supabaseUrl || !serviceRoleKey || !apiHash) {
    console.error('[appointment-reminders] Missing server configuration');
    return Response.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const now = new Date();
  const windowStart = new Date(now.getTime() + WINDOW_BEFORE_MS);
  const windowEnd = new Date(now.getTime() + WINDOW_AFTER_MS);

  const { data: appointments, error: queryError } = await supabase
    .from('appointments')
    .select('id, patient_name, patient_phone, slot_date, slot_time')
    .eq('status', 'confirmed')
    .eq('payment_status', 'paid')
    .is('rescheduled_at', null)
    .gte('slot_date', karachiDateKey(windowStart))
    .lte('slot_date', karachiDateKey(windowEnd));

  if (queryError) {
    console.error('[appointment-reminders] Appointment query failed');
    return Response.json({ error: 'Could not load reminders' }, { status: 500 });
  }

  let sent = 0;
  let skipped = 0;
  let failed = 0;
  let unknown = 0;

  for (const appointment of appointments || []) {
    try {
      const startsAt = appointmentTimestamp(appointment.slot_date, appointment.slot_time);
      if (startsAt < windowStart.getTime() || startsAt > windowEnd.getTime()) {
        skipped += 1;
        continue;
      }

      const recipient = normalizePakistaniMobile(appointment.patient_phone);
      const message = buildReminderSms(appointment);
      const { data: claimData, error: claimError } = await supabase.rpc('claim_sms_notification', {
        p_appointment_id: appointment.id,
        p_notification_type: 'appointment_reminder',
        p_recipient: recipient,
        p_message: message,
        p_max_attempts: 3,
      });
      if (claimError) throw new Error('REMINDER_CLAIM_FAILED');
      const claim = Array.isArray(claimData) ? claimData[0] : claimData;
      if (!claim?.notification_id) {
        skipped += 1;
        continue;
      }

      try {
        const result = await sendVeevoTechSms({ apiHash, senderId, recipient, message });
        const timestamp = new Date().toISOString();
        await supabase.from('notifications').update({
          status: 'sent',
          provider_message_id: result.messageId,
          error_code: null,
          error_message: null,
          retryable: false,
          sent_at: timestamp,
          updated_at: timestamp,
        }).eq('id', claim.notification_id);
        sent += 1;
      } catch (error) {
        const smsError = error instanceof SmsError
          ? error
          : new SmsError('SMS delivery failed', { code: 'SMS_UNEXPECTED_ERROR', ambiguous: true });
        await supabase.from('notifications').update({
          status: smsError.ambiguous ? 'unknown' : 'failed',
          error_code: smsError.code,
          error_message: smsError instanceof SmsError ? smsError.message : 'SMS delivery failed',
          retryable: smsError.retryable && !smsError.ambiguous,
          updated_at: new Date().toISOString(),
        }).eq('id', claim.notification_id);
        if (smsError.ambiguous) unknown += 1;
        else failed += 1;
      }
    } catch (error) {
      console.error('[appointment-reminders] Reminder processing failed', {
        appointmentId: appointment.id,
        code: error instanceof SmsError ? error.code : 'REMINDER_PROCESSING_ERROR',
      });
      failed += 1;
    }
  }

  return Response.json({ checked: appointments?.length || 0, sent, skipped, failed, unknown });
});
