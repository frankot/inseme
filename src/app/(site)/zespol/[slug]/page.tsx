import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageIntro } from "@/components/site/chrome/page-intro";
import { SubpageLayout } from "@/components/site/chrome/subpage-layout";
import { Container } from "@/components/site/ui/container";
import { Reveal } from "@/components/site/ui/reveal";
import { SiteImage } from "@/components/site/ui/site-image";
import { initials, TeamCard } from "@/components/site/ui/team-card";
import { contactDefaults } from "@/content/home";
import { teamMemberPageDefaults as copy, teamPageDefaults } from "@/content/team";
import {
  getPublishedTeam,
  getTeamMemberBySlug,
  getTeamSlugs,
  type TeamMemberDetail,
} from "@/lib/queries/team";

/**
 * Published members are known at build time, so their pages are prerendered.
 * Anything added later renders on first request and is then cached — the admin
 * actions call `revalidatePath("/zespol/<slug>")` on every edit.
 */
export async function generateStaticParams() {
  const slugs = await getTeamSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/zespol/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const member = await getTeamMemberBySlug(slug);
  if (!member) return { title: copy.notFoundTitle };

  const title = member.role
    ? `${member.name} — ${member.role} | Zespół Insieme`
    : `${member.name} | Zespół Insieme`;

  return {
    title,
    description: member.shortBio ?? teamPageDefaults.metaDescription,
  };
}

export default async function TeamMemberPage(props: PageProps<"/zespol/[slug]">) {
  const { slug } = await props.params;
  const member = await getTeamMemberBySlug(slug);
  if (!member) notFound();

  const others = (await getPublishedTeam()).filter((row) => row.slug !== slug);

  return (
    <SubpageLayout intro={false}>
      <PageIntro
        eyebrow={copy.eyebrow}
        title={member.name}
        breadcrumb={[
          { label: copy.breadcrumbHome, href: "/" },
          { label: copy.breadcrumbTeam, href: "/zespol" },
          { label: member.name },
        ]}
        className="pb-section-sm"
      >
        {member.role && (
          <p className="mt-[clamp(14px,1.6vw,22px)] text-eyebrow uppercase tracking-[0.2em] text-clay-600">
            {member.role}
          </p>
        )}
      </PageIntro>

      <Container className="pb-section-lg">
        <div className="grid items-start gap-[clamp(28px,4vw,72px)] [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))] nav:[grid-template-columns:minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <Reveal className="nav:sticky nav:top-[calc(var(--nav-h-sticky)+32px)]">
            <Portrait member={member} />

            {member.qualifications && (
              <div className="mt-[clamp(20px,2.2vw,30px)] border-t border-line pt-4">
                <span className="text-eyebrow uppercase tracking-[0.2em] text-clay-600">
                  {copy.qualificationsLabel}
                </span>
                <p className="mt-2.5 text-[15px] leading-[1.7] text-ink-500">
                  {member.qualifications}
                </p>
              </div>
            )}
          </Reveal>

          <Reveal delay={70}>
            {member.shortBio && (
              <p className="mb-[clamp(22px,2.4vw,34px)] max-w-[32em] text-pretty font-heading text-[clamp(19px,1.8vw,25px)] leading-[1.4] tracking-[-0.022em] font-light text-ink-900">
                {member.shortBio}
              </p>
            )}

            {member.longBio && (
              // Sanitised on write by `sanitizeRichText` in the save action.
              <div
                className="rich-text max-w-[38em]"
                dangerouslySetInnerHTML={{ __html: member.longBio }}
              />
            )}

            <Cta />
          </Reveal>
        </div>

        {others.length > 0 && <Others members={others} />}
      </Container>
    </SubpageLayout>
  );
}

function Portrait({ member }: { member: TeamMemberDetail }) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-stone">
      {member.photo ? (
        <SiteImage
          src={member.photo.url}
          alt={member.photo.altText ?? member.name}
          fill
          preload
          sizes="(max-width: 960px) 100vw, 40vw"
          className="object-cover object-top saturate-[.92]"
        />
      ) : (
        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center font-heading text-[clamp(56px,7vw,96px)] font-light tracking-[-0.03em] text-clay-300"
        >
          {initials(member.name)}
        </span>
      )}
    </div>
  );
}

function Cta() {
  return (
    <div className="mt-[clamp(32px,4vw,56px)] flex flex-wrap items-end justify-between gap-x-10 gap-y-5 border border-line bg-sand p-[clamp(22px,2.4vw,34px)]">
      <div className="max-w-[26em]">
        <h2 className="mb-2.5 font-heading text-heading text-ink-900">
          {copy.ctaTitle}
        </h2>
        <p className="text-[15px] leading-[1.7] text-ink-400">{copy.ctaBody}</p>
      </div>
      <a
        href={`tel:${contactDefaults.phoneHref}`}
        className="link-arrow bg-ink-900 px-[26px] py-[15px] text-[15px] tabular-nums text-bone transition-colors hover:bg-ink-700"
      >
        <span>Zadzwoń: {contactDefaults.phone}</span>
        <span aria-hidden className="text-[14px]">
          →
        </span>
      </a>
    </div>
  );
}

function Others({ members }: { members: Awaited<ReturnType<typeof getPublishedTeam>> }) {
  return (
    <section className="mt-section border-t border-line pt-[clamp(28px,3.2vw,48px)]">
      <div className="mb-[clamp(20px,2.4vw,32px)] flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3">
        <h2 className="font-heading text-display-sm text-ink-900">
          {copy.othersTitle}
        </h2>
        <Link
          href="/zespol"
          className="link-arrow text-[14.5px] text-sage-600 transition-colors hover:text-sage-700"
        >
          <span>{copy.backLabel}</span>
          <span aria-hidden>→</span>
        </Link>
      </div>

      <div className="grid gap-gap [grid-template-columns:repeat(auto-fit,minmax(212px,1fr))]">
        {members.slice(0, 4).map((other, i) => (
          <TeamCard
            key={other.id}
            member={other}
            delay={i * 70}
            compact
            sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 25vw"
          />
        ))}
      </div>
    </section>
  );
}
