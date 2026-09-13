import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Every call to action on the site, at one size.
 *
 * `solid` and `light` are the same button on opposite grounds; `quiet` is the
 * inline arrow link the cards and section heads end on. They used to be
 * hand-built at each call site, which is how the page ended up with two button
 * paddings and four sizes of the same arrow link.
 */
export type CtaVariant = "solid" | "light" | "quiet" | "quiet-on-dark";

const VARIANTS: Record<CtaVariant, string> = {
  solid:
    "bg-ink-900 px-[clamp(22px,2.2vw,30px)] py-[15px] text-body text-bone hover:bg-ink-700",
  light:
    "bg-bone px-[clamp(22px,2.2vw,30px)] py-[15px] text-body text-ink-900 hover:bg-mist",
  quiet: "text-body text-sage-600 hover:text-sage-700",
  "quiet-on-dark": "text-body text-on-dark-sage hover:text-on-dark",
};

export function Cta({
  href,
  variant = "quiet",
  children,
  className,
  /**
   * A card whose whole surface is already a link ends on a Cta that must not
   * be a second link — it renders as a span and takes the hover from the card.
   */
  as,
  ...rest
}: {
  href?: string;
  variant?: CtaVariant;
  children: ReactNode;
  className?: string;
  as?: "span";
  target?: string;
  rel?: string;
}) {
  const content = (
    <>
      <span>{children}</span>
      <span aria-hidden className="text-[0.92em]">
        →
      </span>
    </>
  );

  const classes = cn(
    "link-arrow transition-colors",
    VARIANTS[variant],
    // Inside a linked card the hover lives on the card, not on the span.
    as === "span" &&
      variant === "quiet" &&
      "group-hover:text-sage-700 hover:text-sage-700",
    className,
  );

  if (as === "span" || !href) {
    return <span className={classes}>{content}</span>;
  }

  // `tel:`, `mailto:` and in-page anchors are not routes — Link would only get
  // in the way of them.
  const external = /^(tel:|mailto:|https?:|#)/.test(href);

  if (external) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {content}
    </Link>
  );
}
