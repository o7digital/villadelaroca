import { parseLegacyHtmlForShell } from "./legacy-html";

type Locale = "en" | "es";

const controllerName = "CASACANTA ZIHUA SA DE CV";
const contactEmail = "sales.reservations@lacasaquecanta.com";
const contactPhone = "+52 (755) 555 7000";
const contactPhoneHref = "tel:+527555557000";
const siteUrl = "https://villadelaroca.com/";

function privacyStyles() {
  return `
    <style>
      .vdr-privacy-bg {
        background-color: rgb(233, 232, 229);
        min-height: 100vh;
        position: relative;
        overflow: hidden;
        padding: 138px 0 72px;
      }

      .vdr-privacy-bg::before {
        content: "";
        position: fixed;
        inset: 0;
        background-image: url("/assets/legacy/uploads/2022/11/logo_vdr_blanco_ok.png");
        background-repeat: no-repeat;
        background-position: center 30%;
        background-size: clamp(360px, 116vw, 1280px);
        filter: invert(1) grayscale(1);
        opacity: 0.11;
        pointer-events: none;
        z-index: 0;
      }

      .vdr-privacy-container {
        width: min(900px, calc(100% - 36px));
        margin: 0 auto;
        position: relative;
        z-index: 1;
        color: #26333a;
        font-family: "Montserrat", sans-serif;
      }

      .vdr-privacy-breadcrumb {
        margin: 0 0 18px;
        font-size: 13px;
        color: #536066;
      }

      .vdr-privacy-breadcrumb a {
        color: #26333a;
        text-decoration: underline;
        text-underline-offset: 3px;
      }

      .vdr-privacy-container h1 {
        margin: 0 0 34px;
        font-family: "Playfair Display", serif;
        font-size: clamp(36px, 6vw, 58px);
        line-height: 1.08;
        color: #202b31;
      }

      .vdr-privacy-content {
        max-width: 760px;
      }

      .vdr-privacy-content p {
        margin: 0 0 15px;
        font-size: 15px;
        line-height: 1.78;
      }

      .vdr-privacy-content .lead {
        font-size: 17px;
      }

      .vdr-privacy-content h3 {
        margin: 30px 0 12px;
        font-family: "Playfair Display", serif;
        font-size: 25px;
        line-height: 1.2;
        color: #202b31;
      }

      .vdr-privacy-content ul {
        margin: 0 0 16px 24px;
        padding: 0;
        list-style: disc;
      }

      .vdr-privacy-content li {
        margin: 7px 0;
        line-height: 1.65;
      }

      .vdr-privacy-content hr {
        border: 0;
        border-top: 1px solid rgba(38, 51, 58, 0.24);
        margin: 30px 0;
      }

      .vdr-privacy-content a {
        color: #26333a;
        text-decoration: underline;
        text-underline-offset: 3px;
      }

      body .header.transparent {
        background: rgba(0, 0, 0, 0.42);
      }

      @media (min-width: 768px) {
        .vdr-privacy-bg::before {
          background-position: center 24%;
          background-size: clamp(520px, 78vw, 1480px);
          opacity: 0.12;
        }
      }

      @media (max-width: 767px) {
        .vdr-privacy-bg {
          padding-top: 116px;
        }
      }
    </style>
  `;
}

