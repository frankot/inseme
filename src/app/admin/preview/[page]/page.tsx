import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { renderCmsPage } from "@/components/site/cms/render";
import { getPageDef } from "@/cms/registry";
import { getCmsPreview } from "@/lib/cms/get-page";

export const metadata: Metadata = {
  title: "Podgląd — panel Insieme",
  robots: { index: false, follow: false },
};

// The draft, every time.
export const dynamic = "force-dynamic";

/**
 * The editor's preview (plans/CMS_PLAN.md §5): the page's real view, fed the
 * draft. `/admin/*` is already gated by `proxy.ts`; the session check here is
 * the second lock, since this route sits outside the admin shell.
 */
export default async function CmsPreviewPage({ params }: { params: Promise<{ page: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");

  const { page: key } = await params;
  if (!getPageDef(key)) notFound();
  return renderCmsPage(await getCmsPreview(key));
}
