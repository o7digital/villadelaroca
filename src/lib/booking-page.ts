import { parseLegacyHtmlForShell } from "./legacy-html";

type Locale = "en" | "es";

const HERO_IMAGE = "/assets/legacy/uploads/2023/01/ourbnb_top2.webp";
const SUITES_IMAGE = "/assets/legacy/uploads/2023/01/vdlr_suite_02.webp";
const VILLA_IMAGE = "/assets/legacy/uploads/2022/11/xxl_982-villa-de-la-roca-b-and-b-ixtapa-zihuatanejo.webp";
const SUITE_GALLERY_COUNT = 8;
const VILLA_GALLERY_IMAGES = ["/slider/1.webp", "/slider/2.webp", "/slider/3.webp", "/slider/4.webp", "/slider/5.webp", "/slider/6.webp", "/slider/7.webp", "/slider/8.webp"];

function absolutizeLegacyPaths(html: string) {
  return html
    .replace(/(href|src)=(["'])((?:\.\.\/)+)?assets\//g, "$1=$2/assets/")
    .replace(/(href|src)=(["'])((?:\.\.\/)+)?feed\//g, "$1=$2/feed/")
    .replace(/(href|src)=(["'])((?:\.\.\/)+)?comments\//g, "$1=$2/comments/");
}

function pageMeta(locale: Locale) {
  if (locale === "es") {
    return {
      title: "Reservar - Villa de la Roca Zihuatanejo",
      description: "Consulta disponibilidad y reserva suites o la villa completa en Villa de la Roca, Playa La Ropa, Zihuatanejo.",
      canonical: "https://villadelaroca.com/es/reservar/",
    };
  }

  return {
    title: "Book Your Stay - Villa de la Roca Zihuatanejo",
    description: "Check availability and book private suites or the entire Villa de la Roca in Playa La Ropa, Zihuatanejo.",
    canonical: "https://villadelaroca.com/book/",
  };
}

function replaceMeta(headHtml: string, locale: Locale) {
  const meta = pageMeta(locale);
  const alternates = '<link rel="alternate" href="/book/" hreflang="en"/><link rel="alternate" href="/es/reservar/" hreflang="es"/>';

  return absolutizeLegacyPaths(headHtml)
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${meta.title}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/i, `<meta name="description" content="${meta.description}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/i, `<meta property="og:title" content="${meta.title}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/i, `<meta property="og:description" content="${meta.description}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/i, `<meta property="og:url" content="${meta.canonical}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*" \/>/i, `<meta name="twitter:title" content="${meta.title}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*" \/>/i, `<meta name="twitter:description" content="${meta.description}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/i, `<link rel="canonical" href="${meta.canonical}" />`)
    .replace(/<link rel="alternate" href="[^"]*" hreflang="en"\/>\s*<link rel="alternate" href="[^"]*" hreflang="es"\/>/i, alternates);
}

function bookingStyles() {
  return `
    <style>
      :root {
        --vdr-ink: #1d2528;
        --vdr-green: #315447;
        --vdr-green-dark: #213d34;
        --vdr-gold: #c4a767;
        --vdr-sand: #f4f0e8;
        --vdr-white: #ffffff;
      }

      body:has(.vdr-booking-page) {
        background: var(--vdr-sand);
      }

      body:has(.vdr-booking-page) .header.transparent {
        position: absolute !important;
        top: 0;
        left: 0;
        right: 0;
        z-index: 10000;
        background: linear-gradient(180deg, rgba(8, 16, 15, 0.72), rgba(8, 16, 15, 0)) !important;
      }

      body:has(.vdr-booking-page) .header.transparent .mainbar,
      body:has(.vdr-booking-page) .header.transparent.stuck .mainbar {
        background: transparent !important;
      }

      body:has(.vdr-booking-page) .social-floating {
        display: none !important;
      }

      .vdr-booking-page {
        color: var(--vdr-ink);
        background: var(--vdr-sand);
        font-family: "Montserrat", sans-serif;
      }

      .vdr-booking-hero {
        min-height: min(610px, 72vh);
        display: flex;
        align-items: flex-end;
        position: relative;
        isolation: isolate;
        overflow: hidden;
        background: #1f3e38 url("${HERO_IMAGE}") center 53% / cover no-repeat;
      }

      .vdr-booking-hero::before {
        content: "";
        position: absolute;
        inset: 0;
        z-index: -1;
        background: linear-gradient(180deg, rgba(9, 20, 18, 0.14) 25%, rgba(9, 20, 18, 0.83) 100%);
      }

      .vdr-booking-hero__inner {
        width: min(1180px, calc(100% - 40px));
        margin: 0 auto;
        padding: 190px 0 68px;
        color: var(--vdr-white);
      }

      .vdr-booking-eyebrow {
        margin: 0 0 16px;
        color: #f0d99e;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.22em;
        text-transform: uppercase;
      }

      .vdr-booking-hero h1 {
        max-width: 760px;
        margin: 0;
        color: var(--vdr-white);
        font-family: "Playfair Display", serif;
        font-size: clamp(46px, 7vw, 82px);
        font-weight: 500;
        line-height: 0.98;
        letter-spacing: -0.025em;
        text-shadow: 0 3px 28px rgba(0, 0, 0, 0.25);
        text-transform: none !important;
      }

      .vdr-booking-hero p:last-child {
        max-width: 650px;
        margin: 24px 0 0;
        font-size: clamp(16px, 2vw, 20px);
        line-height: 1.65;
        color: rgba(255, 255, 255, 0.9);
      }

      .vdr-booking-body {
        width: min(1180px, calc(100% - 40px));
        margin: 0 auto;
        padding: 72px 0 88px;
      }

      .vdr-booking-intro {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(300px, 0.7fr);
        gap: 64px;
        align-items: end;
        margin-bottom: 38px;
      }

      .vdr-booking-intro h2 {
        margin: 0;
        color: var(--vdr-ink);
        font-family: "Playfair Display", serif;
        font-size: clamp(34px, 4.5vw, 54px);
        font-weight: 500;
        line-height: 1.08;
        text-transform: none !important;
      }

      .vdr-booking-intro p {
        margin: 0;
        color: #52605d;
        font-size: 15px;
        line-height: 1.8;
      }

      .vdr-stay-options {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px;
        margin: 0 0 36px;
      }

      .vdr-stay-option {
        display: grid !important;
        grid-template-columns: 168px minmax(0, 1fr) !important;
        width: 100% !important;
        min-height: 154px;
        padding: 0 !important;
        overflow: hidden;
        border: 1px solid rgba(49, 84, 71, 0.2);
        border-radius: 3px;
        background: rgba(255, 255, 255, 0.76);
        color: var(--vdr-ink);
        text-align: left;
        cursor: pointer;
        appearance: none;
        box-shadow: 0 10px 34px rgba(24, 45, 39, 0.06);
        transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease, background 180ms ease;
      }

      .vdr-stay-option:hover {
        transform: translateY(-2px);
        border-color: rgba(49, 84, 71, 0.55);
        box-shadow: 0 16px 36px rgba(24, 45, 39, 0.11);
      }

      .vdr-stay-option.is-active {
        border-color: var(--vdr-green);
        background: var(--vdr-white);
        box-shadow: 0 0 0 2px var(--vdr-green), 0 16px 38px rgba(24, 45, 39, 0.13);
      }

      .vdr-stay-option img {
        width: 100%;
        height: 154px;
        min-height: 154px;
        object-fit: cover;
      }

      .vdr-stay-option__copy {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 22px 24px;
      }

      .vdr-stay-option__title {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 8px;
        font-family: "Playfair Display", serif;
        font-size: 25px;
        font-weight: 600;
      }

      .vdr-stay-option__title::after {
        content: "";
        width: 9px;
        height: 9px;
        margin-left: auto;
        border: 1px solid #71807a;
        border-radius: 50%;
        background: transparent;
        box-shadow: 0 0 0 4px #fff;
      }

      .vdr-stay-option.is-active .vdr-stay-option__title::after {
        border-color: var(--vdr-green);
        background: var(--vdr-green);
      }

      .vdr-stay-option__detail {
        color: #66716e;
        font-size: 13px;
        line-height: 1.6;
      }

      .vdr-engine-shell {
        position: relative;
        overflow: hidden;
        border: 1px solid rgba(49, 84, 71, 0.2);
        border-radius: 3px;
        background: var(--vdr-white);
        box-shadow: 0 20px 60px rgba(26, 49, 42, 0.1);
      }

      .vdr-suite-gallery {
        margin: -16px 0 36px;
        position: relative;
      }

      .vdr-suite-gallery[hidden] { display: none; }

      .vdr-suite-slider {
        position: relative;
        overflow: hidden;
        background: #17231f;
      }

      .vdr-suite-slider__track {
        display: flex;
        transition: transform 350ms ease;
      }

      .vdr-suite-slide {
        display: block;
        flex: 0 0 100%;
        width: 100%;
        padding: 0;
        border: 0;
        background: none;
        cursor: zoom-in;
      }

      .vdr-suite-slide img {
        display: block;
        width: 100%;
        height: min(34vw, 460px);
        object-fit: cover;
      }

      .vdr-suite-slider__nav {
        position: absolute;
        top: 50%;
        z-index: 1;
        width: 48px;
        height: 48px;
        border: 0;
        border-radius: 50%;
        background: var(--vdr-green-dark);
        color: #fff;
        font-size: 38px;
        line-height: 1;
        cursor: pointer;
        transform: translateY(-50%);
      }

      .vdr-suite-slider__nav--prev { left: 18px; }
      .vdr-suite-slider__nav--next { right: 18px; }

      .vdr-suite-slider__count {
        position: absolute;
        right: 18px;
        bottom: 18px;
        padding: 8px 11px;
        background: rgba(0, 0, 0, 0.62);
        color: #fff;
        font-size: 12px;
      }

      .vdr-suite-lightbox {
        width: min(1200px, calc(100% - 36px));
        max-width: none;
        padding: 0;
        border: 0;
        background: #111;
      }

      .vdr-suite-lightbox::backdrop { background: rgba(0, 0, 0, 0.82); }
      .vdr-suite-lightbox img { display: block; width: 100%; max-height: 88vh; object-fit: contain; }
      .vdr-suite-lightbox button { position: absolute; top: 12px; right: 12px; width: 42px; height: 42px; border: 0; border-radius: 50%; background: #fff; font-size: 25px; cursor: pointer; }

      .vdr-search-form {
        display: grid;
        grid-template-columns: 1fr 1fr auto;
        gap: 14px;
        align-items: end;
        padding: 24px;
        border: 1px solid #ded8ce;
        background: #f7f4ee;
      }

      .vdr-search-form label { display: grid; gap: 7px; color: #53605d; font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
      .vdr-search-form input { width: 100%; min-height: 48px; padding: 10px 12px; border: 1px solid #cfc8bc; background: #fff; color: var(--vdr-ink); font: inherit; }
      .vdr-search-form button { min-height: 48px; padding: 0 26px; border: 0; background: var(--vdr-green); color: #fff; font: 700 12px "Montserrat", sans-serif; letter-spacing: .08em; text-transform: uppercase; cursor: pointer; }
      .vdr-search-price { min-height: 24px; margin: 14px 0 0; color: var(--vdr-green-dark); font-size: 18px; font-weight: 700; }

      .vdr-engine-heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        padding: 24px 30px;
        border-bottom: 1px solid #e9e5dc;
        background: #fff;
      }

      .vdr-engine-heading h3 {
        margin: 0;
        color: var(--vdr-ink);
        font-family: "Playfair Display", serif;
        font-size: 27px;
        font-weight: 600;
      }

      .vdr-secure-note {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: #66716e;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
      }

      .vdr-secure-note svg {
        width: 16px;
        height: 16px;
        color: var(--vdr-green);
      }

      .vdr-engine-frame-wrap {
        position: relative;
        min-height: 700px;
        padding: 20px;
        background: #fbfaf7;
      }

      .vdr-engine-loading {
        position: absolute;
        inset: 20px;
        z-index: 1;
        display: grid;
        place-items: center;
        background: #fbfaf7;
        color: #65716e;
        font-size: 13px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        transition: opacity 180ms ease, visibility 180ms ease;
      }

      .vdr-engine-frame-wrap.is-loaded .vdr-engine-loading {
        opacity: 0;
        visibility: hidden;
      }

      .vdr-engine-frame {
        display: block;
        width: 100%;
        height: 1120px;
        border: 0;
        background: #fff;
      }

      .vdr-engine-footer {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        padding: 18px 30px;
        border-top: 1px solid #e9e5dc;
        color: #6b7672;
        font-size: 12px;
        line-height: 1.6;
      }

      .vdr-engine-footer a {
        color: var(--vdr-green-dark);
        font-weight: 700;
        text-decoration: underline;
        text-underline-offset: 3px;
      }

      @media (max-width: 900px) {
        .vdr-booking-intro {
          grid-template-columns: 1fr;
          gap: 18px;
        }

        .vdr-stay-option {
          grid-template-columns: 130px minmax(0, 1fr) !important;
        }
      }

      @media (max-width: 680px) {
        .vdr-booking-hero {
          min-height: 520px;
          background-position: 58% center;
        }

        .vdr-booking-hero__inner {
          width: min(100% - 30px, 1180px);
          padding: 155px 0 46px;
        }

        .vdr-booking-body {
          width: min(100% - 24px, 1180px);
          padding: 48px 0 62px;
        }

        .vdr-stay-options {
          grid-template-columns: 1fr;
        }

        .vdr-suite-gallery { margin-top: -18px; }
        .vdr-suite-slide img { height: 64vw; }
        .vdr-search-form { grid-template-columns: 1fr; }

        .vdr-stay-option {
          grid-template-columns: 118px minmax(0, 1fr) !important;
          min-height: 132px;
        }

        .vdr-stay-option img {
          height: 132px;
          min-height: 132px;
        }

        .vdr-stay-option__copy {
          padding: 17px 18px;
        }

        .vdr-stay-option__title {
          font-size: 21px;
        }

        .vdr-engine-heading,
        .vdr-engine-footer {
          align-items: flex-start;
          flex-direction: column;
          padding: 20px;
        }

        .vdr-engine-frame-wrap {
          min-height: 780px;
          padding: 0;
        }

        .vdr-engine-loading {
          inset: 0;
        }

        .vdr-engine-frame {
          height: 1420px;
        }
      }
    </style>
  `;
}

function bookingCopy(locale: Locale) {
  if (locale === "es") {
    return {
      eyebrow: "Reservación oficial",
      title: "Reserva tu estancia frente al Pacífico",
      heroText: "Elige tus fechas y descubre la tranquilidad de Villa de la Roca, a unos pasos de Playa La Ropa.",
      introTitle: "Una experiencia íntima en Zihuatanejo",
      introText: "Selecciona una suite privada o disfruta la villa completa. La disponibilidad, las tarifas y el pago seguro se gestionan directamente con nuestro sistema de reservaciones.",
      suites: "Suites privadas",
      suitesDetail: "Cinco suites · desayuno incluido",
      villa: "Villa completa",
      villaDetail: "Uso privado · cinco habitaciones",
      dates: "Elige tus fechas",
      secure: "Reserva segura",
      loading: "Cargando disponibilidad",
      powered: "Disponibilidad y pagos procesados de forma segura por Beds24.",
      fallback: "Abrir el motor de reserva",
      frameTitle: "Disponibilidad y reservación de Villa de la Roca",
    };
  }

  return {
    eyebrow: "Official reservations",
    title: "Book your stay by the Pacific",
    heroText: "Choose your dates and discover the quiet beauty of Villa de la Roca, just steps from Playa La Ropa.",
    introTitle: "An intimate stay in Zihuatanejo",
    introText: "Choose a private suite or enjoy the entire villa. Live availability, rates and secure payment are handled directly by our reservation system.",
    suites: "Private suites",
    suitesDetail: "Five suites · breakfast included",
    villa: "Entire villa",
    villaDetail: "Private use · five bedrooms",
    dates: "Choose your dates",
    secure: "Secure booking",
    loading: "Loading availability",
    powered: "Availability and payments are securely processed by Beds24.",
    fallback: "Open reservation system",
    frameTitle: "Villa de la Roca availability and booking",
  };
}

function buildBookingContent(locale: Locale) {
  const copy = bookingCopy(locale);
  const lang = locale === "es" ? "es" : "en";

  return `
    ${bookingStyles()}
    <main class="vdr-booking-page">
      <section class="vdr-booking-hero">
        <div class="vdr-booking-hero__inner">
          <p class="vdr-booking-eyebrow">${copy.eyebrow}</p>
          <h1>${copy.title}</h1>
          <p>${copy.heroText}</p>
        </div>
      </section>

      <section class="vdr-booking-body" id="availability">
        <div class="vdr-booking-intro">
          <h2>${copy.introTitle}</h2>
          <p>${copy.introText}</p>
        </div>

        <div class="vdr-stay-options" role="group" aria-label="${locale === "es" ? "Tipo de estancia" : "Stay type"}">
          <button class="vdr-stay-option is-active" type="button" data-stay="suites" data-propid="316599" aria-pressed="true">
            <img src="${SUITES_IMAGE}" alt="${copy.suites}" width="1200" height="900" />
            <span class="vdr-stay-option__copy">
              <span class="vdr-stay-option__title">${copy.suites}</span>
              <span class="vdr-stay-option__detail">${copy.suitesDetail}</span>
            </span>
          </button>
          <button class="vdr-stay-option" type="button" data-stay="villa" data-propid="318544" aria-pressed="false">
            <img src="${VILLA_IMAGE}" alt="${copy.villa}" width="1401" height="800" />
            <span class="vdr-stay-option__copy">
              <span class="vdr-stay-option__title">${copy.villa}</span>
              <span class="vdr-stay-option__detail">${copy.villaDetail}</span>
            </span>
          </button>
        </div>

        <section class="vdr-suite-gallery" data-gallery="suites" aria-labelledby="vdr-suite-gallery-title">
          <div class="vdr-suite-slider" data-gallery-slider>
            <div class="vdr-suite-slider__track" data-gallery-track>
              ${Array.from({ length: SUITE_GALLERY_COUNT }, (_, index) => `<button class="vdr-suite-slide" type="button" data-gallery-slide aria-label="${copy.suites} ${index + 1}"><img src="/room/${index + 1}.webp" alt="${copy.suites} ${index + 1}" loading="lazy" /></button>`).join("")}
            </div>
            <button class="vdr-suite-slider__nav vdr-suite-slider__nav--prev" type="button" data-gallery-prev aria-label="Previous photo">‹</button>
            <button class="vdr-suite-slider__nav vdr-suite-slider__nav--next" type="button" data-gallery-next aria-label="Next photo">›</button>
            <span class="vdr-suite-slider__count" data-gallery-count>1 / ${SUITE_GALLERY_COUNT}</span>
          </div>
        </section>
        <section class="vdr-suite-gallery" data-gallery="villa" hidden aria-labelledby="vdr-villa-gallery-title">
          <div class="vdr-suite-slider" data-gallery-slider>
            <div class="vdr-suite-slider__track" data-gallery-track>
              ${VILLA_GALLERY_IMAGES.map((src, index) => `<button class="vdr-suite-slide" type="button" data-gallery-slide aria-label="${copy.villa} ${index + 1}"><img src="${src}" alt="${copy.villa} ${index + 1}" loading="lazy" /></button>`).join("")}
            </div>
            <button class="vdr-suite-slider__nav vdr-suite-slider__nav--prev" type="button" data-gallery-prev aria-label="Previous photo">‹</button>
            <button class="vdr-suite-slider__nav vdr-suite-slider__nav--next" type="button" data-gallery-next aria-label="Next photo">›</button>
            <span class="vdr-suite-slider__count" data-gallery-count>1 / ${VILLA_GALLERY_IMAGES.length}</span>
          </div>
        </section>
        <dialog class="vdr-suite-lightbox" data-suite-lightbox><button type="button" data-suite-close aria-label="Close">×</button><img data-suite-lightbox-image alt="" /></dialog>

        <form class="vdr-search-form" data-booking-search>
          <label>${locale === "es" ? "Fecha de entrada" : "Check-in"}<input type="date" name="checkin" required /></label>
          <label>${locale === "es" ? "Fecha de salida" : "Check-out"}<input type="date" name="checkout" required /></label>
          <button type="submit">${locale === "es" ? "Buscar" : "Search"}</button>
        </form>
        <p class="vdr-search-price" data-booking-price aria-live="polite"></p>

        <section class="vdr-engine-shell" aria-labelledby="vdr-engine-title">
          <header class="vdr-engine-heading">
            <h3 id="vdr-engine-title">${copy.dates}</h3>
            <span class="vdr-secure-note">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 10V7a5 5 0 0 1 10 0v3M5 10h14v11H5V10Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
              ${copy.secure}
            </span>
          </header>
          <div class="vdr-engine-frame-wrap" data-booking-frame-wrap>
            <div class="vdr-engine-loading" aria-live="polite">${copy.loading}</div>
            <iframe
              class="vdr-engine-frame"
              data-booking-frame
              data-lang="${lang}"
              title="${copy.frameTitle}"
              loading="eager"
              allow="payment"
              referrerpolicy="strict-origin-when-cross-origin"
            ></iframe>
          </div>
          <footer class="vdr-engine-footer">
            <span>${copy.powered}</span>
            <a data-external-booking href="https://beds24.com/booking.php?propid=316599&amp;referer=BookingLink&amp;lang=${lang}&amp;cur=MXN" target="_blank" rel="noopener noreferrer">${copy.fallback} ↗</a>
          </footer>
        </section>
      </section>
    </main>

    <script>
      (function () {
        var frame = document.querySelector("[data-booking-frame]");
        var frameWrap = document.querySelector("[data-booking-frame-wrap]");
        var externalLink = document.querySelector("[data-external-booking]");
        var galleries = Array.prototype.slice.call(document.querySelectorAll("[data-gallery]"));
        var searchForm = document.querySelector("[data-booking-search]");
        var priceOutput = document.querySelector("[data-booking-price]");
        var lightbox = document.querySelector("[data-suite-lightbox]");
        var lightboxImage = document.querySelector("[data-suite-lightbox-image]");
        var options = Array.prototype.slice.call(document.querySelectorAll("[data-propid]"));
        if (!frame || !frameWrap || !externalLink || !options.length) return;

        var pageParams = new URLSearchParams(window.location.search);
        var initialStay = pageParams.get("stay") === "villa" ? "villa" : "suites";
        var passthrough = ["checkin", "checkout", "numnight", "numadult", "numchild"];

        function bookingUrl(propid, referer, dates) {
          var params = new URLSearchParams();
          params.set("propid", propid);
          params.set("referer", referer);
          params.set("lang", frame.getAttribute("data-lang") || "en");
          params.set("cur", "MXN");
          params.set("cssfile", window.location.origin + "/booking-engine.css");
          if (dates) {
            params.set("checkin", dates.checkin);
            params.set("checkout", dates.checkout);
          }
          passthrough.forEach(function (name) {
            var value = pageParams.get(name);
            if (value) params.set(name, value);
          });
          return "https://beds24.com/booking.php?" + params.toString();
        }

        function selectStay(stay, updateAddress) {
          var selected = options.find(function (option) { return option.getAttribute("data-stay") === stay; }) || options[0];
          var propid = selected.getAttribute("data-propid");
          options.forEach(function (option) {
            var active = option === selected;
            option.classList.toggle("is-active", active);
            option.setAttribute("aria-pressed", active ? "true" : "false");
          });
          galleries.forEach(function (gallery) {
            gallery.hidden = gallery.getAttribute("data-gallery") !== selected.getAttribute("data-stay");
          });
          externalLink.href = bookingUrl(propid, "BookingLink");

          if (updateAddress && window.history && window.history.replaceState) {
            pageParams.set("stay", selected.getAttribute("data-stay"));
            window.history.replaceState({}, "", window.location.pathname + "?" + pageParams.toString() + "#availability");
          }
        }

        options.forEach(function (option) {
          option.addEventListener("click", function () {
            selectStay(option.getAttribute("data-stay"), true);
          });
        });

        galleries.forEach(function (gallery) {
          var track = gallery.querySelector("[data-gallery-track]");
          var slides = Array.prototype.slice.call(gallery.querySelectorAll("[data-gallery-slide]"));
          var count = gallery.querySelector("[data-gallery-count]");
          var slideIndex = 0;

          function showSlide(index) {
            slideIndex = (index + slides.length) % slides.length;
            track.style.transform = "translateX(-" + (slideIndex * 100) + "%)";
            if (count) count.textContent = (slideIndex + 1) + " / " + slides.length;
          }

          gallery.querySelector("[data-gallery-prev]").addEventListener("click", function () { showSlide(slideIndex - 1); });
          gallery.querySelector("[data-gallery-next]").addEventListener("click", function () { showSlide(slideIndex + 1); });
          slides.forEach(function (slide) {
            slide.addEventListener("click", function () {
              var image = slide.querySelector("img");
              lightboxImage.src = image.currentSrc || image.src;
              lightboxImage.alt = image.alt;
              lightbox.showModal();
            });
          });
        });
        document.querySelector("[data-suite-close]").addEventListener("click", function () { lightbox.close(); });

        searchForm.addEventListener("submit", function (event) {
          event.preventDefault();
          var data = new FormData(searchForm);
          var dates = { checkin: data.get("checkin"), checkout: data.get("checkout") };
          if (!dates.checkin || !dates.checkout || dates.checkout <= dates.checkin) return;
          var selected = options.find(function (option) { return option.classList.contains("is-active"); }) || options[0];
          var propid = selected.getAttribute("data-propid");
          var roomid = selected.getAttribute("data-stay") === "villa" ? "715668" : "658909";
          priceOutput.textContent = "…";
          fetch("/api/booking-price?roomid=" + roomid + "&checkin=" + dates.checkin + "&checkout=" + dates.checkout)
            .then(function (response) { return response.json(); })
            .then(function (price) { priceOutput.textContent = price.mxn + " MXN (" + price.usd + " USD)"; })
            .catch(function () { priceOutput.textContent = ""; });
          frameWrap.classList.remove("is-loaded");
          frame.src = bookingUrl(propid, "iFrame", dates);
        });
        frame.addEventListener("load", function () { frameWrap.classList.add("is-loaded"); });
        selectStay(initialStay, false);
        var dateInputs = searchForm.querySelectorAll("input[type=date]");
        var today = new Date();
        var checkinDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        var checkoutDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3);
        function formatDate(date) {
          return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
        }
        dateInputs[0].value = pageParams.get("checkin") || formatDate(checkinDate);
        dateInputs[1].value = pageParams.get("checkout") || formatDate(checkoutDate);
        searchForm.dispatchEvent(new Event("submit", { cancelable: true }));
      })();
    </script>
  `;
}

export function buildBookingPage(rawHtml: string, locale: Locale) {
  const shell = parseLegacyHtmlForShell(rawHtml);

  return {
    ...shell,
    lang: locale,
    headHtml: replaceMeta(shell.headHtml, locale),
    contentHtml: buildBookingContent(locale),
    tailHtml: absolutizeLegacyPaths(shell.tailHtml),
  };
}
