import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site/chrome/site-footer";

/**
 * The public site's shell for share-by-link previews of unpublished articles:
 * same `main`, same footer, but no consent banner, sticky call bar or
 * analytics — whoever checks a draft is not a visitor to count.
 */
export default function PreviewLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="flex-auto overflow-x-clip bg-cream">{children}</main>
      <SiteFooter />
    </>
  );
}
