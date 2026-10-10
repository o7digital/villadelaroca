export function addDays(date, count) {
  const value = new Date(date + 'T12:00:00Z');
  value.setUTCDate(value.getUTCDate() + count);
  return value.toISOString().slice(0, 10);
}

export function nightsBetween(arrival, departure) {
  return Math.round((Date.parse(departure + 'T12:00:00Z') - Date.parse(arrival + 'T12:00:00Z')) / 86400000);
}

export function rangeError(days, arrival, departure) {
  if (!arrival || !departure || departure <= arrival) return 'DATES';
  if (!days[arrival]?.available) return 'UNAVAILABLE';
  if (!days[arrival]?.checkIn || !days[departure]?.checkOut) return 'RESTRICTIONS';
  const nights = nightsBetween(arrival, departure);
  for (let date = arrival; date < departure; date = addDays(date, 1)) {
    const day = days[date];
    if (!day?.available) return 'UNAVAILABLE';
    if ((date === arrival || day.stayThrough) && (nights < day.minStay || nights > day.maxStay)) return 'RESTRICTIONS';
  }
  return null;
}
