CREATE TYPE "public"."contact_status" AS ENUM('new', 'handled');--> statement-breakpoint
CREATE TYPE "public"."preferred_contact" AS ENUM('phone', 'email');--> statement-breakpoint
CREATE TABLE "contact_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"phone" text,
	"email" text,
	"message" text NOT NULL,
	"preferred_contact_method" "preferred_contact" DEFAULT 'phone' NOT NULL,
	"consent_at" timestamp with time zone DEFAULT now() NOT NULL,
	"status" "contact_status" DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "lead_signups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"source" text,
	"consent_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "screening_test_answer_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" uuid NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"label" text NOT NULL,
	"points" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "screening_test_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"test_id" uuid NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"text" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "screening_test_result_bands" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"test_id" uuid NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"min_score" integer DEFAULT 0 NOT NULL,
	"max_score" integer DEFAULT 0 NOT NULL,
	"result_title" text NOT NULL,
	"result_body" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "screening_test_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"test_id" uuid,
	"email" text NOT NULL,
	"consent_at" timestamp with time zone DEFAULT now() NOT NULL,
	"total_score" integer NOT NULL,
	"max_score" integer NOT NULL,
	"result_band_id" uuid,
	"emailed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "screening_tests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"intro_text" text,
	"disclaimer_text" text,
	"meta_title" text,
	"meta_description" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "screening_tests_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "screening_test_answer_options" ADD CONSTRAINT "screening_test_answer_options_question_id_screening_test_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."screening_test_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "screening_test_questions" ADD CONSTRAINT "screening_test_questions_test_id_screening_tests_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."screening_tests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "screening_test_result_bands" ADD CONSTRAINT "screening_test_result_bands_test_id_screening_tests_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."screening_tests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "screening_test_submissions" ADD CONSTRAINT "screening_test_submissions_test_id_screening_tests_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."screening_tests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "screening_test_submissions" ADD CONSTRAINT "screening_test_submissions_result_band_id_screening_test_result_bands_id_fk" FOREIGN KEY ("result_band_id") REFERENCES "public"."screening_test_result_bands"("id") ON DELETE set null ON UPDATE no action;