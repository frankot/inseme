import type { ReactNode } from "react";

import { SiteSettingsProvider } from "@/components/site/chrome/site-settings";
import { getSiteSettings } from "@/lib/queries/settings";

/** Reads the settings once and hands the client-facing part to the provider. */
export async function SiteSettingsRoot({ children }: { children: ReactNode }) {
  const { contact, privacyNote, consentBannerText } = await getSiteSettings();
  return (
    <SiteSettingsProvider value={{ contact, privacyNote, consentBannerText }}>
      {children}
    </SiteSettingsProvider>
  );
}
