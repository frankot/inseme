import type { ProgramPoint, StageBand } from "@/content/program";

/**
 * The shape every intent page shares (`/leczenie-alkoholizmu`, `/dla-rodziny`,
 * `/detoks-i-kwalifikacja`). Each page answers one search intent.
 *
 * One template, but not one component repeated: every slot has its own form,
 * borrowed from the homepage, so the page reads like the rest of the site
 * rather than a list of lists.
 *
 *   intro      title and lead beside a photograph, the short answer under them
 *   explain    01 · the stage band from /program, pinned heading, numbered list
 *   steps      02 · the homepage's step rows (big clay numerals)
 *   statement  03 · the dark band: one sentence set large, then the detail
 *   cards      04 · a grid of cards
 *   feature    05 · a photograph beside the text, with figures or points
 *   faq        06 · the homepage FAQ: sticky heading, accordion (DB category)
 *   related    links onward and the phone number
 *
 * These objects are the CMS seed for the pages (plans/CMS_PLAN.md §11.1): the
 * pages are `fixed`, so code owns the slots and their order and an editor
 * changes the copy. Section `id`s are anchors and future CMS section ids, so
 * keep them stable.
 *
 * Writing rules (art. 14 — informing, not advertising): no claims about
 * effectiveness, success rates or treatment time beyond the programme's own
 * length; no "najlepszy", "skuteczny", "gwarantujemy".
 */

export type IntentImage = { src: string; alt: string; caption?: string };
export type IntentLinkTarget = { label: string; href: string };

export type IntentIntro = {
  title: string;
  /** First paragraph set large, the rest as body. */
  lead: string[];
  /**
   * The direct answer, under the lead: what AI overviews and a hurried reader
   * both take from the page. Three or four lines, each one complete.
   */
  summaryTitle: string;
  summary: string[];
  image: IntentImage;
};

export type IntentSteps = {
  id: string;
  label: string;
  title: string;
  lead: string[];
  steps: { title: string; body: string }[];
  /** A line after the steps, before the link. */
  note?: string;
  link?: IntentLinkTarget;
};

export type IntentStatement = {
  id: string;
  label: string;
  /** The sentence the band exists for, set at quote size. */
  statement: string;
  body: string[];
  /** Titled points read as columns; untitled ones as a dashed list. */
  points: ProgramPoint[];
  /** Closing line under a rule — a warning, a number to call. */
  closing?: string;
};

export type IntentCards = {
  id: string;
  label: string;
  title: string;
  lead: string;
  /** Number the cards — for a sequence (a procedure), not a set. */
  numbered?: boolean;
  cards: { title: string; body: string }[];
  note?: string;
  link?: IntentLinkTarget;
};

export type IntentFeature = {
  id: string;
  label: string;
  title: string;
  body: string[];
  image: IntentImage;
  /** Figures in the homepage's stat style ("28 dni" / "minimum…"). */
  facts?: { value: string; label: string }[];
  points?: ProgramPoint[];
  note?: string;
  link?: IntentLinkTarget;
};

export type IntentLink = { title: string; body: string; href: string };

export type IntentPageContent = {
  /** Public route, also the canonical URL. */
  path: string;
  metaTitle: string;
  metaDescription: string;
  breadcrumbHome: string;
  breadcrumbLabel: string;
  intro: IntentIntro;
  explain: StageBand;
  steps: IntentSteps;
  statement: IntentStatement;
  cards: IntentCards;
  feature: IntentFeature;
  /** Rendered only when the category has published questions. */
  faq: { label: string; title: string; lead: string; category: string };
  related: { label: string; title: string; linkLabel: string; links: IntentLink[] };
  call: { title: string; body: string; ctaLabel: string };
};
