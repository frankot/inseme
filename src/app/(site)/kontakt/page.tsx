import type { Metadata } from "next";

import { SubpageLayout } from "@/components/site/chrome/subpage-layout";
import { Container } from "@/components/site/ui/container";
import { KontaktGrid } from "@/components/site/ui/kontakt-grid";
import { kontaktDefaults } from "@/content/home";
import { kontaktPageDefaults as copy } from "@/content/kontakt";
import { getSiteContact } from "@/lib/queries/settings";

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
};

export default async function KontaktPage() {
  const contact = await getSiteContact();

  return (
    <SubpageLayout
      eyebrow={copy.eyebrow}
      title={copy.title}
      lead={copy.lead}
      breadcrumb={[
        { label: copy.breadcrumbHome, href: "/" },
        { label: copy.breadcrumbKontakt },
      ]}
      contact={contact}
    >
      <Container className="pb-section-lg">
        <KontaktGrid
          contact={contact}
          formTitle={copy.formTitle}
          formNote={copy.formNote}
          map={kontaktDefaults.map}
        />
      </Container>
    </SubpageLayout>
  );
}
