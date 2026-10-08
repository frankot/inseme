import "server-only";

import { readFileSync } from "node:fs";
import path from "node:path";

import { Marked } from "marked";
import sanitizeHtml from "sanitize-html";

/**
 * The admin manual: `src/content/admin-manual.md`, written for the client in
 * plain Polish, rendered at /admin/instrukcja. Edit the Markdown file to change
 * it — this only turns it into HTML.
 *
 * Headings get GitHub-style ids ("SEO — jak pisać pod Google" →
 * `seo--jak-pisać-pod-google`), so links inside the manual can be written the
 * way any Markdown editor previews them. The level-2 and level-3 headings make
 * the table of contents.
 *
 * Read from disk on each request (the admin is dynamic). `next.config.ts`
 * lists the file in `outputFileTracingIncludes` so it ships with the function.
 */
const MANUAL_PATH = path.join(process.cwd(), "src/content/admin-manual.md");

export type ManualHeading = { id: string; text: string; depth: 2 | 3 };

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s/g, "-");
}

export function loadAdminManual(): { title: string; html: string; toc: ManualHeading[] } {
  const source = readFileSync(MANUAL_PATH, "utf8");
  const toc: ManualHeading[] = [];
  const used = new Map<string, number>();
  let title = "Instrukcja";

  const marked = new Marked({
    renderer: {
      heading({ tokens, depth, text }) {
        const inner = this.parser.parseInline(tokens);
        const plain = text.replace(/[*_`]/g, "");
        if (depth === 1) {
          title = plain;
          return ""; // The page header shows it.
        }
        const base = slugify(plain);
        const seen = used.get(base) ?? 0;
        used.set(base, seen + 1);
        const id = seen ? `${base}-${seen}` : base;
        if (depth === 2 || depth === 3) toc.push({ id, text: plain, depth });
        return `<h${depth} id="${id}">${inner}</h${depth}>\n`;
      },
    },
  });

  const raw = marked.parse(source, { async: false });
  const html = sanitizeHtml(raw, {
    allowedTags: [
      "h2", "h3", "h4", "p", "br", "strong", "em", "code", "pre", "blockquote",
      "ul", "ol", "li", "a", "hr", "table", "thead", "tbody", "tr", "th", "td",
    ],
    allowedAttributes: { a: ["href"], h2: ["id"], h3: ["id"], h4: ["id"] },
    // Internal anchors and the occasional link out; nothing else.
    allowedSchemes: ["https", "mailto", "tel"],
    allowProtocolRelative: false,
  });

  return { title, html, toc };
}
