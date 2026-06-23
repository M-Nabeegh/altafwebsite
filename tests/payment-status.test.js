import test from 'node:test';
import assert from 'node:assert/strict';
import { hasDetectedPaidAppointment } from '../src/utils/paymentStatus.js';

test('redirects a delayed confirmed payment to the success page', () => {
  assert.equal(hasDetectedPaidAppointment({ status: 'confirmed', paymentStatus: 'paid' }), true);
});

test('redirects a late paid appointment for manual review', () => {
  assert.equal(hasDetectedPaidAppointment({ status: 'cancelled', paymentStatus: 'paid' }), true);
});

test('keeps polling for pending, failed, or unpaid appointments', () => {
  assert.equal(hasDetectedPaidAppointment({ status: 'payment_pending', paymentStatus: 'unpaid' }), false);
  assert.equal(hasDetectedPaidAppointment({ status: 'failed', paymentStatus: 'failed' }), false);
  assert.equal(hasDetectedPaidAppointment({ status: 'confirmed', paymentStatus: 'unpaid' }), false);
  assert.equal(hasDetectedPaidAppointment(null), false);
});
