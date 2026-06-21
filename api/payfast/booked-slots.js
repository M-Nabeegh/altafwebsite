// api/payfast/booked-slots.js
// Returns which time slots are already booked for a given date.
// Called by BookingPage when patient selects a date.

import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export default async function handler(req, res) {
  const SITE_BASE_URL = process.env.VITE_SITE_BASE_URL || 'https://javedaltaf.com';
  res.setHeader('Access-Control-Allow-Origin', SITE_BASE_URL);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { date } = req.query;

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'date query param required (YYYY-MM-DD)' });
  }

  const supabase = getSupabase();

  // Return booked slots for dates where appointment is NOT failed/cancelled
  const { data, error } = await supabase
    .from('appointments')
    .select('slot_time')
    .eq('slot_date', date)
    .neq('status', 'failed')
    .neq('status', 'cancelled');

  if (error) {
    console.error('[booked-slots] Supabase error:', error.message);
    return res.status(500).json({ error: 'Could not fetch booked slots' });
  }

  const bookedSlots = (data || []).map(r => r.slot_time);

  return res.status(200).json({ date, bookedSlots });
}
