"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import { useId, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { useSiteContact } from "@/components/site/chrome/site-settings";
import { FieldError } from "@/components/site/ui/field-error";
import { CALLBACK_DEFAULTS } from "@/content/callback";
import { track } from "@/lib/analytics";
import { submitCallbackRequest } from "@/lib/contact";
import { HONEYPOT_FIELD } from "@/lib/honeypot";
import { cn } from "@/lib/utils";
import {
  CALLBACK_TIMES,
  callbackRequestSchema,
  type CallbackRequestInput,
  type CallbackTime,
} from "@/lib/validations/contact";

const TIME_LABELS: Record<CallbackTime, string> = {
  asap: "Jak najszybciej",
  morning: "Rano",
  afternoon: "Po południu",
  evening: "Wieczorem",
};

const FIELD = {
  light:
    "w-full border border-line-strong bg-cream px-3.5 py-3 text-body text-ink-900 outline-none focus-visible:border-sage-600 aria-invalid:border-destructive",
  dark: "w-full border border-white/15 bg-white/[0.06] px-3.5 py-3 text-body text-on-dark outline-none focus-visible:border-sage-300 aria-invalid:border-clay-300",
};

/**
 * "Poproś o telefon" — for the reader who is not ready to ring: at work, at
 * night, in a flat where they cannot talk, or simply not yet sure. Three
 * things only: a number, a time of day and consent (name optional). No message
 * box, so nobody has to write down their health to get a call back.
 *
 * One component for every placement — article block, /cennik, the intent
 * pages' call card, the test result — told apart by `placement`, which rides
 * along with the request (with the page path) so the inbox and GA4 both say
 * which place works.
 *
 * `collapsed` starts as a single quiet button and opens the form in place:
 * inside the test result a second full form would bury the e-mail field.
 */
