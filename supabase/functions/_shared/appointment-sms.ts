export const SMS_MAX_LENGTH = 160;

export class SmsError extends Error {
  code: string;
  retryable: boolean;
  ambiguous: boolean;

  constructor(
    message: string,
    { code, retryable = false, ambiguous = false }:
      { code: string; retryable?: boolean; ambiguous?: boolean },
  ) {
    super(message);
    this.name = 'SmsError';
    this.code = code;
    this.retryable = retryable;
    this.ambiguous = ambiguous;
  }
}

export function normalizePakistaniMobile(value: unknown): string {
  const compact = String(value || '').trim().replace(/[\s()-]/g, '');
  if (/^03\d{9}$/.test(compact)) return `+92${compact.slice(1)}`;
  if (/^\+923\d{9}$/.test(compact)) return compact;
  throw new SmsError('Invalid Pakistani mobile number', { code: 'INVALID_PHONE' });
}

export function extractSmsFirstName(fullName: unknown): string {
  const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) throw new SmsError('Patient name is required', { code: 'INVALID_NAME' });
  const selected = /^(muhammad|abdul)$/i.test(parts[0]) && parts[1] ? parts[1] : parts[0];
  return selected.slice(0, 18);
}

export function formatSmsDate(value: unknown): string {
  const match = String(value || '').slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) throw new SmsError('Invalid appointment date', { code: 'INVALID_DATE' });
  const [, yearText, monthText, dayText] = match;
  const date = new Date(Date.UTC(Number(yearText), Number(monthText) - 1, Number(dayText)));
  if (
    date.getUTCFullYear() !== Number(yearText)
    || date.getUTCMonth() !== Number(monthText) - 1
    || date.getUTCDate() !== Number(dayText)
  ) throw new SmsError('Invalid appointment date', { code: 'INVALID_DATE' });

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Karachi',
  }).format(date);
}

export function formatSmsTime(value: unknown): string {
  const start = String(value || '').split(/\s+-\s+/)[0].trim();
  const match = start.match(/^(0?[1-9]|1[0-2]):([0-5]\d)\s*(AM|PM)$/i);
  if (!match) throw new SmsError('Invalid appointment time', { code: 'INVALID_TIME' });
  return `${Number(match[1])}:${match[2]} ${match[3].toUpperCase()}`;
}

export function buildReminderSms(appointment: Record<string, unknown>): string {
  const message = `Dear ${extractSmsFirstName(appointment.patient_name)},\n\nReminder: Your appointment with Dr. Javed Altaf is in 1 hour.\n\n${formatSmsDate(appointment.slot_date)} at ${formatSmsTime(appointment.slot_time)}\n\nDetails: javedaltaf.com`;
  if (message.length > SMS_MAX_LENGTH) {
    throw new SmsError('SMS message exceeds 160 characters', { code: 'MESSAGE_TOO_LONG' });
  }
  return message;
}

export function appointmentTimestamp(slotDate: unknown, slotTime: unknown): number {
  const date = String(slotDate || '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new SmsError('Invalid appointment date', { code: 'INVALID_DATE' });
  }
  const time = formatSmsTime(slotTime);
  const match = time.match(/^(\d{1,2}):(\d{2}) (AM|PM)$/);
  if (!match) throw new SmsError('Invalid appointment time', { code: 'INVALID_TIME' });
  let hour = Number(match[1]) % 12;
  if (match[3] === 'PM') hour += 12;
  const iso = `${date}T${String(hour).padStart(2, '0')}:${match[2]}:00+05:00`;
  const timestamp = Date.parse(iso);
  if (!Number.isFinite(timestamp)) {
    throw new SmsError('Invalid appointment date/time', { code: 'INVALID_DATETIME' });
  }
  return timestamp;
}

export async function sendVeevoTechSms({
  apiHash,
  senderId,
  recipient,
  message,
}: {
  apiHash: string;
  senderId: string;
  recipient: string;
  message: string;
}): Promise<{ messageId: string }> {
  if (!apiHash) throw new SmsError('VeevoTech is not configured', { code: 'MISSING_API_HASH' });
  if (message.length > SMS_MAX_LENGTH) {
    throw new SmsError('SMS message exceeds 160 characters', { code: 'MESSAGE_TOO_LONG' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  let response: Response;
  try {
    response = await fetch('https://api.veevotech.com/v3/sendsms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hash: apiHash,
        receivernum: normalizePakistaniMobile(recipient),
        sendernum: senderId || 'Default',
        textmessage: message,
      }),
      signal: controller.signal,
    });
  } catch {
    throw new SmsError('SMS provider request did not complete', {
      code: 'PROVIDER_NETWORK_ERROR', ambiguous: true,
    });
  } finally {
    clearTimeout(timeout);
  }

  let data: { STATUS?: string; MESSAGE_ID?: string };
  try {
    data = await response.json();
  } catch {
    throw new SmsError('SMS provider returned an unreadable response', {
      code: 'PROVIDER_INVALID_RESPONSE',
      retryable: !response.ok && response.status < 500,
      ambiguous: response.ok || response.status >= 500,
    });
  }

  if (!response.ok) {
    throw new SmsError('SMS provider rejected the request', {
      code: `PROVIDER_HTTP_${response.status}`,
      retryable: response.status < 500,
      ambiguous: response.status >= 500,
    });
  }
  if (data.STATUS !== 'SUCCESSFUL' || !data.MESSAGE_ID) {
    throw new SmsError('SMS provider reported an unsuccessful status', {
      code: 'PROVIDER_REJECTED', retryable: true,
    });
  }
  return { messageId: String(data.MESSAGE_ID) };
}

export function karachiDateKey(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Karachi', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date);
  const value = (type: string) => parts.find((part) => part.type === type)?.value;
  return `${value('year')}-${value('month')}-${value('day')}`;
}