function englishContent() {
  return `
    <section class="vdr-privacy-content">
      <p class="lead"><strong>In “Villa de la Roca”</strong>, as a property belonging to <strong>${controllerName}</strong>, we are aware of the importance of maintaining the confidentiality of personal and sensitive information of our guests and clients. We are committed to protecting your information and privacy in accordance with:</p>
      <ul>
        <li>The <strong>Federal Law on the Protection of Personal Data Held by Private Parties</strong> (Mexico)</li>
        <li>The <strong>General Data Protection Regulation (GDPR)</strong> of the European Union</li>
        <li>The <strong>California Consumer Privacy Act (CCPA)</strong> in the United States</li>
      </ul>
      <p>Below we provide you with important information regarding the collection, use, and protection of your personal data.</p>
      <hr />
      <h3>1. Data Collection</h3>
      <p>We may collect personal information at any of the contact and interaction points we have with our clients, including:</p>
      <ul>
        <li>Our website and reservation system</li>
        <li>Information sent to or shared through our social media platforms</li>
        <li>Our internal systems and during your visit to the property</li>
      </ul>
      <p>This information may include:</p>
      <ul>
        <li>Contact details (name, phone number, email, address)</li>
        <li>Information related to your booking, stay, or visit</li>
        <li>Payment data (credit card, TAX ID, business activity)</li>
        <li>Personal characteristics, nationality, passport or official ID number, and place and date of issue</li>
        <li>Travel history and preferences during your stay</li>
        <li>Data on travel companions (name, preferences)</li>
        <li>Medical information voluntarily provided to improve your experience</li>
        <li>Marketing and communication preferences</li>
        <li>Feedback and comments about our services</li>
      </ul>
      <hr />
      <h3>2. Use of Personal and Sensitive Information</h3>
      <p>${controllerName} uses this information to provide the services you requested or those related to a reservation, transaction, or program. We may also use your data to:</p>
      <ul>
        <li>Improve our services and offer the level of hospitality you expect</li>
        <li>Ensure that our website, products, and services meet your interests</li>
        <li>Process payments, refunds, and other service-related requests</li>
        <li>Send communications regarding services, promotions, and special events (with your prior consent)</li>
      </ul>
      <p>The legal basis for processing your data includes:</p>
      <ul>
        <li>Your consent</li>
        <li>The execution of a contract (your reservation)</li>
        <li>Our legitimate interest (to improve services)</li>
      </ul>
      <p>All in accordance with applicable Mexican law, the GDPR, and the CCPA.</p>
      <hr />
      <h3>3. Data Transfers</h3>
      <p>We may transfer your personal data to:</p>
      <ul>
        <li>IT service providers operating our technological infrastructure (servers, reservation systems, etc.)</li>
        <li>Medical providers, in case of emergency</li>
        <li>Competent authorities, when required by law</li>
      </ul>
      <p>If you do not object, we will assume that you authorize these transfers.</p>
      <p><strong>Note for EU residents:</strong> We only transfer personal data outside the European Economic Area (EEA) to countries that ensure an adequate level of protection, or under Standard Contractual Clauses approved by the European Commission.</p>
      <p><strong>Note for California residents (USA):</strong> We do not sell your personal information as defined under the CCPA.</p>
      <hr />
      <h3>4. Security Measures</h3>
      <p>We have implemented physical, technical, and administrative safeguards to protect your personal data from unauthorized access, loss, alteration, or misuse. These include:</p>
      <ul>
        <li>SSL encryption on our website and reservation systems</li>
        <li>Internal access controls and staff training</li>
        <li>Secure backups and system monitoring</li>
      </ul>
      <hr />
      <h3>5. ARCO Rights and Other Applicable Rights</h3>
      <p>In accordance with Mexican law, you have the right to Access, Rectify, Cancel, or Oppose the processing of your personal data (ARCO rights).</p>
      <p>Additionally, under GDPR and CCPA, you may also exercise the following rights:</p>
      <ul>
        <li>Data portability (EU)</li>
        <li>Restriction of processing</li>
        <li>Right to erasure (“right to be forgotten”)</li>
        <li>Right to opt out of marketing or data sharing (California)</li>
      </ul>
      <p>You may submit your request to exercise any of these rights by writing to our Reservations and Sales Department: <a href="mailto:${contactEmail}">${contactEmail}</a> · <a href="${contactPhoneHref}">${contactPhone}</a></p>
      <p><strong>Response Time:</strong> Within 20 business days from the date of receipt of your request, if it is deemed admissible, the corresponding action will be taken within 15 business days following the date on which the response is communicated.</p>
      <p>We will respond through the contact method you indicate in your request and within the timeframe established by applicable law.</p>
      <hr />
      <h3>6. Data Retention</h3>
      <p>We retain your personal data only for as long as necessary to fulfill the purposes described above, or as required by applicable tax or legal regulations.</p>
      <hr />
      <h3>7. Modifications to this Privacy Notice</h3>
      <p>This privacy notice may be updated at any time. Changes will be published on our website: <a href="${siteUrl}">www.villadelaroca.com</a> · Last update: August 2025</p>
      <hr />
      <h3>8. Identity and Address of the Data Controller</h3>
      <p><strong>${controllerName}</strong></p>
      <ul>
        <li>Fiscal Address: Montes Urales 754, Floor 5, Lomas de Chapultepec I Sección, 11000 CDMX, Mexico</li>
        <li>Property Address: Camino Escénico a Playa La Ropa, Colonia La Ropa, 40880 Zihuatanejo, Gro., Mexico</li>
      </ul>
      <p>© All rights reserved Villa de la Roca</p>
    </section>
  `;
}

