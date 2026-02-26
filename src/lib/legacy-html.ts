export interface LegacyDocumentParts {
  lang: string;
  headHtml: string;
  bodyClass: string;
  bodyHtml: string;
}

function extractMatch(input: string, regex: RegExp, label: string): string {
  const match = input.match(regex);
  if (!match || !match[1]) {
    throw new Error(`Unable to extract ${label} from legacy HTML`);
  }

  return match[1];
}

export function parseLegacyHtmlDocument(html: string): LegacyDocumentParts {
  const langMatch = html.match(/<html[^>]*\slang=["']([^"']+)["'][^>]*>/i);
  const lang = langMatch?.[1] ?? "en";

  const headHtml = extractMatch(html, /<head[^>]*>([\s\S]*?)<\/head>/i, "head");
  const bodyOpenTag = html.match(/<body([^>]*)>/i);
  const bodyHtml = extractMatch(html, /<body[^>]*>([\s\S]*?)<\/body>/i, "body");

  const bodyAttributes = bodyOpenTag?.[1] ?? "";
  const bodyClassMatch = bodyAttributes.match(/\sclass=["']([^"']+)["']/i);
  const bodyClass = bodyClassMatch?.[1] ?? "";

  return {
    lang,
    headHtml,
    bodyClass,
    bodyHtml,
  };
}
