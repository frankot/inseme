import type { Metadata } from "next";

import { SubpageLayout } from "@/components/site/chrome/subpage-layout";
import { Container } from "@/components/site/ui/container";
import { Cta } from "@/components/site/ui/cta";
import { Reveal } from "@/components/site/ui/reveal";
import {
  PRICES_ARE_REAL,
  cennikPageDefaults as copy,
  cennikTeaserDefaults as teaser,
  programPrices,
} from "@/content/cennik";
import { contactDefaults } from "@/content/home";

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
};

/**
 * The page the footer has been promising all along — its "Cennik i pobyt" link
 * pointed at the contact anchor, so the visitor with the single most
 * qualifying question on their mind landed on a form.
 *
 * Everything price-shaped is gated on `PRICES_ARE_REAL`: until the client's
 * list is in, the page still answers "what does it depend on" and "what is
 * included" — which is most of the question — without printing a number nobody
 * approved.
 */
export default function CennikPage() {
  return (
    <SubpageLayout
      eyebrow={copy.eyebrow}
      title={copy.title}
      lead={PRICES_ARE_REAL ? copy.lead : teaser.noPriceLead}
      breadcrumb={[
        { label: copy.breadcrumbHome, href: "/" },
        { label: copy.breadcrumbLabel },
      ]}
    >
      <Container className="pb-section-lg">
        {PRICES_ARE_REAL && (
          <Reveal className="mb-section-sm overflow-x-auto">
            <table className="w-full min-w-[34em] border-collapse text-left">
              <thead>
                <tr className="border-b border-line-warm text-eyebrow uppercase tracking-[0.2em] text-clay-600">
                  <th className="py-3 font-normal">{copy.tableHeadProgram}</th>
                  <th className="py-3 font-normal">{copy.tableHeadLength}</th>
                  <th className="py-3 text-right font-normal">{copy.tableHeadPrice}</th>
                </tr>
              </thead>
              <tbody>
                {programPrices.map((item) => (
                  <tr key={item.id} className="border-b border-line-strong">
                    <td className="py-[clamp(14px,1.5vw,20px)] pr-4 font-heading text-[clamp(17px,1.4vw,20px)] tracking-[-0.02em] text-ink-900">
                      {item.name}
                    </td>
                    <td className="py-[clamp(14px,1.5vw,20px)] pr-4 text-meta text-ink-300">
                      {item.unit}
                    </td>
                    <td className="py-[clamp(14px,1.5vw,20px)] text-right">
                      <span className="font-heading text-[clamp(18px,1.5vw,22px)] tracking-[-0.025em] tabular-nums text-ink-900">
                        {item.priceFrom ?? teaser.noPriceLabel}
                      </span>
                      {item.priceUnit && (
                        <span className="mt-0.5 block text-meta text-ink-300">
                          {item.priceUnit}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        )}

        <div className="grid gap-gap [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
          {programPrices.map((item, i) => (
            <Reveal
              key={item.id}
              as="article"
              delay={i * 70}
              id={item.id}
              className="card-surface flex min-w-0 flex-col gap-4 p-card scroll-mt-[calc(var(--nav-h-sticky)+12px)]"
            >
              <div>
                <h2 className="font-heading text-heading text-ink-900">{item.name}</h2>
                <p className="mt-1.5 text-meta text-ink-300">{item.unit}</p>
              </div>

              {PRICES_ARE_REAL && item.priceFrom && (
                <p className="border-y border-line-warm py-3.5">
                  <span className="font-heading text-[clamp(22px,2vw,28px)] leading-none tracking-[-0.03em] tabular-nums text-ink-900">
                    {item.priceFrom}
                  </span>
                  {item.priceUnit && (
                    <span className="ml-2 text-meta text-ink-300">{item.priceUnit}</span>
                  )}
                </p>
              )}

              <div>
                <h3 className="mb-2.5 text-eyebrow uppercase tracking-[0.2em] text-clay-600">
                  {teaser.includesTitle}
                </h3>
                <ul className="m-0 list-none p-0">
                  {item.includes.map((line) => (
                    <li
                      key={line}
                      className="flex gap-2.5 border-t border-line py-2.5 text-meta text-ink-400"
                    >
                      <span aria-hidden className="mt-[7px] block h-px w-[9px] shrink-0 bg-clay-300" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {item.note && (
                <p className="mt-auto text-meta text-ink-300">{item.note}</p>
              )}
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-section-sm border-t border-line-strong pt-[clamp(24px,3vw,40px)]">
          <h2 className="mb-[clamp(20px,2.2vw,30px)] max-w-[16em] text-pretty font-heading text-display-sm text-ink-900">
            {teaser.dependsTitle}
          </h2>
          <ul className="m-0 grid list-none gap-x-[clamp(24px,3vw,56px)] gap-y-0 p-0 tab:grid-cols-3">
            {teaser.depends.map((item) => (
              <li
                key={item.title}
                className="border-t border-line-warm py-[clamp(14px,1.5vw,20px)]"
              >
                <p className="mb-1.5 text-body tracking-[-0.015em] text-ink-900">
                  {item.title}
                </p>
                <p className="text-pretty text-meta text-ink-400">{item.body}</p>
              </li>
            ))}
          </ul>

          <p className="mt-[clamp(22px,2.4vw,32px)] max-w-[44em] text-body text-ink-400">
            {teaser.note}
          </p>

          <Cta
            href={`tel:${contactDefaults.phoneHref}`}
            variant="solid"
            className="mt-[clamp(20px,2.2vw,30px)]"
          >
            Zapytaj o cenę — {contactDefaults.phone}
          </Cta>
        </Reveal>
      </Container>
    </SubpageLayout>
  );
}
