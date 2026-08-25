import type { Metadata } from "next";
import { Bricolage_Grotesque, Work_Sans } from "next/font/google";
import "./globals.css";

/**
 * Display face for headings. `opsz` has to be requested explicitly — next/font
 * ships only `wght` by default, and Bricolage's optical-size default is 14, so
 * without this the 100px hero headline would render with the small-text design.
 */
const display = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-display",
});

const body = Work_Sans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Insieme",
  description: "Ośrodek terapii uzależnień Insieme.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pl"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
