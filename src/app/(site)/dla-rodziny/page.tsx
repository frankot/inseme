import { IntentView, intentMetadata } from "@/components/site/intent/intent-page";
import { dlaRodzinyDefaults as defaults } from "@/content/intent/dla-rodziny";
import { getCmsPage } from "@/lib/cms/get-page";

/** Prerendered, refreshed every five minutes; publishing in the CMS revalidates it. */
export const revalidate = 300;

export function generateMetadata() {
  return intentMetadata("dla-rodziny", defaults.path);
}

/** Copy from the CMS (`/admin/cms/dla-rodziny`); see `IntentView`. */
export default async function DlaRodzinyPage() {
  return <IntentView page={await getCmsPage("dla-rodziny")} defaults={defaults} />;
}
