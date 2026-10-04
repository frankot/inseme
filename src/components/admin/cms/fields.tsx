"use client";

import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, Plus, X } from "lucide-react";
import { createContext, useContext, useId, useState } from "react";
import { useController, useFormContext, useWatch } from "react-hook-form";

import { MediaPicker } from "@/components/admin/media-picker";
import { emptyValue, type FieldSpec, type ListSpec, type RefSpec } from "@/cms/fields";
import type { CmsImage, RefKind } from "@/cms/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/**
 * The CMS form, rendered from a section's field specs (plans/CMS_PLAN.md §1.1).
 * Every leaf is a controlled input bound to the page form by path, so the
 * whole page is one react-hook-form value the editor autosaves.
 */

export type RefOption = { id: string; label: string; meta?: string; published: boolean };
export type RefOptions = Record<RefKind, RefOption[]>;

const RefOptionsContext = createContext<RefOptions>({ faq: [], team: [], test: [], article: [] });
export const RefOptionsProvider = RefOptionsContext.Provider;

export function FieldControl({ spec, name }: { spec: FieldSpec; name: string }) {
  switch (spec.kind) {
    case "text":
      return <TextField spec={spec} name={name} />;
    case "image":
      return <ImageField spec={spec} name={name} />;
    case "link":
      return <LinkField label={spec.label} hint={spec.hint} optional={spec.optional} name={name} />;
    case "select":
      return <SelectField spec={spec} name={name} />;
    case "toggle":
      return <ToggleField label={spec.label} hint={spec.hint} name={name} />;
    case "ref":
      return <RefField spec={spec} name={name} />;
    case "list":
      return <ListField spec={spec} name={name} />;
    case "group":
      return (
        <div className="flex flex-col gap-4">
          {Object.entries(spec.fields).map(([key, field]) => (
            <FieldControl key={key} spec={field} name={`${name}.${key}`} />
          ))}
        </div>
      );
  }
}

function Shell({
  label,
  hint,
  htmlFor,
  aside,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={htmlFor}>{label}</Label>
        {aside}
      </div>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Counter({ length, max }: { length: number; max?: number }) {
  if (!max || length < max * 0.8) return null;
  return (
    <span className={cn("text-xs tabular-nums", length > max ? "text-destructive" : "text-muted-foreground")}>
      {length} / {max}
    </span>
  );
}

function TextField({ spec, name }: { spec: Extract<FieldSpec, { kind: "text" }>; name: string }) {
  const id = useId();
  const { field } = useController({ name });
  const value = typeof field.value === "string" ? field.value : "";
  const props = {
    id,
    value,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      field.onChange(event.target.value),
    onBlur: field.onBlur,
  };
  return (
    <Shell
      label={spec.optional ? `${spec.label} (opcjonalnie)` : spec.label}
      hint={spec.hint}
      htmlFor={id}
      aside={<Counter length={value.length} max={spec.max} />}
    >
      {spec.multiline ? (
        <Textarea rows={Math.min(8, Math.max(2, Math.ceil(value.length / 70)))} {...props} />
      ) : (
        <Input {...props} />
      )}
    </Shell>
  );
}

function ImageField({ spec, name }: { spec: Extract<FieldSpec, { kind: "image" }>; name: string }) {
  const { field } = useController({ name });
  const image = (field.value ?? { src: "", alt: "" }) as CmsImage;
  const altId = useId();
  const captionId = useId();
  const set = (patch: Partial<CmsImage>) => field.onChange({ ...image, ...patch });

  return (
    <fieldset className="flex flex-col gap-3 rounded-md border p-3">
      <legend className="px-1 text-sm font-medium">{spec.label}</legend>
      <MediaPicker
        value={
          image.src
            ? {
                id: image.mediaId ?? "",
                url: image.src,
                altText: image.alt,
                width: null,
                height: null,
                mimeType: "image/*",
                size: 0,
                uploadedAt: "",
              }
            : null
        }
        onChange={(media) => {
          // An image field is required — clearing it would only leave a hole.
          if (!media) return;
          set({ src: media.url, mediaId: media.id, alt: media.altText || image.alt });
        }}
      />
      {spec.hint && <p className="text-xs text-muted-foreground">{spec.hint}</p>}
      <Shell label="Opis zdjęcia (alt)" htmlFor={altId}>
        <Input id={altId} value={image.alt ?? ""} onChange={(e) => set({ alt: e.target.value })} />
      </Shell>
      {spec.caption && (
        <Shell label="Podpis (opcjonalnie)" htmlFor={captionId}>
          <Input
            id={captionId}
            value={image.caption ?? ""}
            onChange={(e) => set({ caption: e.target.value })}
          />
        </Shell>
      )}
    </fieldset>
  );
}

function LinkField({
  label,
  hint,
  optional,
  name,
}: {
  label: string;
  hint?: string;
  optional: boolean;
  name: string;
}) {
  const { field } = useController({ name });
  const link = field.value as { label: string; href: string } | undefined;
  const labelId = useId();
  const hrefId = useId();

  if (!link) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="self-start"
        onClick={() => field.onChange({ label: "", href: "" })}
      >
        <Plus aria-hidden /> {label}
      </Button>
    );
  }

  return (
    <fieldset className="flex flex-col gap-3 rounded-md border p-3">
      <legend className="flex items-center gap-2 px-1 text-sm font-medium">
        {label}
        {optional && (
          <button
            type="button"
            className="text-xs font-normal text-muted-foreground underline-offset-2 hover:underline"
            onClick={() => field.onChange(undefined)}
          >
            usuń
          </button>
        )}
      </legend>
      <div className="grid gap-3 sm:grid-cols-2">
        <Shell label="Tekst linku" htmlFor={labelId}>
          <Input
            id={labelId}
            value={link.label}
            onChange={(e) => field.onChange({ ...link, label: e.target.value })}
          />
        </Shell>
        <Shell label="Adres" htmlFor={hrefId} hint={hint ?? "np. /program, #dojazd, tel:+48…"}>
          <Input
            id={hrefId}
            value={link.href}
            onChange={(e) => field.onChange({ ...link, href: e.target.value })}
          />
        </Shell>
      </div>
    </fieldset>
  );
}

