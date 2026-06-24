import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getInitialCalendarDate,
  groupOccupiedAppointmentsByDate,
  isOccupiedAppointment,
  toLocalDateKey,
} from '../src/utils/appointmentCalendar.js';

const appointments = [
  { id: 'confirmed', slot_date: '2026-06-27', status: 'confirmed' },
  { id: 'pending', slot_date: '2026-06-27', status: 'payment_pending' },
  { id: 'failed', slot_date: '2026-06-27', status: 'failed' },
  { id: 'cancelled', slot_date: '2026-07-04', status: 'cancelled' },
];

test('only confirmed and active payment holds occupy calendar slots', () => {
  assert.equal(isOccupiedAppointment(appointments[0]), true);
  assert.equal(isOccupiedAppointment(appointments[1]), true);
  assert.equal(isOccupiedAppointment(appointments[2]), false);
  assert.equal(isOccupiedAppointment(appointments[3]), false);

  const grouped = groupOccupiedAppointmentsByDate(appointments);
  assert.equal(grouped.get('2026-06-27').length, 2);
  assert.equal(grouped.has('2026-07-04'), false);
});

test('calendar opens on the next occupied date without UTC date drift', () => {
  const selected = getInitialCalendarDate(appointments, new Date(2026, 5, 24, 12));
  assert.equal(toLocalDateKey(selected), '2026-06-27');
});
