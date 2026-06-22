#!/usr/bin/env node
// scripts/migrate.mjs
// Applies the PayFast payment schema to Supabase.
// Run: node scripts/migrate.mjs

import { createClient } from '@supabase/supabase-js';
import { config } from './dotenv-loader.mjs';

config(); // Load .env

const SUPABASE_URL              = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ─── Test connection ──────────────────────────────────────────────────────────
console.log('🔌 Testing Supabase connection...');

async function testConnection() {
  const { error } = await supabase.from('appointments').select('count').limit(1);
  if (error && error.code === '42P01') {
    return 'tables_missing'; // Table doesn't exist yet
  }
  if (error) {
    return { error: error.message };
  }
  return 'tables_exist';
}

const connResult = await testConnection();

if (connResult === 'tables_exist') {
  console.log('✅ Supabase connected. Tables already exist.');
  console.log('   Run a full query to verify...');
  
  const { count, error } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true });
  
  if (!error) {
    console.log(`   appointments table: ${count} rows`);
    console.log('✅ Schema is already applied. Ready to go!');
  }
  process.exit(0);
}

if (connResult && connResult.error) {
  console.error('❌ Supabase connection failed:', connResult.error);
  process.exit(1);
}

// Tables missing — guide user to apply schema
console.log('\n⚠️  Tables not found in Supabase.');
console.log('');
console.log('Please run the schema SQL manually:');
console.log('');
console.log('1. Open: https://supabase.com/dashboard/project/qqhskjfqgztnqpajzfkm/sql/new');
console.log('2. Paste the contents of: api/supabase/schema.sql');
console.log('3. Click Run');
console.log('');
console.log('After running the SQL, run this script again to verify.');
