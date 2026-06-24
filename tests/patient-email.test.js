import test from 'node:test';
import assert from 'node:assert/strict';
import { patientConfirmationHtml } from '../api/emails/patientConfirmation.js';
import { doctorNotificationHtml } from '../api/emails/doctorNotification.js';

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
  assert.doesNotMatch(html, /transaction id/i);
  assert.doesNotMatch(html, /test-transaction/i);
});

test('doctor notification remains readable in dark-mode email clients', () => {
  const html = doctorNotificationHtml({
    patientName: 'Test Patient',
    patientEmail: 'patient@example.com',
    patientPhone: '03001234567',
    slotDate: '2026-06-27',
    slotTime: '10:00 AM - 10:15 AM',
    basketId: 'JA-TEST',
    amount: 10,
    transactionId: 'test-transaction',
    notes: 'Test notes',
  });

  assert.match(html, /name="color-scheme" content="light only"/i);
  assert.match(html, /name="supported-color-schemes" content="light only"/i);
  assert.match(html, /class="email-header" bgcolor="#047857"/i);
  assert.match(html, /class="email-card" bgcolor="#ffffff"/i);
  assert.match(html, /-webkit-text-fill-color:#ffffff/i);
});
