const HOTEL_EMAIL = "sales.reservations@lacasaquecanta.com";
const FACEBOOK_URL = "https://www.facebook.com/VilladelaRoca";
const INSTAGRAM_URL = "https://www.instagram.com/villadelarocazihuatanejo";

export function patchContactPageHtml(rawHtml: string): string {
  return rawHtml
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

export { FACEBOOK_URL, HOTEL_EMAIL, INSTAGRAM_URL };