function spanishContent() {
  return `
    <section class="vdr-privacy-content">
      <p class="lead">En <strong>Villa de la Roca</strong>, como propiedad perteneciente a <strong>${controllerName}</strong>, somos plenamente conscientes de la importancia de mantener la confidencialidad de la información personal y sensible de nuestros huéspedes y clientes. Estamos comprometidos con la protección de sus datos personales conforme a:</p>
      <ul>
        <li>La <strong>Ley Federal de Protección de Datos Personales en Posesión de los Particulares</strong> (México)</li>
        <li>El <strong>Reglamento General de Protección de Datos (GDPR)</strong> de la Unión Europea</li>
        <li>La <strong>Ley de Privacidad del Consumidor de California (CCPA)</strong> en los Estados Unidos</li>
      </ul>
      <p>A continuación, ponemos a su disposición información relevante sobre la recopilación, uso, protección y transferencia de sus datos personales.</p>
      <hr />
      <h3>1. Recopilación de datos</h3>
      <p>Podemos recopilar datos personales a través de distintos puntos de contacto e interacción con nuestros clientes, incluyendo:</p>
      <ul>
        <li>Nuestro sitio web y sistema de reservaciones</li>
        <li>Información enviada o compartida a través de nuestras redes sociales</li>
        <li>Nuestros sistemas internos y durante su estancia en la propiedad</li>
      </ul>
      <p>La información recabada puede incluir:</p>
      <ul>
        <li>Datos de contacto (nombre, teléfono, correo electrónico, dirección)</li>
        <li>Información relacionada con su reservación, estancia o visita</li>
        <li>Datos de pago (tarjeta, RFC, actividad económica)</li>
        <li>Características personales, nacionalidad, pasaporte o identificación oficial con lugar y fecha de expedición</li>
        <li>Historial de visitas previas</li>
        <li>Preferencias durante su estancia</li>
        <li>Información de acompañantes (nombre, preferencias)</li>
        <li>Información médica compartida voluntariamente</li>
        <li>Preferencias de marketing y comunicación</li>
        <li>Opiniones o comentarios sobre nuestros servicios</li>
      </ul>
      <hr />
      <h3>2. Uso de la información personal y sensible</h3>
      <p>${controllerName} utiliza esta información para brindarle los servicios solicitados o relacionados con su reservación, transacción o la adquisición de productos o paquetes. También podemos usar sus datos para:</p>
      <ul>
        <li>Mejorar nuestros servicios y ofrecer el nivel de hospitalidad que espera</li>
        <li>Asegurar que nuestro sitio web, productos y servicios sean de su interés</li>
        <li>Procesar pagos, reembolsos y otras solicitudes relacionadas con el servicio</li>
        <li>Enviar comunicaciones sobre servicios, promociones y eventos especiales (con su consentimiento previo)</li>
      </ul>
      <p>Las bases legales para el tratamiento de sus datos incluyen:</p>
      <ul>
        <li>Su consentimiento</li>
        <li>La ejecución de un contrato (su reservación)</li>
        <li>Nuestro interés legítimo (mejora de servicios)</li>
      </ul>
      <hr />
      <h3>3. Transferencia de datos</h3>
      <p>Podemos transferir sus datos personales a:</p>
      <ul>
        <li>Proveedores de TI que operan nuestra infraestructura tecnológica</li>
        <li>Proveedores médicos, en caso de emergencia</li>
        <li>Autoridades competentes, cuando así lo exija la ley</li>
      </ul>
      <p>Si no manifiesta su oposición, se entenderá que acepta estas transferencias.</p>
      <hr />
      <h3>4. Medidas de seguridad</h3>
      <p>Hemos implementado medidas de seguridad físicas, técnicas y administrativas para proteger sus datos personales contra accesos no autorizados, pérdida, alteración o uso indebido. Entre ellas:</p>
      <ul>
        <li>Cifrado SSL en nuestro sitio web y sistemas de reservación</li>
        <li>Controles de acceso internos y capacitación al personal</li>
        <li>Copias de seguridad y monitoreo de sistemas</li>
      </ul>
      <hr />
      <h3>5. Derechos ARCO y otros derechos aplicables</h3>
      <p>De acuerdo con la legislación mexicana, usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse al tratamiento de sus datos personales (derechos ARCO).</p>
      <p>Adicionalmente, bajo GDPR y CCPA, también puede ejercer los siguientes derechos:</p>
      <ul>
        <li>Portabilidad de datos (UE)</li>
        <li>Limitación del tratamiento</li>
        <li>Derecho de supresión (“derecho al olvido”)</li>
        <li>Derecho a oponerse a marketing o compartición de datos (California)</li>
      </ul>
      <p>Para ejercer sus derechos, contacte a nuestro Departamento de Reservas y Ventas: <a href="mailto:${contactEmail}">${contactEmail}</a> · <a href="${contactPhoneHref}">${contactPhone}</a></p>
      <hr />
      <h3>6. Conservación de datos</h3>
      <p>Conservamos sus datos personales sólo el tiempo necesario para cumplir con los fines descritos o según lo exijan las normas fiscales o legales aplicables.</p>
      <hr />
      <h3>7. Modificaciones a este aviso de privacidad</h3>
      <p>Este aviso de privacidad puede ser actualizado en cualquier momento. Los cambios se publicarán en <a href="${siteUrl}">www.villadelaroca.com</a>. Última actualización: Agosto 2025.</p>
      <hr />
      <h3>8. Identidad y domicilio del responsable</h3>
      <p><strong>${controllerName}</strong></p>
      <ul>
        <li>Domicilio fiscal: Montes Urales 754, Piso 5, Lomas de Chapultepec I Sección, 11000 CDMX, México</li>
        <li>Domicilio de la propiedad: Camino Escénico a Playa La Ropa, Colonia La Ropa, 40880 Zihuatanejo, Gro., México</li>
      </ul>
      <p>© Todos los derechos reservados Villa de la Roca</p>
    </section>
  `;
}

