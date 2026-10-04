/**
 * The stored shape of a CMS page (plans/CMS_PLAN.md §2.1).
 *
 * Every page is `fixed` (D12): the page definition in code owns which sections
 * exist and their order, so the doc keys sections by their definition id
 * rather than storing an ordered list.
 */
export type SectionDoc = {
  enabled: boolean;
  /** Validated against the section's schema on publish and on read. */
  data: unknown;
};

export type PageDoc = {
  schemaVersion: 1;
  seo: { title: string; description: string };
  sections: Record<string, SectionDoc>;
};

/** An image field: a static path from the seed, or a media-library pick. */
export type CmsImage = {
  src: string;
  alt: string;
  caption?: string;
  /** Set when picked from the library; `src` is that file's URL. */
  mediaId?: string | null;
};

export type RefKind = "faq" | "team" | "test" | "article";
