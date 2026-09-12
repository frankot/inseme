"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { leadSignups } from "@/db/schema";
import { actionError, type ActionResult } from "@/lib/action-result";
import { requireAdmin } from "@/lib/auth-guard";

/** Right-to-erasure. Soft delete, so the row leaves every list and the export at once. */
export async function deleteLeadSignup(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await db
      .update(leadSignups)
      .set({ deletedAt: new Date() })
      .where(eq(leadSignups.id, id));
    revalidatePath("/admin/leads");
    revalidatePath("/admin");
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się usunąć adresu.");
  }
}
