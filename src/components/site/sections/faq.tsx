import { Cta } from "@/components/site/ui/cta";
import { FaqList } from "@/components/site/ui/faq-list";
import { Section } from "@/components/site/ui/section";
import { StickySplit } from "@/components/site/ui/sticky-split";
import { faqDefaults, type FaqContent } from "@/content/home";
import type { FaqEntry } from "@/lib/queries/faq";

/**
 * Published rows of `faq_items`, in the order /admin/faq shows them. Like
 * Zespół it removes itself when there is nothing published, rather than
 * printing a heading over an empty list.
 *
 * The accordion itself is `FaqList`, so /faq can render the full set
 * without this section's heading column repeating the page title.
 */
export function Faq({
  items,
  content = faqDefaults,
  /**
   * Set on the homepage: show only the questions featured in /admin/faq, at
   * most this many. With none featured it falls back to the first ones, so the
   * section never disappears just because nobody ticked the box.
   */
  limit,
}: {
  items: FaqEntry[];
  content?: FaqContent;
  limit?: number;
}) {
  if (items.length === 0) return null;

  const featured = items.filter((item) => item.featured);
  const pool = limit && featured.length > 0 ? featured : items;
  const shown = limit ? pool.slice(0, limit) : pool;
  const hasMore = shown.length < items.length;

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
        <FaqList items={shown} />

        {hasMore && (
          <Cta href={content.href} className="mt-[clamp(22px,2.4vw,32px)]">
            {content.linkLabel}
          </Cta>
        )}
      </StickySplit>
    </Section>
  );
}
