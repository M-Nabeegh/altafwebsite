-- Run after deploying the appointment-reminders Edge Function.
-- Before running, store the project URL and anon key in Supabase Vault:
--   select vault.create_secret('https://YOUR_PROJECT_REF.supabase.co', 'project_url');
--   select vault.create_secret('YOUR_SUPABASE_ANON_KEY', 'anon_key');
-- The anon key only authenticates the cron request. The Edge Function reads data
-- with its server-side SUPABASE_SERVICE_ROLE_KEY environment variable.

create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.unschedule(jobid)
from cron.job
where jobname = 'appointment-sms-reminders';

select cron.schedule(
  'appointment-sms-reminders',
  '*/5 * * * *',
  $$
  select net.http_post(
    url := (
      select decrypted_secret
      from vault.decrypted_secrets
      where name = 'project_url'
      limit 1
    ) || '/functions/v1/appointment-reminders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (
        select decrypted_secret
        from vault.decrypted_secrets
        where name = 'anon_key'
        limit 1
      )
    ),
    body := '{}'::jsonb
  );
  $$
);
