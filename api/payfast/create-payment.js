// api/payfast/create-payment.js
// Creates a pending appointment, calls PayFast GetAccessToken,
// returns all fields needed for the browser to POST to PayFast PostTransaction.
// SECURED_KEY NEVER leaves this server-side function.
// MERCHANT_ID is included in postFields as required by PayFast's redirect flow.

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import {
  expireStaleReservations,
  validateAppointmentSlot,
} from './booking-rules.js';

// ─── Config ───────────────────────────────────────────────────────────────────
const ENV              = process.env.PAYFAST_ENV || 'UAT';
const MERCHANT_ID      = process.env.PAYFAST_MERCHANT_ID;
const SECURED_KEY      = process.env.PAYFAST_SECURED_KEY;
const MERCHANT_NAME    = process.env.PAYFAST_MERCHANT_NAME || 'Prof. Dr. Javed Altaf';
const CURRENCY_CODE    = 'PKR';
const TRAN_TYPE        = 'ECOMM_PURCHASE';
const PROCCODE         = '00';
const VERSION          = 'MERCHANT-CART-0.1';
const SITE_BASE_URL    = process.env.VITE_SITE_BASE_URL || 'https://javedaltaf.com';

const PAYFAST_UAT_TOKEN_URL = 'https://ipguat.apps.net.pk/Ecommerce/api/Transaction/GetAccessToken';
const PAYFAST_LIVE_TOKEN_URL = 'https://ipg1.apps.net.pk/Ecommerce/api/Transaction/GetAccessToken';
const PAYFAST_UAT_POST_URL  = 'https://ipguat.apps.net.pk/Ecommerce/api/Transaction/PostTransaction';
const PAYFAST_LIVE_POST_URL = 'https://ipg1.apps.net.pk/Ecommerce/api/Transaction/PostTransaction';

// Test amount: PKR 10 for verification; switch to 4000 in production
const CONSULTATION_AMOUNT = process.env.CONSULTATION_AMOUNT || '10';

function getPayFastUrls() {
  if (ENV === 'LIVE') {
    return { tokenUrl: PAYFAST_LIVE_TOKEN_URL, postUrl: PAYFAST_LIVE_POST_URL };
  }
  return { tokenUrl: PAYFAST_UAT_TOKEN_URL, postUrl: PAYFAST_UAT_POST_URL };
}

