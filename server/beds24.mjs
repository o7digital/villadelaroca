import { addDays, nightsBetween, rangeError } from '../public/booking-calendar-core.js';

export const STAYS = {
  suites: { propertyId: 316599, roomId: 658909, quantity: 5, adults: 2, children: 2 },
  villa: { propertyId: 318544, roomId: 715668, quantity: 1, adults: 10, children: 5 },
};
const BASE = 'https://beds24.com/api/v2';
const cache = new Map();
let accessToken;
let tokenPromise;

export class BookingError extends Error {
  constructor(code, status = 400) { super(code); this.code = code; this.status = status; }
}

export function today() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Mexico_City', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

function validDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value + 'T12:00:00Z').toISOString().slice(0, 10) === value;
}

export function validateInput(input, mode) {
  const stay = input.stay;
  const config = Object.hasOwn(STAYS, stay) ? STAYS[stay] : null;
  const adults = Number(input.adults);
  const children = Number(input.children);
  if (!config || !Number.isInteger(adults) || adults < 1 || adults > config.adults || !Number.isInteger(children) || children < 0 || children > config.children) throw new BookingError('OCCUPANCY');
  const start = mode === 'calendar' ? input.start : input.arrival;
  const end = mode === 'calendar' ? input.end : input.departure;
  if (!validDate(start) || !validDate(end)) throw new BookingError('DATES');
  const nights = nightsBetween(start, end);
  if (!validDate(start) || !validDate(end) || start < today() || end > addDays(today(), 370) || nights < 1 || nights > (mode === 'calendar' ? 62 : 90)) throw new BookingError('DATES');
  return { stay, config, adults, children, start, end, nights, lang: input.lang === 'es' ? 'es' : 'en' };
}

async function cached(key, ttl, fn, fresh = false) {
  if (fresh) return fn();
  const found = cache.get(key);
  if (found && found.until > Date.now()) return found.value;
  if (cache.size > 128) cache.delete(cache.keys().next().value);
  const value = Promise.resolve().then(fn);
  cache.set(key, { until: Date.now() + ttl, value });
  try { return await value; } catch (error) { cache.delete(key); throw error; }
}

async function token() {
  if (accessToken?.until > Date.now()) return accessToken.value;
  if (tokenPromise) return tokenPromise;
  tokenPromise = (async () => {
    const refresh = process.env.BEDS24_REFRESH_TOKEN?.trim();
    if (!refresh) {
      if (!process.env.BEDS24_API_TOKEN?.trim()) throw new BookingError('NOT_CONFIGURED', 503);
      return process.env.BEDS24_API_TOKEN.trim();
    }
    const response = await fetch(BASE + '/authentication/token', { headers: { refreshToken: refresh }, signal: AbortSignal.timeout(15000) });
    const body = await response.json();
    if (!response.ok || !body.token) throw new BookingError('API_AUTHENTICATION', 503);
    accessToken = { value: body.token, until: Date.now() + Math.max(1, (body.expiresIn || 3600) - 60) * 1000 };
    return body.token;
  })();
  try { return await tokenPromise; } finally { tokenPromise = undefined; }
}

async function read(path, params, retry = true) {
  const query = new URLSearchParams();
  for (const [key, values] of Object.entries(params)) for (const value of Array.isArray(values) ? values : [values]) query.append(key, String(value));
  const response = await fetch(BASE + path + '?' + query, { headers: { token: await token(), accept: 'application/json' }, signal: AbortSignal.timeout(20000) });
  if (response.status === 401 && retry && process.env.BEDS24_REFRESH_TOKEN) { accessToken = undefined; return read(path, params, false); }
  if (response.status === 429) throw new BookingError('API_BUSY', 503);
  const body = await response.json();
  if (!response.ok || body.success === false || !Array.isArray(body.data) || body.pages?.nextPageExists) throw new BookingError('API_UNAVAILABLE', 503);
  return body.data;
}

async function properties(fresh = false) {
  return cached('properties', 300000, async () => {
    const [props, fixed] = await Promise.all([
      read('/properties', { id: [316599, 318544], includeAllRooms: true, includePriceRules: true, includeOffers: true, includeUpsellItems: true }),
      read('/inventory/fixedPrices', { roomId: [658909, 715668] }),
    ]);
    for (const property of props) for (const room of property.roomTypes || []) room.fixedPrices = fixed.filter(r => r.roomId === room.id);
    return props;
  }, fresh);
}

