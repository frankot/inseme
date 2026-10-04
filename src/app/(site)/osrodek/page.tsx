import type { Metadata } from "next";

import { OsrodekView } from "@/components/site/cms/osrodek-view";
import { getCmsPage } from "@/lib/cms/get-page";

/** Prerendered, refreshed every five minutes; publishing in the CMS revalidates it. */
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getCmsPage("osrodek");
  return { title: seo.title, description: seo.description, alternates: { canonical: "/osrodek" } };
}

/** Copy from the CMS (`/admin/cms/osrodek`); see `OsrodekView`. */
export default async function OsrodekPage() {
  return <OsrodekView page={await getCmsPage("osrodek")} />;
}