export function CallbackForm({
  placement,
  tone = "light",
  heading = CALLBACK_DEFAULTS.heading,
  text = CALLBACK_DEFAULTS.text,
  headingLevel = 2,
  collapsed = false,
  toggleLabel = CALLBACK_DEFAULTS.toggle,
  className,
}: {
  placement: string;
  tone?: "light" | "dark";
  /** `null` drops the heading — when the surrounding block already has one. */
  heading?: string | null;
  text?: string | null;
  headingLevel?: 2 | 3;
  collapsed?: boolean;
  toggleLabel?: string;
  className?: string;
}) {
  const contact = useSiteContact();
  const pathname = usePathname();
  const [open, setOpen] = useState(!collapsed);
  const [sentTime, setSentTime] = useState<CallbackTime | null>(null);
  const started = useRef(false);
  const firstField = useRef<HTMLInputElement | null>(null);
  const id = useId();
  const dark = tone === "dark";

  const form = useForm<CallbackRequestInput>({
    resolver: zodResolver(callbackRequestSchema),
    defaultValues: {
      name: "",
      phone: "",
      time: "asap",
      // Unticked: consent under RODO has to be an action, not a default.
      consent: false,
      placement,
      page: pathname || "/",
      [HONEYPOT_FIELD]: "",
    },
  });

  const Heading = headingLevel === 2 ? "h2" : "h3";
  const muted = dark ? "text-on-dark-muted" : "text-ink-400";
  const errorTone = dark ? "text-clay-300" : undefined;

  if (sentTime) {
    return (
      <div
        role="status"
        className={cn("px-4 py-4 text-body", dark ? "bg-on-dark/10 text-on-dark-lead" : "bg-mist text-ink-600", className)}
      >
        <p className="mb-1.5 font-heading text-[19px] tracking-[-0.02em]">Zapisaliśmy prośbę.</p>
        <p>
          Oddzwonimy {CALLBACK_TIMES[sentTime]}. Jeśli sprawa nie może czekać, zadzwoń:{" "}
          <a href={`tel:${contact.phoneHref}`} className="whitespace-nowrap underline underline-offset-2">
            {contact.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          // Focus lands in the form it opened, not back at the top of the card.
          requestAnimationFrame(() => firstField.current?.focus());
        }}
        className={cn(
          "link-arrow self-start text-body transition-colors",
          dark ? "text-on-dark-sage hover:text-on-dark" : "text-sage-600 hover:text-sage-700",
          className,
        )}
      >
        <span>{toggleLabel}</span>
        <span aria-hidden>→</span>
      </button>
    );
  }

  const errors = form.formState.errors;
  const phoneField = form.register("phone");

  return (
    <form
      noValidate
      aria-label={heading ?? toggleLabel}
      className={cn("flex flex-col gap-3", className)}
      onFocusCapture={() => {
        if (started.current) return;
        started.current = true;
        track("form_start");
      }}
      onSubmit={form.handleSubmit(async (values) => {
        const result = await submitCallbackRequest({ ...values, placement, page: pathname || "/" });
        if (result.ok) {
          track("callback_request", { cta_location: placement });
          setSentTime(values.time);
          return;
        }
        form.setError("root.server", { message: result.error });
      })}
    >
      {(heading || text) && (
        <div className="mb-1">
          {heading && (
            <Heading
              className={cn(
                "text-pretty font-heading",
                headingLevel === 2 ? "text-heading" : "text-[clamp(19px,1.6vw,23px)] leading-[1.25] tracking-[-0.025em]",
                dark ? "text-on-dark" : "text-ink-900",
              )}
            >
              {heading}
            </Heading>
          )}
          {text && (
            <p className={cn("mt-2 max-w-[34em] text-pretty text-[15.5px] leading-[1.68]", dark ? "text-on-dark-sage-2" : "text-ink-500")}>
              {text}
            </p>
          )}
        </div>
      )}

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
        <label className="flex flex-col gap-1.5">
          <span className={cn("text-meta", muted)}>Telefon</span>
          <input
            {...phoneField}
            ref={(el) => {
              phoneField.ref(el);
              firstField.current = el;
            }}
            className={FIELD[tone]}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? `${id}-phone-error` : undefined}
          />
          <FieldError id={`${id}-phone-error`} message={errors.phone?.message} className={errorTone} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={cn("text-meta", muted)}>Imię (opcjonalnie)</span>
          <input {...form.register("name")} className={FIELD[tone]} autoComplete="given-name" />
        </label>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className={cn("mb-1.5 text-meta", muted)}>Kiedy zadzwonić?</legend>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(TIME_LABELS) as CallbackTime[]).map((time) => (
            <label key={time} className="cursor-pointer">
              <input type="radio" value={time} {...form.register("time")} className="peer sr-only" />
              <span
                className={cn(
                  "block border px-3.5 py-2 text-meta transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2",
                  dark
                    ? "border-white/15 text-on-dark-lead hover:border-sage-300 peer-checked:border-sage-300 peer-checked:bg-white/[0.1] peer-checked:text-on-dark peer-focus-visible:outline-sage-300"
                    : "border-line-strong text-ink-600 hover:border-sage-600 peer-checked:border-sage-600 peer-checked:bg-mist peer-checked:text-ink-900 peer-focus-visible:outline-sage-600",
                )}
              >
                {TIME_LABELS[time]}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <label className={cn("flex cursor-pointer items-start gap-2.5 text-meta", dark ? "text-on-dark-muted" : "text-ink-300")}>
          <input
            type="checkbox"
            {...form.register("consent")}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? `${id}-consent-error` : undefined}
            className="mt-0.5 size-3.5 shrink-0 accent-[var(--sage-600)]"
          />
          <span>
            {CALLBACK_DEFAULTS.consent}{" "}
            <a href="/polityka-prywatnosci" className="underline underline-offset-2 hover:text-sage-600">
              Polityka prywatności
            </a>
          </span>
        </label>
        <FieldError id={`${id}-consent-error`} message={errors.consent?.message} className={cn("pl-6", errorTone)} />
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className={cn(
            "link-arrow px-[clamp(22px,2.2vw,30px)] py-[15px] text-body transition-colors disabled:opacity-60",
            dark ? "bg-bone text-ink-900 hover:bg-mist" : "bg-ink-900 text-bone hover:bg-ink-700",
          )}
        >
          <span>{form.formState.isSubmitting ? "Wysyłanie…" : CALLBACK_DEFAULTS.submit}</span>
          <span aria-hidden>→</span>
        </button>
        <a
          href={`tel:${contact.phoneHref}`}
          className={cn("text-meta transition-colors", dark ? "text-on-dark-muted hover:text-on-dark" : "text-ink-400 hover:text-sage-600")}
        >
          albo zadzwoń: <span className="whitespace-nowrap tabular-nums">{contact.phone}</span>
        </a>
      </div>

      {/* The server's answer (rate limit, outage) — about the form, not one field. */}
      <FieldError id={`${id}-server-error`} message={errors.root?.server?.message} className={errorTone} />
    </form>
  );
}
