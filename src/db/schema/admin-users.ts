import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Admin accounts. Single flat role — every row here has full CMS access.
 * Created via `npm run admin:create`; there is no public registration surface.
 */
export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;
