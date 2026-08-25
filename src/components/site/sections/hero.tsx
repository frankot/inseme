import { SiteHeader } from "@/components/site/chrome/site-header";
import { SiteImage } from "@/components/site/ui/site-image";
import {
  contactDefaults,
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
  contact = contactDefaults,
}: {
  content?: HeroContent;
  contact?: SiteContact;
}) {
  return (
    <section
      id="gora"
      className="relative min-h-svh overflow-hidden bg-ink-950"
    >
      <div className="absolute inset-0 animate-slow-zoom">
        <SiteImage
          src={content.image.src}
          alt={content.image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_56%] saturate-[.84] brightness-[.94]"
        />
      </div>
      <div className="hero-scrim pointer-events-none absolute inset-0" />

      <SiteHeader contact={contact} />

      <div className="relative mx-auto flex min-h-svh max-w-[1440px] flex-col justify-end gap-[clamp(26px,3vw,44px)] px-gutter pt-[calc(var(--nav-h)+clamp(28px,5vh,64px))] pb-[clamp(40px,5vw,72px)]">
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
        </div>

        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6 border-t border-bone/20 pt-[clamp(20px,2.5vw,32px)]">
          <p className="max-w-[27em] text-lead text-on-dark-lead">
            {content.lead}
          </p>
          <a
            href={`tel:${contact.phoneHref}`}
            className="link-arrow bg-bone px-[30px] py-[17px] text-base tabular-nums text-ink-900 transition-colors hover:bg-mist"
          >
            <span>Zadzwoń: {contact.phone}</span>
            <span aria-hidden className="text-[15px]">
              →
            </span>
          </a>
        </div>
      </div>

      <span
        aria-hidden
        className="pointer-events-none absolute bottom-3.5 left-1/2 animate-cue text-sm text-bone"
      >
        ↓
      </span>
    </section>
  );
}
