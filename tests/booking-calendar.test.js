import assert from 'node:assert/strict';
import test from 'node:test';
import { getInitialBookingMonth, isPastBookingDate } from '../src/utils/bookingCalendar.js';

test('booking calendar opens on next available Saturday month', () => {
  const june29InKarachi = new Date('2026-06-28T19:01:00.000Z');
  const initialMonth = getInitialBookingMonth(june29InKarachi);

  assert.equal(initialMonth.getFullYear(), 2026);
  assert.equal(initialMonth.getMonth(), 6);
});

test('booking past-date checks use Asia/Karachi today', () => {
  const june29InKarachi = new Date('2026-06-28T19:01:00.000Z');

  assert.equal(isPastBookingDate(new Date(2026, 5, 27), june29InKarachi), true);
  assert.equal(isPastBookingDate(new Date(2026, 5, 29), june29InKarachi), false);
  assert.equal(isPastBookingDate(new Date(2026, 6, 4), june29InKarachi), false);
});
