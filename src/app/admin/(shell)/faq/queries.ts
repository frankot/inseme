import { isNotNull } from "drizzle-orm";

import { db } from "@/db";
import { faqItems } from "@/db/schema";

/** Existing categories, offered as autocomplete so editors don't invent variants. */
export async function getFaqCategories(): Promise<string[]> {
  const rows = await db
    .selectDistinct({ category: faqItems.category })
    .from(faqItems)
    .where(isNotNull(faqItems.category));
  return rows.map((row) => row.category).filter((value): value is string => Boolean(value)).sort();
}
