import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";

import { SubpageLayout } from "@/components/site/chrome/subpage-layout";
import { ArticleCard } from "@/components/site/ui/article-card";
import { BlockRenderer } from "@/components/site/ui/block-renderer";
import { Container } from "@/components/site/ui/container";
import { Cta } from "@/components/site/ui/cta";
import { Reveal } from "@/components/site/ui/reveal";
import { SiteImage } from "@/components/site/ui/site-image";
import {
  artykulyPageDefaults as copy,
  formatArticleDate,
} from "@/content/artykuly";
import { contactDefaults } from "@/content/home";
import { getArticlePreview, getReadingMinutes } from "@/lib/article-preview";
import {
  getArticleBySlug,
  getArticleSlugs,
  getRelatedArticles,
} from "@/lib/queries/articles";
import { cn } from "@/lib/utils";

/**
 * Published articles are known at build time, so they are prerendered; anything
 * added later renders on first request. Both are refreshed on the same five
 * minute window as the homepage teaser.
 */
export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/artykuly/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: copy.metaTitle };

  return {
    title: article.metaTitle ?? `${article.title} — Poradnik Insieme`,
    description: article.metaDescription ?? article.excerpt ?? copy.metaDescription,
  };
}

export default async function ArticlePage(props: PageProps<"/artykuly/[slug]">) {
  const { slug } = await props.params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const related = await getRelatedArticles(slug);
  const date = formatArticleDate(article.publishedAt);
  const minutes = getReadingMinutes(article.body);
  const { points } = getArticlePreview(article.body);

  return (
    <SubpageLayout intro={false}>
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
              { label: copy.breadcrumbLabel, href: "/artykuly" },
              { label: article.title },
            ]}
          />
        </Reveal>

        <div
          className={cn(
            "mt-[clamp(22px,2.6vw,40px)] grid items-end gap-x-[clamp(32px,5vw,88px)] gap-y-[clamp(28px,3vw,44px)]",
            article.cover && "nav:[grid-template-columns:minmax(0,1.1fr)_minmax(0,0.9fr)]",
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
              {article.authorReviewer && (
                <>
                  <span aria-hidden>·</span>
                  <span>
                    {copy.reviewerLabel}:{" "}
                    <span className="text-ink-600">{article.authorReviewer}</span>
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
                priority
                sizes="(max-width: 960px) 100vw, 40vw"
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
        <div className="grid items-start gap-x-[clamp(40px,6vw,112px)] gap-y-[clamp(40px,5vw,64px)] nav:[grid-template-columns:minmax(0,1fr)_minmax(260px,320px)]">
          <div className="min-w-0">
            <BlockRenderer blocks={article.body} />

            {/* The review trail the publish gate insists on — named, so a
                reader can see who checked the medical claims and when. */}
            {(article.authorReviewer || date) && (
              <Reveal className="mt-[clamp(36px,4vw,64px)] flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3 border-t border-line-strong pt-5 text-[14px] text-ink-300">
                {article.authorReviewer && (
                  <span>
                    {copy.reviewerLabel}:{" "}
                    <span className="text-ink-600">{article.authorReviewer}</span>
                  </span>
                )}
                {date && <span className="tabular-nums">{date}</span>}
              </Reveal>
            )}
          </div>

          <aside className="flex flex-col gap-gap nav:sticky nav:top-[calc(var(--nav-h-sticky)+clamp(20px,2.4vw,40px))]">
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
                href={`tel:${contactDefaults.phoneHref}`}
                variant="light"
                className="mt-5 tabular-nums"
              >
                {contactDefaults.phone}
              </Cta>
            </Reveal>
          </aside>
        </div>

        {related.length > 0 && (
          <div className="mt-[clamp(56px,7vw,104px)]">
            <div className="mb-[clamp(20px,2.4vw,32px)] flex items-baseline justify-between gap-6">
              <h2 className="font-heading text-heading text-ink-900">{copy.relatedTitle}</h2>
              <Cta href="/artykuly" className="shrink-0">
                {copy.backLabel}
              </Cta>
            </div>
            <div className="grid gap-gap [grid-template-columns:repeat(auto-fit,minmax(248px,1fr))]">
              {related.map((item, i) => (
                <ArticleCard
                  key={item.id}
                  article={item}
                  delay={i * 70}
                  sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
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
