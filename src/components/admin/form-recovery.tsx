"use client";

import { History } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";

const PREFIX = "insieme-admin:";
const WRITE_MS = 1000;
const LEAVE_MESSAGE = "Masz niezapisane zmiany. Opuścić stronę?";

type Snapshot<T> = { values: T; extra?: unknown; savedAt: string };

/**
 * Keeps unsaved work in an admin form from being lost, without saving it to
 * the server. A record is a draft or published (see `SaveActions`), so a
 * timed server save would either hide a live record or publish half an edit.
 * Instead:
 *
 * - while the form differs from what was loaded, a copy goes to this browser's
 *   localStorage (debounced) and is offered back the next time the form opens;
 * - closing the tab, reloading or following a link asks first.
 *
 * Both stop once the form is saved — call `markSaved` with the saved values.
 * `extra` carries UI state the values alone can't rebuild, such as the picked
 * photo's preview.
 */
export function useFormRecovery<T extends FieldValues>({
  form,
  storageKey,
  getExtra,
  onRestore,
}: {
  form: UseFormReturn<T>;
  /** One per record, e.g. `faq:<id>` or `faq:new`. */
  storageKey: string;
  getExtra?: () => unknown;
  onRestore?: (values: T, extra: unknown) => void;
}) {
  const key = PREFIX + storageKey;
  const [pending, setPending] = useState<Snapshot<T> | null>(null);
  const dirty = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const extraRef = useRef(getExtra);
  // While the restore notice is up, the old copy is kept until the user picks
  // „Przywróć” or „Odrzuć” — typing first must not overwrite it.
  const holding = useRef(false);
  useEffect(() => {
    extraRef.current = getExtra;
    holding.current = pending !== null;
  });

  const clearStored = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    try {
      localStorage.removeItem(key);
    } catch {}
  }, [key]);

  // A copy left by an earlier visit. Read after mount: the server has no
  // localStorage, and reading it during render would break hydration.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one read of an external store after hydration
      if (raw) setPending(JSON.parse(raw) as Snapshot<T>);
    } catch {}
  }, [key]);

  // Write a copy while the form is dirty; drop it once it no longer is.
  useEffect(() => {
    return form.subscribe({
      formState: { values: true, isDirty: true },
      callback: ({ values, isDirty }) => {
        dirty.current = Boolean(isDirty);
        if (holding.current) return;
        if (!isDirty) {
          clearStored();
          return;
        }
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          timer.current = null;
          const snapshot: Snapshot<T> = {
            values: values as T,
            extra: extraRef.current?.(),
            savedAt: new Date().toISOString(),
          };
          try {
            localStorage.setItem(key, JSON.stringify(snapshot));
          } catch {}
        }, WRITE_MS);
      },
    });
  }, [form, key, clearStored]);

  // Ask before the tab closes or reloads…
  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (dirty.current) event.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  // …and before a link leaves the form. Capture phase on the document runs
  // ahead of React's root listener, so a refused click never reaches <Link>.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!dirty.current || event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, location.href);
      if (url.pathname === location.pathname && url.search === location.search) return;
      if (!window.confirm(LEAVE_MESSAGE)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  function restore() {
    if (!pending) return;
    holding.current = false;
    // Keeping the loaded values as defaults leaves the form dirty, so the copy
    // and the leave-warning stay in force until the user actually saves.
    form.reset(pending.values, { keepDefaultValues: true });
    onRestore?.(pending.values, pending.extra);
    setPending(null);
  }

  function discard() {
    holding.current = false;
    clearStored();
    setPending(null);
  }

  /** After a successful save: the saved values become the clean baseline. */
  function markSaved(values: T) {
    dirty.current = false;
    form.reset(values);
    clearStored();
    setPending(null);
  }

  return { pending, restore, discard, markSaved };
}

export function RecoveryNotice({
  recovery,
}: {
  recovery: Pick<ReturnType<typeof useFormRecovery>, "pending" | "restore" | "discard">;
}) {
  if (!recovery.pending) return null;
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
      <History className="size-4 shrink-0" aria-hidden />
      <span className="min-w-0 flex-1">
        Masz niezapisane zmiany z{" "}
        {new Date(recovery.pending.savedAt).toLocaleString("pl-PL")}, zachowane w tej
        przeglądarce.
      </span>
      <div className="flex gap-2">
        <Button type="button" size="sm" variant="outline" onClick={recovery.discard}>
          Odrzuć
        </Button>
        <Button type="button" size="sm" onClick={recovery.restore}>
          Przywróć
        </Button>
      </div>
    </div>
  );
}
