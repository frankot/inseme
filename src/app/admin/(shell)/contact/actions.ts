"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { contactSubmissions } from "@/db/schema";
import { actionError, type ActionResult } from "@/lib/action-result";
import { requireAdmin } from "@/lib/auth-guard";

export async function setContactStatus(
  id: string,
  status: "new" | "handled",
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await db.update(contactSubmissions).set({ status }).where(eq(contactSubmissions.id, id));
    revalidatePath("/admin/contact");
    revalidatePath("/admin");
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się zmienić statusu.");
  }
}

/** Right-to-erasure: soft delete, same as every other personal-data table. */
export async function deleteContactSubmission(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await db
      .update(contactSubmissions)
      .set({ deletedAt: new Date() })
      .where(eq(contactSubmissions.id, id));
    revalidatePath("/admin/contact");
    revalidatePath("/admin");
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się usunąć wiadomości.");
  }
}
