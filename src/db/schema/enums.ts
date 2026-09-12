import { pgEnum } from "drizzle-orm/pg-core";

/** Every editable content type shares this draft → published lifecycle. */
export const contentStatus = pgEnum("content_status", ["draft", "published"]);

/**
 * Service pages (Leczenie alkoholizmu, Detoks…) share the Pages shape, so they
 * live in the same table behind a discriminator rather than a duplicate schema.
 */
export const pageType = pgEnum("page_type", ["standard", "service"]);

/** Contact inbox lifecycle — an admin marks a message handled once acted on. */
export const contactStatus = pgEnum("contact_status", ["new", "handled"]);

/** How the person asked to be reached back. */
export const preferredContact = pgEnum("preferred_contact", ["phone", "email"]);
