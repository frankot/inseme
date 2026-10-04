"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { docErrors, normalizeDoc, slotKey, type PageDef } from "@/cms/define";
import { getPageDef, refSlots } from "@/cms/registry";
import type { PageDoc, RefKind } from "@/cms/types";
import { db } from "@/db";
import { cmsPages } from "@/db/schema";
import { actionError, type DataResult } from "@/lib/action-result";
import { requireAdmin } from "@/lib/auth-guard";

/**
 * CMS writes (plans/CMS_PLAN.md §2.1, §3, §4.4). Every save carries the
 * `draftVersion` it started from; a mismatch means someone else saved in the
 * meantime, and the editor is told to reload instead of overwriting them.
 */

const MAX_DOC_BYTES = 512 * 1024;
const CONFLICT = "Ktoś inny zmienił tę stronę — odśwież, aby zobaczyć zmiany.";

type SaveResult = { version: number; savedAt: string; errors: Record<string, string[]> };
type ConflictResult = { ok: false; error: string; conflict: true };

function pageOrThrow(key: string): PageDef {
  const def = getPageDef(key);
  if (!def) throw new Error(`Nieznana strona CMS: ${key}`);
  return def;
}

function revalidatePage(def: PageDef) {
  revalidatePath(def.route);
  revalidatePath("/admin/cms");
  revalidatePath(`/admin/cms/${def.adminSlug}`);
}

export async function saveDraft(
  key: string,
  input: PageDoc,
  version: number,
): Promise<DataResult<SaveResult> | ConflictResult> {
  try {
    const user = await requireAdmin();
    const def = pageOrThrow(key);
    const doc = normalizeDoc(def, input);
    if (JSON.stringify(doc).length > MAX_DOC_BYTES) {
      return { ok: false, error: "Strona jest zbyt duża, by ją zapisać." };
    }

    const now = new Date();
    const values = {
      draft: doc,
      draftVersion: version + 1,
      draftUpdatedAt: now,
      draftUpdatedBy: user.id ?? null,
    };
    const updated = await db
      .update(cmsPages)
      .set(values)
      .where(and(eq(cmsPages.key, key), eq(cmsPages.draftVersion, version)))
      .returning({ version: cmsPages.draftVersion });

    if (updated.length === 0) {
      const exists = await db.query.cmsPages.findFirst({
        columns: { key: true },
        where: eq(cmsPages.key, key),
      });
      if (exists || version !== 0) return { ok: false, error: CONFLICT, conflict: true };
      await db.insert(cmsPages).values({ key, ...values });
    }

    // No revalidation here: the editor is the only reader of the draft, and a
    // refreshed payload on every keystroke-save would only re-render it.
    return {
      ok: true,
      data: { version: version + 1, savedAt: now.toISOString(), errors: docErrors(def, doc) },
    };
  } catch (error) {
    return actionError(error, "Nie udało się zapisać szkicu.");
  }
}

export async function publishDraft(
  key: string,
  version: number,
): Promise<DataResult<{ version: number }> | ConflictResult> {
  try {
    const user = await requireAdmin();
    const def = pageOrThrow(key);
    const row = await db.query.cmsPages.findFirst({ where: eq(cmsPages.key, key) });
    if (!row?.draft) return { ok: false, error: "Brak zmian do opublikowania." };
    if (row.draftVersion !== version) return { ok: false, error: CONFLICT, conflict: true };

    const doc = normalizeDoc(def, row.draft);
    const errors = Object.values(docErrors(def, doc)).flat();
    if (errors.length) {
      return { ok: false, error: `Popraw błędy przed publikacją: ${errors[0]}` };
    }

    await db
      .update(cmsPages)
      .set({
        published: doc,
        draft: null,
        draftVersion: version + 1,
        publishedAt: new Date(),
        publishedBy: user.id ?? null,
      })
      .where(eq(cmsPages.key, key));
    revalidatePage(def);
    return { ok: true, data: { version: version + 1 } };
  } catch (error) {
    return actionError(error, "Nie udało się opublikować.");
  }
}

export async function discardDraft(
  key: string,
  version: number,
): Promise<DataResult<{ version: number }> | ConflictResult> {
  try {
    await requireAdmin();
    const def = pageOrThrow(key);
    const updated = await db
      .update(cmsPages)
      .set({ draft: null, draftVersion: version + 1 })
      .where(and(eq(cmsPages.key, key), eq(cmsPages.draftVersion, version)))
      .returning({ key: cmsPages.key });
    if (updated.length === 0) return { ok: false, error: CONFLICT, conflict: true };
    revalidatePage(def);
    return { ok: true, data: { version: version + 1 } };
  } catch (error) {
    return actionError(error, "Nie udało się odrzucić szkicu.");
  }
}

const ENTITY_ADMIN: Record<RefKind, string> = {
  faq: "/admin/faq",
  team: "/admin/team",
  test: "/admin/tests",
  article: "/admin/articles",
};

/**
 * The entity-side switch (D6, §3.2): "show this on the homepage". It writes
 * the published doc directly — the change is live at once, as the hint in the
 * admin says — and the open draft too, if there is one, so publishing that
 * draft later does not undo it. Touching the draft bumps its version, which
 * makes an editor open elsewhere reload rather than overwrite.
 */
export async function setFeatured(
  slot: string,
  entityId: string,
  on: boolean,
): Promise<DataResult<{ on: boolean }>> {
  try {
    await requireAdmin();
    const target = refSlots.find((candidate) => slotKey(candidate) === slot);
    if (!target) return { ok: false, error: "Nieznane miejsce na stronie." };
    const def = pageOrThrow(target.pageKey);
    const row = await db.query.cmsPages.findFirst({ where: eq(cmsPages.key, def.key) });

    const apply = (doc: PageDoc): PageDoc | string => {
      const section = doc.sections[target.sectionId];
      const data = { ...(section.data as Record<string, unknown>) };
      const current = data[target.field];
      if (target.spec.multiple) {
        const list = Array.isArray(current) ? current.filter((v) => v !== entityId) : [];
        if (on) {
          if (list.length >= target.spec.max) {
            return `Limit ${target.spec.max} osiągnięty w sekcji „${target.sectionLabel}” — najpierw odznacz inną pozycję.`;
          }
          list.push(entityId);
        }
        data[target.field] = list;
      } else {
        data[target.field] = on ? entityId : current === entityId ? null : current;
      }
      return { ...doc, sections: { ...doc.sections, [target.sectionId]: { ...section, data } } };
    };

    const published = apply(normalizeDoc(def, row?.published));
    if (typeof published === "string") return { ok: false, error: published };
    const draft = row?.draft ? apply(normalizeDoc(def, row.draft)) : null;
    if (typeof draft === "string") return { ok: false, error: draft };

    if (row) {
      await db
        .update(cmsPages)
        .set({
          published,
          ...(draft && { draft, draftVersion: row.draftVersion + 1 }),
        })
        .where(eq(cmsPages.key, def.key));
    } else {
      await db.insert(cmsPages).values({ key: def.key, published, publishedAt: new Date() });
    }

    revalidatePage(def);
    revalidatePath(ENTITY_ADMIN[target.spec.ref]);
    return { ok: true, data: { on } };
  } catch (error) {
    return actionError(error, "Nie udało się zmienić wyróżnienia.");
  }
}
