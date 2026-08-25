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
      <main className="flex-auto overflow-x-hidden bg-cream">{children}</main>
      <SiteFooter />
    </>
  );
}
