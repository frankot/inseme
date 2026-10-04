import { pgEnum } from "drizzle-orm/pg-core";

/** Every editable content type shares this draft → published lifecycle. */
export const contentStatus = pgEnum("content_status", ["draft", "published"]);

/** Contact inbox lifecycle — an admin marks a message handled once acted on. */
export const contactStatus = pgEnum("contact_status", ["new", "handled"]);

/** How the person asked to be reached back. */
export const preferredContact = pgEnum("preferred_contact", ["phone", "email"]);
