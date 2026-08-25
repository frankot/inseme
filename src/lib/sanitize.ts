import sanitizeHtml from "sanitize-html";

/**
 * Editor output is stored as HTML and will be injected into the public site with
 * dangerouslySetInnerHTML, so it is sanitised on write — an admin account is
 * trusted, but a stored-XSS foothold shouldn't be one editor mistake away.
 */
export function sanitizeRichText(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "strong", "em", "u", "s", "h2", "h3", "h4",
      "ul", "ol", "li", "blockquote", "a", "code", "hr",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
    },
  });
}
