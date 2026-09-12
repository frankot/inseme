"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { screeningTestSubmissions } from "@/db/schema";
import type { ActionResult } from "@/lib/action-result";
import { emailLayout, escapeHtml, sendEmail } from "@/lib/email";
import { getSiteContact } from "@/lib/queries/settings";
import { bandForScore, getScreeningTestById } from "@/lib/queries/screening";
import { isBot } from "@/lib/honeypot";
import { allowRequest } from "@/lib/rate-limit";
import {
  screeningResultSchema,
  type ScreeningResultInput,
} from "@/lib/validations/screening";

/**
 * Deliver a screening result by e-mail.
 *
 * What is stored: the test, the e-mail, the consent timestamp, the score and
 * which band it landed in. What is **not** stored: the individual answers. The
 * test promises the visitor they are not recorded, and the table has no column
 * for them — see `src/db/schema/screening-tests.ts`.
 *
 * The score is re-checked against the test's real maximum rather than trusted,
 * and the band is re-derived server-side, so the PDF always matches content the
 * admin actually authored.
 */
export async function sendScreeningResult(
  input: ScreeningResultInput,
): Promise<ActionResult> {
  const parsed = screeningResultSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Sprawdź adres e-mail i zgodę na wysyłkę." };
  }

  // A filled honeypot is a bot. Report success — telling it which field gave it
  // away just teaches the next attempt.
  if (isBot(parsed.data)) return { ok: true };

  if (!(await allowRequest("screening"))) {
    return {
      ok: false,
      error: "Zbyt wiele prób. Odczekaj chwilę albo po prostu zadzwoń.",
    };
  }

  try {
    const test = await getScreeningTestById(parsed.data.testId);
    if (!test) return { ok: false, error: "Ten test jest już niedostępny." };

    const score = Math.min(Math.max(0, parsed.data.score), test.maxScore);
    const band = bandForScore(test.bands, score);
    if (!band) return { ok: false, error: "Nie udało się ustalić wyniku." };

    const [submission] = await db
      .insert(screeningTestSubmissions)
      .values({
        testId: test.id,
        email: parsed.data.email,
        consentAt: new Date(),
        totalScore: score,
        maxScore: test.maxScore,
        resultBandId: band.id,
      })
      .returning({ id: screeningTestSubmissions.id, createdAt: screeningTestSubmissions.createdAt });

    const contact = await getSiteContact();
    const disclaimer =
      test.disclaimerText ??
      "Test ma charakter orientacyjny i nie jest diagnozą. Nie zastępuje rozmowy z terapeutą ani badania lekarskiego.";

    // Rendering the PDF is the one step that can fail on its own. The visitor
    // already has the result on screen, so a failure here must not read as a
    // failed submission — it is logged and the row stays without `emailedAt`.
    let attachment: { filename: string; content: Buffer } | undefined;
    try {
      const { renderScreeningResultPdf } = await import("@/lib/pdf/screening-result");
      const pdf = await renderScreeningResultPdf({
        testTitle: test.title,
        score,
        maxScore: test.maxScore,
        resultTitle: band.resultTitle,
        resultBody: band.resultBody,
        disclaimer,
        phone: contact.phone,
        createdAt: submission.createdAt,
      });
      attachment = { filename: "wynik-testu-insieme.pdf", content: pdf };
    } catch (error) {
      console.error("screening result PDF failed to render", error);
    }

    const delivered = await sendEmail({
      to: parsed.data.email,
      subject: `Twój wynik — ${test.title}`,
      html: emailLayout({
        heading: band.resultTitle,
        body: `
          <p style="margin:0 0 14px;">${escapeHtml(band.resultBody)}</p>
          <p style="margin:0 0 14px;color:#9A9F95;font-size:13px;">Wynik orientacyjny: <strong style="color:#2E3330;">${score} / ${test.maxScore}</strong></p>
          <p style="margin:0 0 6px;">Jeśli chcesz o tym porozmawiać — <strong style="color:#2E3330;">${escapeHtml(contact.phone)}</strong>, dyżur całą dobę. Rozmowa nie zobowiązuje do przyjazdu.</p>
        `,
        footer: escapeHtml(disclaimer),
      }),
      text: [
        band.resultTitle,
        "",
        band.resultBody,
        "",
        `Wynik orientacyjny: ${score} / ${test.maxScore}`,
        "",
        `Jeśli chcesz o tym porozmawiać — ${contact.phone}, dyżur całą dobę.`,
        "",
        disclaimer,
      ].join("\n"),
      attachments: attachment ? [attachment] : undefined,
    });

    if (delivered) {
      await db
        .update(screeningTestSubmissions)
        .set({ emailedAt: new Date() })
        .where(eq(screeningTestSubmissions.id, submission.id));
    }

    return { ok: true };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: "Nie udało się wysłać wyniku. Spróbuj ponownie albo zadzwoń.",
    };
  }
}