export function expandCalendar(rows, start, end) {
  const result = {};
  for (const row of rows || []) {
    const from = row.from < start ? start : row.from;
    const to = row.to > end ? end : row.to;
    if (!validDate(from) || !validDate(to)) continue;
    for (let date = from; date <= to; date = addDays(date, 1)) result[date] = row;
  }
  return result;
}

async function inventory(start, end, fresh = false) {
  return cached('inventory:' + start + ':' + end, 300000, async () => {
    const params = { roomId: [658909, 715668], startDate: start, endDate: end };
    const [calendars, availability] = await Promise.all([
      read('/inventory/rooms/calendar', { ...params, includeNumAvail: true, includeMinStay: true, includeMaxStay: true, includeOverride: true, includePrices: true, includeLinkedPrices: true, includeMultiplier: true }),
      read('/inventory/rooms/availability', params),
    ]);
    return { calendars: Object.fromEntries(calendars.map(r => [r.roomId, expandCalendar(r.calendar, start, end)])), availability: Object.fromEntries(availability.map(r => [r.roomId, r.availability || {}])) };
  }, fresh);
}

export function eligibleRules(room) {
  return (room.priceRules || []).filter(r => r.priceFor && r.bookingPage?.direct && !r.agentCodes?.length && (room.offers || []).some(o => o.offerId === r.offer && ['always', 'onlyIfAvailable'].includes(o.enable)));
}

// Calendar prices are lodging prices for the selected occupancy. Mandatory
// supplements and taxes are added to the authoritative stay offer below.
export function dailyPrice(day, room, rule, adults, children) {
  const base = day['linkedPrice' + rule.id] ?? day['price' + rule.id];
  if (!Number.isFinite(base) || base <= 0) return null;
  let price = base;
  const persons = adults + children;
  if (rule.priceFor.type === 'perPerson') price *= persons;
  else if (rule.priceFor.type === 'upToPerson') {
    const included = rule.priceFor.upToPersonValue;
    const extraAdults = Math.max(0, adults - included);
    const extraChildren = Math.max(0, persons - Math.max(adults, included));
    if (extraAdults && !rule.extraPerson) return null;
    price += extraAdults * (rule.extraPerson || 0) + extraChildren * (rule.extraChild || rule.extraPerson || 0);
  } else if (rule.priceFor.type !== 'maxCapacity') return null;
  return Math.round(price * (day.multiplier || 1) * 100) / 100;
}

export function makeDays(data, room, input) {
  const days = {};
  const rules = eligibleRules(room);
  for (let date = input.start; date <= input.end; date = addDays(date, 1)) {
    const day = data.calendars[input.config.roomId]?.[date];
    const suites = data.calendars[658909]?.[date];
    const available = Boolean(day && day.numAvail > 0 && day.override !== 'blackout' && (input.stay !== 'villa' || (suites?.numAvail >= 5 && suites.override !== 'blackout')));
    const advance = nightsBetween(today(), date);
    const prices = rules.filter(rule => advance >= (rule.minDaysUntilCheckin || 0) && advance <= (rule.maxDaysUntilCheckin ?? 999)).map(rule => ({ rule, price: day ? dailyPrice(day, room, rule, input.adults, input.children) : null })).filter(r => r.price !== null);
    const cheapest = prices.sort((a, b) => a.price - b.price)[0];
    days[date] = {
      available,
      checkIn: available && Boolean(cheapest) && data.availability[input.config.roomId]?.[date] === true && !['noCheckIn', 'noCheckInOrCheckOut'].includes(day?.override),
      // A sold-out arrival day can still be a departure day.
      checkOut: Boolean(day && !['blackout', 'noCheckOut', 'noCheckInOrCheckOut'].includes(day.override)),
      price: cheapest?.price ?? null,
      minStay: Math.max(day?.minStay || room.minStay || 1, cheapest?.rule.minimumStay || 1),
      maxStay: Math.min(day?.maxStay || room.maxStay || 365, cheapest?.rule.maximumStay || 365),
      stayThrough: room.restrictionStrategy === 'stayThrough',
    };
  }
  return days;
}

