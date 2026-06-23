# VeevoTech appointment SMS deployment

The integration has two server-side senders:

- Vercel sends a confirmation only after a PayFast IPN hash is verified and the appointment update to `confirmed` / `paid` succeeds.
- A Supabase Edge Function sends reminders for eligible appointments approximately one hour before the starting time.

No frontend bundle receives the VeevoTech hash.

## 1. Apply the database migration

Apply `supabase/migrations/20260623120000_veevotech_sms.sql` with `supabase db push`, or run it once in the Supabase SQL Editor.

This adds notification delivery metadata, an atomic/idempotent SMS claim function, a reminder lookup index, and `appointments.rescheduled_at`. The admin reschedule endpoint sets this timestamp, and those appointments are excluded from automatic reminders.

## 2. Configure and deploy the Edge Function

Authenticate the Supabase CLI, then set the Edge Function secrets and deploy:

```sh
supabase secrets set VEEVOTECH_API_HASH=YOUR_HASH VEEVOTECH_SENDER_ID=Default --project-ref YOUR_PROJECT_REF
supabase functions deploy appointment-reminders --project-ref YOUR_PROJECT_REF
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are supplied to hosted Edge Functions by Supabase. Never put the service-role key or VeevoTech hash in cron SQL, client code, or a `VITE_` variable.

## 3. Configure the five-minute cron

In the Supabase SQL Editor, store the project URL and anon key in Vault using the placeholder commands at the top of `supabase/cron/appointment-reminders.sql`. Then run the rest of that file.

The anon key authenticates invocation of the Edge Function. Database reads and writes still happen inside the function with the server-side service-role key.

## 4. Configure Vercel

Add these variables to the required Vercel environments (Preview and/or Production):

```text
VEEVOTECH_API_HASH=<secret hash>
VEEVOTECH_SENDER_ID=Default
```

Redeploy the website after adding the variables. Do not prefix either variable with `VITE_`.

## 5. Verify without sending a real SMS

```sh
npm test
npm run lint
npm run build
```

The automated provider tests use a mocked HTTP request. A real paid/IPN test or manual invocation can send an actual SMS and should only be run after explicit approval.
