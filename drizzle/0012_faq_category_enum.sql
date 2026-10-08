CREATE TYPE "public"."faq_category" AS ENUM('ogolne', 'alkohol', 'narkotyki', 'rodzina', 'detoks', 'nfz');--> statement-breakpoint
-- Free-text categories before this: empty or unknown values become the general group.
UPDATE "faq_items" SET "category" = 'ogolne' WHERE "category" IS NULL OR "category" NOT IN ('ogolne', 'alkohol', 'narkotyki', 'rodzina', 'detoks', 'nfz');--> statement-breakpoint
ALTER TABLE "faq_items" ALTER COLUMN "category" SET DATA TYPE "public"."faq_category" USING "category"::"public"."faq_category";--> statement-breakpoint
ALTER TABLE "faq_items" ALTER COLUMN "category" SET DEFAULT 'ogolne'::"public"."faq_category";--> statement-breakpoint
ALTER TABLE "faq_items" ALTER COLUMN "category" SET NOT NULL;
