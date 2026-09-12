"use server";

import { db } from "@/db";
import { contactSubmissions, leadSignups } from "@/db/schema";
import type { ActionResult } from "@/lib/action-result";
import { emailLayout, escapeHtml, sendEmail } from "@/lib/email";
import { isBot } from "@/lib/honeypot";
import { getNotifyEmail, getSiteContact } from "@/lib/queries/settings";
import { allowRequest } from "@/lib/rate-limit";
import {
  contactFormSchema,
  leadSignupSchema,
  type ContactFormInput,
  type LeadSignupInput,
} from "@/lib/validations/contact";

/**
 * The public contact form.
 *
 * The message is stored first and notified second: a Resend outage must never
 * lose someone's message, so a failed notification leaves the row in the inbox
 * and only logs. The visitor is told it arrived, because it did.
 */
export async function submitContactForm(input: ContactFormInput): Promise<ActionResult> {
  const parsed = contactFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Sprawdź formularz." };
  }

  if (isBot(parsed.data)) return { ok: true };

  if (!(await allowRequest("contact"))) {
    return {
      ok: false,
      error: "Zbyt wiele wiadomości z tego urządzenia. Zadzwoń — odbierzemy od razu.",
    };
  }

  try {
    const data = parsed.data;
    await db.insert(contactSubmissions).values({
      name: emptyToNull(data.name),
      phone: emptyToNull(data.phone),
      email: emptyToNull(data.email),
      message: data.message,
      preferredContactMethod: data.preferredContactMethod,
      consentAt: new Date(),
    });

    const to = await getNotifyEmail();
    if (to) {
      const rows: [string, string][] = [
        ["Imię", data.name?.trim() || "—"],
        ["Telefon", data.phone?.trim() || "—"],
        ["E-mail", data.email?.trim() || "—"],
        ["Preferowany kontakt", data.preferredContactMethod === "phone" ? "telefon" : "e-mail"],
      ];

      await sendEmail({
        to,
        subject: "Nowa wiadomość z formularza kontaktowego",
        // Replying goes to the person, not to the notification mailbox.
        replyTo: data.email?.trim() || undefined,
        html: emailLayout({
          heading: "Nowa wiadomość ze strony",
          body: `
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px;font-size:14px;">
              ${rows
                .map(
                  ([label, value]) =>
                    `<tr><td style="padding:2px 16px 2px 0;color:#9A9F95;">${label}</td><td style="padding:2px 0;color:#2E3330;">${escapeHtml(value)}</td></tr>`,
                )
                .join("")}
            </table>
            <p style="margin:0;white-space:pre-wrap;">${escapeHtml(data.message)}</p>
          `,
          footer: "Wiadomość czeka w panelu: /admin/contact",
        }),
        text: [
          ...rows.map(([label, value]) => `${label}: ${value}`),
          "",
          data.message,
        ].join("\n"),
      });
    }

    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Nie udało się wysłać wiadomości. Zadzwoń — odbierzemy." };
  }
}

/**
 * The e-mail-capture widget. A repeat address is treated as success rather than
 * an error: the person's intent is satisfied either way, and telling them their
 * address is already on file leaks who has signed up.
 */
export async function submitLeadSignup(input: LeadSignupInput): Promise<ActionResult> {
  const parsed = leadSignupSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Sprawdź adres e-mail." };
  }

  if (isBot(parsed.data)) return { ok: true };

  if (!(await allowRequest("signup"))) {
    return { ok: false, error: "Zbyt wiele prób. Spróbuj za chwilę." };
  }

  try {
    await db.insert(leadSignups).values({
      email: parsed.data.email,
      source: emptyToNull(parsed.data.source),
      consentAt: new Date(),
    });

    const contact = await getSiteContact();
    await sendEmail({
      to: parsed.data.email,
      subject: "Insieme — potwierdzenie zapisu",
      html: emailLayout({
        heading: "Zapisaliśmy Twój adres",
        body: `
          <p style="margin:0 0 14px;">Odezwiemy się tylko wtedy, gdy będziemy mieć coś konkretnego do przekazania. Adres nie trafia do żadnej listy reklamowej.</p>
          <p style="margin:0;">Jeśli chcesz porozmawiać już teraz — <strong style="color:#2E3330;">${escapeHtml(contact.phone)}</strong>, dyżur całą dobę.</p>
        `,
      }),
      text: `Zapisaliśmy Twój adres.\n\nJeśli chcesz porozmawiać już teraz — ${contact.phone}, dyżur całą dobę.`,
    });

    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Nie udało się zapisać adresu. Spróbuj ponownie." };
  }
}

function emptyToNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}