// ─── Supabase ─────────────────────────────────────────────────────────────────
function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// ─── CORS helper ──────────────────────────────────────────────────────────────
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', SITE_BASE_URL);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// ─── Handler ──────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── 1. Validate required env vars ──────────────────────────────────────────
  if (!MERCHANT_ID || !SECURED_KEY) {
    console.error('[create-payment] Missing PAYFAST credentials in environment');
    return res.status(500).json({ error: 'Payment gateway not configured' });
  }
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('[create-payment] Missing Supabase credentials in environment');
    return res.status(500).json({ error: 'Database not configured' });
  }

  // ── 2. Parse & validate request body ───────────────────────────────────────
  const {
    patientName,
    patientEmail,
    patientPhone,
    selectedDate,
    selectedTimeSlot,
    notes,
  } = req.body || {};

  const missing = [];
  if (!patientName?.trim())    missing.push('patientName');
  if (!patientEmail?.trim())   missing.push('patientEmail');
  if (!patientPhone?.trim())   missing.push('patientPhone');
  if (!selectedDate)           missing.push('selectedDate');
  if (!selectedTimeSlot?.trim()) missing.push('selectedTimeSlot');

  if (missing.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
  }

  // Basic email validation
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(patientEmail.trim())) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const normalizedSlotTime = selectedTimeSlot.trim();
  const slotValidationError = validateAppointmentSlot(selectedDate, normalizedSlotTime);
  if (slotValidationError) {
    return res.status(400).json({ error: slotValidationError });
  }

  // ── 3. Generate basket_id ──────────────────────────────────────────────────
  const basketId = `JA-${Math.floor(40000 + Math.random() * 50000)}`;
  const txnAmt   = CONSULTATION_AMOUNT;
  const orderDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

  // ── 4. Insert pending appointment in Supabase ──────────────────────────────
  const supabase = getSupabase();

  try {
    await expireStaleReservations(supabase, selectedDate);
  } catch (error) {
    console.error('[create-payment] Reservation cleanup error:', error.message);
    return res.status(500).json({ error: 'Could not verify slot availability' });
  }

  const { data: existingAppointment, error: availabilityErr } = await supabase
    .from('appointments')
    .select('id')
    .eq('slot_date', selectedDate)
    .eq('slot_time', normalizedSlotTime)
    .in('status', ['payment_pending', 'confirmed'])
    .limit(1)
    .maybeSingle();

  if (availabilityErr) {
    console.error('[create-payment] Availability check error:', availabilityErr.message);
    return res.status(500).json({ error: 'Could not verify slot availability' });
  }
  if (existingAppointment) {
    return res.status(409).json({ error: 'This time slot was just reserved. Please select another slot.' });
  }

  const { data: appointment, error: dbErr } = await supabase
    .from('appointments')
    .insert({
      patient_name:    patientName.trim(),
      patient_email:   patientEmail.trim().toLowerCase(),
      patient_phone:   patientPhone.trim(),
      slot_date:       selectedDate,
      slot_time:       normalizedSlotTime,
      amount:          parseInt(txnAmt, 10),
      status:          'payment_pending',
      payment_status:  'unpaid',
      basket_id:       basketId,
      notes:           notes?.trim() || null,
    })
    .select()
    .single();

  if (dbErr) {
    console.error('[create-payment] Supabase insert error:', dbErr.message);
    if (dbErr.code === '23505') {
      return res.status(409).json({ error: 'This time slot was just reserved. Please select another slot.' });
    }
    return res.status(500).json({ error: 'Failed to create appointment record' });
  }

  console.log(`[create-payment] Appointment created: ${appointment.id} basket: ${basketId}`);

  // ── 5. Call PayFast GetAccessToken ─────────────────────────────────────────
  const { tokenUrl, postUrl } = getPayFastUrls();

  let accessToken = null;
  try {
    const tokenRes = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent':   'javedaltaf.com/1.0 PayFast-Integration',
      },
      body: JSON.stringify({
        MERCHANT_ID,
        SECURED_KEY,
        BASKET_ID:     basketId,
        TXNAMT:        txnAmt,
        CURRENCY_CODE,
      }),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error('[create-payment] PayFast token error:', tokenRes.status, errText);
      // Roll back appointment
      await supabase.from('appointments').update({ status: 'failed' }).eq('id', appointment.id);
      return res.status(502).json({ error: 'Payment gateway token request failed' });
    }

    const tokenData = await tokenRes.json();
    accessToken = tokenData.ACCESS_TOKEN || tokenData.access_token || tokenData.token;

    if (!accessToken) {
      console.error('[create-payment] No ACCESS_TOKEN in response:', JSON.stringify(tokenData));
      await supabase.from('appointments').update({ status: 'failed' }).eq('id', appointment.id);
      return res.status(502).json({ error: 'Payment gateway did not return access token' });
    }

    console.log(`[create-payment] ACCESS_TOKEN obtained for basket: ${basketId}`);
  } catch (err) {
    console.error('[create-payment] Token fetch exception:', err.message);
    await supabase.from('appointments').update({ status: 'failed' }).eq('id', appointment.id);
    return res.status(502).json({ error: 'Could not reach payment gateway' });
  }

  // ── 6. Build SIGNATURE ─────────────────────────────────────────────────────
  // PayFast SIGNATURE = SHA256 of concatenated key fields
  const sigString = `${MERCHANT_ID}${SECURED_KEY}${basketId}${txnAmt}`;
  const signature = crypto.createHash('sha256').update(sigString).digest('hex').toUpperCase();

  // ── 7. Return PostTransaction form fields to frontend ──────────────────────
  // SUCCESS_URL / FAILURE_URL include basket_id so pages can poll status
  const postFields = {
    MERCHANT_ID,
    MERCHANT_NAME,
    TOKEN:                   accessToken,
    PROCCODE,
    TXNAMT:                  txnAmt,
    CUSTOMER_MOBILE_NO:      patientPhone.trim(),
    CUSTOMER_EMAIL_ADDRESS:  patientEmail.trim(),
    SIGNATURE:               signature,
    VERSION,
    TXNDESC:                 `Online Consultation - ${patientName.trim()}`,
    SUCCESS_URL:             `${SITE_BASE_URL}/payment-success/${basketId}`,
    FAILURE_URL:             `${SITE_BASE_URL}/payment-failure/${basketId}`,
    BASKET_ID:               basketId,
    ORDER_DATE:              orderDate,
    CHECKOUT_URL:            `${SITE_BASE_URL}/api/payfast/ipn`,
    CURRENCY_CODE,
    TRAN_TYPE,
    CUSTOMER_NAME:           patientName.trim(),
    MERCHANT_USERAGENT:      'javedaltaf.com/1.0',
    COUNTRY:                 'PK',
  };

  return res.status(200).json({
    postUrl,
    postFields,
    basketId,
  });
}
