-- Adds the public URL segment for /zespol/<slug>.
--
-- Hand-edited from drizzle-kit's output: it emitted a bare
-- `ADD COLUMN "slug" text NOT NULL`, which fails on any table that already has
-- rows. Instead the column arrives nullable, is backfilled from `name`, and is
-- only then tightened. On an empty table every UPDATE below is a no-op.
ALTER TABLE "team_members" ADD COLUMN "slug" text;--> statement-breakpoint
-- Same transliteration as `slugify` in src/lib/slug.ts.
UPDATE "team_members" SET "slug" = trim(both '-' from regexp_replace(
	lower(translate("name", 'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ', 'acelnoszzACELNOSZZ')),
	'[^a-z0-9]+', '-', 'g'));--> statement-breakpoint
-- Two people with the same name would collide on the unique constraint below.
UPDATE "team_members" t SET "slug" = t."slug" || '-' || left(t."id"::text, 4)
	WHERE EXISTS (SELECT 1 FROM "team_members" o
		WHERE o."slug" = t."slug" AND o."id" <> t."id");--> statement-breakpoint
-- A name of nothing but punctuation slugifies to an empty string.
UPDATE "team_members" SET "slug" = 'osoba-' || left("id"::text, 8)
	WHERE "slug" IS NULL OR "slug" = '';--> statement-breakpoint
ALTER TABLE "team_members" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_slug_unique" UNIQUE("slug");
