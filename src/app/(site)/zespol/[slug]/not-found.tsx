import Link from "next/link";

import { SubpageLayout } from "@/components/site/chrome/subpage-layout";
import { Container } from "@/components/site/ui/container";
import { teamMemberPageDefaults as copy } from "@/content/team";

/** A slug that matches nobody — a deleted person, or an unpublished one. */
export default function TeamMemberNotFound() {
  return (
    <SubpageLayout
      eyebrow={copy.eyebrow}
      title={copy.notFoundTitle}
      lead={copy.notFoundBody}
      breadcrumb={[
        { label: copy.breadcrumbHome, href: "/" },
        { label: copy.breadcrumbTeam, href: "/zespol" },
      ]}
    >
      <Container className="pb-section-lg">
        <Link
          href="/zespol"
          className="link-arrow text-[15px] text-sage-600 transition-colors hover:text-sage-700"
        >
          <span>{copy.backLabel}</span>
          <span aria-hidden>→</span>
        </Link>
      </Container>
    </SubpageLayout>
  );
}
