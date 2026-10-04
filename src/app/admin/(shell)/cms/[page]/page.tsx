import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { loadEditorState, loadRefOptions } from "@/app/admin/(shell)/cms/editor-data";
import { CmsEditor } from "@/components/admin/cms/cms-editor";
import { getPageDefBySlug } from "@/cms/registry";

export const metadata: Metadata = { title: "CMS — panel Insieme" };

// Always the latest draft — never a cached render.
export const dynamic = "force-dynamic";

/** One route for every CMS page (plans/CMS_PLAN.md §4.3). */
export default async function CmsEditorPage({ params }: { params: Promise<{ page: string }> }) {
  const { page: slug } = await params;
  const def = getPageDefBySlug(slug);
  if (!def) notFound();

  const [state, refOptions] = await Promise.all([loadEditorState(def), loadRefOptions(def)]);

  return (
    // Keyed by page: switching pages in the title dropdown must start a fresh
    // form, not carry the previous page's state into the next one.
    <CmsEditor
      key={def.key}
      pageKey={def.key}
      initialDoc={state.current}
      publishedDoc={state.published}
      initialVersion={state.version}
      initialErrors={state.errors}
      hasDraft={state.hasDraft}
      publishedLabel={state.publishedLabel}
      refOptions={refOptions}
    />
  );
}
