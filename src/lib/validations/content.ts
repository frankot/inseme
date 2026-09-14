import { z } from "zod";

import { blocksSchema } from "@/lib/blocks";
import { slugPattern } from "@/lib/slug";

/**
 * These schemas are shared by the forms (react-hook-form resolver) and the
 * server actions, so they stay transform-free: input and output types must
 * match or the resolver's generics diverge. Empty string → NULL happens in the
 * actions via `emptyToNull`.
 */
export function emptyToNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

const optionalText = z.string().trim().max(2000).optional();
const optionalLongText = z.string().trim().max(20000).optional();
const optionalUrl = z.union([z.literal(""), z.url("Nieprawidłowy adres URL.")]).optional();

const slugField = z
  .string()
  .trim()
  .min(1, "Podaj adres URL (slug).")
  .max(96)
  .regex(slugPattern, "Slug może zawierać tylko małe litery, cyfry i myślniki.");

const metaFields = {
  metaTitle: z.string().trim().max(70, "Maksymalnie 70 znaków.").optional(),
  metaDescription: z.string().trim().max(180, "Maksymalnie 180 znaków.").optional(),
};

export const settingsSchema = z.object({
  phone: optionalText,
  secondaryPhone: optionalText,
  email: z.union([z.literal(""), z.email("Nieprawidłowy adres e-mail.")]).optional(),
  address: optionalText,
  hours: optionalText,
  whatsapp: optionalText,
  socialLinks: z.object({
    facebook: optionalUrl,
    instagram: optionalUrl,
    youtube: optionalUrl,
    linkedin: optionalUrl,
  }),
  privacyNote: optionalText,
  consentBannerText: optionalText,
  defaultOgImageId: z.uuid().nullable(),
});

export const pageSchema = z.object({
  title: z.string().trim().min(1, "Podaj tytuł.").max(160),
  slug: slugField,
  pageType: z.enum(["standard", "service"]),
  heroTitle: optionalText,
  heroSubtitle: optionalText,
  sections: blocksSchema,
  ogImageId: z.uuid().nullable(),
  ...metaFields,
});

export const teamMemberSchema = z.object({
  name: z.string().trim().min(1, "Podaj imię i nazwisko.").max(120),
  slug: slugField,
  role: optionalText,
  qualifications: optionalText,
  shortBio: optionalText,
  longBio: optionalLongText,
  photoId: z.uuid().nullable(),
  sortOrder: z.number().int().min(0).max(9999),
});

export const faqItemSchema = z.object({
  question: z.string().trim().min(1, "Podaj pytanie.").max(300),
  answer: z.string().trim().min(1, "Podaj odpowiedź.").max(20000),
  category: optionalText,
  sortOrder: z.number().int().min(0).max(9999),
});

export const articleSchema = z.object({
  title: z.string().trim().min(1, "Podaj tytuł.").max(200),
  slug: slugField,
  excerpt: z.string().trim().max(400, "Maksymalnie 400 znaków.").optional(),
  body: blocksSchema,
  authorReviewer: optionalText,
  coverImageId: z.uuid().nullable(),
  ...metaFields,
});

/**
 * A photo is described, not titled — the caption is what a visitor reads under
 * the tile, and `altText` is the separate screen-reader line. Both optional:
 * `galleryAlt()` falls back one to the other, then to a generic label.
 */
export const galleryPhotoSchema = z.object({
  altText: z.string().trim().max(300, "Maksymalnie 300 znaków.").optional(),
  description: z.string().trim().max(600, "Maksymalnie 600 znaków.").optional(),
  sortOrder: z.number().int().min(0).max(9999),
});

/** One uploaded WebP variant, as the browser reports it back. */
export const galleryVariantSchema = z.object({
  key: z.string().min(1).max(255),
  url: z.url(),
  width: z.number().int().positive().max(20000),
  height: z.number().int().positive().max(20000),
  size: z.number().int().positive(),
});

export const galleryPhotoCreateSchema = z.object({
  full: galleryVariantSchema,
  thumb: galleryVariantSchema,
  altText: z.string().trim().max(300).optional(),
  description: z.string().trim().max(600).optional(),
});

/** The whole visible order, committed after a drag or a nudge. */
export const galleryReorderSchema = z.object({
  ids: z.array(z.uuid()).min(1).max(2000),
});

export const mediaAltTextSchema = z.object({
  id: z.uuid(),
  altText: z.string().trim().max(300).optional(),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
export type PageInput = z.infer<typeof pageSchema>;
export type TeamMemberInput = z.infer<typeof teamMemberSchema>;
export type FaqItemInput = z.infer<typeof faqItemSchema>;
export type ArticleInput = z.infer<typeof articleSchema>;
export type GalleryPhotoInput = z.infer<typeof galleryPhotoSchema>;
export type GalleryPhotoCreateInput = z.infer<typeof galleryPhotoCreateSchema>;
