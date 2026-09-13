import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site/chrome/site-footer";

/**
 * Public site shell. The header is not here: it lives inside the hero so the
 * transparent bar sits on the photograph, and it renders its own fixed compact
 * bar and mobile panel.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/*
        `clip`, not `hidden`: hiding one axis makes the other a scroll container,
        which silently binds every `position: sticky` inside the page to <main>
        instead of the viewport — so nothing ever sticks. `clip` trims the same
        horizontal overflow without creating that scroll container.
      */}
      <main className="flex-auto overflow-x-clip bg-cream">{children}</main>
      <SiteFooter />
    </>
  );
}
