import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SMS_MAX_LENGTH,
  SmsValidationError,
  VeevoTechError,
  assertSmsLength,
  buildConfirmationSms,
  buildReminderSms,
  extractSmsFirstName,
  formatSmsDate,
  formatSmsTime,
  normalizePakistaniMobile,
  sendVeevoTechSms,
} from '../api/sms/veevotech.js';

const appointment = {
  id: 'appointment-1',
  patient_name: 'Muhammad Ahmed Khan',
  patient_phone: '03001234567',
  slot_date: '2026-06-27',
  slot_time: '10:30 AM - 10:45 AM',
};

test('normalizes accepted Pakistani mobile formats', () => {
  assert.equal(normalizePakistaniMobile('03001234567'), '+923001234567');
  assert.equal(normalizePakistaniMobile('+923001234567'), '+923001234567');
  assert.equal(normalizePakistaniMobile('0300 123 4567'), '+923001234567');
});

test('rejects invalid Pakistani mobile numbers', () => {
  for (const value of ['3001234567', '+924001234567', '0300123456', '030012345678']) {
    assert.throws(() => normalizePakistaniMobile(value), SmsValidationError);
  }
});

test('extracts the SMS name with Muhammad and Abdul special handling', () => {
  assert.equal(extractSmsFirstName('Muhammad Ahmed Khan'), 'Ahmed');
  assert.equal(extractSmsFirstName('mUhAmMaD Adeel'), 'Adeel');
  assert.equal(extractSmsFirstName('Abdul Rehman Siddiqui'), 'Rehman');
  assert.equal(extractSmsFirstName('Abdul'), 'Abdul');
  assert.equal(extractSmsFirstName('Fatima Zahra'), 'Fatima');
});

test('limits the chosen SMS first name to 18 characters', () => {
  assert.equal(extractSmsFirstName('Muhammad ThisNameIsMuchLongerThanEighteen'), 'ThisNameIsMuchLong');
  assert.equal(extractSmsFirstName('Extraordinarilylongfirstname Ali').length, 18);
});

test('formats appointment date and starting time for SMS', () => {
  assert.equal(formatSmsDate('2026-06-27'), '27 Jun 2026');
  assert.equal(formatSmsTime('10:30 AM - 10:45 AM'), '10:30 AM');
  assert.equal(formatSmsTime('1:05 pm - 1:20 pm'), '1:05 PM');
});

test('builds exact confirmation and reminder templates under 160 characters', () => {
  const confirmation = buildConfirmationSms(appointment);
  const reminder = buildReminderSms(appointment);

  assert.equal(confirmation, 'Dear Ahmed,\n\nAppointment with Dr. Javed Altaf confirmed:\n\n27 Jun 2026 at 10:30 AM\n\nDetails: javedaltaf.com');
  assert.equal(reminder, 'Dear Ahmed,\n\nReminder: Your appointment with Dr. Javed Altaf is in 1 hour.\n\n27 Jun 2026 at 10:30 AM\n\nDetails: javedaltaf.com');
  assert.ok(confirmation.length <= SMS_MAX_LENGTH);
  assert.ok(reminder.length <= SMS_MAX_LENGTH);
  assert.throws(() => assertSmsLength('x'.repeat(161)), /exceeds 160/);
});

test('sends only the documented VeevoTech payload and accepts a successful response', async () => {
  let request;
  const fetchImpl = async (url, options) => {
    request = { url, options, body: JSON.parse(options.body) };
    return { ok: true, status: 200, json: async () => ({ STATUS: 'SUCCESSFUL', MESSAGE_ID: 'msg-123' }) };
  };

  const result = await sendVeevoTechSms({
    apiHash: 'test-secret-never-logged',
    senderId: 'Default',
    recipient: '03001234567',
    message: buildConfirmationSms(appointment),
    fetchImpl,
  });

  assert.equal(result.messageId, 'msg-123');
  assert.equal(request.url, 'https://api.veevotech.com/v3/sendsms');
  assert.deepEqual(Object.keys(request.body).sort(), ['hash', 'receivernum', 'sendernum', 'textmessage']);
  assert.equal(request.body.receivernum, '+923001234567');
  assert.equal(request.body.sendernum, 'Default');
  assert.equal('header' in request.body, false);
});

test('treats provider non-success and network failures as unsuccessful', async () => {
  await assert.rejects(
    sendVeevoTechSms({
      apiHash: 'test-secret',
      recipient: '03001234567',
      message: 'Test',
      fetchImpl: async () => ({
        ok: true,
        status: 200,
        json: async () => ({ STATUS: 'FAILED' }),
      }),
    }),
    (error) => error instanceof VeevoTechError && error.code === 'PROVIDER_REJECTED' && error.retryable,
  );

  await assert.rejects(
    sendVeevoTechSms({
      apiHash: 'test-secret',
      recipient: '03001234567',
      message: 'Test',
      fetchImpl: async () => { throw new Error('network detail must be sanitized'); },
    }),
    (error) => error instanceof VeevoTechError && error.code === 'PROVIDER_NETWORK_ERROR' && error.ambiguous,
  );
});
