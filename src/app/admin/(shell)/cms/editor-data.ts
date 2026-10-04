import "server-only";

import { asc, desc, eq } from "drizzle-orm";

import type { RefOptions } from "@/components/admin/cms/fields";
import { docErrors, normalizeDoc, slotsOf, type PageDef } from "@/cms/define";
import { db } from "@/db";
import { adminUsers, articles, cmsPages, faqItems, screeningTests, teamMembers } from "@/db/schema";

/** "Opublikowano 3 paź, 14:02 · A. Kowalska" / never published. */
export function publishedLabelFor(at: Date | null, by: string | null | undefined): string {
  if (!at) return "Nigdy nie publikowano — strona pokazuje treść domyślną";
  const when = at.toLocaleString("pl-PL", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
  return `Opublikowano ${when}${by ? ` · ${by}` : ""}`;
}

export async function loadEditorState(def: PageDef) {
  const row = await db.query.cmsPages.findFirst({ where: eq(cmsPages.key, def.key) });
  const publisher = row?.publishedBy
    ? await db.query.adminUsers.findFirst({
        columns: { name: true, email: true },
        where: eq(adminUsers.id, row.publishedBy),
      })
    : null;

  const published = normalizeDoc(def, row?.published);
  const current = normalizeDoc(def, row?.draft ?? row?.published);
  return {
    published,
    current,
    version: row?.draftVersion ?? 0,
    hasDraft: Boolean(row?.draft),
    errors: docErrors(def, current),
    publishedLabel: publishedLabelFor(row?.publishedAt ?? null, publisher?.name ?? publisher?.email),
  };
}

/** Picker lists, only for the kinds this page has slots for. Drafts included, marked. */
export async function loadRefOptions(def: PageDef): Promise<RefOptions> {
  const kinds = new Set(slotsOf(def).map((slot) => slot.spec.ref));
  const out: RefOptions = { faq: [], team: [], test: [], article: [] };

  if (kinds.has("faq")) {
    const rows = await db
      .select({ id: faqItems.id, q: faqItems.question, status: faqItems.status, category: faqItems.category })
      .from(faqItems)
      .orderBy(asc(faqItems.sortOrder), asc(faqItems.createdAt));
    out.faq = rows.map((r) => ({
      id: r.id,
      label: r.q,
      meta: r.category ?? undefined,
      published: r.status === "published",
    }));
  }
  if (kinds.has("team")) {
    const rows = await db
      .select({ id: teamMembers.id, name: teamMembers.name, role: teamMembers.role, status: teamMembers.status })
      .from(teamMembers)
      .orderBy(asc(teamMembers.sortOrder), asc(teamMembers.name));
    out.team = rows.map((r) => ({
      id: r.id,
      label: r.name,
      meta: r.role ?? undefined,
      published: r.status === "published",
    }));
  }
  if (kinds.has("test")) {
    const rows = await db
      .select({ id: screeningTests.id, title: screeningTests.title, status: screeningTests.status })
      .from(screeningTests)
      .orderBy(asc(screeningTests.title));
    out.test = rows.map((r) => ({ id: r.id, label: r.title, published: r.status === "published" }));
  }
  if (kinds.has("article")) {
    const rows = await db
      .select({ id: articles.id, title: articles.title, status: articles.status })
      .from(articles)
      .orderBy(desc(articles.publishedAt), desc(articles.createdAt));
    out.article = rows.map((r) => ({ id: r.id, label: r.title, published: r.status === "published" }));
  }
  return out;
}
