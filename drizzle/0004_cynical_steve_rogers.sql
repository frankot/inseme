CREATE TABLE "gallery_photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"alt_text" text,
	"description" text,
	"full_key" text NOT NULL,
	"full_url" text NOT NULL,
	"full_width" integer NOT NULL,
	"full_height" integer NOT NULL,
	"full_size" integer NOT NULL,
	"thumb_key" text NOT NULL,
	"thumb_url" text NOT NULL,
	"thumb_width" integer NOT NULL,
	"thumb_height" integer NOT NULL,
	"thumb_size" integer NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "gallery_photos_full_key_unique" UNIQUE("full_key"),
	CONSTRAINT "gallery_photos_thumb_key_unique" UNIQUE("thumb_key")
);
--> statement-breakpoint
CREATE INDEX "gallery_photos_public_idx" ON "gallery_photos" USING btree ("status","sort_order","created_at");