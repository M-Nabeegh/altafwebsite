-- ============================================================
-- javedaltaf.com — PayFast Payment Integration Schema
-- Run this entire file in your Supabase SQL Editor
-- ============================================================

-- ─── 1. appointments ──────────────────────────────────────────────────────────
create table if not exists appointments (
  id              uuid primary key default gen_random_uuid(),
  patient_name    text not null,
  patient_phone   text not null,
  patient_email   text not null,
  doctor_id       text not null default 'dr-javed-altaf',
  slot_date       date not null,
  slot_time       text not null,
  amount          integer not null default 10,
  notes           text,
  status          text not null default 'pending'
                    check (status in ('pending', 'payment_pending', 'confirmed', 'failed', 'cancelled')),
  payment_status  text not null default 'unpaid'
                    check (payment_status in ('unpaid', 'paid', 'failed', 'refunded')),
  basket_id       text unique not null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table appointments is 'Patient appointment bookings for javedaltaf.com';
comment on column appointments.basket_id is 'Unique PayFast basket_id — format JA-XXXXXXXXXXXX';
comment on column appointments.amount is 'Amount in PKR (integer, no decimals)';

-- ─── 2. payment_transactions ──────────────────────────────────────────────────
create table if not exists payment_transactions (
  id                    uuid primary key default gen_random_uuid(),
  appointment_id        uuid references appointments(id) on delete cascade,
  merchant_id           text,
  basket_id             text not null,
  transaction_id        text,
  err_code              text,
  err_msg               text,
  payment_name          text,
  merchant_amount       text,
  transaction_amount    text,
  transaction_currency  text,
  validation_hash       text,
  raw_payload           jsonb,
  verified              boolean not null default false,
  created_at            timestamptz not null default now()
);

comment on table payment_transactions is 'Raw PayFast IPN payloads for auditing';
comment on column payment_transactions.verified is 'true only when err_code=000 AND hash validated';
comment on column payment_transactions.raw_payload is 'Complete IPN POST body stored for audit';

-- Index for basket_id lookups
create index if not exists idx_payment_transactions_basket_id
  on payment_transactions(basket_id);

-- ─── 3. notifications ──────────────────────────────────────────────────────────
create table if not exists notifications (
  id              uuid primary key default gen_random_uuid(),
  appointment_id  uuid references appointments(id) on delete cascade,
  channel         text not null default 'email'
                    check (channel in ('email', 'sms', 'whatsapp')),
  recipient       text not null,
  message         text,
  status          text not null default 'sent'
                    check (status in ('sent', 'failed', 'pending')),
  created_at      timestamptz not null default now()
);

comment on table notifications is 'Log of all notifications sent after payment confirmation';

-- ─── 4. updated_at trigger ────────────────────────────────────────────────────
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_appointments_updated_at on appointments;
create trigger set_appointments_updated_at
  before update on appointments
  for each row execute function update_updated_at_column();

-- ─── 5. Row Level Security ────────────────────────────────────────────────────
-- All access is via service role key (server-side only).
-- No anon/public access allowed.

alter table appointments          enable row level security;
alter table payment_transactions  enable row level security;
alter table notifications         enable row level security;

-- No public policies — service role bypasses RLS automatically.
-- Anon users have zero access to these tables.

-- ─── 6. Explicit GRANTs for service_role ─────────────────────────────────────
-- Required for Supabase projects where service_role needs explicit table grants.

grant usage on schema public to service_role;

grant all privileges on public.appointments         to service_role;
grant all privileges on public.payment_transactions to service_role;
grant all privileges on public.notifications        to service_role;

-- Also grant on sequences (for any serial/identity columns)
grant usage, select on all sequences in schema public to service_role;

-- ─── 6. Indexes ───────────────────────────────────────────────────────────────
create index if not exists idx_appointments_basket_id
  on appointments(basket_id);

create index if not exists idx_appointments_status
  on appointments(status);

create index if not exists idx_appointments_slot_date
  on appointments(slot_date);

create index if not exists idx_appointments_patient_email
  on appointments(patient_email);

-- Prevent two active reservations from owning the same date/time. Failed,
-- cancelled, and expired checkout attempts do not block a future booking.
create unique index if not exists uq_appointments_active_slot
  on appointments(slot_date, slot_time)
  where status in ('payment_pending', 'confirmed')
    and slot_time in (
      '10:00 AM - 10:15 AM',
      '10:15 AM - 10:30 AM',
      '10:30 AM - 10:45 AM',
      '10:45 AM - 11:00 AM',
      '11:00 AM - 11:15 AM',
      '11:15 AM - 11:30 AM',
      '11:30 AM - 11:45 AM',
      '11:45 AM - 12:00 PM'
    );
