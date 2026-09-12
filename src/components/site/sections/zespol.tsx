import Link from "next/link";

import { Container } from "@/components/site/ui/container";
import { Reveal } from "@/components/site/ui/reveal";
import { SectionRule } from "@/components/site/ui/section-rule";
import { TeamCard } from "@/components/site/ui/team-card";
import { teamTeaserDefaults, type TeamTeaserContent } from "@/content/team";
import type { TeamCardData } from "@/lib/queries/team";

/**
 * Three featured people on the homepage. Unlike the other sections this one
 * takes real rows — see `getFeaturedTeam` — and removes itself when there are
 * none, so an unpopulated CMS leaves no gap between Ośrodek and Pierwszy
 * kontakt rather than an empty heading.
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
    <section id="zespol" className="scroll-mt-[calc(var(--nav-h-sticky)+12px)]">
      <Container className="pt-section pb-section-sm">
        <SectionRule
          index={content.index}
          label={content.eyebrow}
          className="mb-[clamp(28px,3.2vw,48px)]"
        />

        <div className="mb-[clamp(28px,3.2vw,48px)] flex flex-wrap items-end justify-between gap-x-16 gap-y-6">
          <Reveal className="flex-[1_1_22em]">
            <h2 className="mb-5 max-w-[15em] text-pretty font-heading text-display text-ink-900">
              {content.title}
            </h2>
            <p className="max-w-[34em] text-pretty text-body-lg text-ink-500">
              {content.lead}
            </p>
          </Reveal>

          <Reveal className="shrink-0">
            <Link
              href={content.href}
              className="link-arrow text-[14.5px] text-sage-600 transition-colors hover:text-sage-700"
            >
              <span>{content.linkLabel}</span>
              <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>

        <div className="grid gap-gap [grid-template-columns:repeat(auto-fit,minmax(248px,1fr))]">
          {members.map((member, i) => (
            <TeamCard key={member.id} member={member} delay={i * 70} compact />
          ))}
        </div>
      </Container>
    </section>
  );
}
