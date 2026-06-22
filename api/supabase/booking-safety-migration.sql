-- Run once in the Supabase SQL Editor for an existing deployment.
-- It safely releases checkout attempts older than 15 minutes, then prevents
-- simultaneous active bookings for the same appointment slot.

update appointments
set status = 'cancelled', updated_at = now()
where status = 'payment_pending'
  and created_at < now() - interval '15 minutes';

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
