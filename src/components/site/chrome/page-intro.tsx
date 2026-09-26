import Link from "next/link";
import { Fragment, type ReactNode } from "react";

import { Container } from "@/components/site/ui/container";
import { Reveal } from "@/components/site/ui/reveal";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

/**
 * The opening block of every subpage, built to the same shape as the homepage's
 * section masthead (see `Section`): the eyebrow line first, then the title on
 * the left with the lead opposite it. A subpage puts a breadcrumb where the
 * homepage puts its numeral, so the two read as the same grid.
 *
 * The h1 takes the step above a section's h2, which is the only difference.
 */
export function PageIntro({
  eyebrow,
  title,
  lead,
  breadcrumb,
  className,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  breadcrumb?: Crumb[];
  className?: string;
  /** Anything that belongs under the lead — a CTA, a note, a filter row. */
  children?: ReactNode;
}) {
  return (
    <Container className={cn("pt-section-sm pb-section", className)}>
      <Reveal>
        {/*
          A breadcrumb already ends on the page's own name, so it stands in for
          the eyebrow rather than being printed beside it — otherwise /zespol
          opens on "ZESPÓŁ / ZESPÓŁ".
        */}
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2 text-eyebrow uppercase tracking-[0.22em] text-clay-400">
          {breadcrumb?.length ? (
            <Breadcrumb items={breadcrumb} />
          ) : (
            <span className="text-clay-600">{eyebrow}</span>
          )}
        </div>

        <div className="mt-[clamp(18px,2vw,28px)] flex flex-wrap items-start justify-between gap-x-[clamp(32px,5vw,80px)] gap-y-6 tab:flex-nowrap">
          <h1 className="max-w-[14em] flex-[1_1_22rem] text-pretty font-heading text-display text-ink-900">
            {title}
          </h1>

          {(lead || children) && (
            <div className="flex flex-[0_1_26rem] flex-col items-start gap-4">
              {lead && (
                <p className="max-w-[34em] text-pretty text-lead text-ink-500">
                  {lead}
                </p>
              )}
              {children}
            </div>
          )}
        </div>
      </Reveal>
    </Container>
  );
}

function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Ścieżka nawigacji" className="flex items-center gap-2.5">
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
            <span className="text-clay-600">{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
