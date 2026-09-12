import type { Metadata } from "next";

import { SubpageLayout } from "@/components/site/chrome/subpage-layout";
import { Container } from "@/components/site/ui/container";
import { TeamCard } from "@/components/site/ui/team-card";
import { teamPageDefaults } from "@/content/team";
import { getPublishedTeam } from "@/lib/queries/team";

export const metadata: Metadata = {
  title: teamPageDefaults.metaTitle,
  description: teamPageDefaults.metaDescription,
};

export default async function ZespolPage() {
  const members = await getPublishedTeam();

  return (
    <SubpageLayout
      eyebrow={teamPageDefaults.eyebrow}
      title={teamPageDefaults.title}
      lead={teamPageDefaults.lead}
      breadcrumb={[
        { label: "Strona główna", href: "/" },
        { label: "Zespół" },
      ]}
    >
      <Container className="pb-section-lg">
        {members.length === 0 ? (
          <p className="max-w-[34em] border-t border-line pt-[clamp(24px,3vw,40px)] text-body-lg text-ink-300">
            {teamPageDefaults.emptyNote}
          </p>
        ) : (
          <div className="grid gap-gap [grid-template-columns:repeat(auto-fit,minmax(248px,1fr))]">
            {members.map((member, i) => (
              <TeamCard
                key={member.id}
                member={member}
                delay={(i % 4) * 70}
                sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 25vw"
              />
            ))}
          </div>
        )}
      </Container>
    </SubpageLayout>
  );
}
