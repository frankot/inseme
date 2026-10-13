"use client";

import { createContext, useContext, useState } from "react";
import { useFormContext } from "react-hook-form";

import { sameValue, valueAt } from "@/lib/same-value";
import { cn } from "@/lib/utils";

export { sameValue, valueAt };

/**
 * What the draft changed against the live version. The editor provides the
 * published values — a CMS page doc, or a record's live columns in its form's
 * shape; every field compares its own value at its own path, so a change is
 * marked where it was made — and each mark can show the published value and
 * put it back, one field at a time.
 */

const PublishedContext = createContext<object | null>(null);
export const PublishedProvider = PublishedContext.Provider;

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
