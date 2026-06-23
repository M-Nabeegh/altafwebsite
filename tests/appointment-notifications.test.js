import test from 'node:test';
import assert from 'node:assert/strict';
import {
  deliverSmsNotification,
  sendAppointmentConfirmationSms,
} from '../api/sms/appointment-notifications.js';
import { buildConfirmationSms, VeevoTechError } from '../api/sms/veevotech.js';

const appointment = {
  id: 'appointment-duplicate-test',
  patient_name: 'Abdul Rehman',
  patient_phone: '03001234567',
  slot_date: '2026-06-27',
  slot_time: '10:30 AM - 10:45 AM',
};

function createMemoryStore() {
  const records = new Map();
  return {
    records,
    async claim(record) {
      const key = `${record.appointmentId}:${record.notificationType}`;
      if (records.has(key)) return { claimed: false };
      const stored = { ...record, id: key, status: 'pending' };
      records.set(key, stored);
      return { claimed: true, id: key, attemptCount: 1 };
    },
    async markSent(id, providerMessageId) {
      const row = records.get(id);
      Object.assign(row, { status: 'sent', providerMessageId });
    },
    async markFailed(id, error) {
      const row = records.get(id);
      Object.assign(row, { status: error.ambiguous ? 'unknown' : 'failed', errorCode: error.code });
    },
  };
}

test('idempotent claim prevents a duplicate provider send', async () => {
  const store = createMemoryStore();
  let providerCalls = 0;
  const sendSms = async () => {
    providerCalls += 1;
    return { messageId: 'provider-message-1' };
  };
  const input = {
    store,
    appointment,
    notificationType: 'appointment_confirmation',
    buildMessage: buildConfirmationSms,
    sendSms,
  };

  const first = await deliverSmsNotification(input);
  const duplicate = await deliverSmsNotification(input);

  assert.equal(first.status, 'sent');
  assert.equal(duplicate.status, 'duplicate');
  assert.equal(providerCalls, 1);
});

test('provider failure is recorded without changing the appointment', async () => {
  const store = createMemoryStore();
  const before = structuredClone(appointment);
  const result = await deliverSmsNotification({
    store,
    appointment,
    notificationType: 'appointment_confirmation',
    buildMessage: buildConfirmationSms,
    sendSms: async () => {
      throw new VeevoTechError('private provider detail', {
        code: 'PROVIDER_NETWORK_ERROR', ambiguous: true,
      });
    },
  });

  assert.equal(result.status, 'unknown');
  assert.deepEqual(appointment, before);
  assert.equal([...store.records.values()][0].status, 'unknown');
});

test('confirmation sender refuses unpaid or unconfirmed appointments', async () => {
  const result = await sendAppointmentConfirmationSms({
    supabase: null,
    appointment: { ...appointment, status: 'payment_pending', payment_status: 'unpaid' },
    fetchImpl: async () => { throw new Error('provider must not be called'); },
  });
  assert.equal(result.status, 'skipped_ineligible');
});
