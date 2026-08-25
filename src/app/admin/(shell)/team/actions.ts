"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { teamMembers } from "@/db/schema";
import { actionError, type ActionResult, type DataResult } from "@/lib/action-result";
import { requireAdmin } from "@/lib/auth-guard";
import { sanitizeRichText } from "@/lib/sanitize";
import { emptyToNull, teamMemberSchema, type TeamMemberInput } from "@/lib/validations/content";

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
      role: emptyToNull(parsed.data.role),
      qualifications: emptyToNull(parsed.data.qualifications),
      shortBio: emptyToNull(parsed.data.shortBio),
      longBio: parsed.data.longBio ? sanitizeRichText(parsed.data.longBio) : null,
      photoId: parsed.data.photoId,
      sortOrder: parsed.data.sortOrder,
      updatedAt: new Date(),
    };

    if (id) {
      // Saving never changes status — publishing is a separate, explicit action.
      await db.update(teamMembers).set(values).where(eq(teamMembers.id, id));
      revalidatePath("/admin/team");
      revalidatePath(`/admin/team/${id}`);
      return { ok: true, data: { id } };
    }

    const [row] = await db.insert(teamMembers).values(values).returning({ id: teamMembers.id });
    revalidatePath("/admin/team");
    return { ok: true, data: { id: row.id } };
  } catch (error) {
    return actionError(error, "Nie udało się zapisać osoby.");
  }
}

export async function publishTeamMember(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await db
      .update(teamMembers)
      .set({ status: "published", publishedAt: new Date(), updatedAt: new Date() })
      .where(eq(teamMembers.id, id));
    revalidatePath("/admin/team");
    revalidatePath(`/admin/team/${id}`);
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się opublikować.");
  }
}

export async function unpublishTeamMember(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await db
      .update(teamMembers)
      .set({ status: "draft", updatedAt: new Date() })
      .where(eq(teamMembers.id, id));
    revalidatePath("/admin/team");
    revalidatePath(`/admin/team/${id}`);
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się cofnąć publikacji.");
  }
}

export async function deleteTeamMember(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
    revalidatePath("/admin/team");
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się usunąć osoby.");
  }
}
