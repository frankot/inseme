CREATE TABLE "phone_click_counts" (
	"day" date NOT NULL,
	"page" text NOT NULL,
	"location" text NOT NULL,
	"landing" text NOT NULL,
	"source" text NOT NULL,
	"device" text NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "phone_click_counts_pk" PRIMARY KEY("day","page","location","landing","source","device")
);
