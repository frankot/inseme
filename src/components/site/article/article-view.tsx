import Link from "next/link";
import { Fragment } from "react";

import { SubpageLayout } from "@/components/site/chrome/subpage-layout";
import { ArticleCard } from "@/components/site/ui/article-card";
import { BlockRenderer } from "@/components/site/ui/block-renderer";
import { Container } from "@/components/site/ui/container";
import { Cta } from "@/components/site/ui/cta";
import { JsonLd } from "@/components/site/ui/json-ld";
import { Reveal } from "@/components/site/ui/reveal";
import { SiteImage } from "@/components/site/ui/site-image";
import { initials } from "@/components/site/ui/team-card";
import type { ArticleSource } from "@/db/schema";
import type { SiteContact } from "@/content/home";
import {
  artykulyPageDefaults as copy,
  formatArticleDate,
} from "@/content/artykuly";
import { getArticlePreview, getReadingMinutes } from "@/lib/article-preview";
import type {
  ArticleCardData,
  ArticleDetail,
  ArticleReviewer,
} from "@/lib/queries/articles";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/structured-data";
import { cn } from "@/lib/utils";

/**
 * One article as the site shows it — /porady/[slug] for a published text and
 * /podglad/artykuly/[id] for a draft, so the preview cannot drift from
 * the real page.
 */
