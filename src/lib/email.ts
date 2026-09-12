import "server-only";

import { Resend } from "resend";

import { env } from "@/lib/env";

/**
 * Resend is optional the same way R2 is: without a key the app still scores
 * tests and stores contact messages, it just cannot post anything out. Every
 * caller treats a `false` return as "delivery skipped", never as a failed
 * submission — the visitor already got their answer on screen.
 */
const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export function emailConfigured(): boolean {
  return resend !== null && Boolean(env.RESEND_FROM);
}

export type Attachment = { filename: string; content: Buffer };

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: Attachment[];
}): Promise<boolean> {
  if (!resend || !env.RESEND_FROM) {
    console.warn(`e-mail skipped (Resend not configured): ${options.subject}`);
    return false;
  }

  try {
    const { error } = await resend.emails.send({
      from: env.RESEND_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
      attachments: options.attachments?.map((file) => ({
        filename: file.filename,
        content: file.content,
      })),
    });
    if (error) {
      console.error("Resend rejected the message", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Resend request failed", error);
    return false;
  }
}

/**
 * Minimal branded wrapper. Deliberately plain HTML with inline styles — mail
 * clients ignore stylesheets, and this is read once and thrown away.
 */
export function emailLayout(options: {
  heading: string;
  body: string;
  footer?: string;
}): string {
  return `<!doctype html>
<html lang="pl"><body style="margin:0;padding:24px;background:#F7F5EF;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#2E3330;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#FBFAF6;border:1px solid #E8E4DA;">
    <tr><td style="padding:28px 28px 8px;">
      <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#A08E7B;">Insieme</p>
      <h1 style="margin:0;font-size:21px;line-height:1.25;font-weight:600;color:#232823;">${escapeHtml(options.heading)}</h1>
    </td></tr>
    <tr><td style="padding:12px 28px 24px;font-size:15px;line-height:1.7;color:#4E544C;">${options.body}</td></tr>
    <tr><td style="padding:16px 28px 24px;border-top:1px solid #E8E4DA;font-size:12px;line-height:1.6;color:#9A9F95;">
      ${options.footer ?? "Insieme — ośrodek leczenia uzależnień, Magdalenka."}
    </td></tr>
  </table>
</body></html>`;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
