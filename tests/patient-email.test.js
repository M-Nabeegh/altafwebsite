import test from 'node:test';
import assert from 'node:assert/strict';
import { patientConfirmationHtml } from '../api/emails/patientConfirmation.js';

test('patient confirmation email does not expose payment implementation terms', () => {
  const html = patientConfirmationHtml({
    patientName: 'Test Patient',
    slotDate: '2026-06-27',
    slotTime: '10:00 AM - 10:15 AM',
    basketId: 'JA-TEST',
    amount: 10,
    transactionId: 'test-transaction',
    orderDate: '2026-06-23 19:50:00',
  });

  assert.doesNotMatch(html, /payfast/i);
  assert.doesNotMatch(html, /\bipn\b/i);
});
