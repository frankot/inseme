"use client";

import { useEffect } from "react";

import { contactDefaults } from "@/content/home";

/**
 * Last resort: the root layout itself threw. This replaces it entirely, so
 * nothing from it is available — not the fonts, not the stylesheet, not the
 * settings from the database. Plain HTML with inline styles, and the phone
 * number from the code defaults, which cannot fail.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="pl">
      <body
        style={{
          margin: 0,
          minHeight: "100svh",
          display: "grid",
          placeItems: "center",
          padding: 24,
          background: "#F7F5EF",
          color: "#2E3330",
          fontFamily: "-apple-system, Segoe UI, Helvetica, Arial, sans-serif",
        }}
      >
        <main style={{ maxWidth: 480 }}>
          <p style={{ margin: 0, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6E5E4C" }}>
            Insieme
          </p>
          <h1 style={{ margin: "8px 0 12px", fontSize: 28, lineHeight: 1.2 }}>Coś poszło nie tak.</h1>
          <p style={{ margin: "0 0 24px", lineHeight: 1.6, color: "#4E544C" }}>
            Strona nie wczytała się poprawnie. Spróbuj jeszcze raz za chwilę — a jeśli sprawa jest
            pilna, zadzwoń.
          </p>
          <a
            href={`tel:${contactDefaults.phoneHref}`}
            style={{
              display: "inline-block",
              marginRight: 20,
              padding: "14px 24px",
              background: "#232823",
              color: "#FBFAF6",
              textDecoration: "none",
            }}
          >
            Zadzwoń: {contactDefaults.phone}
          </a>
          <button
            type="button"
            onClick={() => retry()}
            style={{ border: 0, background: "none", padding: 0, font: "inherit", color: "#4F6B3C", cursor: "pointer" }}
          >
            Spróbuj ponownie →
          </button>
        </main>
      </body>
    </html>
  );
}
