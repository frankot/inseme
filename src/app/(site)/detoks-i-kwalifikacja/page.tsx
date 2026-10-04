import { IntentPage, intentMetadata } from "@/components/site/intent/intent-page";
import { detoksIKwalifikacjaDefaults as copy } from "@/content/intent/detoks-i-kwalifikacja";

export const metadata = intentMetadata(copy);

/** Prerendered, refreshed every five minutes — the FAQ block reads the DB. */
export const revalidate = 300;

export default function DetoksIKwalifikacjaPage() {
  return <IntentPage copy={copy} />;
}