function SelectField({ spec, name }: { spec: Extract<FieldSpec, { kind: "select" }>; name: string }) {
  const { field } = useController({ name });
  return (
    <Shell label={spec.label} hint={spec.hint}>
      <Select value={field.value ?? ""} onValueChange={(next) => field.onChange(next)}>
        <SelectTrigger className="w-full">
          <SelectValue>
            {(value: string) => spec.options.find((o) => o.value === value)?.label ?? "—"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {spec.options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Shell>
  );
}

function ToggleField({ label, hint, name }: { label: string; hint?: string; name: string }) {
  const { field } = useController({ name });
  const id = useId();
  return (
    <div className="flex items-start gap-3">
      <Switch id={id} checked={Boolean(field.value)} onCheckedChange={(v) => field.onChange(v)} />
      <div>
        <Label htmlFor={id}>{label}</Label>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- refs */

const AUTO = "__auto";

function optionLabel(option: RefOption | undefined) {
  if (!option) return "Usunięty — nie wyświetla się";
  return `${option.label}${option.published ? "" : " · szkic — nie wyświetla się"}`;
}

function RefField({ spec, name }: { spec: RefSpec; name: string }) {
  const options = useContext(RefOptionsContext)[spec.ref];
  const { field } = useController({ name });
  const byId = new Map(options.map((option) => [option.id, option]));

  if (!spec.multiple) {
    const value = typeof field.value === "string" ? field.value : AUTO;
    return (
      <Shell label={spec.label} hint={spec.hint}>
        <Select value={value} onValueChange={(next) => field.onChange(next === AUTO ? null : next)}>
          <SelectTrigger className="w-full">
            <SelectValue>
              {(v: string) => (v === AUTO ? "Automatycznie" : optionLabel(byId.get(v)))}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={AUTO}>Automatycznie</SelectItem>
            {options.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {optionLabel(option)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Shell>
    );
  }

  const picked: string[] = Array.isArray(field.value) ? field.value : [];
  const available = options.filter((option) => !picked.includes(option.id));
  const move = (from: number, to: number) => {
    const next = [...picked];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    field.onChange(next);
  };

  return (
    <Shell
      label={spec.label}
      hint={spec.hint}
      aside={
        <span className="text-xs tabular-nums text-muted-foreground">
          {picked.length} / {spec.max}
        </span>
      }
    >
      {picked.length > 0 && (
        <ol className="flex flex-col divide-y rounded-md border">
          {picked.map((id, i) => {
            const option = byId.get(id);
            return (
              <li key={id} className="flex items-center gap-2 px-3 py-2 text-sm">
                <span className="w-5 text-xs tabular-nums text-muted-foreground">{i + 1}.</span>
                <span className={cn("min-w-0 flex-1 truncate", (!option || !option.published) && "text-muted-foreground line-through")}>
                  {optionLabel(option)}
                </span>
                <RowButtons
                  onUp={i > 0 ? () => move(i, i - 1) : undefined}
                  onDown={i < picked.length - 1 ? () => move(i, i + 1) : undefined}
                  onRemove={() => field.onChange(picked.filter((p) => p !== id))}
                />
              </li>
            );
          })}
        </ol>
      )}
      {picked.length < spec.max && available.length > 0 && (
        <Select value="" onValueChange={(next) => next && field.onChange([...picked, next])}>
          <SelectTrigger className="w-full">
            <SelectValue>{() => "+ Dodaj…"}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {available.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {optionLabel(option)}
                {option.meta ? ` — ${option.meta}` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </Shell>
  );
}

function RowButtons({
  onUp,
  onDown,
  onRemove,
}: {
  onUp?: () => void;
  onDown?: () => void;
  onRemove?: () => void;
}) {
  return (
    <span className="flex shrink-0 items-center">
      <Button type="button" variant="ghost" size="icon" className="size-7" disabled={!onUp} onClick={onUp} aria-label="W górę">
        <ArrowUp className="size-3.5" aria-hidden />
      </Button>
      <Button type="button" variant="ghost" size="icon" className="size-7" disabled={!onDown} onClick={onDown} aria-label="W dół">
        <ArrowDown className="size-3.5" aria-hidden />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-7 text-muted-foreground hover:text-destructive"
        disabled={!onRemove}
        onClick={onRemove}
        aria-label="Usuń"
      >
        <X className="size-3.5" aria-hidden />
      </Button>
    </span>
  );
}

/* ------------------------------------------------------------------- lists */

function ListField({ spec, name }: { spec: ListSpec; name: string }) {
  const { setValue, getValues } = useFormContext();
  const watched = useWatch({ name });
  const items: unknown[] = Array.isArray(watched) ? watched : [];
  const write = (next: unknown[]) => setValue(name, next, { shouldDirty: true });

  if (spec.fixedLabels) {
    return (
      <Shell label={spec.label} hint={spec.hint}>
        <Tabs defaultValue="0">
          <TabsList>
            {spec.fixedLabels.map((label, i) => (
              <TabsTrigger key={label} value={String(i)}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          {spec.fixedLabels.map((label, i) => (
            <TabsContent key={label} value={String(i)} className="pt-3">
              <FieldControl spec={spec.item} name={`${name}.${i}`} />
            </TabsContent>
          ))}
        </Tabs>
      </Shell>
    );
  }

  const move = (from: number, to: number) => {
    const next = [...(getValues(name) as unknown[])];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    write(next);
  };
  const remove = (index: number) =>
    write((getValues(name) as unknown[]).filter((_, i) => i !== index));
  const add = () => write([...((getValues(name) as unknown[]) ?? []), emptyValue(spec.item)]);
  const simple = spec.item.kind === "text";

  return (
    <Shell
      label={spec.label}
      hint={spec.hint}
      aside={
        <span className="text-xs tabular-nums text-muted-foreground">
          {items.length} / {spec.max}
        </span>
      }
    >
      <div className="flex flex-col gap-2">
        {items.map((item, i) =>
          simple ? (
            <div key={i} className="flex items-start gap-1">
              <div className="min-w-0 flex-1 [&_label]:sr-only">
                <FieldControl spec={spec.item} name={`${name}.${i}`} />
              </div>
              <RowButtons
                onUp={i > 0 ? () => move(i, i - 1) : undefined}
                onDown={i < items.length - 1 ? () => move(i, i + 1) : undefined}
                onRemove={items.length > spec.min ? () => remove(i) : undefined}
              />
            </div>
          ) : (
            <ListItem
              key={i}
              index={i}
              title={itemTitle(spec, item)}
              onUp={i > 0 ? () => move(i, i - 1) : undefined}
              onDown={i < items.length - 1 ? () => move(i, i + 1) : undefined}
              onRemove={items.length > spec.min ? () => remove(i) : undefined}
            >
              <FieldControl spec={spec.item} name={`${name}.${i}`} />
            </ListItem>
          ),
        )}
        {items.length < spec.max && (
          <Button type="button" variant="outline" size="sm" className="self-start" onClick={add}>
            <Plus aria-hidden /> Dodaj
          </Button>
        )}
      </div>
    </Shell>
  );
}

function itemTitle(spec: ListSpec, item: unknown): string {
  if (!item || typeof item !== "object") return "";
  const record = item as Record<string, unknown>;
  const key = spec.titleKey;
  if (key && typeof record[key] === "string") return record[key] as string;
  if (typeof record.alt === "string") return record.alt;
  if (typeof record.title === "string") return record.title;
  return "";
}

function ListItem({
  index,
  title,
  onUp,
  onDown,
  onRemove,
  children,
}: {
  index: number;
  title: string;
  onUp?: () => void;
  onDown?: () => void;
  onRemove?: () => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const Chevron = open ? ChevronDown : ChevronRight;
  return (
    <div className="rounded-md border">
      <div className="flex items-center gap-2 px-2 py-1.5">
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-2 text-left text-sm"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <Chevron className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <span className="w-5 shrink-0 text-xs tabular-nums text-muted-foreground">{index + 1}.</span>
          <span className="truncate">{title || <span className="text-muted-foreground">(bez tytułu)</span>}</span>
        </button>
        <RowButtons onUp={onUp} onDown={onDown} onRemove={onRemove} />
      </div>
      {open && <div className="border-t p-3">{children}</div>}
    </div>
  );
}
