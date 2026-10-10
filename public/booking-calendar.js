import { addDays, nightsBetween, rangeError } from './booking-calendar-core.js';

const root = document.querySelector('[data-premium-calendar]');
if (root) init();

function init() {
  const spanish = root.dataset.lang === 'es';
  const lang = spanish ? 'es' : 'en';
  const locale = spanish ? 'es-MX' : 'en-US';
  const copy = spanish ? {
    arrival: 'Llegada', departure: 'Salida', nights: 'Noches', chooseArrival: 'Elige tu fecha de llegada', chooseDeparture: 'Ahora elige tu fecha de salida',
    priceHint: 'Tarifa de alojamiento por noche · USD', selected: 'Seleccionado', unavailable: 'No disponible', previous: 'Mes anterior', next: 'Mes siguiente',
    total: 'Total de la estancia', included: 'Incluye impuestos y suplementos obligatorios', continue: 'Continuar con estas fechas', loading: 'Consultando disponibilidad…',
    checking: 'Verificando tarifa y disponibilidad…', pick: 'Selecciona llegada y salida para consultar el total.', error: 'No pudimos consultar las tarifas. Puedes reservar en el motor de abajo.',
    unavailableStay: 'Estas fechas no están disponibles. Elige otra estancia.', restrictions: 'La estancia no cumple las restricciones de llegada, salida o duración. Elige otras fechas.',
    occupancy: 'Esta ocupación no está permitida para el alojamiento seleccionado.', changed: 'La tarifa ha cambiado. Revisa el nuevo total y pulsa continuar de nuevo.', ready: 'Tarifa y disponibilidad verificadas. Continúa en el motor de reserva.', departureOnly: 'Solo salida',
  } : {
    arrival: 'Check-in', departure: 'Check-out', nights: 'Nights', chooseArrival: 'Choose your check-in date', chooseDeparture: 'Now choose your check-out date',
    priceHint: 'Lodging rate per night · USD', selected: 'Selected', unavailable: 'Unavailable', previous: 'Previous month', next: 'Next month',
    total: 'Stay total', included: 'Includes taxes and mandatory supplements', continue: 'Continue with these dates', loading: 'Checking availability…',
    checking: 'Verifying price and availability…', pick: 'Select check-in and check-out to see your total.', error: 'We could not retrieve rates. You can still book in the engine below.',
    unavailableStay: 'These dates are unavailable. Please choose another stay.', restrictions: 'These dates do not meet arrival, departure or stay length restrictions. Please choose another stay.',
    occupancy: 'This occupancy is not allowed for the selected accommodation.', changed: 'The price has changed. Review the updated total and press continue again.', ready: 'Price and availability verified. Continue in the booking engine.', departureOnly: 'Check-out only',
  };
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Mexico_City', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const params = new URLSearchParams(location.search);
  let arrival = params.get('checkin') || null;
  let departure = params.get('checkout') || null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(arrival || '') || arrival < today || arrival > addDays(today, 365)) arrival = departure = null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(departure || '') || departure <= arrival) departure = null;
  let month = (arrival || today).slice(0, 7) + '-01';
  let days = {};
  let selectedQuote = null;
  let generation = 0;
  let quoteSequence = 0;
  let controller;
  let checking = false;

  root.innerHTML = `<div class="vdr-calendar__toolbar"><p data-calendar-prompt></p><div class="vdr-calendar__nav"><button type="button" data-calendar-prev aria-label="${copy.previous}">‹</button><button type="button" data-calendar-next aria-label="${copy.next}">›</button></div></div><div class="vdr-calendar__months" data-calendar-months></div><div class="vdr-calendar__legend"><span>${copy.selected}</span><span>${copy.unavailable}</span></div><div class="vdr-calendar__summary"><div class="vdr-calendar__details"><div><span>${copy.arrival}</span><strong data-calendar-arrival>—</strong></div><div><span>${copy.departure}</span><strong data-calendar-departure>—</strong></div><div><span>${copy.nights}</span><strong data-calendar-nights>—</strong></div></div><div class="vdr-calendar__price"><div><small>${copy.total}</small><strong data-calendar-total>—</strong><small>${copy.included}</small></div><button type="button" class="vdr-calendar__continue" data-calendar-continue disabled>${copy.continue}</button></div><p class="vdr-calendar__status" data-calendar-status role="status" aria-live="polite"></p></div>`;
  const find = name => root.querySelector('[data-calendar-' + name + ']');
  const money = (value, compact = false) => '$' + value.toLocaleString(locale, { minimumFractionDigits: compact && Number.isInteger(value) ? 0 : 2, maximumFractionDigits: 2 }) + (compact ? '' : ' USD');
  const dateLabel = date => date ? new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(date + 'T12:00:00Z')) : '—';
  function status(message, error = false) { find('status').textContent = message; find('status').classList.toggle('is-error', error); }
  function occupancy() {
    const selected = document.querySelector('[data-stay].is-active');
    return { stay: selected?.dataset.stay || 'suites', adults: Number(document.querySelector('[data-numadult]').value), children: Number(document.querySelector('[data-numchild]').value), lang };
  }
  function shiftMonth(value, count) { const date = new Date(value + 'T12:00:00Z'); date.setUTCMonth(date.getUTCMonth() + count); return date.toISOString().slice(0, 10); }
  function summary() {
    find('arrival').textContent = dateLabel(arrival);
    find('departure').textContent = dateLabel(departure);
    find('nights').textContent = arrival && departure ? String(nightsBetween(arrival, departure)) : '—';
    find('total').textContent = selectedQuote ? money(selectedQuote.total) : '—';
    find('continue').disabled = !selectedQuote || checking;
  }
  function render() {
    find('prompt').textContent = (arrival && !departure ? copy.chooseDeparture : copy.chooseArrival) + ' · ' + copy.priceHint;
    find('prev').disabled = month <= today.slice(0, 7) + '-01';
    find('next').disabled = shiftMonth(month, 1) > addDays(today, 335);
    const content = document.createDocumentFragment();
    for (let offset = 0; offset < 2; offset++) {
      const first = shiftMonth(month, offset);
      const next = shiftMonth(first, 1);
      const section = document.createElement('section');
      section.className = 'vdr-calendar__month';
      const heading = document.createElement('h4');
      heading.textContent = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(first + 'T12:00:00Z'));
      section.append(heading);
      const weekdays = document.createElement('div'); weekdays.className = 'vdr-calendar__week';
      for (let i = 0; i < 7; i++) { const label = document.createElement('span'); label.textContent = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' }).format(new Date(addDays('2026-10-05', i) + 'T12:00:00Z')); weekdays.append(label); }
      section.append(weekdays);
      const grid = document.createElement('div'); grid.className = 'vdr-calendar__grid';
      const blanks = (new Date(first + 'T12:00:00Z').getUTCDay() + 6) % 7;
      for (let i = 0; i < blanks; i++) grid.append(document.createElement('span'));
      for (let date = first; date < next; date = addDays(date, 1)) {
        const day = days[date];
        const choosingDeparture = arrival && !departure && date > arrival;
        const allowed = date >= today && Boolean(choosingDeparture ? !rangeError(days, arrival, date) : day?.checkIn);
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'vdr-calendar__day'; button.dataset.date = date; button.disabled = !allowed;
        button.classList.toggle('is-unavailable', !allowed);
        button.classList.toggle('is-selected', date === arrival || date === departure);
        button.classList.toggle('is-in-range', Boolean(arrival && departure && date > arrival && date < departure));
        button.setAttribute('aria-pressed', String(date === arrival || date === departure));
        button.setAttribute('aria-label', dateLabel(date) + ', ' + (allowed && !day?.available ? copy.departureOnly : day?.price !== null && day?.price !== undefined ? money(day.price) : copy.unavailable));
        const number = document.createElement('span'); number.textContent = String(Number(date.slice(-2)));
        const price = document.createElement('small'); price.textContent = allowed && !day?.available ? '↗' : day?.price !== null && day?.price !== undefined && day?.available ? money(day.price, true) : '—';
        button.append(number, price); grid.append(button);
      }
      section.append(grid); content.append(section);
    }
    find('months').replaceChildren(content);
    summary();
  }
  async function request(input, signal, method = 'GET') {
    const response = await fetch(method === 'GET' ? '/api/booking?' + new URLSearchParams(input) : '/api/booking', method === 'GET' ? { signal } : { method, signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || 'API_UNAVAILABLE');
    return body;
  }
  function showError(error) {
    status(error.message === 'UNAVAILABLE' ? copy.unavailableStay : error.message === 'RESTRICTIONS' ? copy.restrictions : error.message === 'OCCUPANCY' ? copy.occupancy : copy.error, true);
  }
  async function load(reset = false) {
    const sequence = ++generation;
    ++quoteSequence;
    controller?.abort(); controller = new AbortController();
    selectedQuote = null; checking = false;
    if (reset) { arrival = departure = null; days = {}; }
    root.setAttribute('aria-busy', 'true'); status(copy.loading); summary();
    const start = month < today ? today : month;
    const end = shiftMonth(month, 2) < addDays(today, 370) ? shiftMonth(month, 2) : addDays(today, 370);
    try {
      const data = await request({ mode: 'calendar', ...occupancy(), start, end }, controller.signal);
      if (sequence !== generation) return;
      days = { ...days, ...data.days }; render(); status(copy.pick);
      if (arrival && departure) await loadQuote(sequence);
    } catch (error) { if (sequence === generation && error.name !== 'AbortError') { days = {}; render(); showError(error); } }
    finally { if (sequence === generation) root.setAttribute('aria-busy', 'false'); }
  }
  async function loadQuote(sequence = generation, verify = false) {
    const quoteId = ++quoteSequence;
    const prior = selectedQuote;
    selectedQuote = null; checking = true; summary(); status(copy.checking);
    try {
      const data = await request({ mode: 'quote', ...occupancy(), arrival, departure }, controller.signal, verify ? 'POST' : 'GET');
      if (sequence !== generation || quoteId !== quoteSequence) return;
      selectedQuote = data;
      if (verify) {
        if (!prior || data.total !== prior.total) { status(copy.changed); return; }
        window.dispatchEvent(new CustomEvent('vdr:dates-confirmed', { detail: data }));
        const url = new URL(location.href); url.searchParams.set('checkin', arrival); url.searchParams.set('checkout', departure); url.searchParams.set('numnight', String(data.nights));
        history.replaceState({}, '', url.pathname + url.search + '#availability');
        status(copy.ready);
        document.querySelector('[data-booking-frame-wrap]').scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else status(copy.included);
    } catch (error) { if (sequence === generation && quoteId === quoteSequence && error.name !== 'AbortError') showError(error); }
    finally { if (sequence === generation && quoteId === quoteSequence) { checking = false; summary(); } }
  }
  find('months').addEventListener('click', event => {
    const button = event.target.closest('[data-date]');
    if (!button || button.disabled || checking) return;
    const date = button.dataset.date;
    ++quoteSequence; selectedQuote = null;
    if (!arrival || departure || date <= arrival) { arrival = date; departure = null; status(copy.chooseDeparture); }
    else { departure = date; loadQuote(); }
    render();
    root.querySelector('[data-date="' + date + '"]')?.focus();
  });
  find('months').addEventListener('keydown', event => {
    const button = event.target.closest('[data-date]');
    const offset = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[event.key];
    if (!button || !offset) return;
    event.preventDefault(); root.querySelector('[data-date="' + addDays(button.dataset.date, offset) + '"]:not(:disabled)')?.focus();
  });
  find('prev').addEventListener('click', () => { month = shiftMonth(month, -1); load(); });
  find('next').addEventListener('click', () => { month = shiftMonth(month, 1); load(); });
  find('continue').addEventListener('click', () => { if (selectedQuote && !checking) loadQuote(generation, true); });
  window.addEventListener('vdr:stay-change', () => { days = {}; load(); });
  render(); load();
}
