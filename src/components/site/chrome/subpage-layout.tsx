import type { ReactNode } from "react";

import { PageIntro, type Crumb } from "@/components/site/chrome/page-intro";
import { SiteHeader } from "@/components/site/chrome/site-header";
import { contactDefaults, type SiteContact } from "@/content/home";

/**
 * The shell every subpage sits in: the solid header (the homepage's lives
 * inside its hero, so there is nothing to reuse there) followed by the title
 * block. Pages supply their own sections as children.
 *
 * Pass `intro={false}` when a page wants the header but draws its own opening —
 * `/zespol/[slug]` does, because a person's name is not a page title.
 */
export function SubpageLayout({
  eyebrow,
  title,
  lead,
  breadcrumb,
  intro = true,
  contact = contactDefaults,
  children,
}: {
  eyebrow?: string;
  title?: string;
  lead?: ReactNode;
  breadcrumb?: Crumb[];
  intro?: boolean;
  contact?: SiteContact;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader variant="solid" contact={contact} />
      {/* The skip link's target — `tabIndex` so focus actually lands here. */}
      <div id="tresc" tabIndex={-1} className="outline-none">
        {intro && eyebrow && title && (
          <PageIntro
            eyebrow={eyebrow}
            title={title}
            lead={lead}
            breadcrumb={breadcrumb}
          />
        )}
        {/*
          The footer is pulled up over whatever ends the page. On the homepage the
          last band already carries that overhang in its padding; here the pages
          end in ordinary containers, so the room is given back once, for all of
          them, rather than on every page's last element.
        */}
        <div className="pb-slab">{children}</div>
      </div>
    </>
  );
}
