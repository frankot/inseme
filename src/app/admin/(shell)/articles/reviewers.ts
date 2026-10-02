import "server-only";

import { asc } from "drizzle-orm";

import type { ReviewerOption } from "@/app/admin/(shell)/articles/article-form";
import { db } from "@/db";
import { teamMembers } from "@/db/schema";

/** Everyone in Zespół, in the order /admin/team shows them. */
export async function getReviewerOptions(): Promise<ReviewerOption[]> {
  const rows = await db
    .select({
      id: teamMembers.id,
      name: teamMembers.name,
      role: teamMembers.role,
      status: teamMembers.status,
    })
    .from(teamMembers)
    .orderBy(asc(teamMembers.sortOrder), asc(teamMembers.name));
  return rows.map(({ status, ...row }) => ({ ...row, published: status === "published" }));
}
