import { Cta } from "@/components/site/ui/cta";
import { Reveal } from "@/components/site/ui/reveal";
import { Section } from "@/components/site/ui/section";
import { opinieDefaults, type OpinieContent, type Review } from "@/content/opinie";

/**
 * Three reviews, quoted from the Google profile.
 *
 * It replaces the single anonymous pull quote the page used to carry. One quote
 * nobody can check is decoration; three attributed ones on a profile the reader
 * can open themselves are evidence — which is what a family comparing ośrodki
 * is actually looking for.
 *
 * Removes itself when there is nothing to quote, like Zespół and Artykuły.
 */
export function Opinie({
  content = opinieDefaults,
}: {
  content?: OpinieContent;
}) {
  if (content.reviews.length === 0) return null;

  const hasAggregate = content.rating != null && content.count != null;

  return (
    <Section
      id="opinie"
      tone="dark"
      index={content.index}
      label={content.eyebrow}
      title={content.title}
      lead={content.lead}
      action={
        content.profileUrl ? (
          <Cta
            href={content.profileUrl}
            variant="quiet-on-dark"
            target="_blank"
            rel="noopener"
          >
            {content.linkLabel}
          </Cta>
        ) : undefined
      }
    >
      {hasAggregate && (
        <Reveal className="mb-gap flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-white/12 pb-[clamp(16px,1.8vw,24px)]">
          <span className="font-heading text-[clamp(26px,2.4vw,34px)] leading-none tracking-[-0.03em] tabular-nums text-on-dark">
            {content.rating?.toFixed(1).replace(".", ",")}
          </span>
          <Stars rating={Math.round(content.rating ?? 0)} />
          <span className="text-meta text-on-dark-faint">
            {content.count} opinii w Google
          </span>
        </Reveal>
      )}

      <div className="grid gap-gap [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
        {content.reviews.map((review, i) => (
          <ReviewCard key={review.author + review.date} review={review} delay={i * 70} />
        ))}
      </div>

      <p className="mt-[clamp(18px,2vw,26px)] text-meta text-on-dark-faint">
        {content.sourceNote}
      </p>
    </Section>
  );
}

function ReviewCard({ review, delay }: { review: Review; delay: number }) {
  return (
    <Reveal
      as="figure"
      delay={delay}
      className="m-0 flex min-w-0 flex-col gap-5 border border-white/12 bg-white/[0.045] p-card"
    >
      <Stars rating={review.rating} />

      <blockquote className="m-0 flex-auto">
        <p className="text-pretty text-body text-on-dark-lead">„{review.body}”</p>
      </blockquote>

      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-white/12 pt-4 text-meta">
        <span className="text-on-dark">{review.author}</span>
        <time dateTime={review.date} className="text-on-dark-faint tabular-nums">
          {formatReviewDate(review.date)}
        </time>
      </figcaption>
    </Reveal>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span
      className="flex items-center gap-1"
      role="img"
      aria-label={`Ocena ${rating} na 5`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          aria-hidden
          className={n <= rating ? "text-sage-300" : "text-on-dark-faint/35"}
        >
          ★
        </span>
      ))}
    </span>
  );
}

/** "2026-07-18" → "lipiec 2026" — the month is enough, and the day is noise. */
function formatReviewDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("pl-PL", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
