CREATE TABLE "cms_pages" (
	"key" text PRIMARY KEY NOT NULL,
	"draft" jsonb,
	"published" jsonb,
	"draft_version" integer DEFAULT 0 NOT NULL,
	"draft_updated_at" timestamp with time zone,
	"draft_updated_by" uuid,
	"published_at" timestamp with time zone,
	"published_by" uuid
);
--> statement-breakpoint
ALTER TABLE "cms_pages" ADD CONSTRAINT "cms_pages_draft_updated_by_admin_users_id_fk" FOREIGN KEY ("draft_updated_by") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cms_pages" ADD CONSTRAINT "cms_pages_published_by_admin_users_id_fk" FOREIGN KEY ("published_by") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;