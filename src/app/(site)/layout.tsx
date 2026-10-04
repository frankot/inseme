import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ConsentBanner } from "@/components/site/chrome/consent";
import { SiteFooter } from "@/components/site/chrome/site-footer";
import { SiteSettingsRoot } from "@/components/site/chrome/site-settings-root";
import { StickyCallBar } from "@/components/site/chrome/sticky-call-bar";
import { JsonLd } from "@/components/site/ui/json-ld";
import { getSiteSettings } from "@/lib/queries/settings";
import { BASE_OPEN_GRAPH } from "@/lib/site-url";
import { clinicJsonLd } from "@/lib/structured-data";

/**
 * The share card for every page without an image of its own — what appears
 * when a link is pasted into WhatsApp or Messenger, which is how families pass
 * the site around. Set under Ustawienia; `public/og-default.jpg` until then.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { ogImage } = await getSiteSettings();
  const images = [ogImage];
  return {
    openGraph: { ...BASE_OPEN_GRAPH, images },
    twitter: { card: "summary_large_image", images },
  };
}

/**
 * Public site shell. The header is not here: it lives inside the hero so the
 * transparent bar sits on the photograph, and it renders its own fixed compact
 * bar and mobile panel.
 */
export default async function SiteLayout({ children }: { children: ReactNode }) {
  const { contact, socialLinks } = await getSiteSettings();

  return (
    <SiteSettingsRoot>
      {/*
        First thing a keyboard reaches: jumps past the header and its menu to
        where the page's own content starts (`#tresc`, set by the hero and by
        `SubpageLayout`).
      */}
      <a
        href="#tresc"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-ink-900 focus:px-4 focus:py-3 focus:text-body focus:text-bone"
      >
        Przejdź do treści
      </a>
      <JsonLd data={clinicJsonLd(contact, socialLinks)} />
      {/*
        `clip`, not `hidden`: hiding one axis makes the other a scroll container,
        which silently binds every `position: sticky` inside the page to <main>
        instead of the viewport — so nothing ever sticks. `clip` trims the same
        horizontal overflow without creating that scroll container.
      */}
      <main className="flex-auto overflow-x-clip bg-cream">{children}</main>
      <SiteFooter />
      <StickyCallBar />
      <ConsentBanner />
    </SiteSettingsRoot>
  );
}
