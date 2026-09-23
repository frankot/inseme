import type { Block } from "@/lib/blocks";

/**
 * A taste of an article for the homepage: its opening paragraphs, and a short
 * outline of what the rest covers. Read out of the block body rather than
 * written separately, so an editor publishing a text never has a second thing
 * to keep in step with it.
 *
 * The HTML is already sanitised on write (see `sanitize.ts`), which is what
 * makes plain patterns safe here: no attributes survive on `p`, `h*` or `li`.
 */
export type ArticlePreview = {
  /** Opening paragraphs, as sanitised HTML with their inline markup intact. */
  opening: string[];
  /** Plain-text points — the article's headings, or failing that its steps. */
  points: string[];
};

/** Roughly five lines at the rich-text size, before the text fades out. */
const OPENING_BUDGET = 520;
const OPENING_MAX = 3;
const POINTS_MAX = 5;
const POINT_MAX_CHARS = 110;

const BLOCK_LEVEL_WRAPPERS = /<(ul|ol|blockquote)>[\s\S]*?<\/\1>/g;
const PARAGRAPH = /<p>([\s\S]*?)<\/p>/g;
const HEADING = /<h[23]>([\s\S]*?)<\/h[23]>/g;
const LIST_ITEM = /<li>([\s\S]*?)<\/li>/g;

export function getArticlePreview(blocks: Block[]): ArticlePreview {
  const opening: string[] = [];
  let openingLength = 0;

  const headings: string[] = [];
  const items: string[] = [];

  for (const block of blocks) {
    switch (block.type) {
      case "richtext":
      case "image_text": {
        if (block.type === "image_text" && block.heading) headings.push(block.heading);

        // Paragraphs inside lists and quotes are not the text's opening.
        const prose = block.html.replace(BLOCK_LEVEL_WRAPPERS, "");
        for (const [, inner] of prose.matchAll(PARAGRAPH)) {
          const length = toText(inner).length;
          if (length === 0) continue;
          if (opening.length >= OPENING_MAX || openingLength >= OPENING_BUDGET) break;
          opening.push(inner);
          openingLength += length;
        }

        for (const [, inner] of block.html.matchAll(HEADING)) headings.push(toText(inner));
        for (const [, inner] of block.html.matchAll(LIST_ITEM)) items.push(toText(inner));
        break;
      }
      case "step_list":
        items.push(...block.steps.map((step) => step.title));
        break;
      case "faq_embed":
        if (block.heading) headings.push(block.heading);
        break;
      case "cta":
        break;
    }
  }

  // Three headings make an outline; fewer and the steps or bullets say more.
  const source = headings.length >= 3 ? headings : items.length > 0 ? items : headings;
  const points = source.filter(Boolean).slice(0, POINTS_MAX).map(clip);

  return { opening, points };
}

function toText(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function clip(text: string): string {
  if (text.length <= POINT_MAX_CHARS) return text;
  const cut = text.slice(0, POINT_MAX_CHARS);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,.;:–—-]+$/, "")}…`;
}
