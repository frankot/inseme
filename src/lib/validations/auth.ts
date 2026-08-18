import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Nieprawidłowy adres e-mail.").min(1, "Podaj adres e-mail."),
  password: z.string().min(1, "Podaj hasło."),
});

export type LoginInput = z.infer<typeof loginSchema>;
