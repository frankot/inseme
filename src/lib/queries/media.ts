import "server-only";

import { inArray } from "drizzle-orm";

import { db } from "@/db";
import { media } from "@/db/schema";
import { toMediaSummary } from "@/lib/media-summary";
import type { MediaSummary } from "@/lib/media-types";

/**
 * Media referenced by id from inside a block tree (`image_text`), looked up in
 * one round trip and handed back keyed by id — blocks hold ids, not joins.
 */
export async function getMediaByIds(ids: string[]): Promise<Map<string, MediaSummary>> {
  if (ids.length === 0) return new Map();
  const rows = await db.select().from(media).where(inArray(media.id, ids));
  return new Map(rows.map((row) => [row.id, toMediaSummary(row)]));
}
