import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { contactDefaults, heroDefaults } from "@/content/home";

/**
 * The preview card for every page that has no image of its own — what appears
 * when a link is pasted into WhatsApp or Messenger, which is how families pass
 * the site around. Type only for now: the photographs are still placeholders,
 * and a card is cached by those apps long after the file changes.
 *
 * Work Sans comes from the same TTFs the result PDF uses, which are known to
 * carry the Polish diacritics.
 */
export const alt = "Insieme — ośrodek leczenia uzależnień w Magdalence pod Warszawą";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK_950 = "#232823";
const BONE = "#F7F5EF";
const SAGE_300 = "#9DBE8F";
const MUTED = "rgba(247, 245, 239, 0.62)";

export default async function OpengraphImage() {
  const [regular, semibold] = await Promise.all([
    readFile(join(process.cwd(), "public/fonts/WorkSans-Regular.ttf")),
    readFile(join(process.cwd(), "public/fonts/WorkSans-SemiBold.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: INK_950,
          color: BONE,
          fontFamily: "Work Sans",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span style={{ fontSize: 44, fontWeight: 600, letterSpacing: "-0.02em" }}>
            Insieme
          </span>
          <span
            style={{ fontSize: 20, letterSpacing: "0.24em", textTransform: "uppercase", color: MUTED }}
          >
            ośrodek leczenia uzależnień · Magdalenka
          </span>
        </div>

        <span
          style={{
            maxWidth: 900,
            fontSize: 72,
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
          }}
        >
          {heroDefaults.title}
        </span>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            paddingTop: 28,
            borderTop: `1px solid rgba(247, 245, 239, 0.2)`,
            fontSize: 30,
          }}
        >
          <span style={{ width: 10, height: 10, background: SAGE_300 }} />
          <span style={{ fontWeight: 600 }}>{contactDefaults.phone}</span>
          <span style={{ color: MUTED }}>{contactDefaults.addressLine2}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Work Sans", data: regular, style: "normal", weight: 400 },
        { name: "Work Sans", data: semibold, style: "normal", weight: 600 },
      ],
    },
  );
}
