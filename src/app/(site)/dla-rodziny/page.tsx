import { IntentPage, intentMetadata } from "@/components/site/intent/intent-page";
import { dlaRodzinyDefaults as copy } from "@/content/intent/dla-rodziny";

export const metadata = intentMetadata(copy);

/** Prerendered, refreshed every five minutes — the FAQ block reads the DB. */
export const revalidate = 300;

export default function DlaRodzinyPage() {
  return <IntentPage copy={copy} />;
}
