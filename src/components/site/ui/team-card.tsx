import Link from "next/link";

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
  /** The teaser drops the biography; the roster keeps it. */
  compact = false,
  sizes = "(max-width: 960px) 100vw, 33vw",
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
        className="group flex h-full flex-col border border-line bg-bone transition-colors hover:border-line-warm"
      >
        <Portrait member={member} sizes={sizes} />

        <div className="flex flex-auto flex-col p-[clamp(18px,1.8vw,26px)]">
          {member.role && (
            <span className="mb-2.5 text-eyebrow uppercase tracking-[0.18em] text-clay-600">
              {member.role}
            </span>
          )}

          <h3 className="font-heading text-heading text-ink-900">{member.name}</h3>

          {member.qualifications && (
            <p className="mt-2 text-[13.5px] leading-[1.6] text-ink-300">
              {member.qualifications}
            </p>
          )}

          {!compact && member.shortBio && (
            <p className="mt-3.5 text-[15px] leading-[1.68] text-ink-400">
              {member.shortBio}
            </p>
          )}

          <span className="link-arrow mt-auto pt-5 text-[14.5px] text-sage-600 transition-colors group-hover:text-sage-700">
            <span>Poznaj</span>
            <span aria-hidden>→</span>
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

function Portrait({
  member,
  sizes,
}: {
  member: TeamCardData;
  sizes: string;
}) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-stone">
      {member.photo ? (
        <SiteImage
          src={member.photo.url}
          alt={member.photo.altText ?? member.name}
          fill
          sizes={sizes}
          className="object-cover object-top saturate-[.92] transition-transform duration-[900ms] ease-out group-hover:scale-[1.035]"
        />
      ) : (
        // No photograph yet: initials rather than an empty grey rectangle.
        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center font-heading text-[clamp(38px,4.5vw,60px)] font-light tracking-[-0.03em] text-clay-300"
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
