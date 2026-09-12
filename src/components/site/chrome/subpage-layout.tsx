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
  lead?: string;
  breadcrumb?: Crumb[];
  intro?: boolean;
  contact?: SiteContact;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader variant="solid" contact={contact} />
      {intro && eyebrow && title && (
        <PageIntro
          eyebrow={eyebrow}
          title={title}
          lead={lead}
          breadcrumb={breadcrumb}
        />
      )}
      {children}
    </>
  );
}
