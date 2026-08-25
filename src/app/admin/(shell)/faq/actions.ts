"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { faqItems } from "@/db/schema";
import { actionError, type ActionResult, type DataResult } from "@/lib/action-result";
import { requireAdmin } from "@/lib/auth-guard";
import { sanitizeRichText } from "@/lib/sanitize";
import { emptyToNull, faqItemSchema, type FaqItemInput } from "@/lib/validations/content";

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

    const values = {
      question: parsed.data.question,
      answer: sanitizeRichText(parsed.data.answer),
      category: emptyToNull(parsed.data.category),
      sortOrder: parsed.data.sortOrder,
      updatedAt: new Date(),
    };

    if (id) {
      await db.update(faqItems).set(values).where(eq(faqItems.id, id));
      revalidatePath("/admin/faq");
      revalidatePath(`/admin/faq/${id}`);
      return { ok: true, data: { id } };
    }

    const [row] = await db.insert(faqItems).values(values).returning({ id: faqItems.id });
    revalidatePath("/admin/faq");
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
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się usunąć pytania.");
  }
}
