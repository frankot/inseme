import { z } from "zod";

const trimmedOptional = z.string().trim().max(200).optional();

// Consent fields below are booleans that must be true, rather than
// `z.literal(true)`: the forms start unticked, so `false` has to be a value
// the form can hold — the server still rejects it.

/**
 * The public contact form. A person in crisis should not be blocked by
 * validation, so the only hard requirements are the message, one way to reach
 * them back, and the consent checkbox.
 */
export const contactFormSchema = z
  .object({
    name: trimmedOptional,
    phone: trimmedOptional,
    email: z.union([z.literal(""), z.email("Nieprawidłowy adres e-mail.")]).optional(),
    message: z
      .string()
      .trim()
      .min(10, "Napisz choć kilka zdań — inaczej trudno nam odpowiedzieć.")
      .max(5000),
    preferredContactMethod: z.enum(["phone", "email"]),
    consent: z.boolean().refine((v) => v, { message: "Bez zgody nie możemy się odezwać." }),
    /** Honeypot. */
    company: z.string().max(200).optional(),
  })
  .refine((data) => Boolean(data.phone?.trim()) || Boolean(data.email?.trim()), {
    message: "Podaj telefon albo e-mail — inaczej nie mamy jak odpowiedzieć.",
    path: ["phone"],
  })
  .refine(
    (data) => data.preferredContactMethod !== "phone" || Boolean(data.phone?.trim()),
    { message: "Wybrano kontakt telefoniczny — podaj numer.", path: ["phone"] },
  )
  .refine(
    (data) => data.preferredContactMethod !== "email" || Boolean(data.email?.trim()),
    { message: "Wybrano kontakt e-mailowy — podaj adres.", path: ["email"] },
  );

export type ContactFormInput = z.infer<typeof contactFormSchema>;

/** The standalone e-mail-capture widget. */
export const leadSignupSchema = z.object({
  email: z.email("Podaj poprawny adres e-mail."),
  consent: z.boolean().refine((v) => v, { message: "Bez zgody nie możemy zapisać adresu." }),
  /** Which placement converted — set by the component, not the visitor. */
  source: z.string().trim().max(60).optional(),
  company: z.string().max(200).optional(),
});

export type LeadSignupInput = z.infer<typeof leadSignupSchema>;
