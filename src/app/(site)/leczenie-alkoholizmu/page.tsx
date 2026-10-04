import { IntentPage, intentMetadata } from "@/components/site/intent/intent-page";
import { leczenieAlkoholizmuDefaults as copy } from "@/content/intent/leczenie-alkoholizmu";

export const metadata = intentMetadata(copy);

/** Prerendered, refreshed every five minutes — the FAQ block reads the DB. */
export const revalidate = 300;

export default function LeczenieAlkoholizmuPage() {
  return <IntentPage copy={copy} />;
}
