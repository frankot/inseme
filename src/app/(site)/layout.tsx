import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site/chrome/site-footer";
import { StickyCallBar } from "@/components/site/chrome/sticky-call-bar";
import { JsonLd } from "@/components/site/ui/json-ld";
import { clinicJsonLd } from "@/lib/structured-data";

/**
 * Public site shell. The header is not here: it lives inside the hero so the
 * transparent bar sits on the photograph, and it renders its own fixed compact
 * bar and mobile panel.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
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
      <JsonLd data={clinicJsonLd()} />
      {/*
        `clip`, not `hidden`: hiding one axis makes the other a scroll container,
        which silently binds every `position: sticky` inside the page to <main>
        instead of the viewport — so nothing ever sticks. `clip` trims the same
        horizontal overflow without creating that scroll container.
      */}
      <main className="flex-auto overflow-x-clip bg-cream">{children}</main>
      <SiteFooter />
      <StickyCallBar />
    </>
  );
}
