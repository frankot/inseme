import type { Metadata } from "next";
import Link from "next/link";

import { SubpageLayout } from "@/components/site/chrome/subpage-layout";
import { Container } from "@/components/site/ui/container";
import { Cta } from "@/components/site/ui/cta";
import { Reveal } from "@/components/site/ui/reveal";
import { SiteImage } from "@/components/site/ui/site-image";
import { cennikPageDefaults as copy } from "@/content/cennik";
import { NFZ_ARTICLE_SLUG } from "@/content/artykul-nfz";
import { contactDefaults } from "@/content/home";
import { getArticleBySlug } from "@/lib/queries/articles";
import { cn } from "@/lib/utils";

// The NFZ card borrows the article's cover, which editors can change.
export const revalidate = 300;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: { canonical: "/cennik" },
};

/**
 * One program, what its price covers, and what can move it.
 *
 * The page used to be four price cards — detoks, terapia, rodzina, po pobycie.
 * Detoks is not run here and the rest are parts of the one stay, so the client's
 * copy describes a single 28-day program instead; the anchors the homepage list
 * links to (`/cennik#detoks` etc.) now land on the top of the page, except
 * `#terapia`, which the program block keeps.
 */
export default async function CennikPage() {
  const { program } = copy;
  const nfzCover = (await getArticleBySlug(NFZ_ARTICLE_SLUG))?.cover ?? null;

  return (
    <SubpageLayout
      eyebrow={copy.eyebrow}
      title={copy.title}
      lead={
        <>
          {copy.lead}
          <span className="mt-4 block text-body text-ink-900">{copy.freeCall}</span>
        </>
      }
      breadcrumb={[
        { label: copy.breadcrumbHome, href: "/" },
        { label: copy.breadcrumbLabel },
      ]}
    >
      <Container className="pb-section-lg">
        <Reveal
          as="article"
          id={program.id}
          className="card-surface grid gap-x-[clamp(32px,5vw,80px)] gap-y-6 p-card scroll-mt-[calc(var(--nav-h-sticky)+12px)] desk:[grid-template-columns:minmax(0,16rem)_minmax(0,1fr)]"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 desk:flex-col desk:justify-start">
            <h2 className="font-heading text-heading text-ink-900">{program.name}</h2>
            <p className="font-heading text-[clamp(30px,3.2vw,44px)] leading-none tracking-[-0.03em] tabular-nums text-ink-900">
              {program.length}
            </p>
          </div>

          <div className="min-w-0">
            <h3 className="mb-2.5 text-eyebrow uppercase tracking-[0.2em] text-clay-600">
              {program.includesTitle}
            </h3>
            {/* Nine lines read as a wall in one column; two halve the height. */}
            <ul className="m-0 grid list-none gap-x-[clamp(24px,3vw,48px)] p-0 tab:grid-cols-2">
              {program.includes.map((line) => (
                <li
                  key={line}
                  className="flex gap-2.5 border-t border-line py-2.5 text-meta text-ink-400"
                >
                  <span aria-hidden className="mt-[7px] block h-px w-[9px] shrink-0 bg-clay-300" />
                  <span className="first-letter:uppercase">{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal className="mt-section-sm border-t border-line-strong pt-[clamp(24px,3vw,40px)]">
          <h2 className="mb-[clamp(20px,2.2vw,30px)] max-w-[16em] text-pretty font-heading text-display-sm text-ink-900">
            {copy.dependsTitle}
          </h2>
          <ul className="m-0 grid list-none gap-x-[clamp(24px,3vw,56px)] gap-y-0 p-0 tab:grid-cols-2">
            {copy.depends.map((item) => (
              <li
                key={item.title}
                className="border-t border-line-warm py-[clamp(14px,1.5vw,20px)]"
              >
                <p className="mb-1.5 text-body tracking-[-0.015em] text-ink-900">
                  {item.title}
                </p>
                <p className="max-w-[38em] text-pretty text-meta text-ink-400">{item.body}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-section-sm grid items-start gap-x-16 gap-y-4 border-t border-line-strong pt-[clamp(24px,3vw,40px)] tab:[grid-template-columns:minmax(0,1fr)_minmax(0,1fr)]">
          <h2 className="max-w-[16em] text-pretty font-heading text-display-sm text-ink-900">
            {copy.closingTitle}
          </h2>
          <div className="flex flex-col items-start gap-[clamp(20px,2.2vw,30px)]">
            <p className="max-w-[34em] text-pretty text-body-lg text-ink-500">{copy.closingBody}</p>
            <Cta
              href={`tel:${contactDefaults.phoneHref}`}
              variant="solid"
              className="tabular-nums"
            >
              {copy.closingCta} — {contactDefaults.phone}
            </Cta>
          </div>
        </Reveal>

        {/*
          The closing block above is a heading beside text; this one is a
          linked card, so the page does not end on the same layout twice.
        */}
        <Reveal className="mt-section-sm">
          <Link
            href={copy.nfzHref}
            className={cn(
              "card-surface group grid overflow-hidden",
              nfzCover && "tab:[grid-template-columns:minmax(0,5fr)_minmax(0,7fr)]",
            )}
          >
            {nfzCover && (
              <div className="relative aspect-[3/2] overflow-hidden bg-stone tab:aspect-auto tab:min-h-[16rem]">
                <SiteImage
                  src={nfzCover.url}
                  alt={nfzCover.altText ?? ""}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover saturate-[.92] transition-transform duration-[900ms] ease-out group-hover:scale-[1.035]"
                />
              </div>
            )}
            <div className="flex flex-col items-start justify-center gap-4 p-card">
              <span className="text-eyebrow uppercase tracking-[0.2em] text-clay-600">
                {copy.nfzEyebrow}
              </span>
              <h2 className="max-w-[16em] text-pretty font-heading text-display-sm text-ink-900">
                {copy.nfzTitle}
              </h2>
              <p className="max-w-[34em] text-pretty text-body text-ink-400">{copy.nfzBody}</p>
              <Cta as="span" className="mt-1">
                {copy.nfzLinkLabel}
              </Cta>
            </div>
          </Link>
        </Reveal>
      </Container>
    </SubpageLayout>
  );
}
