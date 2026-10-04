import type { ReactNode } from "react";

import { PreviewBridge } from "@/components/admin/cms/preview-bridge";
import { SiteFooter } from "@/components/site/chrome/site-footer";

/**
 * The public site's shell for the CMS preview: same `main`, same footer, but
 * no consent banner, sticky call bar or analytics — it is an admin screen
 * that happens to look like the site.
 */
export default function PreviewLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="flex-auto overflow-x-clip bg-cream">{children}</main>
      <SiteFooter />
      <PreviewBridge />
    </>
  );
}
