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

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: FONT_SIZES }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
