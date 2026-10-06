import "server-only";

import { inArray } from "drizzle-orm";

import { normalizeDoc, slotKey } from "@/cms/define";
import { getPageDef, slotsForKind } from "@/cms/registry";
import type { RefKind } from "@/cms/types";
import { db } from "@/db";
import { articles, cmsPages, faqItems, screeningTests, teamMembers } from "@/db/schema";

const ENTITY_TABLES = {
  faq: faqItems,
  team: teamMembers,
  test: screeningTests,
  article: articles,
} as const;

/**
 * The subset of `ids` whose rows still exist. A CMS doc keeps ids as plain
 * strings, so deleting a record leaves its id behind in every slot it was
 * featured in — and a dangling id would still count toward the slot's limit.
 */
export async function existingIds(kind: RefKind, ids: string[]): Promise<Set<string>> {
  if (ids.length === 0) return new Set();
  const table = ENTITY_TABLES[kind];
  const rows = await db.select({ id: table.id }).from(table).where(inArray(table.id, ids));
  return new Set(rows.map((row) => row.id));
}

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

  const picked = slots.map((slot) => {
    const def = getPageDef(slot.pageKey)!;
    const doc = normalizeDoc(def, rows.find((row) => row.key === slot.pageKey)?.published);
    const value = (doc.sections[slot.sectionId]?.data as Record<string, unknown> | undefined)?.[
      slot.field
    ];
    const ids = Array.isArray(value) ? value : typeof value === "string" ? [value] : [];
    return ids.filter((v): v is string => typeof v === "string");
  });
  const alive = await existingIds(kind, [...new Set(picked.flat())]);

  return slots.map((slot, i) => ({
    key: slotKey(slot),
    label: `${slot.pageLabel} · ${slot.sectionLabel}`,
    max: slot.spec.multiple ? slot.spec.max : 1,
    ids: new Set(picked[i].filter((id) => alive.has(id))),
  }));
}
