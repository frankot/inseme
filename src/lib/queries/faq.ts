import "server-only";

import { and, asc, eq } from "drizzle-orm";

import { db } from "@/db";
import { faqItems } from "@/db/schema";

/**
 * Read side of `faq_items` for the public site. The admin panel queries the
 * table directly because it needs drafts; everything here is published-only and
 * ordered the way /admin/faq promises — by the "Kolejność" field, then age.
 */

/** Answers are sanitised rich text (`sanitizeRichText`), not plain strings. */
export type FaqEntry = { id: string; question: string; answer: string };

/**
 * Published questions, optionally narrowed to one category — the field exists
 * so a group of questions can be embedded on a subpage without dragging the
 * whole FAQ along. No category means every published row.
 */
export async function getPublishedFaq(category?: string): Promise<FaqEntry[]> {
  const published = eq(faqItems.status, "published");
  return db
    .select({
      id: faqItems.id,
      question: faqItems.question,
      answer: faqItems.answer,
    })
    .from(faqItems)
    .where(category ? and(published, eq(faqItems.category, category)) : published)
    .orderBy(asc(faqItems.sortOrder), asc(faqItems.createdAt));
}
