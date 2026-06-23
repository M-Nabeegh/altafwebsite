const VEEVOTECH_URL = 'https://api.veevotech.com/v3/sendsms';
export const SMS_MAX_LENGTH = 160;

export class SmsValidationError extends Error {
  constructor(message, code = 'SMS_VALIDATION_ERROR') {
    super(message);
    this.name = 'SmsValidationError';
    this.code = code;
  }
}

export class VeevoTechError extends Error {
  constructor(message, { code, retryable = false, ambiguous = false, httpStatus } = {}) {
    super(message);
    this.name = 'VeevoTechError';
    this.code = code || 'VEEVOTECH_ERROR';
    this.retryable = retryable;
    this.ambiguous = ambiguous;
    this.httpStatus = httpStatus;
  }
}

export function normalizePakistaniMobile(value) {
  const compact = String(value || '').trim().replace(/[\s()-]/g, '');

  if (/^03\d{9}$/.test(compact)) {
    return `+92${compact.slice(1)}`;
  }
  if (/^\+923\d{9}$/.test(compact)) {
    return compact;
  }

  throw new SmsValidationError('Invalid Pakistani mobile number', 'INVALID_PHONE');
}

export function extractSmsFirstName(fullName) {
  const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    throw new SmsValidationError('Patient name is required', 'INVALID_NAME');
  }

  const firstWord = parts[0];
  const selected = /^(muhammad|abdul)$/i.test(firstWord) && parts[1]
    ? parts[1]
    : firstWord;

  return selected.slice(0, 18);
}

export function formatSmsDate(value) {
  const match = String(value || '').slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) throw new SmsValidationError('Invalid appointment date', 'INVALID_DATE');

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year
    || date.getUTCMonth() !== month - 1
    || date.getUTCDate() !== day
  ) {
    throw new SmsValidationError('Invalid appointment date', 'INVALID_DATE');
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Karachi',
  }).format(date);
}

export function formatSmsTime(value) {
  const startTime = String(value || '').split(/\s+-\s+/)[0].trim();
  const match = startTime.match(/^(0?[1-9]|1[0-2]):([0-5]\d)\s*(AM|PM)$/i);
  if (!match) throw new SmsValidationError('Invalid appointment time', 'INVALID_TIME');

  return `${Number(match[1])}:${match[2]} ${match[3].toUpperCase()}`;
}

export function assertSmsLength(message) {
  if (typeof message !== 'string' || message.length === 0) {
    throw new SmsValidationError('SMS message is required', 'INVALID_MESSAGE');
  }
  if (message.length > SMS_MAX_LENGTH) {
    throw new SmsValidationError('SMS message exceeds 160 characters', 'MESSAGE_TOO_LONG');
  }
  return message;
}

export function buildConfirmationSms(appointment) {
  const firstName = extractSmsFirstName(appointment.patient_name);
  const date = formatSmsDate(appointment.slot_date);
  const time = formatSmsTime(appointment.slot_time);

  return assertSmsLength(
    `Dear ${firstName},\n\nAppointment with Dr. Javed Altaf confirmed:\n\n${date} at ${time}\n\nDetails: javedaltaf.com`
  );
}

export function buildReminderSms(appointment) {
  const firstName = extractSmsFirstName(appointment.patient_name);
  const date = formatSmsDate(appointment.slot_date);
  const time = formatSmsTime(appointment.slot_time);

  return assertSmsLength(
    `Dear ${firstName},\n\nReminder: Your appointment with Dr. Javed Altaf is in 1 hour.\n\n${date} at ${time}\n\nDetails: javedaltaf.com`
  );
}

export function sanitizeSmsError(error) {
  return {
    code: error?.code || 'SMS_UNEXPECTED_ERROR',
    message: error instanceof SmsValidationError
      ? error.message
      : 'SMS delivery failed',
    retryable: Boolean(error?.retryable),
    ambiguous: Boolean(error?.ambiguous),
  };
}

export async function sendVeevoTechSms({
  apiHash,
  senderId = 'Default',
  recipient,
  message,
  fetchImpl = globalThis.fetch,
  timeoutMs = 10_000,
}) {
  if (!apiHash) {
    throw new VeevoTechError('VeevoTech is not configured', { code: 'MISSING_API_HASH' });
  }
  if (typeof fetchImpl !== 'function') {
    throw new VeevoTechError('SMS transport is unavailable', { code: 'MISSING_FETCH' });
  }

  const normalizedRecipient = normalizePakistaniMobile(recipient);
  const safeMessage = assertSmsLength(message);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  let response;
  try {
    response = await fetchImpl(VEEVOTECH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hash: apiHash,
        receivernum: normalizedRecipient,
        sendernum: senderId || 'Default',
        textmessage: safeMessage,
      }),
      signal: controller.signal,
    });
  } catch {
    throw new VeevoTechError('SMS provider request did not complete', {
      code: 'PROVIDER_NETWORK_ERROR',
      ambiguous: true,
    });
  } finally {
    clearTimeout(timeout);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new VeevoTechError('SMS provider returned an unreadable response', {
      code: 'PROVIDER_INVALID_RESPONSE',
      ambiguous: response.ok,
      retryable: !response.ok && response.status < 500,
      httpStatus: response.status,
    });
  }

  if (!response.ok) {
    throw new VeevoTechError('SMS provider rejected the request', {
      code: `PROVIDER_HTTP_${response.status}`,
      retryable: response.status < 500,
      ambiguous: response.status >= 500,
      httpStatus: response.status,
    });
  }

  if (data?.STATUS !== 'SUCCESSFUL' || !data?.MESSAGE_ID) {
    throw new VeevoTechError('SMS provider reported an unsuccessful status', {
      code: 'PROVIDER_REJECTED',
      retryable: true,
    });
  }

  return { messageId: String(data.MESSAGE_ID), recipient: normalizedRecipient };
}
