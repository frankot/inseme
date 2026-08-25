"use server";

import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { articles } from "@/db/schema";
import { actionError, type ActionResult, type DataResult } from "@/lib/action-result";
import { requireAdmin } from "@/lib/auth-guard";
import { sanitizeBlocks } from "@/lib/sanitize-blocks";
import { articleSchema, emptyToNull, type ArticleInput } from "@/lib/validations/content";

export async function saveArticle(
  id: string | null,
  input: ArticleInput,
): Promise<DataResult<{ id: string }>> {
  try {
    await requireAdmin();
    const parsed = articleSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Nieprawidłowe dane." };
    }

    const clash = await db.query.articles.findFirst({
      columns: { id: true },
      where: id
        ? and(eq(articles.slug, parsed.data.slug), ne(articles.id, id))
        : eq(articles.slug, parsed.data.slug),
    });
    if (clash) {
      return { ok: false, error: "Artykuł o tym adresie (slug) już istnieje." };
    }

    const values = {
      title: parsed.data.title,
      slug: parsed.data.slug,
      excerpt: emptyToNull(parsed.data.excerpt),
      body: sanitizeBlocks(parsed.data.body),
      authorReviewer: emptyToNull(parsed.data.authorReviewer),
      coverImageId: parsed.data.coverImageId,
      metaTitle: emptyToNull(parsed.data.metaTitle),
      metaDescription: emptyToNull(parsed.data.metaDescription),
      updatedAt: new Date(),
    };

    if (id) {
      await db.update(articles).set(values).where(eq(articles.id, id));
      revalidatePath("/admin/articles");
      revalidatePath(`/admin/articles/${id}`);
      return { ok: true, data: { id } };
    }

    const [row] = await db.insert(articles).values(values).returning({ id: articles.id });
    revalidatePath("/admin/articles");
    return { ok: true, data: { id: row.id } };
  } catch (error) {
    return actionError(error, "Nie udało się zapisać artykułu.");
  }
}

export async function publishArticle(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    // Publishing is the review gate for medical/factual copy: refuse to release
    // an article that doesn't name who checked it.
    const row = await db.query.articles.findFirst({
      columns: { authorReviewer: true },
      where: eq(articles.id, id),
    });
    if (!row) return { ok: false, error: "Nie znaleziono artykułu." };
    if (!row.authorReviewer) {
      return {
        ok: false,
        error: "Uzupełnij pole „Autor / osoba weryfikująca” przed publikacją.",
      };
    }

    await db
      .update(articles)
      .set({ status: "published", publishedAt: new Date(), updatedAt: new Date() })
      .where(eq(articles.id, id));
    revalidatePath("/admin/articles");
    revalidatePath(`/admin/articles/${id}`);
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się opublikować.");
  }
}

export async function unpublishArticle(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await db
      .update(articles)
      .set({ status: "draft", updatedAt: new Date() })
      .where(eq(articles.id, id));
    revalidatePath("/admin/articles");
    revalidatePath(`/admin/articles/${id}`);
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się cofnąć publikacji.");
  }
}

export async function deleteArticle(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await db.delete(articles).where(eq(articles.id, id));
    revalidatePath("/admin/articles");
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się usunąć artykułu.");
  }
}
