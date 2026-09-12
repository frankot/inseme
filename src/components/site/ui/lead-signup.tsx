"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { submitLeadSignup } from "@/lib/contact";
import { HONEYPOT_FIELD } from "@/lib/honeypot";
import { leadSignupSchema, type LeadSignupInput } from "@/lib/validations/contact";
import { cn } from "@/lib/utils";

/**
 * The e-mail-capture widget, placeable anywhere. `source` records which
 * placement converted, so the export can show what actually works.
 */
export function LeadSignup({
  source,
  title = "Zostaw adres, odezwiemy się bez pośpiechu.",
  note = "Nie wysyłamy newslettera ani ofert. Piszemy tylko wtedy, gdy mamy coś konkretnego.",
  className,
}: {
  source: string;
  title?: string;
  note?: string;
  className?: string;
}) {
  const [sent, setSent] = useState(false);

  const form = useForm<LeadSignupInput>({
    resolver: zodResolver(leadSignupSchema),
    defaultValues: { email: "", consent: true, source, [HONEYPOT_FIELD]: "" },
  });

  return (
    <div className={cn("border border-line bg-sand p-card", className)}>
      <h3 className="mb-2 max-w-[18em] text-pretty font-heading text-heading text-ink-900">
        {title}
      </h3>
      <p className="mb-4 max-w-[30em] text-[14.5px] leading-[1.68] text-ink-400">{note}</p>

      {sent ? (
        <p className="bg-mist px-4 py-3.5 text-[14.5px] leading-[1.7] text-ink-600">
          Gotowe — adres zapisany. Potwierdzenie jest już w skrzynce.
        </p>
      ) : (
        <form
          noValidate
          className="flex flex-col gap-3"
          onSubmit={form.handleSubmit(async (values) => {
            const result = await submitLeadSignup({ ...values, source });
            if (result.ok) {
              setSent(true);
              return;
            }
            form.setError("email", { message: result.error });
          })}
        >
          <input
            {...form.register(HONEYPOT_FIELD)}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="absolute left-[-9999px] size-px opacity-0"
          />

          <div className="flex flex-wrap gap-2">
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              aria-label="Adres e-mail"
              placeholder="twój@email.pl"
              {...form.register("email")}
              className="min-w-0 flex-auto border border-line bg-cream px-3.5 py-3 text-[15px] text-ink-900 outline-none placeholder:text-ink-200 focus-visible:border-sage-600"
            />
            <button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="link-arrow border border-ink-900 bg-ink-900 px-5 py-3 text-[15px] text-bone transition-colors hover:bg-transparent hover:text-ink-900 disabled:opacity-60"
            >
              <span>{form.formState.isSubmitting ? "Zapisywanie…" : "Zapisz"}</span>
              <span aria-hidden>→</span>
            </button>
          </div>

          <label className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-[1.6] text-ink-300">
            <input
              type="checkbox"
              {...form.register("consent")}
              className="mt-0.5 size-3.5 shrink-0 accent-[var(--sage-600)]"
            />
            <span>
              Zgadzam się na zapisanie adresu i kontakt w sprawie oferty ośrodka.
            </span>
          </label>

          {(form.formState.errors.email || form.formState.errors.consent) && (
            <p role="alert" className="text-[13px] text-destructive">
              {form.formState.errors.email?.message ?? form.formState.errors.consent?.message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
