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
  rescheduled_at  timestamptz,
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
  notification_type text,
  provider        text,
  provider_message_id text,
  status          text not null default 'sent'
                    check (status in ('sent', 'failed', 'pending', 'unknown')),
  error_code      text,
  error_message   text,
  retryable       boolean not null default false,
  attempt_count   integer not null default 0,
  last_attempt_at timestamptz,
  sent_at         timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  check (notification_type is null or notification_type in ('appointment_confirmation', 'appointment_reminder'))
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

drop trigger if exists set_notifications_updated_at on notifications;
create trigger set_notifications_updated_at
  before update on notifications
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

create index if not exists idx_appointments_reminder_lookup
  on appointments(slot_date, status, payment_status)
  where status = 'confirmed' and payment_status = 'paid';

create unique index if not exists uq_sms_notification_type
  on notifications(appointment_id, notification_type)
  where channel = 'sms' and notification_type is not null;

-- Atomically reserves one SMS notification. A definitive provider rejection may
-- be retried after four minutes, up to the configured attempt limit. Pending,
-- sent, and ambiguous/unknown deliveries are never automatically reclaimed.
create or replace function claim_sms_notification(
  p_appointment_id uuid,
  p_notification_type text,
  p_recipient text,
  p_message text,
  p_max_attempts integer default 3
)
returns table(notification_id uuid, notification_attempt_count integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  claimed notifications%rowtype;
begin
  if p_notification_type = 'appointment_reminder' and not exists (
    select 1 from appointments
    where id = p_appointment_id
      and status = 'confirmed'
      and payment_status = 'paid'
      and rescheduled_at is null
  ) then
    return;
  end if;

  insert into notifications (
    appointment_id, channel, notification_type, provider, recipient, message,
    status, retryable, attempt_count, last_attempt_at
  ) values (
    p_appointment_id, 'sms', p_notification_type, 'veevotech', p_recipient, p_message,
    'pending', false, 1, now()
  )
  on conflict (appointment_id, notification_type)
    where channel = 'sms' and notification_type is not null
  do update set
    recipient = excluded.recipient,
    message = excluded.message,
    status = 'pending',
    retryable = false,
    error_code = null,
    error_message = null,
    attempt_count = notifications.attempt_count + 1,
    last_attempt_at = now(),
    updated_at = now()
  where notifications.status = 'failed'
    and notifications.retryable = true
    and notifications.attempt_count < p_max_attempts
    and notifications.updated_at <= now() - interval '4 minutes'
  returning notifications.* into claimed;

  if claimed.id is not null then
    return query select claimed.id, claimed.attempt_count;
  end if;
end;
$$;

revoke all on function claim_sms_notification(uuid, text, text, text, integer) from public;
grant execute on function claim_sms_notification(uuid, text, text, text, integer) to service_role;

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
