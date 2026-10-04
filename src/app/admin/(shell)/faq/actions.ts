"use server";

import { and, count, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { faqItems } from "@/db/schema";
import { actionError, type ActionResult, type DataResult } from "@/lib/action-result";
import { requireAdmin } from "@/lib/auth-guard";
import { sanitizeRichText } from "@/lib/sanitize";
import {
  emptyToNull,
  FAQ_FEATURED_MAX,
  faqItemSchema,
  type FaqItemInput,
} from "@/lib/validations/content";

export async function saveFaqItem(
  id: string | null,
  input: FaqItemInput,
): Promise<DataResult<{ id: string }>> {
  try {
    await requireAdmin();
    const parsed = faqItemSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Nieprawidłowe dane." };
    }

    if (parsed.data.featured) {
      const others = id
        ? and(eq(faqItems.featured, true), ne(faqItems.id, id))
        : eq(faqItems.featured, true);
      const [{ value: featuredCount }] = await db
        .select({ value: count() })
        .from(faqItems)
        .where(others);
      if (featuredCount >= FAQ_FEATURED_MAX) {
        return {
          ok: false,
          error: `Na stronie głównej może być najwyżej ${FAQ_FEATURED_MAX} pytań. Najpierw odznacz inne.`,
        };
      }
    }

    const values = {
      question: parsed.data.question,
      answer: sanitizeRichText(parsed.data.answer),
      category: emptyToNull(parsed.data.category),
      sortOrder: parsed.data.sortOrder,
      featured: parsed.data.featured,
      updatedAt: new Date(),
    };

    if (id) {
      await db.update(faqItems).set(values).where(eq(faqItems.id, id));
      revalidatePath("/admin/faq");
      revalidatePath("/");
      revalidatePath("/faq");
      revalidatePath(`/admin/faq/${id}`);
      return { ok: true, data: { id } };
    }

    const [row] = await db.insert(faqItems).values(values).returning({ id: faqItems.id });
    revalidatePath("/admin/faq");
    revalidatePath("/");
    revalidatePath("/faq");
    return { ok: true, data: { id: row.id } };
  } catch (error) {
    return actionError(error, "Nie udało się zapisać pytania.");
  }
}

export async function publishFaqItem(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await db
      .update(faqItems)
      .set({ status: "published", publishedAt: new Date(), updatedAt: new Date() })
      .where(eq(faqItems.id, id));
    revalidatePath("/admin/faq");
    revalidatePath("/");
    revalidatePath("/faq");
    revalidatePath(`/admin/faq/${id}`);
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się opublikować.");
  }
}

export async function unpublishFaqItem(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await db
      .update(faqItems)
      .set({ status: "draft", updatedAt: new Date() })
      .where(eq(faqItems.id, id));
    revalidatePath("/admin/faq");
    revalidatePath("/");
    revalidatePath("/faq");
    revalidatePath(`/admin/faq/${id}`);
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się cofnąć publikacji.");
  }
}

export async function deleteFaqItem(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await db.delete(faqItems).where(eq(faqItems.id, id));
    revalidatePath("/admin/faq");
    revalidatePath("/");
    revalidatePath("/faq");
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się usunąć pytania.");
  }
}
