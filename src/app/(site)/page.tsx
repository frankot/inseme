import type { Metadata } from "next";

import { LandingView } from "@/components/site/cms/landing-view";
import { getCmsPage } from "@/lib/cms/get-page";

/**
 * The page is prerendered and refreshed every five minutes, so a published
 * CMS change, article, person or question appears without a deploy. Publishing
 * in the CMS also revalidates this path, which makes the window a backstop
 * rather than the only route from the admin to the site.
 */
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getCmsPage("landing");
  return { title: seo.title, description: seo.description, alternates: { canonical: "/" } };
}

/**
 * The homepage is a summary with a hierarchy, not the whole site.
 *
 * Its one job is the phone call, so the order runs: who you are and what
 * happens if you ring (01), the test for anyone not ready to ring (02), then
 * the proof a person weighs before dialling — the place, the reading, the
 * people, the reviews — and only then the questions and the form. The copy and
 * the picks come from the CMS (`/admin/cms/strona-glowna`); the order is code.
 */
export default async function HomePage() {
  const page = await getCmsPage("landing");
  return <LandingView page={page} />;
}
