import type { ReactNode } from "react";

import type { CmsPage } from "@/lib/cms/get-page";

/**
 * Wraps one CMS section of a page.
 *
 * On the public site it is nothing: a switched-off section renders nothing and
 * a switched-on one renders bare. In the editor's preview it adds the
 * `data-cms-section` hook the editor scrolls to, and a switched-off section
 * keeps a thin hatched bar in its place so it can still be found.
 *
 * The wrapper is a plain block with no padding or border, so the raised
 * sheets' negative margins collapse through it exactly as before.
 */
export function CmsSlot({
  page,
  id,
  children,
}: {
  page: CmsPage;
  id: string;
  children: ReactNode;
}) {
  const enabled = page.sections[id]?.enabled ?? true;

  if (!page.preview) return enabled ? children : null;

  const label = page.def.sections.find((section) => section.id === id)?.label ?? id;
  return (
    <div data-cms-section={id} className="scroll-mt-4">
      {enabled ? (
        children
      ) : (
        <div className="relative z-30 mx-auto my-6 max-w-[1440px] px-gutter">
          <div className="border border-dashed border-line-strong bg-[repeating-linear-gradient(135deg,transparent_0_8px,rgba(0,0,0,0.04)_8px_16px)] px-5 py-4 text-meta text-ink-400">
            Sekcja ukryta: {label}
          </div>
        </div>
      )}
    </div>
  );
}
