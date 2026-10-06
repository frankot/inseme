"use client";

import { createContext, useContext, useState } from "react";
import { useFormContext } from "react-hook-form";

import type { PageDoc } from "@/cms/types";
import { cn } from "@/lib/utils";

/**
 * What the draft changed against the live page. The editor provides the
 * published doc; every field compares its own value at its own path, so a
 * change is marked where it was made — and each mark can show the published
 * value and put it back, one field at a time.
 */

const PublishedContext = createContext<PageDoc | null>(null);
export const PublishedProvider = PublishedContext.Provider;

/** `sections.hero.data.items.0.title` → the value at that path, or undefined. */
export function valueAt(doc: unknown, path: string): unknown {
  let current = doc;
  for (const key of path.split(".")) {
    if (current === null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

/**
 * Deep equality where "nothing" is one value: an optional field that was
 * never filled (undefined), cleared (""), or nulled reads the same, so
 * opening a field and leaving it empty doesn't count as a change.
 */
export function sameValue(a: unknown, b: unknown): boolean {
  const blank = (v: unknown) => v === undefined || v === null || v === "";
  if (blank(a) || blank(b)) return blank(a) && blank(b);
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    return a.every((item, i) => sameValue(item, b[i]));
  }
  if (typeof a === "object" && typeof b === "object") {
    const ra = a as Record<string, unknown>;
    const rb = b as Record<string, unknown>;
    const keys = new Set([...Object.keys(ra), ...Object.keys(rb)]);
    return [...keys].every((key) => sameValue(ra[key], rb[key]));
  }
  return a === b;
}

export type Diff = {
  changed: boolean;
  /** The published value at this path. */
  before: unknown;
  /** Puts the published value back into the form (the draft autosaves it). */
  restore: () => void;
};

export function usePublishedDiff(name: string, value: unknown): Diff {
  const published = useContext(PublishedContext);
  const { setValue } = useFormContext();
  const before = published ? valueAt(published, name) : undefined;
  return {
    changed: published !== null && !sameValue(value, before),
    before,
    restore: () => setValue(name, structuredClone(before), { shouldDirty: true }),
  };
}

/** For an item of a list: changed, or new (past the end of the published list). */
export function useItemState(name: string, index: number, value: unknown): "new" | "changed" | null {
  const published = useContext(PublishedContext);
  if (!published) return null;
  const list = valueAt(published, name);
  if (!Array.isArray(list) || index >= list.length) return "new";
  return sameValue(value, list[index]) ? null : "changed";
}

/** The amber rule beside a changed field. Spread onto the field's wrapper. */
export function changedClass(changed: boolean) {
  return changed ? "-ml-3.5 border-l-2 border-amber-500 pl-3" : undefined;
}

/**
 * The line under a changed field: what it was, and a way back. `before` is the
 * published value already rendered for this field type; null when there is
 * nothing useful to show (the restore link still works).
 */
export function ChangedNote({ diff, before }: { diff: Diff; before: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  if (!diff.changed) return null;
  return (
    <div className="flex flex-col gap-1.5">
      <p className="flex flex-wrap items-center gap-x-2 text-xs text-amber-700 dark:text-amber-400">
        <span>Zmienione od publikacji</span>
        {before !== null && (
          <>
            <span aria-hidden>·</span>
            <button
              type="button"
              className="underline-offset-2 hover:underline"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              {open ? "ukryj opublikowaną" : "pokaż opublikowaną"}
            </button>
          </>
        )}
        <span aria-hidden>·</span>
        <button type="button" className="underline-offset-2 hover:underline" onClick={diff.restore}>
          przywróć
        </button>
      </p>
      {open && before !== null && (
        <div className="whitespace-pre-wrap rounded-md border border-dashed bg-muted/50 px-2.5 py-1.5 text-xs text-muted-foreground">
          {before}
        </div>
      )}
    </div>
  );
}

/** Published text as shown in the note: "(puste)" rather than nothing. */
export function beforeText(value: unknown): React.ReactNode {
  return typeof value === "string" && value.trim() ? value : <em>(puste)</em>;
}

/** The dot in the outline and on list items. */
export function ChangedDot({ label = "Zmieniona od publikacji", className }: { label?: string; className?: string }) {
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={cn("size-2 shrink-0 rounded-full bg-amber-500", className)}
    />
  );
}
