import type { Metadata } from "next";
import Link from "next/link";

import { SubpageLayout } from "@/components/site/chrome/subpage-layout";
import { CallbackForm } from "@/components/site/ui/callback-form";
import { Container } from "@/components/site/ui/container";
import { Cta } from "@/components/site/ui/cta";
import { Reveal } from "@/components/site/ui/reveal";
import { SiteImage } from "@/components/site/ui/site-image";
import {
  KOSZT_ARTICLE_SLUG,
  cennikPageDefaults as copy,
  type CennikExtra,
} from "@/content/cennik";
import { getArticleBySlug } from "@/lib/queries/articles";
import { getSiteContact } from "@/lib/queries/settings";
import { cn } from "@/lib/utils";

// The article card borrows the cost article's cover, which editors can change.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: { canonical: "/cennik" },
};

const TEXT_LINK = "text-sage-600 underline underline-offset-2 hover:text-sage-700";

/** Keeps "9 000 zł" on one line: no break inside an amount or before "zł". */
const amounts = (text: string) => text.replace(/(\d) (?=\d{3}\b|zł)/g, "$1\u00a0");

/** Each band after the price card opens on the same rule and gap. */
const BAND = "mt-section-sm border-t border-line-strong pt-[clamp(24px,3vw,40px)]";

/**
 * A short version of the article „Ile kosztuje odwyk prywatnie”.
 *
 * The price comes first and never stands alone: the card puts the hours it
 * buys and the hourly figure right beside it. The bands below answer the
 * questions in the order a reader asks them: is that a lot (the comparison
 * with a private practice), what does the money pay for, what costs extra,
 * and how is it paid. The refund rules stay in the article, linked from the
 * payment block.
 *
 * `#terapia` still lands on the price card: the homepage list links to it.
 */
