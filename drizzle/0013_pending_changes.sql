ALTER TABLE "articles" ADD COLUMN "pending_changes" jsonb;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "pending_updated_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "pending_changes" jsonb;--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "pending_updated_at" timestamp with time zone;