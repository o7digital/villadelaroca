import { calendar, quote, BookingError } from '../server/beds24.mjs';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (!['GET', 'POST'].includes(req.method)) { res.setHeader('Allow', 'GET, POST'); return res.status(405).json({ error: 'METHOD' }); }
  try {
    const params = Object.fromEntries(new URL(req.url, 'https://villadelaroca.com').searchParams);
    const input = req.method === 'POST' ? (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) : params;
    if (!input || (req.method === 'POST' && input.mode !== 'quote')) throw new BookingError('REQUEST');
    if (input.mode !== 'calendar' && input.mode !== 'quote') throw new BookingError('REQUEST');
    const result = await (input.mode === 'calendar' ? calendar(input) : quote(input));
    if (input.mode === 'calendar') res.setHeader('Cache-Control', 'public, max-age=30, s-maxage=120');
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error instanceof BookingError ? error.status : 503).json({ error: error instanceof BookingError ? error.code : 'API_UNAVAILABLE' });
  }
}
