/**
 * Seeds the FAQ. Which questions the homepage shows is not set here: that
 * lives in the CMS (Strona główna › Pytania, or the row menu in /admin/faq).
 * `seed:cms` starts it with the first six by order.
 *
 * Questions with a `category` are also embedded on the page that reads that
 * category — `alkohol` on /leczenie-alkoholizmu, `narkotyki` on
 * /leczenie-narkomanii, `rodzina` on /dla-rodziny,
 * `detoks` on /detoks-i-kwalifikacja, `nfz` in the NFZ article. They appear on
 * /faq as well.
 *
 *   npm run seed:faq
 *   npm run seed:faq -- --reset   # delete every existing question first
 *
 * Idempotent: rows are matched on the question text, so re-running updates the
 * answer and ordering in place rather than duplicating the list.
 */
import { config as loadEnv } from "dotenv";

import { FAQ_SEED } from "../src/content/faq-seed";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

/** The seed writes plain prose; the editor stores HTML, so wrap it the same way. */
function paragraph(text: string): string {
  return `<p>${text}</p>`;
}

async function main() {
  // Imported after dotenv: `src/lib/env.ts` validates at module load.
  const { db } = await import("../src/db");
  const { faqItems } = await import("../src/db/schema");
  const { sanitizeRichText } = await import("../src/lib/sanitize");
  const { eq } = await import("drizzle-orm");

  const reset = process.argv.slice(2).includes("--reset");
  if (reset) {
    await db.delete(faqItems);
    console.log("· cleared existing questions");
  }

  const now = new Date();

  for (const [i, item] of FAQ_SEED.entries()) {
    const values = {
      question: item.question,
      answer: sanitizeRichText(paragraph(item.answer)),
      category: item.category ?? "ogolne",
      sortOrder: i * 10,
      status: "published" as const,
      publishedAt: now,
      updatedAt: now,
    };

    // `question` carries no unique index — the editor is free to rename one —
    // so the upsert is a lookup rather than ON CONFLICT.
    const existing = await db.query.faqItems.findFirst({
      where: eq(faqItems.question, item.question),
    });

    if (existing) {
      await db.update(faqItems).set(values).where(eq(faqItems.id, existing.id));
      console.log(`· zaktualizowano: ${item.question}`);
    } else {
      await db.insert(faqItems).values(values);
      console.log(`✓ dodano: ${item.question}`);
    }
  }

  console.log(`\n${FAQ_SEED.length} pytań opublikowanych. Sprawdź /admin/faq, sekcję 07 na stronie głównej i /faq.`);
}


main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
