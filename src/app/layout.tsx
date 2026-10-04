import type { Metadata } from "next";
import { Jost, Work_Sans } from "next/font/google";

import { BASE_OPEN_GRAPH, isIndexable, SITE_URL } from "@/lib/site-url";
import "./globals.css";

/**
 * Display face for headings. `opsz` has to be requested explicitly — next/font
 * ships only `wght` by default, and Bricolage's optical-size default is 14, so
 * without this the 100px hero headline would render with the small-text design.
 */
const display = Jost({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-display",
});

const body = Work_Sans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-body",
});

const DEFAULT_DESCRIPTION =
  "Prywatny ośrodek leczenia uzależnień w Magdalence pod Warszawą. Detoks, terapia stacjonarna, wsparcie dla rodziny. Rozmowa nie zobowiązuje do przyjazdu.";

/**
 * Site-wide defaults. Page titles already carry the brand in their own wording
 * ("… | Insieme", "… — Insieme"), so the template passes them through as-is
 * rather than appending a second one.
 *
 * `openGraph` and `twitter` are replaced, not merged, by a page that sets its
 * own — which is why pages only override `alternates` and leave these alone.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Insieme — ośrodek terapii uzależnień w Magdalence pod Warszawą",
    template: "%s",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: "Insieme",
  // No title/description here: Next fills them from each page's own, which it
  // only does while this object leaves them unset. The image is added by the
  // site layout, from settings.
  openGraph: BASE_OPEN_GRAPH,
  twitter: { card: "summary_large_image" },
  robots: isIndexable ? undefined : { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pl"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
