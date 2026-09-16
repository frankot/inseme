import { Cta } from "@/components/site/ui/cta";
import { Section } from "@/components/site/ui/section";
import { TeamCard } from "@/components/site/ui/team-card";
import { teamTeaserDefaults, type TeamTeaserContent } from "@/content/team";
import type { TeamCardData } from "@/lib/queries/team";

/**
 * Four featured people on the homepage — a full row against the four stat
 * figures and four photographs the bands above it carry, and the same card
 * /zespol prints, so the row is a sample of that page rather than a smaller
 * variant of it. Unlike the other sections this one takes real rows — see
 * `getFeaturedTeam` — and removes itself when there are none, so an
 * unpopulated CMS leaves no gap between Program and Opinie rather than an
 * empty heading.
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
          <TeamCard
            key={member.id}
            member={member}
            delay={i * 70}
            // The same card /zespol prints, at the same size: the teaser used
            // to square off the portrait and drop the biography, which made
            // the homepage row visibly shorter than the roster it links to.
            sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 25vw"
          />
        ))}
      </div>
    </Section>
  );
}