export default async function CennikPage() {
  const { program, compare } = copy;
  const [costArticle, contact] = await Promise.all([
    getArticleBySlug(KOSZT_ARTICLE_SLUG),
    getSiteContact(),
  ]);
  const cover = costArticle?.cover ?? null;

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
          className="card-surface grid gap-x-[clamp(32px,5vw,80px)] gap-y-8 p-card scroll-mt-[calc(var(--nav-h-sticky)+12px)] desk:[grid-template-columns:minmax(0,18rem)_minmax(0,1fr)]"
        >
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="font-heading text-heading text-ink-900">{program.name}</h2>
              <p className="mt-1.5 text-meta tabular-nums text-ink-400">{program.length}</p>
            </div>
            <div className="border-t border-line pt-5">
              <p className="whitespace-nowrap font-heading text-[clamp(44px,4.2vw,60px)] leading-none tracking-[-0.035em] tabular-nums text-ink-900">
                {program.price}
              </p>
              <p className="mt-4 text-body text-ink-900">{program.hours}</p>
              <p className="mt-1 max-w-[24em] text-pretty text-meta text-ink-400">
                {amounts(program.perHour)}
              </p>
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="mb-2.5 text-eyebrow uppercase tracking-[0.2em] text-clay-600">
              {program.includesTitle}
            </h3>
            {/* Eight lines read as a wall in one column; two halve the height. */}
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
            <p className="mt-4 max-w-[46em] border-t border-line pt-4 text-pretty text-meta text-ink-400">
              {program.roomsNote}
            </p>
          </div>
        </Reveal>

        {/*
          The answer to "is that a lot": the same month bought as weekly
          sessions in a private practice. A table, because the two only become
          comparable when they line up row by row.
        */}
        <Reveal
          className={cn(
            BAND,
            "grid gap-x-16 gap-y-6 desk:[grid-template-columns:minmax(0,5fr)_minmax(0,7fr)]",
          )}
        >
          <div>
            <h2 className="max-w-[16em] text-pretty font-heading text-display-sm text-ink-900">
              {copy.compareTitle}
            </h2>
            <p className="mt-4 max-w-[34em] text-pretty text-body text-ink-400">
              {amounts(copy.compareLead)}
            </p>
          </div>
          <div className="min-w-0">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <th scope="col" className="pb-3">
                    <span className="sr-only">Porównanie</span>
                  </th>
                  {compare.columns.map((column, i) => (
                    <th
                      key={column}
                      scope="col"
                      className={cn(
                        "px-[clamp(10px,1.4vw,20px)] pt-3 pb-3 align-bottom text-eyebrow font-normal uppercase leading-[1.4] tracking-[0.2em]",
                        i === 1 ? "bg-bone text-clay-600" : "text-ink-300",
                      )}
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compare.rows.map((row) => (
                  <tr key={row.label} className="border-t border-line">
                    <th
                      scope="row"
                      className="py-3 pr-3 align-top text-meta font-normal text-ink-400"
                    >
                      {row.label}
                    </th>
                    {row.values.map((value, i) => (
                      <td
                        key={i}
                        className={cn(
                          "px-[clamp(10px,1.4vw,20px)] py-3 align-top text-meta tabular-nums tab:text-body",
                          i === 1 ? "bg-bone text-ink-900" : "text-ink-400",
                        )}
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 max-w-[40em] text-pretty text-meta text-ink-300">
              {copy.compareNote}
            </p>
          </div>
        </Reveal>

        <Reveal className={BAND}>
          <div className="mb-[clamp(20px,2.2vw,30px)] grid items-end gap-x-16 gap-y-4 tab:[grid-template-columns:minmax(0,1fr)_minmax(0,1fr)]">
            <h2 className="max-w-[16em] text-pretty font-heading text-display-sm text-ink-900">
              {copy.valueTitle}
            </h2>
            <p className="max-w-[34em] text-pretty text-body text-ink-400">{copy.valueLead}</p>
          </div>
          <ul className="m-0 grid list-none gap-x-[clamp(24px,3vw,56px)] gap-y-0 p-0 tab:grid-cols-2">
            {copy.value.map((item) => (
              <li
                key={item.title}
                className="border-t border-line-warm py-[clamp(14px,1.5vw,20px)]"
              >
                <p className="mb-1.5 text-body tracking-[-0.015em] text-ink-900">{item.title}</p>
                <p className="max-w-[38em] text-pretty text-meta text-ink-400">{item.body}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal
          className={cn(
            BAND,
            "grid gap-x-[clamp(32px,5vw,80px)] gap-y-10 desk:[grid-template-columns:minmax(0,7fr)_minmax(0,5fr)]",
          )}
        >
          <div className="min-w-0">
            <h2 className="mb-[clamp(20px,2.2vw,30px)] max-w-[16em] text-pretty font-heading text-display-sm text-ink-900">
              {copy.extrasTitle}
            </h2>
            {/* A tariff list: amounts line up in one column on the right. */}
            <ul className="m-0 list-none p-0">
              {copy.extras.map((item) => (
                <PriceRow key={item.title} item={item} />
              ))}
            </ul>
          </div>

          {/*
            The same tariff rows as the list beside it: what is paid before the
            stay starts, and when it counts towards the price.
          */}
          <aside className="card-surface self-start p-card">
            <h2 className="mb-4 text-eyebrow uppercase tracking-[0.2em] text-clay-600">
              {copy.paymentTitle}
            </h2>
            <ul className="m-0 list-none p-0">
              {copy.payments.map((item) => (
                <PriceRow key={item.title} item={item} />
              ))}
            </ul>
            <div className="space-y-3 border-t border-line pt-4">
              <p className="text-pretty text-meta text-ink-500">{amounts(copy.paymentNote)}</p>
              <p className="text-pretty text-meta text-ink-500">
                {copy.paymentRules}
                {/* Only link once the article is published; a draft would 404. */}
                {costArticle && (
                  <>
                    {" "}
                    <Link href={copy.articleHref} className={TEXT_LINK}>
                      {copy.paymentRulesLink}
                    </Link>
                    .
                  </>
                )}
              </p>
            </div>
          </aside>
        </Reveal>

        <Reveal
          className={cn(
            BAND,
            "grid items-start gap-x-16 gap-y-4 tab:[grid-template-columns:minmax(0,1fr)_minmax(0,1fr)]",
          )}
        >
          <h2 className="max-w-[16em] text-pretty font-heading text-display-sm text-ink-900">
            {copy.closingTitle}
          </h2>
          <div className="flex flex-col items-start gap-[clamp(20px,2.2vw,30px)]">
            <p className="max-w-[34em] text-pretty text-body-lg text-ink-500">{copy.closingBody}</p>
            <Cta href={`tel:${contact.phoneHref}`} variant="solid" className="tabular-nums">
              {copy.closingCta} — <span className="whitespace-nowrap">{contact.phone}</span>
            </Cta>
            {/* For whoever wants to talk it over at home first, or cannot ring from work. */}
            <CallbackForm
              placement="cennik"
              headingLevel={3}
              className="w-full max-w-[34em] border-t border-line pt-[clamp(20px,2.2vw,30px)]"
            />
          </div>
        </Reveal>

        {/*
          The closing block above is a heading beside text; this one is a
          linked card, so the page does not end on the same layout twice.
        */}
        {costArticle && (
          <Reveal className="mt-section-sm">
            <Link
              href={copy.articleHref}
              className={cn(
                "card-surface group grid overflow-hidden",
                cover && "tab:[grid-template-columns:minmax(0,5fr)_minmax(0,7fr)]",
              )}
            >
              {cover && (
                <div className="relative aspect-[3/2] overflow-hidden bg-stone tab:aspect-auto tab:min-h-[16rem]">
                  <SiteImage
                    src={cover.url}
                    alt={cover.altText ?? ""}
                    fill
                    sizes="(min-width: 768px) 40vw, 100vw"
                    className="object-cover saturate-[.92] transition-transform duration-[900ms] ease-out group-hover:scale-[1.035]"
                  />
                </div>
              )}
              <div className="flex flex-col items-start justify-center gap-4 p-card">
                <span className="text-eyebrow uppercase tracking-[0.2em] text-clay-600">
                  {copy.articleEyebrow}
                </span>
                <h2 className="max-w-[18em] text-pretty font-heading text-display-sm text-ink-900">
                  {costArticle.title}
                </h2>
                <p className="max-w-[34em] text-pretty text-body text-ink-400">{copy.articleBody}</p>
                <Cta as="span" className="mt-1">
                  {copy.articleLinkLabel}
                </Cta>
              </div>
            </Link>
          </Reveal>
        )}

        <p className="mt-5 max-w-[48em] text-pretty text-meta text-ink-400">
          {copy.nfzText}{" "}
          <Link href={copy.nfzHref} className={TEXT_LINK}>
            {copy.nfzLinkLabel}
          </Link>
          .
        </p>
      </Container>
    </SubpageLayout>
  );
}

/** One tariff line: what, the amount on the right, one sentence under it. */
function PriceRow({ item }: { item: CennikExtra }) {
  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-1.5 border-t border-line-warm py-[clamp(14px,1.5vw,20px)]">
      <p className="text-body tracking-[-0.015em] text-ink-900">{item.title}</p>
      <div className="max-w-[10rem] text-right tab:row-span-2">
        {item.amount ? (
          <>
            <p className="whitespace-nowrap font-heading text-heading tabular-nums text-ink-900">
              {item.amount}
            </p>
            {item.amountUnit && <p className="mt-1 text-meta text-ink-400">{item.amountUnit}</p>}
          </>
        ) : (
          <p className="text-meta text-ink-300">{item.noAmount}</p>
        )}
      </div>
      <p className="col-span-full max-w-[38em] text-pretty text-meta text-ink-400 tab:col-span-1">
        {amounts(item.body)}
      </p>
    </li>
  );
}
