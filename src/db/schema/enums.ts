import { pgEnum } from "drizzle-orm/pg-core";

import { FAQ_CATEGORY_VALUES } from "../../lib/faq-categories";

/** Every editable content type shares this draft → published lifecycle. */
export const contentStatus = pgEnum("content_status", ["draft", "published"]);

/** Contact inbox lifecycle — an admin marks a message handled once acted on. */
export const contactStatus = pgEnum("contact_status", ["new", "handled"]);

/** FAQ groups — see `lib/faq-categories.ts` for what each one does on the site. */
export const faqCategory = pgEnum("faq_category", FAQ_CATEGORY_VALUES);

/** How the person asked to be reached back. */
export const preferredContact = pgEnum("preferred_contact", ["phone", "email"]);
