import "server-only";

import { inArray } from "drizzle-orm";

import { normalizeDoc, slotKey } from "@/cms/define";
import { getPageDef, slotsForKind } from "@/cms/registry";
import type { RefKind } from "@/cms/types";
import { db } from "@/db";
import { cmsPages } from "@/db/schema";

export type FeaturedSlot = {
  key: string;
  /** "Strona główna · Pytania" */
  label: string;
  max: number;
  ids: Set<string>;
};

/**
 * Every slot an entity kind can be featured in, with the ids each holds in the
 * published doc — what the admin lists show and toggle (D6, §3.1).
 */
export async function getFeaturedSlots(kind: RefKind): Promise<FeaturedSlot[]> {
  const slots = slotsForKind(kind);
  if (slots.length === 0) return [];
  const keys = [...new Set(slots.map((slot) => slot.pageKey))];
  const rows = await db
    .select({ key: cmsPages.key, published: cmsPages.published })
    .from(cmsPages)
    .where(inArray(cmsPages.key, keys));

  return slots.map((slot) => {
    const def = getPageDef(slot.pageKey)!;
    const doc = normalizeDoc(def, rows.find((row) => row.key === slot.pageKey)?.published);
    const value = (doc.sections[slot.sectionId]?.data as Record<string, unknown> | undefined)?.[
      slot.field
    ];
    const ids = Array.isArray(value) ? value : typeof value === "string" ? [value] : [];
    return {
      key: slotKey(slot),
      label: `${slot.pageLabel} · ${slot.sectionLabel}`,
      max: slot.spec.multiple ? slot.spec.max : 1,
      ids: new Set(ids.filter((v): v is string => typeof v === "string")),
    };
  });
}
