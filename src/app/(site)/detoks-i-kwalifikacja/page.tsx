import { IntentView, intentMetadata } from "@/components/site/intent/intent-page";
import { detoksIKwalifikacjaDefaults as defaults } from "@/content/intent/detoks-i-kwalifikacja";
import { getCmsPage } from "@/lib/cms/get-page";

/** Prerendered; publishing in the CMS revalidates it, the one-day window is a backstop. */
export const revalidate = 86400;

export function generateMetadata() {
  return intentMetadata("detoks-i-kwalifikacja", defaults.path);
}

/** Copy from the CMS (`/admin/cms/detoks-i-kwalifikacja`); see `IntentView`. */
export default async function DetoksIKwalifikacjaPage() {
  return <IntentView page={await getCmsPage("detoks-i-kwalifikacja")} defaults={defaults} />;
}
