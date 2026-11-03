import type { Metadata } from "next";

import { ProgramView } from "@/components/site/cms/program-view";
import { getCmsPage } from "@/lib/cms/get-page";

/** Prerendered; publishing in the CMS revalidates it, the one-day window is a backstop. */
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getCmsPage("program");
  return { title: seo.title, description: seo.description, alternates: { canonical: "/program" } };
}

/** Copy from the CMS (`/admin/cms/program`); see `ProgramView`. */
export default async function ProgramPage() {
  return <ProgramView page={await getCmsPage("program")} />;
}
