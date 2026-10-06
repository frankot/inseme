"use client";

import { Loader2 } from "lucide-react";
import { useState, type ComponentProps, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * The building blocks of the admin's photo screens — Galeria and Biblioteka
 * mediów — so the two look and behave the same: an upload area that takes a
 * drop, a one-line summary, a grid of cards with the picture, its texts and
 * its actions in the same places. Each screen supplies what differs (captions
 * and publishing in the gallery, file types in the library).
 */

/** Shown instead of a working upload while the R2_* variables are missing. */
export function StorageNotice({ what }: { what: string }) {
  return (
    <p className="rounded-md border border-dashed px-4 py-3 text-sm text-muted-foreground">
      Magazyn plików (Cloudflare R2) nie jest skonfigurowany — uzupełnij zmienne
      <code className="mx-1 rounded bg-muted px-1 py-0.5 text-xs">R2_*</code>
      w pliku <code className="rounded bg-muted px-1 py-0.5 text-xs">.env.local</code>, aby {what}.
    </p>
  );
}

/**
 * Click to pick, or drop files from the desktop. `busyLabel` replaces the
 * button text while uploading; `status` is read out to screen readers.
 */
export function UploadDropzone({
  accept,
  disabled,
  busyLabel,
  icon,
  label,
  status,
  hint,
  acceptDrop = () => true,
  ignoreDrop = false,
  onFiles,
  inputRef,
}: {
  accept: string;
  disabled: boolean;
  busyLabel: string | null;
  icon: ReactNode;
  label: string;
  status?: ReactNode;
  hint: ReactNode;
  /** Filters dropped files (the picker is already limited by `accept`). */
  acceptDrop?: (file: File) => boolean;
  /** True while a card is being dragged, so reordering doesn't count as a drop. */
  ignoreDrop?: boolean;
  onFiles: (files: File[]) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const [isDropTarget, setIsDropTarget] = useState(false);
  return (
    <div
      onDragOver={(event) => {
        if (ignoreDrop) return;
        event.preventDefault();
        setIsDropTarget(true);
      }}
      onDragLeave={() => setIsDropTarget(false)}
      onDrop={(event) => {
        if (ignoreDrop) return;
        event.preventDefault();
        setIsDropTarget(false);
        if (disabled) return;
        onFiles(Array.from(event.dataTransfer.files).filter(acceptDrop));
      }}
      className={cn(
        "flex flex-col items-center gap-3 rounded-lg border border-dashed px-6 py-8 text-center transition-colors",
        isDropTarget ? "border-ring bg-muted/50" : "border-border",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        className="hidden"
        onChange={(event) => onFiles(Array.from(event.target.files ?? []))}
      />
      <Button type="button" disabled={disabled || busyLabel !== null} onClick={() => inputRef.current?.click()}>
        {busyLabel ? <Loader2 className="size-4 animate-spin" aria-hidden /> : icon}
        {busyLabel ?? label}
      </Button>
      <p className="text-xs text-muted-foreground" aria-live="polite">
        {status ?? hint}
      </p>
    </div>
  );
}

/** The line above the grid: counts on the left, an optional action on the right. */
export function PhotoSummary({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
      <p>{children}</p>
      {action}
    </div>
  );
}

export function EmptyPhotos({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-md border border-dashed px-4 py-12 text-center text-sm text-muted-foreground">
      {children}
    </p>
  );
}

export function PhotoGrid({ children }: { children: ReactNode }) {
  return <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{children}</ul>;
}

/**
 * One card: the picture with a badge in each top corner, the editable texts
 * and a meta line, then the actions — left-hand ones (moving, opening) and
 * right-hand ones (publishing, deleting). Extra `<li>` props carry the
 * gallery's drag-to-reorder.
 */
export function PhotoCard({
  media,
  topLeft,
  topRight,
  fields,
  meta,
  actionsStart,
  actionsEnd,
  className,
  ...li
}: {
  media: ReactNode;
  topLeft?: ReactNode;
  topRight?: ReactNode;
  fields: ReactNode;
  meta: ReactNode;
  actionsStart?: ReactNode;
  actionsEnd: ReactNode;
} & Omit<ComponentProps<"li">, "children">) {
  return (
    <li className={cn("flex flex-col gap-3 rounded-lg border bg-card p-3 transition-opacity", className)} {...li}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-muted">
        {media}
        {topLeft ? (
          <span className="absolute left-2 top-2 flex items-center gap-1 rounded bg-background/85 px-1.5 py-0.5 text-xs font-medium tabular-nums backdrop-blur">
            {topLeft}
          </span>
        ) : null}
        {topRight ? (
          <span className="absolute right-2 top-2 flex flex-col items-end gap-1">{topRight}</span>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        {fields}
        <p className="text-xs text-muted-foreground tabular-nums">{meta}</p>
      </div>

      <div className="mt-auto flex items-center justify-between gap-1">
        <div className="flex items-center">{actionsStart}</div>
        <div className="flex items-center gap-1">{actionsEnd}</div>
      </div>
    </li>
  );
}
