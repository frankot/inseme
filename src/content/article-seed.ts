/**
 * The shape of an article written in code and seeded into the panel
 * (`npm run seed:article:<name>`, `scripts/seed-client-article.ts`). Each
 * section becomes one block: text → richtext, steps → step_list, cards →
 * card_list, cta → cta, faq → faq_embed (published questions of one category).
 */
export type ArticleSeed = {
  slug: string;
  title: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  /** Listed under the article; omitted means none. */
  sources?: { title: string; url: string }[];
  sections: (
    | { kind: "text"; html: string }
    | { kind: "steps"; heading: string; steps: { title: string; description: string }[] }
    | { kind: "cards"; heading: string; cards: { title: string; description: string }[] }
    | { kind: "cta"; heading: string; text: string; buttonLabel: string; buttonHref: string }
    | { kind: "faq"; heading: string; category: string }
  )[];
};
