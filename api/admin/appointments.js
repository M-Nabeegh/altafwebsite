// api/admin/appointments.js
// Protected admin endpoint for the doctor dashboard.
// Requires ADMIN_PASSWORD env var to match.

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export default async function handler(req, res) {
  const SITE_BASE_URL = process.env.VITE_SITE_BASE_URL || 'https://javedaltaf.com';
  res.setHeader('Access-Control-Allow-Origin', SITE_BASE_URL);
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'x-admin-password, Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Password check via header
  const submitted = req.headers['x-admin-password'];
  const adminPass  = process.env.ADMIN_PASSWORD;

  if (!adminPass) {
    return res.status(500).json({ error: 'Admin password not configured' });
  }
  if (!submitted || submitted.length !== adminPass.length ||
      !crypto.timingSafeEqual(Buffer.from(submitted), Buffer.from(adminPass))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const supabase = getSupabase();

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Missing appointment ID' });
    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  if (req.method === 'PATCH') {
    const { id, slot_date, slot_time } = req.body || {};
    if (!id || !slot_date || !slot_time) return res.status(400).json({ error: 'Missing fields' });
    const { error } = await supabase.from('appointments').update({ slot_date, slot_time }).eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { filter, date } = req.query;

  let query = supabase
    .from('appointments')
    .select(`
      id, patient_name, patient_email, patient_phone,
      slot_date, slot_time, amount, status, payment_status,
      basket_id, notes, created_at, updated_at
    `)
    .order('slot_date', { ascending: true })
    .order('slot_time', { ascending: true });

  // Optional filters
  if (filter && filter !== 'all') {
    query = query.eq('status', filter);
  }
  if (date) {
    query = query.eq('slot_date', date);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[admin/appointments] error:', error.message);
    return res.status(500).json({ error: 'Database error' });
  }

  // Stats summary
  const stats = {
    total:     data.length,
    confirmed: data.filter(a => a.status === 'confirmed').length,
    pending:   data.filter(a => a.status === 'payment_pending').length,
    failed:    data.filter(a => a.status === 'failed').length,
    revenue:   data.filter(a => a.payment_status === 'paid').reduce((s, a) => s + a.amount, 0),
  };

  return res.status(200).json({ appointments: data, stats });
}
