import { Cta } from "@/components/site/ui/cta";
import { Reveal } from "@/components/site/ui/reveal";
import { Section } from "@/components/site/ui/section";
import { pomagamyDefaults, type PomagamyContent } from "@/content/home";
import { cn } from "@/lib/utils";

/**
 * "W czym pomagamy" — what the centre treats, each row leading to its service
 * page. Straight under the hero: someone who searched for a kind of treatment
 * needs to see their problem named before anything about the phone call.
 *
 * Rows, not cards: Zespół and Opinie are already card grids, and this is a
 * list to scan rather than a set of things to compare.
 *
 * A row with a page is one link. The anchor is the short label ("Odwyk
 * alkoholowy") — the words its target is written for — and its `::after`
 * stretches over the row, so the whole row is the hit area without the whole
 * row becoming the link text. A row without a page stays plain text and does
 * not pretend to be clickable.
 */
export function Pomagamy({ content = pomagamyDefaults }: { content?: PomagamyContent }) {
  return (
    <Section
      id="w-czym-pomagamy"
      tone="tinted"
      index={content.index}
      label={content.eyebrow}
      title={content.title}
      lead={content.lead}
      action={content.link ? <Cta href={content.link.href}>{content.link.label}</Cta> : undefined}
    >
      {/*
        Each row draws its own bottom rule and the first row (both of its cells
        at two columns) the top one — a rule on the list itself would run
        through the gap between the columns.
      */}
      <ul className="m-0 grid list-none gap-x-[clamp(32px,5vw,80px)] p-0 tab:grid-cols-2">
        {content.items.map((item, i) => (
          <Reveal
            as="li"
            key={item.title}
            delay={(i % 2) * 60}
            className="flex border-b border-line-strong first:border-t tab:[&:nth-child(2)]:border-t"
          >
            <div
              className={cn(
                // The bleed lets the hover tint run past the text, as in the price list.
                "relative -mx-[clamp(8px,1vw,16px)] flex min-w-0 flex-1 flex-col px-[clamp(8px,1vw,16px)] py-[clamp(18px,2vw,26px)]",
                item.link && "transition-colors hover:bg-bone",
              )}
            >
              <h3 className="font-heading text-[clamp(18px,1.55vw,22px)] leading-[1.28] tracking-[-0.025em] text-ink-900">
                {item.title}
              </h3>
              <p className="mt-2 max-w-[40em] text-pretty text-meta text-ink-400">{item.body}</p>
              {item.link && (
                <Cta
                  href={item.link.href}
                  // The focus ring goes on the stretched `::after`, so it frames
                  // the row that is clickable rather than the label alone.
                  className="mt-auto self-start pt-3.5 after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-sage-600"
                >
                  {item.link.label}
                </Cta>
              )}
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
