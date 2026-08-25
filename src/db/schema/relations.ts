import { relations } from "drizzle-orm";

import { articles } from "./articles";
import { media } from "./media";
import { pages } from "./pages";
import { settings } from "./settings";
import { teamMembers } from "./team-members";

export const pagesRelations = relations(pages, ({ one }) => ({
  ogImage: one(media, { fields: [pages.ogImageId], references: [media.id] }),
}));

export const articlesRelations = relations(articles, ({ one }) => ({
  coverImage: one(media, { fields: [articles.coverImageId], references: [media.id] }),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  photo: one(media, { fields: [teamMembers.photoId], references: [media.id] }),
}));

export const settingsRelations = relations(settings, ({ one }) => ({
  defaultOgImage: one(media, { fields: [settings.defaultOgImageId], references: [media.id] }),
}));
