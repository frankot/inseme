import { Cta } from "@/components/site/ui/cta";
import { FaqList } from "@/components/site/ui/faq-list";
import { Section } from "@/components/site/ui/section";
import { StickySplit } from "@/components/site/ui/sticky-split";
import { faqDefaults, type FaqContent } from "@/content/home";
import type { FaqEntry } from "@/lib/queries/faq";

/**
 * The homepage's questions: the ones picked in the CMS (07), or the first ones
 * by order when nothing is picked — see `resolveFaq`. Like Zespół it removes
 * itself when there is nothing published, rather than printing a heading over
 * an empty list.
 *
 * The accordion itself is `FaqList`, so /faq can render the full set
 * without this section's heading column repeating the page title.
 */
export function Faq({
  items,
  content = faqDefaults,
  hasMore = false,
}: {
  items: FaqEntry[];
  content?: FaqContent;
  /** Show the link to /faq — there are questions beyond these. */
  hasMore?: boolean;
}) {
  if (items.length === 0) return null;

  return (
    <Section id="faq" tone="tinted" index={content.index} label={content.eyebrow}>
      <StickySplit
        aside={
          <>
            <h2 className="mb-5 max-w-[13em] text-pretty font-heading text-display-sm text-ink-900">
              {content.title}
            </h2>
            <p className="max-w-[26em] text-pretty text-lead text-ink-500">
              {content.note}
            </p>
          </>
        }
      >
        <FaqList items={items} />

        {hasMore && (
          <Cta href={content.href} className="mt-[clamp(22px,2.4vw,32px)]">
            {content.linkLabel}
          </Cta>
        )}
      </StickySplit>
    </Section>
  );
}
