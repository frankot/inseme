import { IntentView, intentMetadata } from "@/components/site/intent/intent-page";
import { leczenieAlkoholizmuDefaults as defaults } from "@/content/intent/leczenie-alkoholizmu";
import { getCmsPage } from "@/lib/cms/get-page";

/** Prerendered, refreshed every five minutes; publishing in the CMS revalidates it. */
export const revalidate = 300;

export function generateMetadata() {
  return intentMetadata("leczenie-alkoholizmu", defaults.path);
}

/** Copy from the CMS (`/admin/cms/leczenie-alkoholizmu`); see `IntentView`. */
export default async function LeczenieAlkoholizmuPage() {
  return <IntentView page={await getCmsPage("leczenie-alkoholizmu")} defaults={defaults} />;
}
