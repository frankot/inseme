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
  sizes = "(max-width: 1023px) 100vw, 33vw",
  className,
}: {
  member: TeamCardData;
  delay?: number;
  sizes?: string;
  className?: string;
}) {
  return (
    <Reveal as="article" delay={delay} className={cn("min-w-0", className)}>
      <Link
        href={`/zespol/${member.slug}`}
        className="card-surface group flex h-full flex-col"
      >
        <Portrait member={member} sizes={sizes} />

        {/*
          Fixed shape: the role always reserves two lines and is clamped to
          them, so names and links line up across a row no matter how long
          the titles run; the bio likewise holds three. Qualifications and the
          full bio live on /zespol/<slug>.
        */}
        <div className="flex flex-auto flex-col p-[clamp(16px,1.6vw,22px)]">
          <span className="mb-2 line-clamp-2 min-h-[2lh] text-eyebrow uppercase tracking-[0.18em] text-clay-600">
            {member.role}
          </span>

          <h3 className="font-heading text-heading text-ink-900">{member.name}</h3>

          <p className="mt-2.5 line-clamp-3 min-h-[3lh] text-meta text-ink-400">
            {member.shortBio}
          </p>

          <Cta as="span" className="mt-auto pt-4">
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
}: {
  member: TeamCardData;
  sizes: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-stone",
        // A row of 4:5 portraits runs very tall on a wide screen; a square
        // crop takes about a fifth off without cropping faces (object-top).
        "aspect-[4/5] tab:aspect-square",
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
