import { IntentView, intentMetadata } from "@/components/site/intent/intent-page";
import { detoksIKwalifikacjaDefaults as defaults } from "@/content/intent/detoks-i-kwalifikacja";
import { getCmsPage } from "@/lib/cms/get-page";

/** Prerendered, refreshed every five minutes; publishing in the CMS revalidates it. */
export const revalidate = 300;

export function generateMetadata() {
  return intentMetadata("detoks-i-kwalifikacja", defaults.path);
}

/** Copy from the CMS (`/admin/cms/detoks-i-kwalifikacja`); see `IntentView`. */
export default async function DetoksIKwalifikacjaPage() {
  return <IntentView page={await getCmsPage("detoks-i-kwalifikacja")} defaults={defaults} />;
}
