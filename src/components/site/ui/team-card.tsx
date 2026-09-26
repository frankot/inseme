import Link from "next/link";

import { Cta } from "@/components/site/ui/cta";
import { Reveal } from "@/components/site/ui/reveal";
import { SiteImage } from "@/components/site/ui/site-image";
import type { TeamCardData } from "@/lib/queries/team";
import { cn } from "@/lib/utils";

/**
 * One person, on the homepage teaser and on /zespol alike. Follows the card
 * grammar the rest of the site uses — square corners, hairline borders, a
 * photograph that drifts on hover, an arrow link that opens up.
 */
export function TeamCard({
  member,
  delay = 0,
  /** Teaser card: drops the biography and squares off the portrait on desktop. */
  compact = false,
  sizes = "(max-width: 1023px) 100vw, 33vw",
  className,
}: {
  member: TeamCardData;
  delay?: number;
  compact?: boolean;
  sizes?: string;
  className?: string;
}) {
  return (
    <Reveal as="article" delay={delay} className={cn("min-w-0", className)}>
      <Link
        href={`/zespol/${member.slug}`}
        className="card-surface group flex h-full flex-col"
      >
        <Portrait member={member} sizes={sizes} compact={compact} />

        <div className="flex flex-auto flex-col p-[clamp(18px,1.8vw,26px)]">
          {member.role && (
            <span className="mb-2.5 text-eyebrow uppercase tracking-[0.18em] text-clay-600">
              {member.role}
            </span>
          )}

          <h3 className="font-heading text-heading text-ink-900">{member.name}</h3>

          {member.qualifications && (
            <p className="mt-2 text-meta text-ink-300">{member.qualifications}</p>
          )}

          {!compact && member.shortBio && (
            <p className="mt-3.5 text-body text-ink-400">{member.shortBio}</p>
          )}

          <Cta as="span" className="mt-auto pt-5">
            Poznaj
          </Cta>
        </div>
      </Link>
    </Reveal>
  );
}

function Portrait({
  member,
  sizes,
  compact,
}: {
  member: TeamCardData;
  sizes: string;
  compact: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-stone",
        // A teaser row of three or four 4:5 portraits runs very tall on a wide
        // screen; square crops take about a fifth off without cropping faces.
        // The roster keeps the full 4:5 — there the photograph is the content.
        compact ? "aspect-[4/5] tab:aspect-square" : "aspect-[4/5]",
      )}
    >
      {member.photo ? (
        <SiteImage
          src={member.photo.url}
          alt={member.photo.altText ?? member.name}
          fill
          sizes={sizes}
          className="object-cover object-top saturate-[.85] brightness-[.9] transition-all duration-[400ms] ease-out group-hover:scale-[1.035] group-hover:saturate-100 group-hover:brightness-100"
        />
      ) : (
        // No photograph yet: initials rather than an empty grey rectangle.
        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center bg-mist font-heading text-[clamp(22px,2vw,28px)] font-light tracking-[0.08em] text-clay-400"
        >
          {initials(member.name)}
        </span>
      )}
    </div>
  );
}

/** "Anna Kowalska" → "AK"; a single name gives a single letter. */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