export function ArticleView({
  article,
  related,
  contact,
}: {
  article: ArticleDetail;
  related: ArticleCardData[];
  contact: SiteContact;
}) {
  const date = formatArticleDate(article.publishedAt);
  const minutes = getReadingMinutes(article.body);
  const { points } = getArticlePreview(article.body);

  return (
    <SubpageLayout intro={false}>
      <JsonLd data={articleJsonLd(article)} />
      {/*
        The opening is a spread rather than a banner: title, lead and the review
        trail on one side, the cover at a reading size on the other. A 16:9
        photograph the full width of the page pushed the first line of text
        below the fold, which is the wrong way round for a text people came to
        read.
      */}
      <Container className="pt-section-sm pb-[clamp(40px,5vw,72px)]">
        <Reveal>
          <Breadcrumb
            items={[
              { label: copy.breadcrumbHome, href: "/" },
              { label: copy.breadcrumbLabel, href: "/porady" },
              { label: article.title },
            ]}
          />
        </Reveal>

        <div
          className={cn(
            "mt-[clamp(22px,2.6vw,40px)] grid items-end gap-x-[clamp(32px,5vw,88px)] gap-y-[clamp(28px,3vw,44px)]",
            article.cover && "tab:[grid-template-columns:minmax(0,1.1fr)_minmax(0,0.9fr)]",
          )}
        >
          <Reveal>
            <h1 className="max-w-[16em] text-pretty font-heading text-display text-ink-900">
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="mt-[clamp(16px,1.8vw,26px)] max-w-[34em] text-pretty text-body-lg text-ink-500">
                {article.excerpt}
              </p>
            )}

            <p className="mt-[clamp(24px,2.6vw,36px)] flex flex-wrap gap-x-3 gap-y-1 border-t border-line-strong pt-[14px] text-meta text-ink-300">
              {date && <span className="tabular-nums text-clay-600">{date}</span>}
              {date && <span aria-hidden>·</span>}
              <span>{copy.readingTime(minutes)}</span>
              {article.reviewerName && (
                <>
                  <span aria-hidden>·</span>
                  <span>
                    {copy.reviewerLabel}:{" "}
                    {article.reviewer?.slug ? (
                      <Link
                        href={`/zespol/${article.reviewer.slug}`}
                        className="text-ink-600 underline decoration-line-strong underline-offset-4 transition-colors hover:text-sage-600"
                      >
                        {article.reviewerName}
                      </Link>
                    ) : (
                      <span className="text-ink-600">{article.reviewerName}</span>
                    )}
                  </span>
                </>
              )}
            </p>
          </Reveal>

          {article.cover && (
            <Reveal
              as="figure"
              delay={120}
              className="relative m-0 aspect-[4/3] overflow-hidden bg-stone"
            >
              <SiteImage
                src={article.cover.url}
                alt={article.cover.altText ?? ""}
                fill
                preload
                sizes="(max-width: 767px) 100vw, 40vw"
                className="object-cover saturate-[.92]"
              />
            </Reveal>
          )}
        </div>
      </Container>

      <Container className="pb-section-lg">
        {/*
          The body keeps a reading measure; the column beside it carries what a
          reader needs partway through — where the text is going, and the phone
          number — and stays in view while they scroll, so the right side of a
          wide screen is never just empty cream.
        */}
        <div className="grid items-start gap-x-[clamp(40px,6vw,112px)] gap-y-[clamp(40px,5vw,64px)] desk:[grid-template-columns:minmax(0,1fr)_minmax(260px,320px)]">
          <div className="min-w-0">
            <BlockRenderer blocks={article.body} />

            {/* The review trail the publish gate insists on — named, so a
                reader can see who checked the medical claims and when. A team
                member gets their face, role and qualifications, and a way to
                read who they are. */}
            {article.reviewer ? (
              <ReviewerCard reviewer={article.reviewer} date={date} />
            ) : (
              (article.reviewerName || date) && (
                <Reveal className="mt-[clamp(36px,4vw,64px)] flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3 border-t border-line-strong pt-5 text-[14px] text-ink-300">
                  {article.reviewerName && (
                    <span>
                      {copy.reviewerLabel}:{" "}
                      <span className="text-ink-600">{article.reviewerName}</span>
                    </span>
                  )}
                  {date && <span className="tabular-nums">{date}</span>}
                </Reveal>
              )
            )}

            {article.sources.length > 0 && <SourceList sources={article.sources} />}
          </div>

          <aside data-track="article-sidebar" className="flex flex-col gap-gap desk:sticky desk:top-[calc(var(--nav-h-sticky)+clamp(20px,2.4vw,40px))]">
            {points.length > 0 && (
              <Reveal>
                <p className="mb-[clamp(12px,1.3vw,18px)] text-eyebrow uppercase tracking-[0.2em] text-clay-600">
                  {copy.outlineLabel}
                </p>
                <ol className="m-0 list-none border-t border-line-strong p-0">
                  {points.map((point, i) => (
                    <li
                      key={i}
                      className="flex gap-[clamp(12px,1.4vw,18px)] border-b border-line py-[clamp(11px,1.1vw,14px)]"
                    >
                      <span className="shrink-0 pt-[3px] text-eyebrow tabular-nums tracking-[0.18em] text-clay-400">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-heading text-[clamp(15.5px,1.1vw,17px)] leading-[1.35] tracking-[-0.02em] text-ink-900">
                        {point}
                      </span>
                    </li>
                  ))}
                </ol>
              </Reveal>
            )}

            <Reveal delay={100} className="bg-ink-950 p-[clamp(22px,2vw,28px)]">
              <p className="font-heading text-[clamp(18px,1.4vw,21px)] leading-[1.25] tracking-[-0.02em] text-on-dark">
                {copy.callTitle}
              </p>
              <p className="mt-2 text-meta text-on-dark-muted">{copy.callText}</p>
              <Cta
                href={`tel:${contact.phoneHref}`}
                variant="light"
                className="mt-5 tabular-nums"
              >
                {contact.phone}
              </Cta>
            </Reveal>
          </aside>
        </div>

        {related.length > 0 && (
          <div className="mt-[clamp(56px,7vw,104px)]">
            <div className="mb-[clamp(20px,2.4vw,32px)] flex items-baseline justify-between gap-6">
              <h2 className="font-heading text-heading text-ink-900">{copy.relatedTitle}</h2>
              <Cta href="/porady" className="shrink-0">
                {copy.backLabel}
              </Cta>
            </div>
            <div className="grid gap-gap [grid-template-columns:repeat(auto-fit,minmax(248px,1fr))]">
              {related.map((item, i) => (
                <ArticleCard
                  key={item.id}
                  article={item}
                  delay={i * 70}
                  sizes="(max-width: 640px) 100vw, (max-width: 1023px) 50vw, 33vw"
                />
              ))}
            </div>
          </div>
        )}
      </Container>
    </SubpageLayout>
  );
}

