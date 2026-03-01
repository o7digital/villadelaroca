export interface LegacyDocumentParts {
  lang: string;
  headHtml: string;
  bodyClass: string;
  bodyHtml: string;
}

export interface LegacyShellParts extends LegacyDocumentParts {
  contentHtml: string;
  tailHtml: string;
}

function stripWeglotFromHead(headHtml: string): string {
  return headHtml
    .replace(/<link[^>]+href=["'][^"']*plugins\/weglot[^"']*["'][^>]*>\s*/gi, "")
    .replace(/<script[^>]+src=["'][^"']*plugins\/weglot[^"']*["'][^>]*>\s*<\/script>\s*/gi, "")
    .replace(/<script[^>]+id=["']wp-weglot-js-js["'][^>]*>[\s\S]*?<\/script>\s*/gi, "")
    .replace(/<script[^>]+id=["']weglot-data["'][^>]*>[\s\S]*?<\/script>\s*/gi, "")
    .replace(/<style[^>]*>[\s\S]*?weglot-flags[\s\S]*?<\/style>\s*/gi, "")
    .replace(/<style[^>]*>[\s\S]*?country-selector\.weglot[\s\S]*?<\/style>\s*/gi, "");
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

  const headHtml = stripWeglotFromHead(extractMatch(html, /<head[^>]*>([\s\S]*?)<\/head>/i, "head"));
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

export function parseLegacyHtmlForShell(html: string): LegacyShellParts {
  const doc = parseLegacyHtmlDocument(html);
  const headerRegex = /<div class="header transparent">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
  const headerMatch = doc.bodyHtml.match(headerRegex);
  const footerIndex = doc.bodyHtml.indexOf('<div class="footer">');
  const returnTopIndex = doc.bodyHtml.indexOf('<a href="javascript:" id="return-to-top">');

  if (!headerMatch || headerMatch.index === undefined) {
    throw new Error("Unable to extract header block from legacy body");
  }

  if (footerIndex < 0 || returnTopIndex < 0 || footerIndex >= returnTopIndex) {
    throw new Error("Unable to split footer/tail blocks from legacy body");
  }

  const contentStart = headerMatch.index + headerMatch[0].length;
  const contentHtml = doc.bodyHtml.slice(contentStart, footerIndex);
  const tailHtml = doc.bodyHtml.slice(returnTopIndex);

  return {
    ...doc,
    contentHtml,
    tailHtml,
  };
}
