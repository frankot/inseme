import Link from "next/link";
import { Fragment, type ReactNode } from "react";

import { Container } from "@/components/site/ui/container";
import { Reveal } from "@/components/site/ui/reveal";
import { SectionRule } from "@/components/site/ui/section-rule";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

/**
 * The opening block of every subpage: the same hairline rule the homepage
 * sections use, but with a breadcrumb where the homepage puts its numeral,
 * followed by the page title and a lead paragraph.
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
    <Container className={cn("pt-section-sm pb-section-sm", className)}>
      <SectionRule
        index={breadcrumb?.length ? <Breadcrumb items={breadcrumb} /> : undefined}
        label={eyebrow}
        // The rule's own top margin assumes a section mid-page; here it sits
        // directly under the header, so it is reset.
        className="mt-0 mb-[clamp(28px,3.2vw,48px)]"
      />

      <Reveal>
        <h1 className="max-w-[14em] text-pretty font-heading text-display text-ink-900">
          {title}
        </h1>
        {lead && (
          <p className="mt-[clamp(18px,2vw,28px)] max-w-[34em] text-pretty text-body-lg text-ink-500">
            {lead}
          </p>
        )}
        {children}
      </Reveal>
    </Container>
  );
}

function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Ścieżka nawigacji" className="flex items-center gap-2">
      {items.map((item, i) => (
        <Fragment key={item.label}>
          {i > 0 && (
            <span aria-hidden className="text-clay-300">
              /
            </span>
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="uppercase tracking-[0.22em] transition-colors hover:text-sage-600"
            >
              {item.label}
            </Link>
          ) : (
            <span className="uppercase tracking-[0.22em]">{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
