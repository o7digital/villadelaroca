import test from 'node:test';
import assert from 'node:assert/strict';
import { addDays, nightsBetween, rangeError } from '../public/booking-calendar-core.js';
import { expandCalendar, makeDays, dailyPrice, supplements, validateInput, today, STAYS } from '../server/beds24.mjs';

const start = addDays(today(), 14);
const rule = { id: 1, priceFor: { type: 'upToPerson', upToPersonValue: 2 }, extraChild: 50, extraPerson: 0, offer: 1, minimumStay: 1, maximumStay: 365, bookingPage: { direct: true }, upsellItems: [1, 2, 3, 4].map(index => ({ index, enable: true })) };
const room = { minStay: 1, maxStay: 365, restrictionStrategy: 'stayThrough', priceRules: [rule], offers: [{ offerId: 1, enable: 'always' }] };
const property = { upsellItems: [4, 10, 16].map((amount, i) => ({ index: i + 1, type: 'obligatoryPercent', amount, per: 'room', period: 'oneTime', vat: 0 })).concat({ index: 4, type: 'obligatory', amount: 50, per: 'child', period: 'daily', vat: 0 }) };

test('dates cross month, year and daylight saving boundaries without changing night count', () => {
  assert.equal(addDays('2026-12-31', 1), '2027-01-01');
  assert.equal(nightsBetween('2026-10-31', '2026-11-02'), 2);
});

test('request validation rejects unknown rooms, excessive occupants and impossible dates', () => {
  const input = { stay: 'villa', adults: 10, children: 5, arrival: start, departure: addDays(start, 2) };
  assert.equal(validateInput(input, 'quote').config.roomId, 715668);
  for (const change of [{ stay: '__proto__' }, { stay: '658909' }, { adults: 11 }, { children: -1 }, { adults: 2.5 }, { arrival: '2026-02-30' }, { departure: start }]) assert.throws(() => validateInput({ ...input, ...change }, 'quote'));
});

test('compressed calendar expands inclusive nights and clips to requested range', () => {
  const calendar = expandCalendar([{ from: start, to: addDays(start, 3), numAvail: 5 }], addDays(start, 1), addDays(start, 2));
  assert.equal(Object.keys(calendar).length, 2);
  assert.equal(calendar[addDays(start, 2)].numAvail, 5);
});

test('villa requires all five suites; unknown inventory fails closed', () => {
  const day = { numAvail: 1, override: 'none', price1: 750 };
  const data = { calendars: { 715668: { [start]: day }, 658909: { [start]: { numAvail: 4 } } }, availability: { 715668: { [start]: true } } };
  const input = { start, end: start, stay: 'villa', config: STAYS.villa, adults: 9, children: 4 };
  assert.equal(makeDays(data, room, input)[start].available, false);
  data.calendars[658909][start].numAvail = 5;
  assert.equal(makeDays(data, room, input)[start].available, true);
  delete data.calendars[658909][start];
  assert.equal(makeDays(data, room, input)[start].available, false);
});

test('nightly lodging price follows occupancy rules without duplicating supplements', () => {
  assert.equal(dailyPrice({ price1: 150 }, room, rule, 2, 0), 150);
  assert.equal(dailyPrice({ price1: 150 }, room, rule, 2, 1), 200);
  assert.equal(dailyPrice({ price1: 150 }, room, rule, 1, 2), 200);
  assert.equal(dailyPrice({ price1: 150, multiplier: 1.2 }, room, rule, 2, 1), 240);
  assert.equal(dailyPrice({ price1: 750 }, room, { ...rule, priceFor: { type: 'upToPerson', upToPersonValue: 20 } }, 9, 4), 750);
  assert.equal(dailyPrice({}, room, rule, 2, 0), null);
});

test('mandatory extras match the existing $1,175 villa summary', () => {
  assert.equal(supplements(property, rule, 750, { adults: 9, children: 4, nights: 1 }).total, 1175);
  assert.equal(supplements(property, rule, 1500, { adults: 9, children: 4, nights: 2 }).total, 2350);
  assert.equal(supplements(property, rule, 400, { adults: 2, children: 1, nights: 2 }).total, 620);
  assert.throws(() => supplements({ upsellItems: [{ index: 1, type: 'obligatory', per: 'unknown', period: 'daily', amount: 10 }] }, rule, 150, { nights: 2 }));
});

test('checkout on a sold-out night is allowed; staying across it is rejected', () => {
  const day = { available: true, checkIn: true, checkOut: true, minStay: 1, maxStay: 10, stayThrough: true };
  const days = { [start]: day, [addDays(start, 1)]: { ...day, available: false, checkIn: false }, [addDays(start, 2)]: day };
  assert.equal(rangeError(days, start, addDays(start, 1)), null);
  assert.equal(rangeError(days, start, addDays(start, 2)), 'UNAVAILABLE');
});

test('closed arrival/departure and minimum/maximum stay are respected', () => {
  const day = { available: true, checkIn: true, checkOut: true, minStay: 2, maxStay: 4, stayThrough: true };
  const days = Object.fromEntries(Array.from({ length: 6 }, (_, i) => [addDays(start, i), { ...day }]));
  assert.equal(rangeError(days, start, addDays(start, 1)), 'RESTRICTIONS');
  assert.equal(rangeError(days, start, addDays(start, 2)), null);
  assert.equal(rangeError(days, start, addDays(start, 5)), 'RESTRICTIONS');
  days[addDays(start, 2)].checkOut = false;
  assert.equal(rangeError(days, start, addDays(start, 2)), 'RESTRICTIONS');
  days[start].checkIn = false;
  assert.equal(rangeError(days, start, addDays(start, 3)), 'RESTRICTIONS');
});
