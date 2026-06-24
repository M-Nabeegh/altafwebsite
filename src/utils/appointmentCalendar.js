export const ACTIVE_APPOINTMENT_STATUSES = new Set(['confirmed', 'payment_pending']);

export function isOccupiedAppointment(appointment) {
  return ACTIVE_APPOINTMENT_STATUSES.has(appointment?.status);
}

export function toLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function fromLocalDateKey(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day, 12);
}

export function getInitialCalendarDate(appointments, today = new Date()) {
  const todayKey = toLocalDateKey(today);
  const nextActiveDate = appointments
    .filter(item => isOccupiedAppointment(item) && item.slot_date >= todayKey)
    .map(item => item.slot_date)
    .sort()[0];

  return nextActiveDate ? fromLocalDateKey(nextActiveDate) : today;
}

export function groupOccupiedAppointmentsByDate(appointments) {
  const grouped = new Map();

  appointments.filter(isOccupiedAppointment).forEach(appointment => {
    const existing = grouped.get(appointment.slot_date) || [];
    existing.push(appointment);
    grouped.set(appointment.slot_date, existing);
  });

  return grouped;
}
