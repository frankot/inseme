"use client";

import { ChevronDown, ChevronUp, GripVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { MediaPicker } from "@/components/admin/media-picker";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  blockTypeLabels,
  blockTypes,
  createBlock,
  type Block,
  type BlockType,
} from "@/lib/blocks";
import type { MediaSummary } from "@/lib/media-types";

export function BlockEditor({
  value,
  onChange,
  mediaLibrary,
}: {
  value: Block[];
  onChange: (blocks: Block[]) => void;
  mediaLibrary: MediaSummary[];
}) {
  // Picked media is remembered here so a freshly chosen image renders straight away.
  const [mediaCache, setMediaCache] = useState<Record<string, MediaSummary>>(() =>
    Object.fromEntries(mediaLibrary.map((item) => [item.id, item])),
  );

  function updateBlock(index: number, next: Block) {
    onChange(value.map((block, i) => (i === index ? next : block)));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-4">
      {value.length === 0 ? (
        <p className="rounded-md border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
          Brak sekcji. Dodaj pierwszą, aby zbudować treść strony.
        </p>
      ) : null}

      {value.map((block, index) => (
        <div key={block.id} className="rounded-lg border">
          <div className="flex items-center gap-2 border-b bg-muted/30 px-3 py-2">
            <GripVertical className="size-4 text-muted-foreground" aria-hidden />
            <span className="text-sm font-medium">{blockTypeLabels[block.type]}</span>
            <span className="text-xs text-muted-foreground">#{index + 1}</span>
            <div className="ml-auto flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Przenieś wyżej"
                disabled={index === 0}
                onClick={() => move(index, -1)}
              >
                <ChevronUp className="size-4" aria-hidden />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Przenieś niżej"
                disabled={index === value.length - 1}
                onClick={() => move(index, 1)}
              >
                <ChevronDown className="size-4" aria-hidden />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Usuń sekcję"
                className="text-destructive hover:text-destructive"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
              >
                <Trash2 className="size-4" aria-hidden />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-3">
            <BlockFields
              block={block}
              onChange={(next) => updateBlock(index, next)}
              mediaCache={mediaCache}
              onMediaPicked={(item) => setMediaCache((cache) => ({ ...cache, [item.id]: item }))}
            />
          </div>
        </div>
      ))}

      <DropdownMenu>
        <DropdownMenuTrigger render={<Button type="button" variant="outline" className="self-start" />}>
          <Plus className="size-4" aria-hidden />
          Dodaj sekcję
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {blockTypes.map((type) => (
            <DropdownMenuItem key={type} onClick={() => onChange([...value, createBlock(type)])}>
              {blockTypeLabels[type]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function BlockFields({
  block,
  onChange,
  mediaCache,
  onMediaPicked,
}: {
  block: Block;
  onChange: (block: Block) => void;
  mediaCache: Record<string, MediaSummary>;
  onMediaPicked: (item: MediaSummary) => void;
}) {
  switch (block.type) {
    case "richtext":
      return (
        <RichTextEditor value={block.html} onChange={(html) => onChange({ ...block, html })} />
      );

    case "image_text":
      return (
        <>
          <MediaPicker
            value={block.mediaId ? (mediaCache[block.mediaId] ?? null) : null}
            onChange={(item) => {
              if (item) onMediaPicked(item);
              onChange({ ...block, mediaId: item?.id ?? null });
            }}
          />
          <div className="flex flex-col gap-2">
            <Label>Nagłówek</Label>
            <Input
              value={block.heading}
              onChange={(event) => onChange({ ...block, heading: event.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Pozycja zdjęcia</Label>
            <Select
              value={block.imagePosition}
              onValueChange={(next) =>
                onChange({ ...block, imagePosition: next as "left" | "right" })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue>
                  {(value: string) => (value === "right" ? "Po prawej" : "Po lewej")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Po lewej</SelectItem>
                <SelectItem value="right">Po prawej</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <RichTextEditor value={block.html} onChange={(html) => onChange({ ...block, html })} />
        </>
      );

    case "cta":
      return (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Nagłówek</Label>
              <Input
                value={block.heading}
                onChange={(event) => onChange({ ...block, heading: event.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Etykieta przycisku</Label>
              <Input
                value={block.buttonLabel}
                onChange={(event) => onChange({ ...block, buttonLabel: event.target.value })}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Adres przycisku</Label>
            <Input
              value={block.buttonHref}
              placeholder="/kontakt lub tel:+48…"
              onChange={(event) => onChange({ ...block, buttonHref: event.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Tekst</Label>
            <Textarea
              value={block.text}
              rows={3}
              onChange={(event) => onChange({ ...block, text: event.target.value })}
            />
          </div>
        </>
      );

    case "step_list":
      return (
        <>
          <div className="flex flex-col gap-2">
            <Label>Nagłówek</Label>
            <Input
              value={block.heading}
              onChange={(event) => onChange({ ...block, heading: event.target.value })}
            />
          </div>
          <div className="flex flex-col gap-3">
            {block.steps.map((step, stepIndex) => (
              <div key={step.id} className="flex items-start gap-2 rounded-md border p-3">
                <span className="mt-2 text-sm font-medium text-muted-foreground">
                  {stepIndex + 1}.
                </span>
                <div className="flex flex-1 flex-col gap-2">
                  <Input
                    value={step.title}
                    placeholder="Tytuł kroku"
                    onChange={(event) =>
                      onChange({
                        ...block,
                        steps: block.steps.map((item, i) =>
                          i === stepIndex ? { ...item, title: event.target.value } : item,
                        ),
                      })
                    }
                  />
                  <Textarea
                    value={step.description}
                    rows={2}
                    placeholder="Opis kroku"
                    onChange={(event) =>
                      onChange({
                        ...block,
                        steps: block.steps.map((item, i) =>
                          i === stepIndex ? { ...item, description: event.target.value } : item,
                        ),
                      })
                    }
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Usuń krok"
                  className="text-destructive hover:text-destructive"
                  onClick={() =>
                    onChange({
                      ...block,
                      steps: block.steps.filter((_, i) => i !== stepIndex),
                    })
                  }
                >
                  <Trash2 className="size-4" aria-hidden />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="self-start"
              onClick={() =>
                onChange({
                  ...block,
                  steps: [
                    ...block.steps,
                    { id: crypto.randomUUID(), title: "", description: "" },
                  ],
                })
              }
            >
              <Plus className="size-4" aria-hidden />
              Dodaj krok
            </Button>
          </div>
        </>
      );

    case "faq_embed":
      return (
        <>
          <div className="flex flex-col gap-2">
            <Label>Nagłówek</Label>
            <Input
              value={block.heading}
              onChange={(event) => onChange({ ...block, heading: event.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Kategoria FAQ</Label>
            <Input
              value={block.category}
              placeholder="Puste = wszystkie opublikowane pytania"
              onChange={(event) => onChange({ ...block, category: event.target.value })}
            />
          </div>
        </>
      );
  }
}

export type { BlockType };
