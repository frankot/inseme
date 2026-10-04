import { z } from "zod";

import type { RefKind } from "./types";

/**
 * Field primitives (plans/CMS_PLAN.md §1.1). One builder call gives both halves
 * of a field: the zod schema the stored value is checked against, and the
 * config the admin form renders from. A section is a `group` of these, so its
 * schema and its form cannot drift apart.
 *
 * Pure data and zod only — imported by the server (validation, seed) and by the
 * client editor alike.
 */

type Base = { label: string; hint?: string };

export type TextSpec = Base & {
  kind: "text";
  multiline: boolean;
  max?: number;
  optional: boolean;
};
export type ImageSpec = Base & { kind: "image"; caption: boolean };
export type LinkSpec = Base & { kind: "link"; optional: boolean };
export type SelectSpec = Base & { kind: "select"; options: { value: string; label: string }[] };
export type ToggleSpec = Base & { kind: "toggle" };
export type RefSpec = Base & { kind: "ref"; ref: RefKind; multiple: boolean; max: number };
export type ListSpec = Base & {
  kind: "list";
  item: FieldSpec;
  min: number;
  max: number;
  /** Item names for a fixed-length list shown as tabs (01's two paths). */
  fixedLabels?: string[];
  /** Which text key of a group item titles its row in the editor. */
  titleKey?: string;
};
export type GroupSpec = Base & { kind: "group"; fields: Record<string, FieldSpec> };

export type FieldSpec =
  | TextSpec
  | ImageSpec
  | LinkSpec
  | SelectSpec
  | ToggleSpec
  | RefSpec
  | ListSpec
  | GroupSpec;

const REQUIRED = "To pole jest wymagane.";
const tooLong = (max: number) => `Maksymalnie ${max} znaków.`;
const BAD_REF = "Nieprawidłowy wybór — usuń pozycję i wybierz ją ponownie.";

/** Relative paths, in-page anchors, tel:, mailto: and https: only. */
const HREF = /^(\/(?!\/)|#|tel:|mailto:|https:\/\/)/;

export const f = {
  text(label: string, opts: { max?: number; hint?: string; optional?: boolean } = {}): TextSpec {
    return { kind: "text", label, multiline: false, optional: false, ...opts };
  },
  textarea(
    label: string,
    opts: { max?: number; hint?: string; optional?: boolean } = {},
  ): TextSpec {
    return { kind: "text", label, multiline: true, optional: false, ...opts };
  },
  image(label: string, opts: { hint?: string; caption?: boolean } = {}): ImageSpec {
    return { kind: "image", label, caption: false, ...opts };
  },
  link(label: string, opts: { hint?: string; optional?: boolean } = {}): LinkSpec {
    return { kind: "link", label, optional: false, ...opts };
  },
  select(label: string, options: SelectSpec["options"], opts: { hint?: string } = {}): SelectSpec {
    return { kind: "select", label, options, ...opts };
  },
  toggle(label: string, opts: { hint?: string } = {}): ToggleSpec {
    return { kind: "toggle", label, ...opts };
  },
  ref(
    label: string,
    ref: RefKind,
    opts: { multiple?: boolean; max?: number; hint?: string } = {},
  ): RefSpec {
    return { kind: "ref", label, ref, multiple: false, max: 1, ...opts };
  },
  list(
    label: string,
    item: FieldSpec,
    opts: { min?: number; max: number; hint?: string; titleKey?: string; fixedLabels?: string[] },
  ): ListSpec {
    return { kind: "list", label, item, min: 0, ...opts };
  },
  group(label: string, fields: Record<string, FieldSpec>, opts: { hint?: string } = {}): GroupSpec {
    return { kind: "group", label, fields, ...opts };
  },
};

/** Paragraphs: the common "list of textareas" shape. */
export function paragraphs(label: string, min = 1, max = 3, hint?: string): ListSpec {
  return f.list(label, f.textarea("Akapit"), { min, max, hint });
}

/** Titled points (`{ title?, body }`) as used by the stage bands. */
export function points(label: string, min: number, max: number, titled: "required" | "optional"): ListSpec {
  return f.list(
    label,
    f.group("Punkt", {
      title: f.text("Tytuł", { max: 80, optional: titled === "optional" }),
      body: f.textarea("Treść", { max: 400 }),
    }),
    { min, max, titleKey: "title" },
  );
}

/* ----------------------------------------------------------------- schemas */

function textSchema(spec: TextSpec): z.ZodType {
  let s = z.string({ error: REQUIRED }).trim();
  if (spec.max) s = s.max(spec.max, tooLong(spec.max));
  return spec.optional ? s.optional() : s.min(1, REQUIRED);
}

export function schemaFor(spec: FieldSpec): z.ZodType {
  switch (spec.kind) {
    case "text":
      return textSchema(spec);
    case "image":
      return z.object({
        src: z
          .string({ error: "Wybierz zdjęcie." })
          .min(1, "Wybierz zdjęcie.")
          .regex(/^(\/(?!\/)|https:\/\/)/, "Nieprawidłowy adres zdjęcia."),
        alt: z.string({ error: REQUIRED }).trim().min(1, "Opisz zdjęcie (tekst alternatywny)."),
        caption: z.string().trim().max(200, tooLong(200)).optional(),
        mediaId: z.string().nullable().optional(),
      });
    case "link": {
      const link = z.object({
        label: z.string({ error: REQUIRED }).trim().min(1, REQUIRED).max(80, tooLong(80)),
        href: z
          .string({ error: REQUIRED })
          .trim()
          .regex(HREF, "Adres: ścieżka (/…), #kotwica, tel:, mailto: albo https://"),
      });
      return spec.optional ? link.optional() : link;
    }
    case "select":
      return z.enum(spec.options.map((o) => o.value) as [string, ...string[]], {
        error: "Wybierz wartość z listy.",
      });
    case "toggle":
      return z.boolean();
    case "ref":
      return spec.multiple
        ? z.array(z.uuid({ error: BAD_REF })).max(spec.max, `Maksymalnie ${spec.max}.`)
        : z.uuid({ error: BAD_REF }).nullable();
    case "list": {
      let s = z.array(schemaFor(spec.item));
      if (spec.min > 0) s = s.min(spec.min, `Co najmniej ${spec.min}.`);
      return s.max(spec.max, `Maksymalnie ${spec.max}.`);
    }
    case "group":
      return z.object(
        Object.fromEntries(Object.entries(spec.fields).map(([key, field]) => [key, schemaFor(field)])),
      );
  }
}

/** An empty value of the right shape, for "+ Dodaj" in lists. */
export function emptyValue(spec: FieldSpec): unknown {
  switch (spec.kind) {
    case "text":
      return "";
    case "image":
      return { src: "", alt: "" };
    case "link":
      return { label: "", href: "" };
    case "select":
      return spec.options[0]?.value ?? "";
    case "toggle":
      return false;
    case "ref":
      return spec.multiple ? [] : null;
    case "list":
      return [];
    case "group":
      return Object.fromEntries(Object.entries(spec.fields).map(([k, v]) => [k, emptyValue(v)]));
  }
}
