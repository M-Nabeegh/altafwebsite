// Shared booking rules used by every server-side appointment write.

export const RESERVATION_HOLD_MINUTES = 15;

export const CONSULTATION_TIME_SLOTS = Object.freeze([
  '10:00 AM - 10:15 AM',
  '10:15 AM - 10:30 AM',
  '10:30 AM - 10:45 AM',
  '10:45 AM - 11:00 AM',
  '11:00 AM - 11:15 AM',
  '11:15 AM - 11:30 AM',
  '11:30 AM - 11:45 AM',
  '11:45 AM - 12:00 PM',
]);

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function getKarachiDateISO(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Karachi',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function getKarachiTimeMinutes(date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Karachi',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return Number(values.hour) * 60 + Number(values.minute);
}

function getSlotStartMinutes(slotTime) {
  const match = /^(\d{1,2}):(\d{2}) (AM|PM) -/.exec(slotTime);
  if (!match) return null;

  let hour = Number(match[1]) % 12;
  if (match[3] === 'PM') hour += 12;
  return hour * 60 + Number(match[2]);
}

export function validateAppointmentDate(slotDate, { allowPast = false, now = new Date() } = {}) {
  if (typeof slotDate !== 'string' || !DATE_PATTERN.test(slotDate)) {
    return 'Appointment date must use YYYY-MM-DD format';
  }

  const [year, month, day] = slotDate.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  const isRealDate = parsed.getUTCFullYear() === year
    && parsed.getUTCMonth() === month - 1
    && parsed.getUTCDate() === day;

  if (!isRealDate) return 'Appointment date is invalid';
  if (parsed.getUTCDay() !== 6) return 'Appointments are available on Saturdays only';
  if (!allowPast && slotDate < getKarachiDateISO(now)) return 'Appointment date cannot be in the past';

  return null;
}

export function validateAppointmentSlot(slotDate, slotTime, options = {}) {
  const dateError = validateAppointmentDate(slotDate, options);
  if (dateError) return dateError;
  if (!CONSULTATION_TIME_SLOTS.includes(slotTime)) return 'Invalid consultation time slot';

  const { allowPast = false, now = new Date() } = options;
  if (!allowPast
    && slotDate === getKarachiDateISO(now)
    && getSlotStartMinutes(slotTime) <= getKarachiTimeMinutes(now)) {
    return 'Appointment time cannot be in the past';
  }

  return null;
}

export function getReservationCutoffISO(date = new Date()) {
  return new Date(date.getTime() - RESERVATION_HOLD_MINUTES * 60 * 1000).toISOString();
}

export async function expireStaleReservations(supabase, slotDate) {
  let query = supabase
    .from('appointments')
    .update({ status: 'cancelled' })
    .eq('status', 'payment_pending')
    .lt('created_at', getReservationCutoffISO());

  if (slotDate) query = query.eq('slot_date', slotDate);

  const { error } = await query;
  if (error) throw new Error(`Could not expire stale reservations: ${error.message}`);
}
