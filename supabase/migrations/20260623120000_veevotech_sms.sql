-- VeevoTech appointment confirmation and reminder support.
-- Apply this once in the Supabase SQL Editor before deploying the application.

alter table appointments
  add column if not exists rescheduled_at timestamptz;

alter table notifications
  add column if not exists notification_type text,
  add column if not exists provider text,
  add column if not exists provider_message_id text,
  add column if not exists error_code text,
  add column if not exists error_message text,
  add column if not exists retryable boolean not null default false,
  add column if not exists attempt_count integer not null default 0,
  add column if not exists last_attempt_at timestamptz,
  add column if not exists sent_at timestamptz,
  add column if not exists updated_at timestamptz not null default now();

alter table notifications drop constraint if exists notifications_status_check;
alter table notifications
  add constraint notifications_status_check
  check (status in ('sent', 'failed', 'pending', 'unknown'));

alter table notifications drop constraint if exists notifications_notification_type_check;
alter table notifications
  add constraint notifications_notification_type_check
  check (notification_type is null or notification_type in ('appointment_confirmation', 'appointment_reminder'));

create index if not exists idx_appointments_reminder_lookup
  on appointments(slot_date, status, payment_status)
  where status = 'confirmed' and payment_status = 'paid';

create unique index if not exists uq_sms_notification_type
  on notifications(appointment_id, notification_type)
  where channel = 'sms' and notification_type is not null;

drop trigger if exists set_notifications_updated_at on notifications;
create trigger set_notifications_updated_at
  before update on notifications
  for each row execute function update_updated_at_column();

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

comment on column appointments.rescheduled_at is
  'Set when an admin changes the appointment slot; rescheduled appointments are excluded from automatic reminders.';
comment on column notifications.provider_message_id is
  'Provider-issued SMS message identifier. Never stores credentials or raw provider payloads.';
