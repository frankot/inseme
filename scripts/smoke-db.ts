/**
 * Schema smoke test: applies the committed migrations to an in-process Postgres
 * (PGlite, no server needed) and exercises the behaviour the admin actions rely
 * on — defaults, unique constraints, the publish transition and ON DELETE SET NULL.
 *
 *   npm run db:smoke
 */
import assert from "node:assert/strict";

import { PGlite } from "@electric-sql/pglite";
import { and, eq, ne } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";

import * as schema from "../src/db/schema";
import { sanitizeRichText } from "../src/lib/sanitize";

async function main() {
  const client = new PGlite();
  const db = drizzle(client, { schema });

  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("✓ migrations applied");

  // Media + FK behaviour --------------------------------------------------
  const [image] = await db
    .insert(schema.media)
    .values({
      r2Key: "media/2026/test.jpg",
      url: "https://media.insieme.pl/media/2026/test.jpg",
      mimeType: "image/jpeg",
      size: 12345,
      width: 1200,
      height: 800,
    })
    .returning();
  assert.ok(image.id, "media row gets a uuid");

  // Pages: defaults, blocks round-trip, unique slug ------------------------
  const [page] = await db
    .insert(schema.pages)
    .values({
      title: "Cennik",
      slug: "cennik",
      ogImageId: image.id,
      sections: [
        { id: "b1", type: "richtext", html: "<p>Treść</p>" },
        {
          id: "b2",
          type: "step_list",
          heading: "Pierwszy kontakt",
          steps: [{ id: "s1", title: "Telefon", description: "Dzwonisz." }],
        },
      ],
    })
    .returning();

  assert.equal(page.status, "draft", "new pages default to draft");
  assert.equal(page.pageType, "standard", "page type defaults to standard");
  assert.equal(page.publishedAt, null, "a draft has no publish date");
  assert.equal(page.sections.length, 2, "blocks round-trip through json");
  assert.equal(page.sections[1].type, "step_list");
  console.log("✓ page defaults + block json round-trip");

  // Drizzle wraps driver errors, so the constraint message is on the cause.
  const duplicate = await db
    .insert(schema.pages)
    .values({ title: "Duplikat", slug: "cennik" })
    .then(() => null)
    .catch((error: unknown) => error);
  assert.ok(duplicate, "inserting a duplicate slug must fail");
  assert.match(
    String((duplicate as { cause?: unknown }).cause ?? duplicate),
    /duplicate key|unique/i,
    "slug uniqueness is enforced by the database",
  );
  console.log("✓ duplicate slug rejected");

  // Publish transition ----------------------------------------------------
  await db
    .update(schema.pages)
    .set({ status: "published", publishedAt: new Date() })
    .where(eq(schema.pages.id, page.id));
  const published = await db.query.pages.findFirst({ where: eq(schema.pages.id, page.id) });
  assert.equal(published?.status, "published");
  assert.ok(published?.publishedAt instanceof Date, "publishedAt is stamped");
  console.log("✓ publish transition");

  // Deleting media must blank references, not fail or cascade -------------
  await db.delete(schema.media).where(eq(schema.media.id, image.id));
  const afterDelete = await db.query.pages.findFirst({ where: eq(schema.pages.id, page.id) });
  assert.ok(afterDelete, "page survives deletion of its image");
  assert.equal(afterDelete?.ogImageId, null, "og image reference is nulled");
  console.log("✓ media delete nulls references (ON DELETE SET NULL)");

  // Settings singleton upsert ---------------------------------------------
  const values = { phone: "+48 100 200 300", socialLinks: { facebook: "https://fb.com/insieme" } };
  await db.insert(schema.settings).values({ id: schema.SETTINGS_ID, ...values });
  await db
    .insert(schema.settings)
    .values({ id: schema.SETTINGS_ID, phone: "+48 999 888 777", socialLinks: {} })
    .onConflictDoUpdate({
      target: schema.settings.id,
      set: { phone: "+48 999 888 777" },
    });
  const allSettings = await db.select().from(schema.settings);
  assert.equal(allSettings.length, 1, "settings stays a single row");
  assert.equal(allSettings[0].phone, "+48 999 888 777", "upsert overwrites");
  assert.deepEqual(allSettings[0].socialLinks, { facebook: "https://fb.com/insieme" });
  console.log("✓ settings singleton upsert");

  // Team / FAQ ordering ----------------------------------------------------
  await db.insert(schema.teamMembers).values([
    { name: "Anna", sortOrder: 2 },
    { name: "Bartosz", sortOrder: 1 },
  ]);
  const team = await db.query.teamMembers.findMany({
    orderBy: (members, { asc }) => [asc(members.sortOrder)],
  });
  assert.deepEqual(
    team.map((member) => member.name),
    ["Bartosz", "Anna"],
    "sortOrder drives list order",
  );
  assert.equal(team[0].status, "draft", "team members start as drafts");
  console.log("✓ team ordering + draft default");

  // Slug-clash query used by savePage/saveArticle ------------------------
  // The dangerous case is editing a record without changing its slug: the
  // check must ignore the record's own row, or every save reports a conflict.
  const selfClash = await db.query.pages.findFirst({
    columns: { id: true },
    where: and(eq(schema.pages.slug, "cennik"), ne(schema.pages.id, page.id)),
  });
  assert.equal(selfClash, undefined, "a page keeping its own slug is not a clash");

  const [other] = await db
    .insert(schema.pages)
    .values({ title: "Kontakt", slug: "kontakt" })
    .returning();
  const realClash = await db.query.pages.findFirst({
    columns: { id: true },
    where: and(eq(schema.pages.slug, "kontakt"), ne(schema.pages.id, page.id)),
  });
  assert.equal(realClash?.id, other.id, "another page's slug is a clash");
  console.log("✓ slug-clash check ignores the record itself");

  // Publish gate for articles ---------------------------------------------
  const [article] = await db
    .insert(schema.articles)
    .values({ title: "Bez recenzenta", slug: "bez-recenzenta", body: [] })
    .returning();
  assert.equal(article.authorReviewer, null, "articles can be drafted without a reviewer");
  assert.equal(article.status, "draft");
  console.log("✓ article draft without reviewer (publish is blocked in the action)");

  // Rich-text sanitisation -------------------------------------------------
  const dirty = '<p onclick="steal()">Tekst <script>alert(1)</script><a href="javascript:x">link</a></p>';
  const clean = sanitizeRichText(dirty);
  assert.ok(!clean.includes("script"), "script tags are stripped");
  assert.ok(!clean.includes("onclick"), "event handlers are stripped");
  assert.ok(!clean.includes("javascript:"), "javascript: URLs are stripped");
  assert.ok(clean.includes("Tekst"), "text content survives");

  const link = sanitizeRichText('<p><a href="https://insieme.pl">Ośrodek</a></p>');
  assert.ok(link.includes('href="https://insieme.pl"'), "https links survive");
  assert.ok(link.includes('rel="noopener noreferrer"'), "rel is added to links");
  assert.ok(sanitizeRichText('<p><a href="tel:+48123">Zadzwoń</a></p>').includes("tel:+48123"));
  console.log("✓ rich-text sanitisation");

  await client.close();
  console.log("\nAll schema smoke checks passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
