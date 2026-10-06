"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";

import { FieldError } from "@/components/site/ui/field-error";
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
  const id = useId();

  const form = useForm<LeadSignupInput>({
    resolver: zodResolver(leadSignupSchema),
    // Consent starts unticked: under RODO it has to be an action, not a default.
    defaultValues: { email: "", consent: false, source, [HONEYPOT_FIELD]: "" },
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
            form.setError("root.server", { message: result.error });
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
              aria-invalid={form.formState.errors.email ? true : undefined}
              aria-describedby={form.formState.errors.email ? `${id}-email-error` : undefined}
              className="min-w-0 flex-auto border border-line bg-cream px-3.5 py-3 text-[15px] text-ink-900 outline-none placeholder:text-ink-200 focus-visible:border-sage-600 aria-invalid:border-destructive"
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
          <FieldError id={`${id}-email-error`} message={form.formState.errors.email?.message} />

          <label className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-[1.6] text-ink-300">
            <input
              type="checkbox"
              {...form.register("consent")}
              aria-invalid={form.formState.errors.consent ? true : undefined}
              aria-describedby={form.formState.errors.consent ? `${id}-consent-error` : undefined}
              className="mt-0.5 size-3.5 shrink-0 accent-[var(--sage-600)]"
            />
            <span>
              Zgadzam się na zapisanie adresu i kontakt w sprawie oferty ośrodka.{" "}
              <a href="/polityka-prywatnosci" className="underline underline-offset-2 hover:text-sage-600">
                Polityka prywatności
              </a>
            </span>
          </label>

          <FieldError
            id={`${id}-consent-error`}
            message={form.formState.errors.consent?.message}
            className="-mt-1.5 pl-6"
          />
          <FieldError id={`${id}-server-error`} message={form.formState.errors.root?.server?.message} />
        </form>
      )}
    </div>
  );
}
