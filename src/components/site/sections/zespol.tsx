import { Cta } from "@/components/site/ui/cta";
import { Section } from "@/components/site/ui/section";
import { TeamCard } from "@/components/site/ui/team-card";
import { teamTeaserDefaults, type TeamTeaserContent } from "@/content/team";
import type { TeamCardData } from "@/lib/queries/team";

/**
 * Three featured people on the homepage. Unlike the other sections this one
 * takes real rows — see `getFeaturedTeam` — and removes itself when there are
 * none, so an unpopulated CMS leaves no gap between Program and Opinie rather
 * than an empty heading.
 */
export function Zespol({
  members,
  content = teamTeaserDefaults,
}: {
  members: TeamCardData[];
  content?: TeamTeaserContent;
}) {
  if (members.length === 0) return null;

  return (
    <Section
      id="zespol"
      index={content.index}
      label={content.eyebrow}
      title={content.title}
      lead={content.lead}
      action={<Cta href={content.href}>{content.linkLabel}</Cta>}
    >
      <div className="grid gap-gap [grid-template-columns:repeat(auto-fit,minmax(248px,1fr))]">
        {members.map((member, i) => (
          <TeamCard key={member.id} member={member} delay={i * 70} compact />
        ))}
      </div>
    </Section>
  );
}
