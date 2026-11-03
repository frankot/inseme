"use server";

import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { articles } from "@/db/schema";
import { actionError, type ActionResult, type DataResult } from "@/lib/action-result";
import { requireAdmin } from "@/lib/auth-guard";
import { notifyIndexNow } from "@/lib/indexnow";
import type { SaveMode } from "@/components/admin/save-actions";
import { publishState } from "@/lib/publish-state";
import { isProtectedArticle } from "@/lib/protected-articles";
import { articleFormOf } from "@/lib/record-forms";
import { sameValue } from "@/lib/same-value";
import { sanitizeBlocks } from "@/lib/sanitize-blocks";
import { articleSchema, emptyToNull, type ArticleInput } from "@/lib/validations/content";

/**
 * The public surfaces an article appears on. They are prerendered with only a
 * one-day backstop (`export const revalidate` on each route), so this is what
 * makes an edit show up at all — skip it and the site lags by up to a day.
 */
function revalidatePublic(slug?: string) {
  revalidatePath("/");
  revalidatePath("/porady");
  if (slug) revalidatePath(`/porady/${slug}`);
  revalidatePath("/sitemap.xml");
}

/** IndexNow for articles whose public URL appeared, changed or went away. */
function announce(...slugs: (string | null | undefined)[]) {
  notifyIndexNow(slugs.map((slug) => slug && `/porady/${slug}`));
}

/** The live columns a valid form writes — sanitised, empty fields as null. */
function articleColumns(data: ArticleInput) {
  return {
    title: data.title,
    slug: data.slug,
    excerpt: emptyToNull(data.excerpt),
    body: sanitizeBlocks(data.body),
    sources: data.sources,
    authorReviewer: emptyToNull(data.authorReviewer),
    reviewerId: data.reviewerId,
    coverImageId: data.coverImageId,
    metaTitle: emptyToNull(data.metaTitle),
    metaDescription: emptyToNull(data.metaDescription),
  };
}

const NO_PENDING = { pendingChanges: null, pendingUpdatedAt: null };

const REVIEWER_REQUIRED = "Wskaż osobę weryfikującą (z zespołu albo spoza niego) przed publikacją.";

async function slugTaken(slug: string, id: string | null) {
  const clash = await db.query.articles.findFirst({
    columns: { id: true },
    where: id ? and(eq(articles.slug, slug), ne(articles.id, id)) : eq(articles.slug, slug),
  });
  return Boolean(clash);
}

/**
 * `publish` and `draft` write the live article (as published / hidden).
 * `pending` is for a published article only: the edits are kept beside it,
 * and the site shows the published version until they are published.
 */
export async function saveArticle(
  id: string | null,
  input: ArticleInput,
  mode: SaveMode,
): Promise<DataResult<{ id: string }>> {
  try {
    await requireAdmin();
    const parsed = articleSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Nieprawidłowe dane." };
    }

    const current = id ? await db.query.articles.findFirst({ where: eq(articles.id, id) }) : null;
    if (id && !current) return { ok: false, error: "Nie znaleziono artykułu." };
    if (isProtectedArticle(current?.slug)) {
      if (current?.slug !== parsed.data.slug) {
        return { ok: false, error: "To stały artykuł — jego adresu (slug) nie można zmienić." };
      }
      if (mode === "draft") {
        return { ok: false, error: "To stały artykuł — musi pozostać opublikowany." };
      }
    }
    // Publishing is the review gate for medical/factual copy.
    if (mode === "publish" && !parsed.data.reviewerId && !parsed.data.authorReviewer?.trim()) {
      return { ok: false, error: REVIEWER_REQUIRED };
    }
    if (await slugTaken(parsed.data.slug, id)) {
      return { ok: false, error: "Artykuł o tym adresie (slug) już istnieje." };
    }

    const columns = articleColumns(parsed.data);

    if (mode === "pending") {
      if (!id || !current || current.status !== "published") {
        return { ok: false, error: "Zmiany bez publikowania można zapisać tylko w opublikowanym artykule." };
      }
      // Edits that end up where the live version is are no pending changes.
      const form = articleFormOf(columns);
      const pending = sameValue(form, articleFormOf(current))
        ? NO_PENDING
        : { pendingChanges: form, pendingUpdatedAt: new Date() };
      await db.update(articles).set(pending).where(eq(articles.id, id));
      revalidatePath("/admin/articles");
      revalidatePath(`/admin/articles/${id}`);
      return { ok: true, data: { id } };
    }

    const values = {
      ...publishState(mode === "publish", current?.publishedAt),
      ...columns,
      ...NO_PENDING,
      updatedAt: new Date(),
    };

    if (id) {
      await db.update(articles).set(values).where(eq(articles.id, id));
      revalidatePath("/admin/articles");
      revalidatePath(`/admin/articles/${id}`);
      revalidatePublic(parsed.data.slug);
      if (current?.slug !== parsed.data.slug) revalidatePublic(current?.slug);
      // Live now, or live until this save (a draft save takes it down).
      if (mode === "publish" || current?.status === "published") {
        announce(parsed.data.slug, current?.status === "published" ? current.slug : null);
      }
      return { ok: true, data: { id } };
    }

    const [row] = await db.insert(articles).values(values).returning({ id: articles.id });
    revalidatePath("/admin/articles");
    revalidatePublic(parsed.data.slug);
    if (mode === "publish") announce(parsed.data.slug);
    return { ok: true, data: { id: row.id } };
  } catch (error) {
    return actionError(error, "Nie udało się zapisać artykułu.");
  }
}

