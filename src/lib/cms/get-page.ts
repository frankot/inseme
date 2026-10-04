import "server-only";

import { eq } from "drizzle-orm";
import { cache } from "react";

import { normalizeDoc, sectionSchema, type PageDef } from "@/cms/define";
import { getPageDef } from "@/cms/registry";
import type { PageDoc } from "@/cms/types";
import { db } from "@/db";
import { cmsPages } from "@/db/schema";

/**
 * Read side of the CMS (plans/CMS_PLAN.md §6.1).
 *
 * Public pages read `published`, check every section against its schema and
 * fall back to the seed — the page's copy in code — section by section; a DB
 * error falls back to the whole seed. Both are logged with `[cms-fallback]`.
 * The preview reads `draft ?? published` without the strict check, so a
 * half-typed field shows as typed.
 */

export type CmsSection<T = Record<string, unknown>> = { enabled: boolean; data: T };

export type CmsPage = {
  def: PageDef;
  seo: PageDoc["seo"];
  sections: Record<string, CmsSection>;
  /** Section wrappers and hidden-section placeholders render only in preview. */
  preview: boolean;
};

export const getCmsPage = cache(async (key: string): Promise<CmsPage> => {
  const def = requireDef(key);
  const seed = def.seed();

  let published: PageDoc | null = null;
  try {
    const row = await db.query.cmsPages.findFirst({
      columns: { published: true },
      where: eq(cmsPages.key, key),
    });
    published = row?.published ?? null;
  } catch (error) {
    console.error(`[cms-fallback] ${key}: DB read failed, rendering seed`, error);
  }

  const doc = normalizeDoc(def, published);
  const sections: CmsPage["sections"] = {};
  for (const section of def.sections) {
    const stored = doc.sections[section.id];
    const parsed = section.locked ? { success: true } : sectionSchema(section).safeParse(stored.data);
    if (parsed.success) {
      sections[section.id] = stored as CmsSection;
    } else {
      console.error(`[cms-fallback] ${key}/${section.id}: stored section invalid, rendering seed`);
      sections[section.id] = { enabled: stored.enabled, data: seed.sections[section.id].data } as CmsSection;
    }
  }

  return { def, seo: doc.seo, sections, preview: false };
});

/** The draft as the editor sees it, for `/admin/preview/[page]`. */
export async function getCmsPreview(key: string): Promise<CmsPage> {
  const def = requireDef(key);
  const seed = def.seed();
  const row = await db.query.cmsPages.findFirst({ where: eq(cmsPages.key, key) });
  const doc = normalizeDoc(def, row?.draft ?? row?.published ?? null);

  const sections: CmsPage["sections"] = {};
  for (const section of def.sections) {
    const stored = doc.sections[section.id];
    sections[section.id] = {
      enabled: stored.enabled,
      // Missing keys take the seed's, so an incomplete draft still renders.
      data: fillFrom(seed.sections[section.id].data, stored.data) as Record<string, unknown>,
    };
  }
  return { def, seo: doc.seo, sections, preview: true };
}

function requireDef(key: string): PageDef {
  const def = getPageDef(key);
  if (!def) throw new Error(`Unknown CMS page "${key}"`);
  return def;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** `value`, with any key it lacks taken from `base` — objects only, arrays as-is. */
function fillFrom(base: unknown, value: unknown): unknown {
  if (!isObject(base) || !isObject(value)) return value ?? base;
  const out: Record<string, unknown> = { ...base };
  for (const [key, v] of Object.entries(value)) out[key] = fillFrom(base[key], v);
  return out;
}

/**
 * 01…NN for the numbered sections that are switched on, in page order — so
 * hiding 02 renumbers the rest instead of leaving a gap.
 */
export function numberSections(page: CmsPage): Record<string, string> {
  const out: Record<string, string> = {};
  let n = 0;
  for (const section of page.def.sections) {
    if (section.numbered && page.sections[section.id]?.enabled) {
      out[section.id] = String(++n).padStart(2, "0");
    }
  }
  return out;
}

/** The ids a ref slot currently holds in the published doc (or the seed). */
export async function getPublishedRefIds(
  pageKey: string,
  sectionId: string,
  field: string,
): Promise<string[]> {
  const page = await getCmsPage(pageKey);
  const value = page.sections[sectionId]?.data?.[field];
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
  return typeof value === "string" ? [value] : [];
}
