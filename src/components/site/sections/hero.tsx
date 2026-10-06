import { SiteHeader } from "@/components/site/chrome/site-header";
import { Cta } from "@/components/site/ui/cta";
import { SiteImage } from "@/components/site/ui/site-image";
import {
  heroDefaults,
  type HeroContent,
  type SiteContact,
} from "@/content/home";

/**
 * The transparent header lives inside the hero so it sits on the photograph and
 * scrolls away with it; the compact bar it renders alongside is fixed.
 */
export function Hero({
  content = heroDefaults,
  contact,
}: {
  content?: HeroContent;
  contact: SiteContact;
}) {
  return (
    <section
      id="gora"
      className="relative h-[var(--hero-h)] overflow-hidden bg-ink-950 tab:h-auto tab:min-h-[min(100svh,var(--hero-max))]"
    >
      <div className="absolute inset-0 animate-slow-zoom">
        <SiteImage
          src={content.image.src}
          alt={content.image.alt}
          fill
          preload
          sizes="100vw"
          className="object-cover object-[50%_56%] saturate-[.84] brightness-[.94]"
        />
      </div>
      <div className="hero-scrim pointer-events-none absolute inset-0" />

      <SiteHeader contact={contact} />

      <div
        id="tresc"
        tabIndex={-1}
        className="relative mx-auto flex h-full max-w-[1440px] flex-col justify-end tab:h-auto tab:min-h-[min(100svh,var(--hero-max))] gap-[clamp(20px,1.5vw,24px)] px-gutter pt-[calc(var(--nav-h)+clamp(28px,5vh,64px))] pb-[calc(clamp(40px,5vw,72px)+var(--spacing-slab))] outline-none"
      >
        <div>
          <p className="mb-[clamp(18px,2vw,28px)] flex items-center gap-3.5 text-eyebrow uppercase tracking-[0.22em] text-on-dark-lead text-shadow-nav">
            <span
              aria-hidden
              className="block h-px w-[26px] bg-on-dark-lead/60"
            />
            <span>{content.eyebrow}</span>
          </p>
          <h1 className="max-w-[9.4em] text-balance font-heading text-display-xl text-bone">
            {content.title}
          </h1>
          {content.rpwdl && (
            <p className="mt-[clamp(16px,2.2vw,26px)]  font-heading text-[clamp(12.5px,1vw,15px)] leading-snug text-on-dark-muted">
              {content.rpwdl.statement && (
                <>
                  {content.rpwdl.statement}
                  <br />
                </>
              )}
              {content.rpwdl.label}:{" "}
              <span className="tabular-nums  text-on-dark-sage-2">
                {content.rpwdl.number}
              </span>
            </p>
          )}
        </div>

        {/* The rule spans half the width, from the left edge the text starts on. */}
        <div className="relative flex flex-wrap items-end justify-between gap-x-10 gap-y-6 pt-[clamp(20px,2.5vw,32px)] before:absolute before:left-0 before:top-0 before:h-px before:w-1/2 before:bg-bone/20 desk:pt-10">
          <p className="max-w-[27em] text-lead text-on-dark-lead">
            {content.lead}
          </p>
          <Cta
            href={`tel:${contact.phoneHref}`}
            variant="light"
            className="tabular-nums"
          >
            Zadzwoń: {contact.phone}
          </Cta>
        </div>

        {content.trust.length > 0 && (
          <ul className="m-0 flex list-none flex-wrap gap-x-[clamp(18px,2.4vw,34px)] gap-y-2 p-0 desk:grid desk:grid-cols-[repeat(2,max-content)] desk:gap-x-[clamp(32px,4vw,64px)] text-meta text-on-dark-lead">
            {content.trust.map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <span aria-hidden className="block size-[5px] bg-sage-300" />
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      <span
        aria-hidden
        className="pointer-events-none absolute bottom-[calc(var(--spacing-slab)+14px)] left-1/2 animate-cue text-sm text-bone"
      >
        ↓
      </span>
    </section>
  );
}
