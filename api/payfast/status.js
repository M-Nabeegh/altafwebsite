// api/payfast/status.js
// Polling endpoint used by the PaymentSuccess / PaymentFailure pages.
// Returns the current payment & appointment status for a given basket_id.
// Never exposes SECURED_KEY or sensitive gateway data.

import { createClient } from '@supabase/supabase-js';

const SITE_BASE_URL = process.env.VITE_SITE_BASE_URL || 'https://javedaltaf.com';

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', SITE_BASE_URL);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { orderId } = req.query;

  if (!orderId || typeof orderId !== 'string') {
    return res.status(400).json({ error: 'orderId query parameter is required' });
  }

  // Validate basket_id format (JA-XXXXX)
  if (!/^JA-[A-Z0-9]{4,12}$/.test(orderId)) {
    return res.status(400).json({ error: 'Invalid order ID format' });
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const supabase = getSupabase();

  const { data: appointment, error } = await supabase
    .from('appointments')
    .select(
      'id, patient_name, patient_email, slot_date, slot_time, amount, status, payment_status, basket_id, created_at'
    )
    .eq('basket_id', orderId)
    .single();

  if (error || !appointment) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  // Return only safe public fields
  return res.status(200).json({
    basketId:       appointment.basket_id,
    status:         appointment.status,
    paymentStatus:  appointment.payment_status,
    patientName:    appointment.patient_name,
    slotDate:       appointment.slot_date,
    slotTime:       appointment.slot_time,
    amount:         appointment.amount,
    createdAt:      appointment.created_at,
  });
}
