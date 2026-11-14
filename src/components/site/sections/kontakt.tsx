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
    // Always the homepage's last band: its numeral is odd or even depending on
    // which sections are switched on, so it says so rather than relying on parity.
    <Section id="kontakt" index={content.index} label={content.eyebrow} last>
      <KontaktGrid
        contact={contact}
        formTitle={content.formTitle}
        formNote={content.formNote}
        map={content.map}
      />
    </Section>
  );
}
