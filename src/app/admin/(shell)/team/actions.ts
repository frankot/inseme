"use server";

import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { teamMembers } from "@/db/schema";
import { actionError, type ActionResult, type DataResult } from "@/lib/action-result";
import { requireAdmin } from "@/lib/auth-guard";
import type { SaveMode } from "@/components/admin/save-actions";
import { publishState } from "@/lib/publish-state";
import { teamFormOf } from "@/lib/record-forms";
import { sameValue } from "@/lib/same-value";
import { sanitizeRichText } from "@/lib/sanitize";
import { emptyToNull, teamMemberSchema, type TeamMemberInput } from "@/lib/validations/content";

/**
 * The team is the first content type the public site actually reads, so every
 * mutation has to invalidate the pages that render it — the homepage teaser,
 * the roster, every person's page (each lists the others), and the articles,
 * whose reviewer card shows a member's photo, name and role.
 *
 * `slugs` name a person's own page explicitly as well: an old slug left behind
 * by a rename is no longer one of the route's pages, but its cached copy must
 * still go.
 */
function revalidateTeam(id: string | null, ...slugs: (string | null | undefined)[]) {
  revalidatePath("/admin/team");
  if (id) revalidatePath(`/admin/team/${id}`);
  revalidatePath("/");
  revalidatePath("/zespol");
  revalidatePath("/zespol/[slug]", "page");
  revalidatePath("/porady/[slug]", "page");
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

/** The live columns a valid form writes — sanitised, empty fields as null. */
function teamColumns(data: TeamMemberInput) {
  return {
    name: data.name,
    slug: data.slug,
    role: emptyToNull(data.role),
    qualifications: emptyToNull(data.qualifications),
    licenses: data.licenses.map((license) => ({ name: license.name, number: license.number })),
    shortBio: emptyToNull(data.shortBio),
    longBio: data.longBio ? sanitizeRichText(data.longBio) : null,
    photoId: data.photoId,
    sortOrder: data.sortOrder,
  };
}

const NO_PENDING = { pendingChanges: null, pendingUpdatedAt: null };

/**
 * `publish` and `draft` write the live record (as published / hidden).
 * `pending` is for a published record only: the edits are kept beside it,
 * and the site shows the published version until they are published.
 */
export async function saveTeamMember(
  id: string | null,
  input: TeamMemberInput,
  mode: SaveMode,
): Promise<DataResult<{ id: string }>> {
  try {
    await requireAdmin();
    const parsed = teamMemberSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Nieprawidłowe dane." };
    }
    const columns = teamColumns(parsed.data);

    const previous = id
      ? await db.query.teamMembers.findFirst({ where: eq(teamMembers.id, id) })
      : null;
    if (id && !previous) return { ok: false, error: "Nie znaleziono osoby." };

    if (mode === "pending") {
      if (!id || previous?.status !== "published") {
        return { ok: false, error: "Zmiany bez publikowania można zapisać tylko w opublikowanym wpisie." };
      }
      const clash = await db.query.teamMembers.findFirst({
        columns: { id: true },
        where: and(eq(teamMembers.slug, columns.slug), ne(teamMembers.id, id)),
      });
      if (clash) return { ok: false, error: "Ten adres (slug) jest już zajęty przez inną osobę." };

      // Edits that end up where the live version is are no pending changes.
      const form = teamFormOf(columns);
      const pending = sameValue(form, teamFormOf(previous))
        ? NO_PENDING
        : { pendingChanges: form, pendingUpdatedAt: new Date() };
      await db.update(teamMembers).set(pending).where(eq(teamMembers.id, id));
      revalidatePath("/admin/team");
      revalidatePath(`/admin/team/${id}`);
      return { ok: true, data: { id } };
    }

    // A renamed slug leaves the old URL behind, so both have to be purged.
    const values = {
      ...publishState(mode === "publish", previous?.publishedAt),
      ...columns,
      ...NO_PENDING,
      updatedAt: new Date(),
    };

    if (id) {
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

/**
 * Status only: pending changes stay pending (so hiding a record and undoing
 * it never publishes edits nobody chose to publish).
 */
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

/** „Opublikuj zmiany”: the pending changes replace the live version. */
export async function publishTeamMemberChanges(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const row = await db.query.teamMembers.findFirst({ where: eq(teamMembers.id, id) });
    if (!row) return { ok: false, error: "Nie znaleziono osoby." };

    if (!row.pendingChanges) return { ok: false, error: "Brak niepublikowanych zmian." };
    const parsed = teamMemberSchema.safeParse(row.pendingChanges);
    if (!parsed.success) {
      return { ok: false, error: "Niepublikowane zmiany są niekompletne — otwórz wpis i popraw je." };
    }
    const columns = teamColumns(parsed.data);

    const [updated] = await db
      .update(teamMembers)
      .set({
        ...columns,
        ...NO_PENDING,
        status: "published",
        publishedAt: row.publishedAt ?? new Date(),
        updatedAt: new Date(),
      })
      .where(eq(teamMembers.id, id))
      .returning({ slug: teamMembers.slug });
    revalidateTeam(id, updated?.slug, row.slug);
    return { ok: true };
  } catch (error) {
    if (isSlugClash(error)) {
      return { ok: false, error: "Ten adres (slug) jest już zajęty przez inną osobę." };
    }
    return actionError(error, "Nie udało się opublikować.");
  }
}

/** Drops the pending changes; the published version stays as it is. */
export async function discardTeamMemberChanges(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await db.update(teamMembers).set(NO_PENDING).where(eq(teamMembers.id, id));
    revalidatePath("/admin/team");
    revalidatePath(`/admin/team/${id}`);
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się odrzucić zmian.");
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
