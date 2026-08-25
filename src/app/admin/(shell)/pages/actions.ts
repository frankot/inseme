"use server";

import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { pages } from "@/db/schema";
import { actionError, type ActionResult, type DataResult } from "@/lib/action-result";
import { requireAdmin } from "@/lib/auth-guard";
import { sanitizeBlocks } from "@/lib/sanitize-blocks";
import { emptyToNull, pageSchema, type PageInput } from "@/lib/validations/content";

export async function savePage(
  id: string | null,
  input: PageInput,
): Promise<DataResult<{ id: string }>> {
  try {
    await requireAdmin();
    const parsed = pageSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Nieprawidłowe dane." };
    }

    // Slug is a public URL and unique in the DB — check it here to return a
    // readable message instead of a constraint violation.
    const clash = await db.query.pages.findFirst({
      columns: { id: true },
      where: id
        ? and(eq(pages.slug, parsed.data.slug), ne(pages.id, id))
        : eq(pages.slug, parsed.data.slug),
    });
    if (clash) {
      return { ok: false, error: "Strona o tym adresie (slug) już istnieje." };
    }

    const values = {
      title: parsed.data.title,
      slug: parsed.data.slug,
      pageType: parsed.data.pageType,
      heroTitle: emptyToNull(parsed.data.heroTitle),
      heroSubtitle: emptyToNull(parsed.data.heroSubtitle),
      sections: sanitizeBlocks(parsed.data.sections),
      ogImageId: parsed.data.ogImageId,
      metaTitle: emptyToNull(parsed.data.metaTitle),
      metaDescription: emptyToNull(parsed.data.metaDescription),
      updatedAt: new Date(),
    };

    if (id) {
      await db.update(pages).set(values).where(eq(pages.id, id));
      revalidatePath("/admin/pages");
      revalidatePath(`/admin/pages/${id}`);
      return { ok: true, data: { id } };
    }

    const [row] = await db.insert(pages).values(values).returning({ id: pages.id });
    revalidatePath("/admin/pages");
    return { ok: true, data: { id: row.id } };
  } catch (error) {
    return actionError(error, "Nie udało się zapisać strony.");
  }
}

export async function publishPage(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await db
      .update(pages)
      .set({ status: "published", publishedAt: new Date(), updatedAt: new Date() })
      .where(eq(pages.id, id));
    revalidatePath("/admin/pages");
    revalidatePath(`/admin/pages/${id}`);
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się opublikować.");
  }
}

export async function unpublishPage(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await db
      .update(pages)
      .set({ status: "draft", updatedAt: new Date() })
      .where(eq(pages.id, id));
    revalidatePath("/admin/pages");
    revalidatePath(`/admin/pages/${id}`);
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się cofnąć publikacji.");
  }
}

export async function deletePage(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await db.delete(pages).where(eq(pages.id, id));
    revalidatePath("/admin/pages");
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się usunąć strony.");
  }
}
