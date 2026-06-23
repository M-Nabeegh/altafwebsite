// api/payfast/ipn.js
// PayFast IPN (Instant Payment Notification) handler.
// This is the ONLY source of truth for payment verification.
// 1. Validates the HMAC-SHA256 validation_hash
// 2. Confirms appointment if err_code === "000"
// 3. Sends confirmation SMS via VeevoTech and emails via Resend
// 4. Returns HTTP 200 to PayFast regardless (to prevent retries)

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { Resend } from 'resend';
import { patientConfirmationHtml } from '../emails/patientConfirmation.js';
import { doctorNotificationHtml } from '../emails/doctorNotification.js';
import { sendAppointmentConfirmationSms } from '../sms/appointment-notifications.js';
import { getReservationCutoffISO } from './booking-rules.js';

// ─── Config ───────────────────────────────────────────────────────────────────
const MERCHANT_ID   = process.env.PAYFAST_MERCHANT_ID;
const SECURED_KEY   = process.env.PAYFAST_SECURED_KEY;
const DOCTOR_EMAIL  = process.env.DOCTOR_EMAIL || 'contact@javedaltaf.com';
const EMAIL_FROM    = process.env.EMAIL_FROM   || 'appointments@javedaltaf.com';

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

// ─── Hash Verification ────────────────────────────────────────────────────────
// PayFast: SHA256( basket_id | SECURED_KEY | MERCHANT_ID | err_code )
function computeValidationHash(basketId, errCode) {
  const raw = `${basketId}|${SECURED_KEY}|${MERCHANT_ID}|${errCode}`;
  return crypto.createHash('sha256').update(raw).digest('hex');
}

function isHashValid(basketId, errCode, receivedHash) {
  if (!receivedHash) return false;
  const expected = computeValidationHash(basketId, errCode);
  // Constant-time comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected.toLowerCase()),
      Buffer.from(receivedHash.toLowerCase())
    );
  } catch {
    return false;
  }
}

// ─── Email Helpers ─────────────────────────────────────────────────────────────
async function sendEmails(resend, appointment, ipnData) {
  const results = [];

  // Email to patient
  try {
    const patientResult = await resend.emails.send({
      from: `Prof. Dr. Javed Altaf <${EMAIL_FROM}>`,
      to:   [appointment.patient_email],
      subject: '✅ Appointment Confirmed — Prof. Dr. Javed Altaf',
      html: patientConfirmationHtml({
        patientName:    appointment.patient_name,
        slotDate:       appointment.slot_date,
        slotTime:       appointment.slot_time,
        basketId:       appointment.basket_id,
        amount:         appointment.amount,
        transactionId:  ipnData.transaction_id,
        orderDate:      ipnData.order_date,
      }),
    });
    results.push({ channel: 'email', recipient: appointment.patient_email, status: 'sent' });
    console.log('[ipn] Patient email sent:', patientResult?.data?.id);
  } catch (err) {
    console.error('[ipn] Patient email error:', err.message);
    results.push({ channel: 'email', recipient: appointment.patient_email, status: 'failed' });
  }

  // Email to doctor/admin
  try {
    const doctorResult = await resend.emails.send({
      from: `Booking System <${EMAIL_FROM}>`,
      to:   [DOCTOR_EMAIL],
      subject: `🔔 New Confirmed Booking — ${appointment.patient_name}`,
      html: doctorNotificationHtml({
        patientName:   appointment.patient_name,
        patientEmail:  appointment.patient_email,
        patientPhone:  appointment.patient_phone,
        slotDate:      appointment.slot_date,
        slotTime:      appointment.slot_time,
        basketId:      appointment.basket_id,
        amount:        appointment.amount,
        transactionId: ipnData.transaction_id,
        notes:         appointment.notes,
      }),
    });
    results.push({ channel: 'email', recipient: DOCTOR_EMAIL, status: 'sent' });
    console.log('[ipn] Doctor email sent:', doctorResult?.data?.id);
  } catch (err) {
    console.error('[ipn] Doctor email error:', err.message);
    results.push({ channel: 'email', recipient: DOCTOR_EMAIL, status: 'failed' });
  }

  return results;
}