function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav
      aria-label="Ścieżka nawigacji"
      className="flex flex-wrap items-center gap-x-2.5 gap-y-2 text-eyebrow uppercase tracking-[0.22em] text-clay-400"
    >
      <JsonLd data={breadcrumbJsonLd(items)} />
      {items.map((item, i) => (
        <Fragment key={item.label}>
          {i > 0 && (
            <span aria-hidden className="opacity-60">
              /
            </span>
          )}
          {item.href ? (
            <Link href={item.href} className="transition-colors hover:text-sage-600">
              {item.label}
            </Link>
          ) : (
            // The article title is long; the crumb only has to say "you are here".
            <span className="max-w-[28ch] truncate text-clay-600">{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}

/** `https://www.mp.pl/…` → `mp.pl`: enough for a reader to know whose page it is. */
function hostOf(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/**
 * What the text rests on, kept out of the reading flow: small type at the foot
 * of the column, numbered so a reader can find one again, each with the
 * domain beside it so an official source reads as one at a glance.
 */
function SourceList({ sources }: { sources: ArticleSource[] }) {
  return (
    <Reveal
      as="section"
      className="mt-[clamp(36px,4vw,64px)] border-t border-line-strong pt-[clamp(18px,2vw,24px)]"
    >
      <h2 className="text-eyebrow uppercase tracking-[0.2em] text-clay-600">
        {copy.sourcesLabel}
      </h2>
      <ol className="m-0 mt-3 flex list-none flex-col gap-2 p-0">
        {sources.map((source, i) => {
          const host = source.url ? hostOf(source.url) : null;
          return (
            <li key={i} className="flex gap-3 text-[13.5px] leading-[1.5] text-ink-400">
              <span className="w-[1.6em] shrink-0 text-right tabular-nums text-clay-400">
                {i + 1}.
              </span>
              <span className="min-w-0 text-pretty">
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-600 underline decoration-line-strong underline-offset-[3px] transition-colors hover:text-sage-600"
                  >
                    {source.title}
                  </a>
                ) : (
                  <span className="text-ink-600">{source.title}</span>
                )}
                {host && <span className="text-ink-300"> · {host}</span>}
              </span>
            </li>
          );
        })}
      </ol>
    </Reveal>
  );
}

function ReviewerCard({ reviewer, date }: { reviewer: ArticleReviewer; date: string | null }) {
  return (
    <Reveal
      as="figure"
      className="m-0 mt-[clamp(36px,4vw,64px)] flex items-start gap-[clamp(16px,1.8vw,24px)] border-t border-line-strong pt-[clamp(20px,2.2vw,28px)]"
    >
      <div className="relative size-[clamp(64px,6vw,84px)] shrink-0 overflow-hidden bg-stone">
        {reviewer.photo ? (
          <SiteImage
            src={reviewer.photo.url}
            alt=""
            fill
            sizes="84px"
            className="object-cover object-top saturate-[.92]"
          />
        ) : (
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center font-heading text-[22px] text-clay-400"
          >
            {initials(reviewer.name)}
          </span>
        )}
      </div>

      <figcaption className="min-w-0">
        <p className="text-meta text-ink-300">{copy.reviewerLabel}</p>
        <p className="mt-1 font-heading text-[clamp(18px,1.5vw,21px)] leading-tight tracking-[-0.02em] text-ink-900">
          {reviewer.name}
        </p>
        {reviewer.role && <p className="mt-1 text-meta text-ink-500">{reviewer.role}</p>}
        {reviewer.qualifications && (
          <p className="mt-2 max-w-[36em] text-meta text-ink-400">{reviewer.qualifications}</p>
        )}
        <p className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-meta text-ink-300">
          {date && <span className="tabular-nums">{date}</span>}
          {reviewer.slug && (
            <Cta href={`/zespol/${reviewer.slug}`} className="text-meta">
              {copy.reviewerBioLabel}
            </Cta>
          )}
        </p>
      </figcaption>
    </Reveal>
  );
}
