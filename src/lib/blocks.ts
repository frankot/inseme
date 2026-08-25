import { z } from "zod";

/**
 * The fixed set of content blocks. Deliberately small and typed — a structured
 * CMS, not a freeform page builder. Adding a type means adding it here, to the
 * editor switch in `block-editor.tsx`, and (later) to the public renderer.
 */
export const blockTypes = ["richtext", "image_text", "cta", "step_list", "faq_embed"] as const;
export type BlockType = (typeof blockTypes)[number];

const baseBlock = { id: z.string().min(1) };

export const richTextBlockSchema = z.object({
  ...baseBlock,
  type: z.literal("richtext"),
  html: z.string(),
});

export const imageTextBlockSchema = z.object({
  ...baseBlock,
  type: z.literal("image_text"),
  mediaId: z.uuid().nullable(),
  heading: z.string(),
  html: z.string(),
  imagePosition: z.enum(["left", "right"]),
});

export const ctaBlockSchema = z.object({
  ...baseBlock,
  type: z.literal("cta"),
  heading: z.string(),
  text: z.string(),
  buttonLabel: z.string(),
  buttonHref: z.string(),
});

export const stepListBlockSchema = z.object({
  ...baseBlock,
  type: z.literal("step_list"),
  heading: z.string(),
  steps: z.array(
    z.object({
      id: z.string().min(1),
      title: z.string(),
      description: z.string(),
    }),
  ),
});

export const faqEmbedBlockSchema = z.object({
  ...baseBlock,
  type: z.literal("faq_embed"),
  heading: z.string(),
  /** Empty = every published FAQ item; otherwise filter by category. */
  category: z.string(),
});

export const blockSchema = z.discriminatedUnion("type", [
  richTextBlockSchema,
  imageTextBlockSchema,
  ctaBlockSchema,
  stepListBlockSchema,
  faqEmbedBlockSchema,
]);

export const blocksSchema = z.array(blockSchema);

export type RichTextBlock = z.infer<typeof richTextBlockSchema>;
export type ImageTextBlock = z.infer<typeof imageTextBlockSchema>;
export type CtaBlock = z.infer<typeof ctaBlockSchema>;
export type StepListBlock = z.infer<typeof stepListBlockSchema>;
export type FaqEmbedBlock = z.infer<typeof faqEmbedBlockSchema>;
export type Block = z.infer<typeof blockSchema>;

export const blockTypeLabels: Record<BlockType, string> = {
  richtext: "Tekst",
  image_text: "Zdjęcie + tekst",
  cta: "Wezwanie do działania",
  step_list: "Lista kroków",
  faq_embed: "Sekcja FAQ",
};

export function createBlock(type: BlockType): Block {
  const id = crypto.randomUUID();
  switch (type) {
    case "richtext":
      return { id, type, html: "" };
    case "image_text":
      return { id, type, mediaId: null, heading: "", html: "", imagePosition: "left" };
    case "cta":
      return { id, type, heading: "", text: "", buttonLabel: "", buttonHref: "" };
    case "step_list":
      return { id, type, heading: "", steps: [] };
    case "faq_embed":
      return { id, type, heading: "", category: "" };
  }
}
