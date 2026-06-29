export function getKarachiTodayLocalDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Karachi',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);

  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return new Date(Number(values.year), Number(values.month) - 1, Number(values.day));
}

export function isPastBookingDate(date, now = new Date()) {
  return date < getKarachiTodayLocalDate(now);
}

export function getInitialBookingMonth(now = new Date()) {
  const candidate = getKarachiTodayLocalDate(now);

  for (let offset = 0; offset < 62; offset += 1) {
    const date = new Date(candidate.getFullYear(), candidate.getMonth(), candidate.getDate() + offset);
    if (date.getDay() === 6) {
      return new Date(date.getFullYear(), date.getMonth(), 1);
    }
  }

  return new Date(candidate.getFullYear(), candidate.getMonth(), 1);
}
