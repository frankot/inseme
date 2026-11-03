import type { Metadata } from "next";

import { OsrodekView } from "@/components/site/cms/osrodek-view";
import { getCmsPage } from "@/lib/cms/get-page";

/** Prerendered; publishing in the CMS revalidates it, the one-day window is a backstop. */
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getCmsPage("osrodek");
  return { title: seo.title, description: seo.description, alternates: { canonical: "/osrodek" } };
}

/** Copy from the CMS (`/admin/cms/osrodek`); see `OsrodekView`. */
export default async function OsrodekPage() {
  return <OsrodekView page={await getCmsPage("osrodek")} />;
}
