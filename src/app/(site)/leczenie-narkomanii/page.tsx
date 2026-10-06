import { IntentView, intentMetadata } from "@/components/site/intent/intent-page";
import { leczenieNarkomaniiDefaults as defaults } from "@/content/intent/leczenie-narkomanii";
import { getCmsPage } from "@/lib/cms/get-page";

/** Prerendered, refreshed every five minutes; publishing in the CMS revalidates it. */
export const revalidate = 300;

export function generateMetadata() {
  return intentMetadata("leczenie-narkomanii", defaults.path);
}

/** Copy from the CMS (`/admin/cms/leczenie-narkomanii`); see `IntentView`. */
export default async function LeczenieNarkomaniiPage() {
  return <IntentView page={await getCmsPage("leczenie-narkomanii")} defaults={defaults} />;
}
