import { KontaktGrid } from "@/components/site/ui/kontakt-grid";
import { Section } from "@/components/site/ui/section";
import {
  kontaktDefaults,
  type KontaktContent,
  type SiteContact,
} from "@/content/home";

export function Kontakt({
  content = kontaktDefaults,
  contact,
}: {
  content?: KontaktContent;
  contact: SiteContact;
}) {
  return (
    <Section id="kontakt" index={content.index} label={content.eyebrow}>
      <KontaktGrid
        contact={contact}
        formTitle={content.formTitle}
        formNote={content.formNote}
        map={content.map}
      />
    </Section>
  );
}
