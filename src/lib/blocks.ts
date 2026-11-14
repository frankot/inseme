import { z } from "zod";

/**
 * The fixed set of content blocks. Deliberately small and typed — a structured
 * CMS, not a freeform page builder. Adding a type means adding it here, to the
 * editor switch in `block-editor.tsx`, and (later) to the public renderer.
 */
export const blockTypes = [
  "richtext",
  "image_text",
  "cta",
  "step_list",
  "card_list",
  "faq_embed",
  "callback_form",
] as const;
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

/**
 * Options side by side rather than in order: a title and a few sentences each
 * (e.g. the medicines a doctor may consider). Plain text, like the steps.
 */
export const cardListBlockSchema = z.object({
  ...baseBlock,
  type: z.literal("card_list"),
  heading: z.string(),
  cards: z.array(
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

/**
 * "Poproś o telefon" inside an article. Heading and text are optional: empty
 * means the form's own copy (`CALLBACK_DEFAULTS`), so the common case is just
 * dropping the block in.
 */
export const callbackFormBlockSchema = z.object({
  ...baseBlock,
  type: z.literal("callback_form"),
  heading: z.string(),
  text: z.string(),
});

export const blockSchema = z.discriminatedUnion("type", [
  richTextBlockSchema,
  imageTextBlockSchema,
  ctaBlockSchema,
  stepListBlockSchema,
  cardListBlockSchema,
  faqEmbedBlockSchema,
  callbackFormBlockSchema,
]);

export const blocksSchema = z.array(blockSchema);

export type RichTextBlock = z.infer<typeof richTextBlockSchema>;
export type ImageTextBlock = z.infer<typeof imageTextBlockSchema>;
export type CtaBlock = z.infer<typeof ctaBlockSchema>;
export type StepListBlock = z.infer<typeof stepListBlockSchema>;
export type CardListBlock = z.infer<typeof cardListBlockSchema>;
export type FaqEmbedBlock = z.infer<typeof faqEmbedBlockSchema>;
export type CallbackFormBlock = z.infer<typeof callbackFormBlockSchema>;
export type Block = z.infer<typeof blockSchema>;

export const blockTypeLabels: Record<BlockType, string> = {
  richtext: "Tekst",
  image_text: "Zdjęcie + tekst",
  cta: "Wezwanie do działania",
  step_list: "Lista kroków",
  card_list: "Karty",
  faq_embed: "Sekcja FAQ",
  callback_form: "Prośba o telefon",
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
    case "card_list":
      return { id, type, heading: "", cards: [] };
    case "faq_embed":
      return { id, type, heading: "", category: "" };
    case "callback_form":
      return { id, type, heading: "", text: "" };
  }
}