function roomConfig(props, input) {
  const property = props.find(p => p.id === input.config.propertyId);
  const room = property?.roomTypes?.find(r => r.id === input.config.roomId);
  if (!room || property.currency !== 'USD') throw new BookingError('CONFIGURATION_CHANGED', 503);
  // The live properties currently use daily prices only. If a fixed-price
  // strategy is later enabled, defer to Beds24 rather than mislabel raw daily
  // values as a calculated nightly price.
  if (room.fixedPrices?.some(r => r.bookingPage?.direct !== false && r.firstNight <= input.end && r.lastNight >= input.start)) throw new BookingError('CONFIGURATION_CHANGED', 503);
  if (input.adults > (room.maxAdult || room.maxPeople) || input.children > (room.maxChildren || 0) || input.adults + input.children > room.maxPeople) throw new BookingError('OCCUPANCY');
  return { property, room };
}

export function supplements(property, rule, amount, input) {
  let extra = 0;
  const items = [];
  for (const item of property.upsellItems || []) {
    if (!item.type.startsWith('obligatory') || !rule.upsellItems?.some(r => r.index === item.index && r.enable)) continue;
    const count = { booking: 1, room: 1, person: input.adults + input.children, adult: input.adults, child: input.children }[item.per];
    const periods = { oneTime: 1, daily: input.nights, dailyPlusOne: input.nights + 1, weekly: Math.ceil(input.nights / 7) }[item.period];
    // Fail closed for unknown charging rules rather than invent a grand total.
    if (count === undefined || periods === undefined || item.vat || !['obligatory', 'obligatoryCleaning', 'obligatoryTax', 'obligatoryPercent', 'obligatoryPercentTax'].includes(item.type)) throw new BookingError('CONFIGURATION_CHANGED', 503);
    let value = item.type.includes('Percent') ? amount * item.amount / 100 : item.amount;
    value = Math.round(value * count * periods * 100) / 100;
    extra += value;
    if (value) items.push({ index: item.index, amount: value });
  }
  return { total: Math.round((amount + extra) * 100) / 100, items };
}

export async function calendar(input) {
  const parsed = validateInput(input, 'calendar');
  const [props, data] = await Promise.all([properties(), inventory(parsed.start, parsed.end)]);
  const { room } = roomConfig(props, parsed);
  return { currency: 'USD', days: makeDays(data, room, parsed), updatedAt: new Date().toISOString() };
}

export async function quote(input) {
  const parsed = validateInput(input, 'quote');
  const [props, data, offers] = await Promise.all([
    properties(true), inventory(parsed.start, parsed.end, true),
    read('/inventory/rooms/offers', { roomId: parsed.config.roomId, propertyId: parsed.config.propertyId, arrival: parsed.start, departure: parsed.end, numAdults: parsed.adults, numChildren: parsed.children }),
  ]);
  const { property, room } = roomConfig(props, parsed);
  const days = makeDays(data, room, parsed);
  const error = rangeError(days, parsed.start, parsed.end);
  if (error) throw new BookingError(error, 409);
  const choices = (offers.find(r => r.roomId === parsed.config.roomId)?.offers || []).filter(o => o.unitsAvailable >= 1 && Number.isFinite(o.price) && o.price > 0 && eligibleRules(room).some(r => r.offer === o.offerId));
  const offer = choices.sort((a, b) => a.price - b.price)[0];
  if (!offer) throw new BookingError('UNAVAILABLE', 409);
  const rule = eligibleRules(room).find(r => r.offer === offer.offerId);
  if (room.taxPercentage || room.taxPerson || room.cleaningFee) throw new BookingError('CONFIGURATION_CHANGED', 503);
  const extras = supplements(property, rule, offer.price, parsed);
  const params = new URLSearchParams({ roomid: String(parsed.config.roomId), referer: 'iFrame', lang: parsed.lang, cur: 'USD', checkin: parsed.start, checkout: parsed.end, numnight: String(parsed.nights), numadult: String(parsed.adults), numchild: String(parsed.children) });
  if (parsed.stay === 'suites') params.set('propid', String(parsed.config.propertyId));
  params.set('naa1-' + offer.offerId + '-' + parsed.config.roomId, String(parsed.adults));
  params.set('ncc1-' + offer.offerId + '-' + parsed.config.roomId, String(parsed.children));
  return { currency: 'USD', arrival: parsed.start, departure: parsed.end, nights: parsed.nights, lodging: offer.price, total: extras.total, supplements: extras.items, offerId: offer.offerId, verifiedAt: new Date().toISOString(), bookingUrl: 'https://beds24.com/booking.php?' + params };
}
