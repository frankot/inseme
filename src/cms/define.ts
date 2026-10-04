import type { z } from "zod";

import { schemaFor, type GroupSpec, type RefSpec } from "./fields";
import type { PageDoc, RefKind } from "./types";

/**
 * Section and page definitions (plans/CMS_PLAN.md §1.2–1.3). Every page is
 * fixed (D12): the definition lists its sections in order; the editor edits
 * their content and switches them on or off, never adds or reorders.
 */

export type SectionDef = {
  id: string;
  label: string;
  /** The editable fields. Anything not listed stays in code. */
  fields: GroupSpec;
  /** Counts toward the 01…NN numbering when enabled. */
  numbered?: boolean;
  /** False for sections a page cannot do without (an opening, say). */
  canDisable?: boolean;
  /**
   * Shown greyed out in the editor with this note instead of a form — the
   * section exists on the page but is not CMS-editable yet (Opinie).
   */
  locked?: string;
};

export type PageDef = {
  key: string;
  adminSlug: string;
  label: string;
  /** Public route, revalidated on publish. */
  route: string;
  sections: SectionDef[];
  /** The page's copy from `src/content/*` — seed and fallback at once. */
  seed: () => PageDoc;
};

export function defineSection(def: SectionDef): SectionDef {
  return def;
}

export function definePage(def: PageDef): PageDef {
  return def;
}

/* --------------------------------------------------------------- schemas */

const schemaCache = new WeakMap<SectionDef, z.ZodType>();

export function sectionSchema(section: SectionDef): z.ZodType {
  let schema = schemaCache.get(section);
  if (!schema) {
    schema = schemaFor(section.fields);
    schemaCache.set(section, schema);
  }
  return schema;
}

/**
 * Hard caps on SEO fields. The editor's counters show the lengths Google
 * actually displays (`recommended`) — going over those is allowed, the snippet
 * is just cut.
 */
export const seoLimits = {
  title: 120,
  description: 300,
  recommended: { title: 60, description: 160 },
} as const;

/** Readable error lines for one section, e.g. "Kroki › 2 › Tytuł: To pole jest wymagane." */
export function sectionErrors(section: SectionDef, data: unknown): string[] {
  if (section.locked) return [];
  const result = sectionSchema(section).safeParse(data);
  if (result.success) return [];
  return result.error.issues.map((issue) => `${labelPath(section.fields, issue.path)}${issue.message}`);
}

function labelPath(spec: GroupSpec, path: PropertyKey[]): string {
  const labels: string[] = [];
  let current: unknown = spec;
  for (const key of path) {
    const node = current as { kind?: string; fields?: Record<string, unknown>; item?: unknown; label?: string };
    if (node?.kind === "group" && typeof key === "string" && node.fields?.[key]) {
      current = node.fields[key];
      labels.push((current as { label: string }).label);
    } else if (node?.kind === "list" && typeof key === "number") {
      current = node.item;
      labels.push(String(key + 1));
    } else {
      break;
    }
  }
  return labels.length ? `${labels.join(" › ")}: ` : "";
}

export function seoErrors(seo: PageDoc["seo"] | undefined): string[] {
  const errors: string[] = [];
  if ((seo?.title ?? "").length > seoLimits.title) errors.push(`Tytuł SEO: maksymalnie ${seoLimits.title} znaków.`);
  if ((seo?.description ?? "").length > seoLimits.description) {
    errors.push(`Opis SEO: maksymalnie ${seoLimits.description} znaków.`);
  }
  return errors;
}

/** Errors per section id (plus "seo"), counting only enabled sections. */
export function docErrors(page: PageDef, doc: PageDoc): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  const seo = seoErrors(doc.seo);
  if (seo.length) out.seo = seo;
  for (const section of page.sections) {
    const stored = doc.sections[section.id];
    if (!stored?.enabled) continue;
    const errors = sectionErrors(section, stored.data);
    if (errors.length) out[section.id] = errors;
  }
  return out;
}

/**
 * Every section present, in definition order: a section added to the code
 * after a page was saved takes its seed, and unknown keys are dropped.
 */
export function normalizeDoc(page: PageDef, doc: PageDoc | null | undefined): PageDoc {
  const seed = page.seed();
  if (!doc || typeof doc !== "object" || !doc.sections) return seed;
  const sections: PageDoc["sections"] = {};
  for (const section of page.sections) {
    const stored = doc.sections[section.id];
    sections[section.id] =
      stored && typeof stored === "object" && "data" in stored
        ? { enabled: section.canDisable === false ? true : Boolean(stored.enabled), data: stored.data }
        : seed.sections[section.id];
  }
  return {
    schemaVersion: 1,
    seo: {
      title: typeof doc.seo?.title === "string" ? doc.seo.title : seed.seo.title,
      description: typeof doc.seo?.description === "string" ? doc.seo.description : seed.seo.description,
    },
    sections,
  };
}

/* ------------------------------------------------------------- ref slots */

/**
 * A place an entity can be featured — a `ref` field in some section. The CMS
 * picker and the entity's own admin list both write the same slot (D6).
 */
export type RefSlot = {
  pageKey: string;
  pageLabel: string;
  sectionId: string;
  sectionLabel: string;
  /** The ref field's key at the section root. */
  field: string;
  spec: RefSpec;
};

export function slotsOf(page: PageDef): RefSlot[] {
  return page.sections.flatMap((section) =>
    Object.entries(section.fields.fields)
      .filter(([, spec]) => spec.kind === "ref")
      .map(([field, spec]) => ({
        pageKey: page.key,
        pageLabel: page.label,
        sectionId: section.id,
        sectionLabel: section.label,
        field,
        spec: spec as RefSpec,
      })),
  );
}

export function slotKey(slot: Pick<RefSlot, "pageKey" | "sectionId" | "field">): string {
  return `${slot.pageKey}/${slot.sectionId}/${slot.field}`;
}

export type { RefKind };
