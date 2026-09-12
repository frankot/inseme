import Link from "next/link";

import { SubpageLayout } from "@/components/site/chrome/subpage-layout";
import { Container } from "@/components/site/ui/container";
import { testyPageDefaults as copy } from "@/content/screening";

export default function TestNotFound() {
  return (
    <SubpageLayout
      eyebrow={copy.eyebrow}
      title={copy.notFoundTitle}
      lead={copy.notFoundBody}
      breadcrumb={[
        { label: copy.breadcrumbHome, href: "/" },
        { label: copy.breadcrumbTesty, href: "/testy" },
      ]}
    >
      <Container className="pb-section-lg">
        <Link
          href="/testy"
          className="link-arrow text-[15px] text-sage-600 transition-colors hover:text-sage-700"
        >
          <span>{copy.backLabel}</span>
          <span aria-hidden>→</span>
        </Link>
      </Container>
    </SubpageLayout>
  );
}
