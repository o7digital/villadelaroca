# Booking calendar

## Temporary production fallback

The premium selector is disabled on both booking pages because the production calendar endpoint returns HTTP 503 (`API_UNAVAILABLE`). Previously its error handler rendered an empty calendar as disabled dates with dashes, obscuring the working native selector. The existing Beds24 iframe now handles dates, live availability and prices directly for suites and the full villa in both languages. Guest limits and the checkout integration are unchanged. No Beds24 settings or credentials were changed. Re-enable the premium markup and assets only after validating live calendar and quote responses against the native engine.

## Premium implementation (currently disabled)

The English `/book/` and Spanish `/es/reservar/` pages now contain a site-owned date range selector above the existing Beds24 iframe. It never accesses the iframe DOM. The booking engine, quantity selection, guest details and payments remain in Beds24.

## Server configuration

Vercel serves `api/booking.mjs` alongside the static Astro output. Configure a sensitive production `BEDS24_REFRESH_TOKEN`, or `BEDS24_API_TOKEN` for a directly usable access/long-life token. Refresh tokens are exchanged server-side through `GET /authentication/token`; the access token is cached until shortly before expiry. Neither credentials nor upstream errors are returned to browsers. Only GET requests are sent to Beds24, even when the site's verification endpoint is called with POST.

An invite code is a setup credential, not the refresh token. Exchange it once using `GET /authentication/setup` with the `code` header, preserve the complete response, and save its `refreshToken` as the sensitive `BEDS24_REFRESH_TOKEN` variable before redeploying. Verify that the returned refresh token can generate access tokens on successive calls to `/authentication/token`. Do not keep a consumed invite code as the runtime credential, expose the exchange to public visitors, or log any authentication response.

The configured token only needs read access to inventory and properties. Room mappings are an allowlist: suites `316599/658909` (five units), villa `318544/715668` (one unit). Villa availability additionally requires five available units in the suite calendar; no dependency is changed.

## Prices and restrictions

Calendar cells show the lodging price per night in USD, calculated from the selected occupancy and the enabled Beds24 daily-price rules. The current setup has one direct offer and one daily price for each room. Children above the included occupancy affect the lodging price according to `extraChild`; obligatory child supplements are separate, just as they are in the existing checkout. The summary adds the configured compulsory supplements and taxes. Nothing is hardcoded to `$150`, `$750`, or the current tax rates.

Arrival and departure restrictions, stay length, inventory and closed nights come from the API calendar/availability. An unavailable night can still be selected as a departure when checkout is permitted. Sold-out nights cannot be included in the stay.

Selecting a range requests an authoritative `/inventory/rooms/offers` quote. Pressing Continue requests it again with uncached inventory and property configuration. A changed total is shown for review and requires another click. The verified dates, occupancy and currency are passed to the existing iframe with documented booking parameters. No reservation is created and no inventory is held by this selector.

Configuration and calendar reads have a bounded five-minute in-memory cache with concurrent request coalescing. The public month response additionally has a two-minute CDN cache; quote and verification responses use `no-store`. Errors leave the existing engine available and never display fabricated rates.

The nightly calculation supports the current daily-price configuration. Activating fixed prices, a different currency, room-level tax/cleaning charges or an unsupported mandatory charging rule triggers the existing-engine fallback rather than a potentially incorrect calendar price or total. Extend and validate the calculation against the native Beds24 summary before enabling such a configuration in the custom selector.

Run `npm test` and `npm run build`. Verify both languages, suites/villa, mobile/desktop, occupancy changes, unavailable dates, checkout on a sold-out night and the final iframe parameters. Tests and QA must stop before submitting a reservation.
