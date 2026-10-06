/**
 * Writes each CMS page's seed — its current copy from `src/content/*` — to
 * `cms_pages.published` (plans/CMS_PLAN.md §6.2).
 *
 *   npm run seed:cms                   # pages with no row yet
 *   npm run seed:cms -- --force landing # reset one page (drops its draft too)
 *
 * Never overwrites an existing page unless forced. For the homepage it also
 * carries today's automatic picks into the doc, so the CMS starts from what the
 * site already shows: the first six published questions and the top four
 * people by order, the featured test. The article pick stays empty (= newest).
 */
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

async function main() {
  // Imported after dotenv: `src/lib/env.ts` validates at module load.
  const { asc, eq } = await import("drizzle-orm");
  const { db } = await import("../src/db");
  const { cmsPages, faqItems, screeningTests, teamMembers } = await import("../src/db/schema");
  const { cmsPageList } = await import("../src/cms/registry");
  const { FEATURED_TEST_SLUG } = await import("../src/content/screening");

  const args = process.argv.slice(2);
  const forceIndex = args.indexOf("--force");
  const force = forceIndex >= 0 ? args[forceIndex + 1] : null;
  if (forceIndex >= 0 && !cmsPageList.some((page) => page.key === force)) {
    throw new Error(`--force needs a page key: ${cmsPageList.map((p) => p.key).join(", ")}`);
  }

  for (const page of cmsPageList) {
    const existing = await db.query.cmsPages.findFirst({
      columns: { key: true },
      where: eq(cmsPages.key, page.key),
    });
    if (existing && force !== page.key) {
      console.log(`· ${page.key} — już jest, pomijam (--force ${page.key}, aby nadpisać)`);
      continue;
    }

    const doc = page.seed();

    if (page.key === "landing") {
      const faq = await db
        .select({ id: faqItems.id })
        .from(faqItems)
        .where(eq(faqItems.status, "published"))
        .orderBy(asc(faqItems.sortOrder), asc(faqItems.createdAt))
        .limit(6);
      const team = await db
        .select({ id: teamMembers.id })
        .from(teamMembers)
        .where(eq(teamMembers.status, "published"))
        .orderBy(asc(teamMembers.sortOrder), asc(teamMembers.name))
        .limit(4);
      const test = await db.query.screeningTests.findFirst({
        columns: { id: true },
        where: eq(screeningTests.slug, FEATURED_TEST_SLUG),
      });
      const set = (id: string, patch: Record<string, unknown>) => {
        doc.sections[id].data = { ...(doc.sections[id].data as object), ...patch };
      };
      set("faq", { faqIds: faq.map((row) => row.id).slice(0, 6) });
      set("zespol", { teamIds: team.map((row) => row.id) });
      set("test", { testId: test?.id ?? null });
    }

    const values = {
      key: page.key,
      published: doc,
      draft: null,
      draftVersion: 0,
      publishedAt: new Date(),
      publishedBy: null,
    };
    await db
      .insert(cmsPages)
      .values(values)
      .onConflictDoUpdate({ target: cmsPages.key, set: values });
    console.log(`✓ ${page.key} — ${page.route}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
