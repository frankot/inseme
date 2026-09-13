"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { contactDefaults, type SiteContact } from "@/content/home";
import { submitContactForm } from "@/lib/contact";
import { HONEYPOT_FIELD } from "@/lib/honeypot";
import { contactFormSchema, type ContactFormInput } from "@/lib/validations/contact";
import { cn } from "@/lib/utils";

const FIELD =
  "w-full border border-line-strong bg-cream px-3.5 py-3 text-body text-ink-900 outline-none placeholder:text-ink-200 focus-visible:border-sage-600";

/**
 * Deliberately short. Someone reaching for this form is often reaching for it
 * instead of the phone — every extra required field is a reason to close the
 * tab. Name is optional, and only one of phone/e-mail is needed.
 */
export function ContactForm({
  contact = contactDefaults,
  className,
  tone = "light",
}: {
  contact?: SiteContact;
  className?: string;
  /** `dark` sits on the ink-900 panel in the homepage Kontakt section. */
  tone?: "light" | "dark";
}) {
  const [sent, setSent] = useState(false);
  const dark = tone === "dark";

  const form = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
      preferredContactMethod: "phone",
      consent: true,
      [HONEYPOT_FIELD]: "",
    },
  });

  if (sent) {
    return (
      <div
        className={cn(
          "px-4 py-4 text-body",
          dark ? "bg-on-dark/10 text-on-dark-lead" : "bg-mist text-ink-600",
          className,
        )}
      >
        <p className="mb-1.5 font-heading text-[19px] tracking-[-0.02em]">
          Wiadomość dotarła.
        </p>
        <p>
          Odezwiemy się w ciągu dnia. Jeśli sprawa nie może czekać — {contact.phone}, dyżur
          całą dobę.
        </p>
      </div>
    );
  }

  const errors = form.formState.errors;

  return (
    <form
      noValidate
      className={cn("flex flex-col gap-3", className)}
      onSubmit={form.handleSubmit(async (values) => {
        const result = await submitContactForm(values);
        if (result.ok) {
          setSent(true);
          return;
        }
        form.setError("message", { message: result.error });
      })}
    >
      {/* Honeypot: off-screen rather than display:none — some bots skip hidden fields. */}
      <input
        {...form.register(HONEYPOT_FIELD)}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute left-[-9999px] size-px opacity-0"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <input
          {...form.register("name")}
          className={FIELD}
          placeholder="Imię (opcjonalnie)"
          aria-label="Imię"
          autoComplete="given-name"
        />
        <input
          {...form.register("phone")}
          className={FIELD}
          placeholder="Telefon"
          aria-label="Telefon"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
        />
      </div>

      <input
        {...form.register("email")}
        className={FIELD}
        placeholder="E-mail"
        aria-label="E-mail"
        type="email"
        inputMode="email"
        autoComplete="email"
      />

      <textarea
        {...form.register("message")}
        rows={4}
        className={cn(FIELD, "resize-y")}
        placeholder="Napisz, co się dzieje. Nie musisz podawać nazwiska."
        aria-label="Wiadomość"
      />

      <fieldset className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <legend
          className={cn(
            "mb-1.5 text-meta",
            dark ? "text-on-dark-muted" : "text-ink-300",
          )}
        >
          Jak wolisz, żebyśmy się odezwali?
        </legend>
        {(["phone", "email"] as const).map((method) => (
          <label
            key={method}
            className={cn(
              "flex cursor-pointer items-center gap-2 text-body",
              dark ? "text-on-dark-lead" : "text-ink-600",
            )}
          >
            <input
              type="radio"
              value={method}
              {...form.register("preferredContactMethod")}
              className="size-3.5 accent-[var(--sage-600)]"
            />
            <span>{method === "phone" ? "Telefon" : "E-mail"}</span>
          </label>
        ))}
      </fieldset>

      <label
        className={cn(
          "flex cursor-pointer items-start gap-2.5 text-meta",
          dark ? "text-on-dark-muted" : "text-ink-300",
        )}
      >
        <input
          type="checkbox"
          {...form.register("consent")}
          className="mt-0.5 size-3.5 shrink-0 accent-[var(--sage-600)]"
        />
        <span>
          Zgadzam się na kontakt w sprawie tej wiadomości. Adresu i numeru nie używamy do
          niczego innego.
        </span>
      </label>

      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className={cn(
          "link-arrow self-start px-[clamp(22px,2.2vw,30px)] py-[15px] text-body transition-colors disabled:opacity-60",
          dark
            ? "bg-bone text-ink-900 hover:bg-mist"
            : "bg-ink-900 text-bone hover:bg-ink-700",
        )}
      >
        <span>{form.formState.isSubmitting ? "Wysyłanie…" : "Wyślij wiadomość"}</span>
        <span aria-hidden>→</span>
      </button>

      {(errors.message || errors.phone || errors.email || errors.consent) && (
        <p role="alert" className="text-meta text-destructive">
          {errors.message?.message ??
            errors.phone?.message ??
            errors.email?.message ??
            errors.consent?.message}
        </p>
      )}
    </form>
  );
}
