/**
 * Seeds one of the client's own articles, written in code, into the panel.
 *
 *   npm run seed:article:przekonac            # src/content/artykul-jak-przekonac.ts
 *   npm run seed:article:pomoc                # src/content/artykul-jak-pomoc.ts
 *   npm run seed:article:pomoc -- --reset     # overwrite edits made in the panel
 *
 * Kept apart from `seed:articles`, which re-upserts every example article: this
 * is the client's own text, and once it is in the panel a re-run must not
 * clobber it. Without --reset an existing row is left alone.
 *
 * Seeded as a draft without a reviewer — pick who checked it in
 * /admin/articles and click „Zapisz i opublikuj”.
 */
import { config as loadEnv } from "dotenv";

import type { ArticleSeed } from "../src/content/article-seed";
import { jakPomocArticleSeed } from "../src/content/artykul-jak-pomoc";
import { jakPrzekonacArticleSeed } from "../src/content/artykul-jak-przekonac";
import type { Block } from "../src/lib/blocks";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

const SEEDS: Record<string, ArticleSeed> = {
  przekonac: jakPrzekonacArticleSeed,
  pomoc: jakPomocArticleSeed,
};

async function main() {
  // Imported after dotenv: `src/lib/env.ts` validates at module load.
  const { db } = await import("../src/db");
  const { articles } = await import("../src/db/schema");
  const { eq } = await import("drizzle-orm");
  const { sanitizeRichText } = await import("../src/lib/sanitize");
  const { createBlock } = await import("../src/lib/blocks");

  const args = process.argv.slice(2);
  const reset = args.includes("--reset");
  const name = args.find((arg) => !arg.startsWith("--"));
  const seed = name ? SEEDS[name] : undefined;
  if (!seed) {
    throw new Error(`Podaj artykuł: ${Object.keys(SEEDS).join(", ")}`);
  }
  const existing = await db.query.articles.findFirst({
    columns: { id: true },
    where: eq(articles.slug, seed.slug),
  });
  if (existing && !reset) {
    console.log(`✓ „${seed.title}” już istnieje — pomijam. Użyj --reset, żeby nadpisać.`);
    return;
  }

  const body: Block[] = seed.sections.map((section) => {
    switch (section.kind) {
      case "text":
        return {
          ...createBlock("richtext"),
          type: "richtext" as const,
          html: sanitizeRichText(section.html.replace(/\n\s*/g, "")),
        };
      case "steps":
        return {
          ...createBlock("step_list"),
          type: "step_list" as const,
          heading: section.heading,
          steps: section.steps.map((step) => ({ id: crypto.randomUUID(), ...step })),
        };
      case "cta":
        return {
          ...createBlock("cta"),
          type: "cta" as const,
          heading: section.heading,
          text: section.text,
          buttonLabel: section.buttonLabel,
          buttonHref: section.buttonHref,
        };
      case "faq":
        return {
          ...createBlock("faq_embed"),
          type: "faq_embed" as const,
          heading: section.heading,
          category: section.category,
        };
    }
  });

  const values = {
    title: seed.title,
    slug: seed.slug,
    excerpt: seed.excerpt,
    metaTitle: seed.metaTitle,
    metaDescription: seed.metaDescription,
    body,
    status: "draft" as const,
    updatedAt: new Date(),
  };

  await db
    .insert(articles)
    .values(values)
    .onConflictDoUpdate({ target: articles.slug, set: values });

  console.log(`✓ ${seed.title} — szkic, /porady/${seed.slug}`);
  console.log("  Wskaż osobę weryfikującą w /admin/articles i kliknij „Zapisz i opublikuj”.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
