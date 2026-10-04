"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { SiteContact } from "@/content/home";
import { siteSettingsDefaults } from "@/content/settings";

/**
 * The part of the settings singleton client components need, handed down once
 * by the site layout instead of threaded through every section as a prop.
 * Outside the provider (the CMS preview) it reads the defaults.
 */
export type ClientSiteSettings = {
  contact: SiteContact;
  privacyNote: string;
  consentBannerText: string;
};

const SiteSettingsContext = createContext<ClientSiteSettings>({
  contact: siteSettingsDefaults.contact,
  privacyNote: siteSettingsDefaults.privacyNote,
  consentBannerText: siteSettingsDefaults.consentBannerText,
});

export function SiteSettingsProvider({
  value,
  children,
}: {
  value: ClientSiteSettings;
  children: ReactNode;
}) {
  return <SiteSettingsContext value={value}>{children}</SiteSettingsContext>;
}

export function useSiteSettings(): ClientSiteSettings {
  return useContext(SiteSettingsContext);
}

export function useSiteContact(): SiteContact {
  return useContext(SiteSettingsContext).contact;
}
