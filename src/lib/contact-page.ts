const HOTEL_EMAIL = "sales.reservations@lacasaquecanta.com";
const FACEBOOK_URL = "https://www.facebook.com/VilladelaRoca";
const INSTAGRAM_URL = "https://www.instagram.com/villadelarocazihuatanejo";
const RESERVATIONS_PHONE_DISPLAY = "+52 755 555 7000";
const RESERVATIONS_PHONE_HREF = "tel:+527555557000";
const WHATSAPP_DISPLAY = "+52 55 2564 1838";
const WHATSAPP_HREF = "https://wa.me/525525641838";

const contactPhonesHtml = `
		<p class="contact_detail"><i class="fa fa-phone"></i><span><a href="${RESERVATIONS_PHONE_HREF}">Tel: ${RESERVATIONS_PHONE_DISPLAY}</a></span></p>



		<p class="contact_detail"><i class="fa fa-whatsapp"></i><span><a href="${WHATSAPP_HREF}" target="_blank" rel="noopener noreferrer">Wa: ${WHATSAPP_DISPLAY}</a></span></p>
`;

export function patchContactPageHtml(rawHtml: string): string {
  return rawHtml
    .replace(/<p class="contact_detail"><i class="fa fa-phone"><\/i><span>[\s\S]*?<\/span><\/p>/i, contactPhonesHtml)
    .replace(/<a href="mailto:[^"]+">[^<]+<\/a>/i, `<a href="mailto:${HOTEL_EMAIL}">${HOTEL_EMAIL}</a>`)
    .replace(
      /<a href="[^"]*" target="_blank" title="Facebook">/i,
      `<a href="${FACEBOOK_URL}" target="_blank" rel="noopener noreferrer" title="Facebook">`,
    )
    .replace(
      /<a href="[^"]*" target="_blank" title="Instagram">/i,
      `<a href="${INSTAGRAM_URL}" target="_blank" rel="noopener noreferrer" title="Instagram">`,
    );
}

export { FACEBOOK_URL, HOTEL_EMAIL, INSTAGRAM_URL, RESERVATIONS_PHONE_DISPLAY, WHATSAPP_DISPLAY };
