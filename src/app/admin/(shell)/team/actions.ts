"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { teamMembers } from "@/db/schema";
import { actionError, type ActionResult, type DataResult } from "@/lib/action-result";
import { requireAdmin } from "@/lib/auth-guard";
import { sanitizeRichText } from "@/lib/sanitize";
import { emptyToNull, teamMemberSchema, type TeamMemberInput } from "@/lib/validations/content";

/**
 * The team is the first content type the public site actually reads, so every
 * mutation has to invalidate the pages that render it — the homepage teaser,
 * the roster, and the person's own page — not just the admin views.
 */
function revalidateTeam(id: string | null, ...slugs: (string | null | undefined)[]) {
  revalidatePath("/admin/team");
  if (id) revalidatePath(`/admin/team/${id}`);
  revalidatePath("/");
  revalidatePath("/zespol");
  for (const slug of new Set(slugs.filter(Boolean))) {
    revalidatePath(`/zespol/${slug}`);
  }
}

/** Postgres unique_violation — here it can only be the slug. */
function isSlugClash(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    ("code" in error ? error.code === "23505" : false)
  );
}

export async function saveTeamMember(
  id: string | null,
  input: TeamMemberInput,
): Promise<DataResult<{ id: string }>> {
  try {
    await requireAdmin();
    const parsed = teamMemberSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Nieprawidłowe dane." };
    }

    const values = {
      name: parsed.data.name,
      slug: parsed.data.slug,
      role: emptyToNull(parsed.data.role),
      qualifications: emptyToNull(parsed.data.qualifications),
      shortBio: emptyToNull(parsed.data.shortBio),
      longBio: parsed.data.longBio ? sanitizeRichText(parsed.data.longBio) : null,
      photoId: parsed.data.photoId,
      sortOrder: parsed.data.sortOrder,
      updatedAt: new Date(),
    };

    if (id) {
      // A renamed slug leaves the old URL behind, so both have to be purged.
      const previous = await db.query.teamMembers.findFirst({
        where: eq(teamMembers.id, id),
        columns: { slug: true },
      });
      // Saving never changes status — publishing is a separate, explicit action.
      await db.update(teamMembers).set(values).where(eq(teamMembers.id, id));
      revalidateTeam(id, values.slug, previous?.slug);
      return { ok: true, data: { id } };
    }

    const [row] = await db.insert(teamMembers).values(values).returning({ id: teamMembers.id });
    revalidateTeam(null, values.slug);
    return { ok: true, data: { id: row.id } };
  } catch (error) {
    if (isSlugClash(error)) {
      return { ok: false, error: "Ten adres (slug) jest już zajęty przez inną osobę." };
    }
    return actionError(error, "Nie udało się zapisać osoby.");
  }
}

export async function publishTeamMember(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const [row] = await db
      .update(teamMembers)
      .set({ status: "published", publishedAt: new Date(), updatedAt: new Date() })
      .where(eq(teamMembers.id, id))
      .returning({ slug: teamMembers.slug });
    revalidateTeam(id, row?.slug);
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się opublikować.");
  }
}

export async function unpublishTeamMember(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const [row] = await db
      .update(teamMembers)
      .set({ status: "draft", updatedAt: new Date() })
      .where(eq(teamMembers.id, id))
      .returning({ slug: teamMembers.slug });
    revalidateTeam(id, row?.slug);
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się cofnąć publikacji.");
  }
}

export async function deleteTeamMember(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const [row] = await db
      .delete(teamMembers)
      .where(eq(teamMembers.id, id))
      .returning({ slug: teamMembers.slug });
    revalidateTeam(null, row?.slug);
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się usunąć osoby.");
  }
}