/**
 * Status only: pending changes stay pending (so hiding an article and undoing
 * it never publishes edits nobody chose to publish).
 */
export async function publishArticle(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    // Publishing is the review gate for medical/factual copy: refuse to release
    // an article that doesn't name who checked it.
    const row = await db.query.articles.findFirst({
      columns: { authorReviewer: true, reviewerId: true, slug: true },
      where: eq(articles.id, id),
    });
    if (!row) return { ok: false, error: "Nie znaleziono artykułu." };
    if (!row.reviewerId && !row.authorReviewer) return { ok: false, error: REVIEWER_REQUIRED };

    await db
      .update(articles)
      .set({ status: "published", publishedAt: new Date(), updatedAt: new Date() })
      .where(eq(articles.id, id));
    revalidatePath("/admin/articles");
    revalidatePath(`/admin/articles/${id}`);
    revalidatePublic(row.slug);
    announce(row.slug);
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się opublikować.");
  }
}

/** „Opublikuj zmiany”: the pending changes replace the live version. */
export async function publishArticleChanges(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const row = await db.query.articles.findFirst({ where: eq(articles.id, id) });
    if (!row) return { ok: false, error: "Nie znaleziono artykułu." };
    if (!row.pendingChanges) return { ok: false, error: "Brak niepublikowanych zmian." };

    // Pending changes saved before a field existed lack it; the live value stands in.
    const parsed = articleSchema.safeParse({ ...articleFormOf(row), ...row.pendingChanges });
    if (!parsed.success) {
      return { ok: false, error: "Niepublikowane zmiany są niekompletne — otwórz artykuł i popraw je." };
    }
    if (!parsed.data.reviewerId && !parsed.data.authorReviewer?.trim()) {
      return { ok: false, error: REVIEWER_REQUIRED };
    }
    if (isProtectedArticle(row.slug) && parsed.data.slug !== row.slug) {
      return { ok: false, error: "To stały artykuł — jego adresu (slug) nie można zmienić." };
    }
    if (await slugTaken(parsed.data.slug, id)) {
      return { ok: false, error: "Artykuł o tym adresie (slug) już istnieje." };
    }

    await db
      .update(articles)
      .set({
        ...articleColumns(parsed.data),
        ...NO_PENDING,
        status: "published",
        publishedAt: row.publishedAt ?? new Date(),
        updatedAt: new Date(),
      })
      .where(eq(articles.id, id));
    revalidatePath("/admin/articles");
    revalidatePath(`/admin/articles/${id}`);
    revalidatePublic(row.slug);
    if (parsed.data.slug !== row.slug) revalidatePublic(parsed.data.slug);
    announce(parsed.data.slug, row.status === "published" ? row.slug : null);
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się opublikować zmian.");
  }
}

/** Drops the pending changes; the published version stays as it is. */
export async function discardArticleChanges(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await db.update(articles).set(NO_PENDING).where(eq(articles.id, id));
    revalidatePath("/admin/articles");
    revalidatePath(`/admin/articles/${id}`);
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się odrzucić zmian.");
  }
}

export async function unpublishArticle(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const row = await db.query.articles.findFirst({
      columns: { slug: true, status: true },
      where: eq(articles.id, id),
    });
    if (isProtectedArticle(row?.slug)) {
      return { ok: false, error: "To stały artykuł — nie można cofnąć jego publikacji." };
    }
    await db
      .update(articles)
      .set({ status: "draft", updatedAt: new Date() })
      .where(eq(articles.id, id));
    revalidatePath("/admin/articles");
    revalidatePath(`/admin/articles/${id}`);
    revalidatePublic(row?.slug);
    if (row?.status === "published") announce(row.slug);
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się cofnąć publikacji.");
  }
}

export async function deleteArticle(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const row = await db.query.articles.findFirst({
      columns: { slug: true, status: true },
      where: eq(articles.id, id),
    });
    if (isProtectedArticle(row?.slug)) {
      return { ok: false, error: "To stały artykuł — nie można go usunąć." };
    }
    await db.delete(articles).where(eq(articles.id, id));
    revalidatePath("/admin/articles");
    revalidatePublic(row?.slug);
    if (row?.status === "published") announce(row.slug);
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się usunąć artykułu.");
  }
}
