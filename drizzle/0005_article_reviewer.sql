ALTER TABLE "articles" ADD COLUMN "reviewer_id" uuid;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_reviewer_id_team_members_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
-- Backfill: the free-text field was written as "[title] Name, role", so an
-- article whose reviewer contains a team member's exact name is linked to them.
-- The text column is cleared only where the link was made.
UPDATE "articles" AS a
SET "reviewer_id" = t."id", "author_reviewer" = NULL
FROM "team_members" AS t
WHERE a."reviewer_id" IS NULL
  AND a."author_reviewer" IS NOT NULL
  AND position(t."name" in a."author_reviewer") > 0;