function pageMeta(locale: Locale) {
  if (locale === "es") {
    return {
      title: "Aviso de Privacidad - Villa de la Roca",
      description: "Aviso de Privacidad de Villa de la Roca, propiedad perteneciente a La Casa Que Canta.",
      canonical: "https://villadelaroca.com/es/privacy-policy/",
      alternate: '<link rel="alternate" href="/privacy-policy/" hreflang="en"/><link rel="alternate" href="/es/privacy-policy/" hreflang="es"/>',
    };
  }

  return {
    title: "Privacy Policy - Villa de la Roca",
    description: "Privacy Policy for Villa de la Roca, a property belonging to La Casa Que Canta.",
    canonical: "https://villadelaroca.com/privacy-policy/",
    alternate: '<link rel="alternate" href="/privacy-policy/" hreflang="en"/><link rel="alternate" href="/es/privacy-policy/" hreflang="es"/>',
  };
}

function replaceMeta(headHtml: string, locale: Locale) {
  const meta = pageMeta(locale);

  return headHtml
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${meta.title}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/i, `<meta name="description" content="${meta.description}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/i, `<meta property="og:title" content="${meta.title}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/i, `<meta property="og:description" content="${meta.description}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/i, `<meta property="og:url" content="${meta.canonical}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*" \/>/i, `<meta name="twitter:title" content="${meta.title}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*" \/>/i, `<meta name="twitter:description" content="${meta.description}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/i, `<link rel="canonical" href="${meta.canonical}" />`)
    .replace(/<link rel="alternate" href="[^"]*" hreflang="en"\/>\s*<link rel="alternate" href="[^"]*" hreflang="es"\/>/i, meta.alternate);
}

function buildPrivacyContent(locale: Locale) {
  const isSpanish = locale === "es";
  const homeHref = isSpanish ? "/es/" : "/";
  const homeLabel = isSpanish ? "Inicio" : "Home";
  const pageLabel = isSpanish ? "Aviso de Privacidad" : "Privacy Policy";

  return `
    ${privacyStyles()}
    <main class="vdr-privacy-bg">
      <div class="vdr-privacy-container">
        <nav class="vdr-privacy-breadcrumb" aria-label="Breadcrumb">
          <a href="${homeHref}">${homeLabel}</a>
          <span> / </span>
          <span>${pageLabel}</span>
        </nav>
        <h1>${pageLabel}</h1>
        ${isSpanish ? spanishContent() : englishContent()}
      </div>
    </main>
  `;
}

export function buildPrivacyPage(rawHtml: string, locale: Locale) {
  const shell = parseLegacyHtmlForShell(rawHtml);

  return {
    ...shell,
    lang: locale,
    headHtml: replaceMeta(shell.headHtml, locale),
    contentHtml: buildPrivacyContent(locale),
  };
}