// ─── Handler ──────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  // Always return 200 to PayFast — even on our own errors — to prevent retries
  // We log everything and handle internally.

  if (req.method !== 'POST') {
    return res.status(200).end(); // PayFast health check
  }

  const body = req.body || {};

  const {
    transaction_id,
    err_code,
    err_msg,
    basket_id,
    order_date,
    validation_hash,
    PaymentName,
    transaction_amount,
    merchant_amount,
    transaction_currency,
  } = body;

  console.log(`[ipn] Received callback: basket=${basket_id} err_code=${err_code} txn=${transaction_id}`);

  // ── Guard: missing required fields ─────────────────────────────────────────
  if (!basket_id || !err_code || !validation_hash) {
    console.error('[ipn] Missing required IPN fields');
    return res.status(200).json({ received: true, status: 'ignored_missing_fields' });
  }

  // ── Guard: credentials configured ──────────────────────────────────────────
  if (!MERCHANT_ID || !SECURED_KEY) {
    console.error('[ipn] Missing PayFast credentials');
    return res.status(200).json({ received: true, status: 'config_error' });
  }

  // ── Hash verification ───────────────────────────────────────────────────────
  if (!isHashValid(basket_id, err_code, validation_hash)) {
    console.error(`[ipn] HASH MISMATCH for basket: ${basket_id}`);
    return res.status(200).json({ received: true, status: 'hash_mismatch' });
  }

  console.log(`[ipn] Hash verified for basket: ${basket_id}`);

  const supabase = getSupabase();

  // ── Fetch appointment ───────────────────────────────────────────────────────
  const { data: appointment, error: findErr } = await supabase
    .from('appointments')
    .select('*')
    .eq('basket_id', basket_id)
    .single();

  if (findErr || !appointment) {
    console.error(`[ipn] Appointment not found for basket: ${basket_id}`, findErr?.message);
    return res.status(200).json({ received: true, status: 'appointment_not_found' });
  }

  // ── Idempotency: already confirmed ────────────────────────────────────────
  if (appointment.status === 'confirmed' && appointment.payment_status === 'paid') {
    console.log(`[ipn] Duplicate callback — already confirmed: ${basket_id}`);
    try {
      const smsResult = await sendAppointmentConfirmationSms({ supabase, appointment });
      console.log(`[ipn] Existing confirmation SMS outcome: ${smsResult.status}`);
    } catch (error) {
      console.error('[ipn] Existing confirmation SMS logging error:', error.message);
    }
    return res.status(200).json({ received: true, status: 'already_confirmed' });
  }

  // ── Store raw IPN payload ───────────────────────────────────────────────────
  const { error: txnErr } = await supabase
    .from('payment_transactions')
    .insert({
      appointment_id:       appointment.id,
      merchant_id:          MERCHANT_ID,
      basket_id,
      transaction_id:       transaction_id || null,
      err_code,
      err_msg:              err_msg || null,
      payment_name:         PaymentName || null,
      merchant_amount:      merchant_amount || null,
      transaction_amount:   transaction_amount || null,
      transaction_currency: transaction_currency || null,
      validation_hash,
      raw_payload:          body,
      verified:             err_code === '000',
    })
    .select()
    .single();

  if (txnErr) {
    console.error('[ipn] Failed to store transaction:', txnErr.message);
  }

  // ── Process result based on err_code ───────────────────────────────────────
  if (err_code === '000') {
    // ── SUCCESS ──────────────────────────────────────────────────────────────
    console.log(`[ipn] Payment SUCCESS — confirming appointment: ${appointment.id}`);

    // A checkout hold may have expired while the patient was still at the
    // gateway. Never reclaim a slot that may already have been rebooked.
    const reservationExpired = appointment.status === 'cancelled'
      || (appointment.status === 'payment_pending'
        && new Date(appointment.created_at).getTime() < new Date(getReservationCutoffISO()).getTime());

    if (reservationExpired) {
      const { error: latePaymentError } = await supabase
        .from('appointments')
        .update({ status: 'cancelled', payment_status: 'paid' })
        .eq('id', appointment.id);

      if (latePaymentError) {
        console.error('[ipn] Could not record late payment:', latePaymentError.message);
      }

      console.error(`[ipn] PAID AFTER RESERVATION EXPIRED — manual review required: ${basket_id}`);
      return res.status(200).json({ received: true, status: 'paid_after_expiry' });
    }

    const { error: confirmationError } = await supabase
      .from('appointments')
      .update({
        status:         'confirmed',
        payment_status: 'paid',
        updated_at:     new Date().toISOString(),
      })
      .eq('id', appointment.id);

    if (confirmationError) {
      console.error('[ipn] Could not confirm appointment:', confirmationError.message);

      // A database uniqueness conflict means another active appointment owns
      // this slot. Preserve the payment for manual review without double-booking.
      await supabase
        .from('appointments')
        .update({ status: 'cancelled', payment_status: 'paid' })
        .eq('id', appointment.id);

      return res.status(200).json({ received: true, status: 'confirmation_conflict' });
    }

    // The appointment is already confirmed before any notification is sent.
    // SMS/email failures are logged but must never roll back a paid booking.
    const resend = getResend();
    const confirmedAppointment = {
      ...appointment,
      status: 'confirmed',
      payment_status: 'paid',
    };
    const [smsResult, emailResults] = await Promise.all([
      sendAppointmentConfirmationSms({ supabase, appointment: confirmedAppointment }).catch((error) => {
        console.error('[ipn] Confirmation SMS logging error:', error.message);
        return { status: 'failed' };
      }),
      sendEmails(resend, appointment, { transaction_id, order_date }),
    ]);
    console.log(`[ipn] Confirmation SMS outcome: ${smsResult.status}`);

    // ── Log notifications ──────────────────────────────────────────────────────
    if (emailResults.length > 0) {
      await supabase.from('notifications').insert(
        emailResults.map(r => ({
          appointment_id: appointment.id,
          channel:        r.channel,
          recipient:      r.recipient,
          message:        'Appointment confirmation email',
          status:         r.status,
        }))
      );
    }

    console.log(`[ipn] Appointment ${appointment.id} confirmed. Notifications processed.`);
    return res.status(200).json({ received: true, status: 'confirmed' });
  } else {
    // ── FAILURE ───────────────────────────────────────────────────────────────
    console.log(`[ipn] Payment FAILED — err_code=${err_code} err_msg=${err_msg} basket=${basket_id}`);

    await supabase
      .from('appointments')
      .update({
        status:         'failed',
        payment_status: 'failed',
        updated_at:     new Date().toISOString(),
      })
      .eq('id', appointment.id);

    return res.status(200).json({ received: true, status: 'payment_failed', err_code, err_msg });
  }
}
