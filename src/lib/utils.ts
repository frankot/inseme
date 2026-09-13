import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The site's fluid type scale (`--text-*` in globals.css). tailwind-merge only
 * knows Tailwind's stock sizes, so it reads these as *text colours* and drops
 * them whenever a real colour follows in the same merge — `cn("text-nav",
 * "text-ink-900")` silently lost the size. Declaring them as font sizes puts
 * them in the right conflict group.
 */
const FONT_SIZES = [
  "display-xl",
  "display",
  "display-sm",
  "quote",
  "heading",
  "nav",
  "mob-link",
  "stat",
  "lead",
  "body-lg",
  "eyebrow",
];

/**
 * The named spacing steps (`--spacing-*` in globals.css). Same story as the
 * type scale: tailwind-merge only knows Tailwind's numeric spacing, so it read
 * `pb-section` as a class it had never heard of and left it sitting beside the
 * `pb-[calc(…)]` it was meant to replace — with the winner decided by stylesheet
 * order rather than by the override. Declaring the steps here puts every
 * padding, margin and gap utility built on them in the right conflict group.
 */
const SPACING = [
  "gutter",
  "section",
  "section-lg",
  "section-sm",
  "card",
  "gap",
  "slab",
  "nav",
  "nav-sticky",
];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: FONT_SIZES }],
    },
    theme: {
      spacing: SPACING,
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
