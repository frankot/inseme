"use client";

import { FileQuestion, FileText, Star, Upload } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { deleteGalleryPhoto } from "@/app/admin/(shell)/gallery/actions";
import { deleteMedia, deleteStrayObjects, updateMediaAltText } from "@/app/admin/(shell)/media/actions";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { ExpandingInput } from "@/components/admin/expanding-input";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  EmptyPhotos,
  PhotoCard,
  PhotoGrid,
  PhotoSummary,
  StorageNotice,
  UploadDropzone,
} from "@/components/admin/photo-admin";
import { formatBytes } from "@/lib/gallery-upload";
import { supportsEdgeResize } from "@/lib/image-host";
import { hasVariants } from "@/lib/image-variants";
import type { InventoryItem, MediaSummary, MediaUsage } from "@/lib/media-types";
import { uploadMediaFile } from "@/lib/media-upload";
import { UPLOAD_ACCEPT } from "@/lib/upload-limits";
import { cn } from "@/lib/utils";

/** "image/jpeg" → "JPG", "application/pdf" → "PDF". */
function typeLabel(mimeType: string): string {
  const sub = mimeType.split("/")[1] ?? mimeType;
  return { jpeg: "JPG", "svg+xml": "SVG" }[sub] ?? sub.toUpperCase();
}

type Filter = "all" | "media" | "unused" | "gallery" | "stray";

const FILTERS: { value: Filter; label: string; test: (entry: InventoryItem) => boolean }[] = [
  { value: "all", label: "Wszystko", test: () => true },
  { value: "media", label: "Biblioteka", test: (entry) => entry.kind === "media" },
  { value: "unused", label: "Nieużywane", test: (entry) => entry.kind === "media" && entry.usedIn.length === 0 },
  { value: "gallery", label: "Galeria", test: (entry) => entry.kind === "gallery" },
  { value: "stray", label: "Poza bazą", test: (entry) => entry.kind === "stray" },
];

const keyOf = (entry: InventoryItem) =>
  entry.kind === "media" ? `m-${entry.item.id}` : entry.kind === "gallery" ? `g-${entry.id}` : `s-${entry.group}`;

const sizeOf = (entry: InventoryItem) => (entry.kind === "media" ? entry.item.size : entry.size);

/**
 * Everything in the R2 bucket (`media-inventory.ts`), laid out like Galeria
 * (`photo-admin.tsx`). One card per file — a photo's responsive copies, and a
 * gallery photo's thumb and full, are counted with it, not listed apart.
 *
 * Library files are edited here and show where they are used. Gallery photos
 * are shown for the full picture of the bucket but edited in Galeria. Stray
 * objects — in the bucket with no row in the database — can only be opened or
 * deleted.
 */
export function MediaLibrary({
  initialItems,
  storageConfigured,
  bucketListed,
}: {
  initialItems: InventoryItem[];
  storageConfigured: boolean;
  bucketListed: boolean;
}) {
  const [items, setItems] = useState(initialItems);
  const [filter, setFilter] = useState<Filter>("all");
  const [pending, setPending] = useState<{ name: string; left: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const missingAlt = items.filter(
    (entry) => entry.kind === "media" && entry.item.mimeType.startsWith("image/") && !entry.item.altText?.trim(),
  );
  const stored = items.reduce((sum, entry) => sum + sizeOf(entry), 0);
  const counts = new Map(FILTERS.map(({ value, test }) => [value, items.filter(test).length]));
  const shown = items.filter(FILTERS.find(({ value }) => value === filter)!.test);

  const remove = (key: string) => setItems((current) => current.filter((entry) => keyOf(entry) !== key));

  async function handleFiles(files: File[]) {
    if (!files.length) return;
    try {
      for (const [index, file] of files.entries()) {
        setPending({ name: file.name, left: files.length - index });
        // uploadMediaFile reports every failure itself; the catch is a last net,
        // so nothing an editor drops can fail without a word.
        const result = await uploadMediaFile(file).catch(() => ({
          ok: false as const,
          error: `${file.name}: nieoczekiwany błąd podczas wysyłki. Spróbuj ponownie.`,
        }));
        if (!result.ok) {
          toast.error(result.error, { duration: 12000 });
          continue;
        }
        setItems((current) => [{ kind: "media", item: result.data, usedIn: [] }, ...current]);
        toast.success(`Dodano ${file.name}.`);
      }
    } finally {
      setPending(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {!storageConfigured ? <StorageNotice what="włączyć przesyłanie plików" /> : null}
      {storageConfigured && !bucketListed ? (
        <p className="rounded-md border border-dashed px-4 py-3 text-sm text-muted-foreground">
          Nie udało się odczytać zawartości magazynu R2 — poniżej tylko pliki zapisane w bazie. Odśwież
          stronę, żeby spróbować ponownie.
        </p>
      ) : null}

      <UploadDropzone
        accept={UPLOAD_ACCEPT}
        disabled={!storageConfigured}
        busyLabel={pending ? "Przesyłanie…" : null}
        icon={<Upload className="size-4" aria-hidden />}
        label="Dodaj pliki"
        status={
          pending ? (
            <>
              {pending.name}
              {pending.left > 1 ? ` — pozostało ${pending.left}` : null}
            </>
          ) : undefined
        }
        hint={
          <>
            Upuść pliki tutaj albo wybierz je z dysku: zdjęcia (JPG, PNG, WebP, AVIF, HEIC), SVG
            lub PDF. Duże zdjęcia są przed wysyłką zmniejszane do 3000 px, a potem powstają ich mniejsze
            kopie, żeby telefony pobierały tylko tyle, ile potrzebują.
          </>
        }
        onFiles={(files) => void handleFiles(files)}
        inputRef={inputRef}
      />

      {items.length > 0 ? (
        <>
          <PhotoSummary>
            {items.length} {items.length === 1 ? "plik" : "plików"}
            {missingAlt.length > 0 ? ` · ${missingAlt.length} bez opisu (alt)` : ""} ·{" "}
            {formatBytes(stored)} w magazynie (z mniejszymi kopiami zdjęć)
          </PhotoSummary>
          <div role="group" aria-label="Pokaż" className="-mt-3 flex flex-wrap gap-1.5">
            {FILTERS.filter(({ value }) => value !== "stray" || counts.get("stray")).map(({ value, label }) => (
              <button
                key={value}
                type="button"
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium tabular-nums transition-colors",
                  filter === value ? "border-foreground bg-foreground text-background" : "hover:bg-accent",
                )}
              >
                {label} <span className="opacity-60">{counts.get(value)}</span>
              </button>
            ))}
          </div>
        </>
      ) : null}

      {items.length === 0 ? (
        <EmptyPhotos>Biblioteka jest pusta. Dodaj pierwsze pliki.</EmptyPhotos>
      ) : shown.length === 0 ? (
        <EmptyPhotos>Nic w tym widoku.</EmptyPhotos>
      ) : (
        <PhotoGrid>
          {shown.map((entry) => {
            const key = keyOf(entry);
            if (entry.kind === "gallery") return <GalleryCard key={key} entry={entry} onDeleted={() => remove(key)} />;
            if (entry.kind === "stray") return <StrayCard key={key} entry={entry} onDeleted={() => remove(key)} />;
            return (
              <MediaCard
                key={key}
                item={entry.item}
                usedIn={entry.usedIn}
                onChanged={(altText) =>
                  setItems((current) =>
                    current.map((row) =>
                      keyOf(row) === key && row.kind === "media" ? { ...row, item: { ...row.item, altText } } : row,
                    ),
                  )
                }
                onDeleted={() => remove(key)}
              />
            );
          })}
        </PhotoGrid>
      )}
    </div>
  );
}

const noteBadge = "rounded px-1.5 py-0.5 text-[11px] font-medium";
const amberBadge = `${noteBadge} bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200`;
const greyBadge = `${noteBadge} bg-background/85 text-muted-foreground backdrop-blur`;

const openLink = (href: string, label = "Otwórz plik") => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="px-1 text-xs underline underline-offset-4">
    {label}
  </a>
);

/** "Użyte w:" — every place the file appears, each a link to its editor. */
function UsageList({ usedIn }: { usedIn: MediaUsage[] }) {
  if (usedIn.length === 0) {
    return <p className="text-xs text-muted-foreground">Nigdzie nieużywany.</p>;
  }
  return (
    <div className="text-xs">
      <p className="text-muted-foreground">Użyte w:</p>
      <ul className="mt-0.5 flex flex-col gap-0.5">
        {usedIn.map((usage) => (
          <li key={usage.label + usage.href}>
            <Link href={usage.href} className="underline underline-offset-4">
              {usage.label}
            </Link>
            {usage.draft ? <span className="text-muted-foreground"> · szkic</span> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MediaCard({
  item,
  usedIn,
  onChanged,
  onDeleted,
}: {
  item: MediaSummary;
  usedIn: MediaUsage[];
  onChanged: (altText: string | null) => void;
  onDeleted: () => void;
}) {
  const [altText, setAltText] = useState(item.altText ?? "");
  const [, startTransition] = useTransition();
  const isImage = item.mimeType.startsWith("image/");

  // Autosaves on blur, like the gallery's captions — and like them, the field
  // stays enabled while saving, so tabbing on never swallows keystrokes.
  function saveAltText() {
    if (altText === (item.altText ?? "")) return;
    startTransition(async () => {
      const result = await updateMediaAltText({ id: item.id, altText });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      onChanged(altText.trim() || null);
      toast.success("Zapisano opis.");
    });
  }

  return (
    <PhotoCard
      media={
        isImage ? (
          <Image
            src={item.url}
            alt={item.altText ?? ""}
            fill
            sizes="(min-width: 1280px) 280px, (min-width: 640px) 45vw, 90vw"
            unoptimized={!(hasVariants(item.url) || supportsEdgeResize(item.url))}
            loading="lazy"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <FileText className="size-8" aria-hidden />
            <span className="text-xs">{item.mimeType}</span>
          </div>
        )
      }
      topLeft={typeLabel(item.mimeType)}
      topRight={
        <>
          {isImage && !item.altText?.trim() ? <span className={amberBadge}>Brak opisu</span> : null}
          {usedIn.length === 0 ? <span className={greyBadge}>Nieużywany</span> : null}
        </>
      }
      fields={
        <>
          <ExpandingInput
            value={altText}
            onChange={setAltText}
            onBlur={saveAltText}
            placeholder="Opis alternatywny (alt)"
            aria-label={`Opis alternatywny pliku ${typeLabel(item.mimeType)}`}
          />
          <UsageList usedIn={usedIn} />
        </>
      }
      meta={[
        item.width && item.height ? `${item.width}×${item.height}` : null,
        formatBytes(item.size),
        typeLabel(item.mimeType),
      ]
        .filter(Boolean)
        .join(" · ")}
      actionsStart={openLink(item.url)}
      actionsEnd={
        <ConfirmDelete
          iconOnly
          onConfirm={async () => {
            const result = await deleteMedia(item.id);
            if (result.ok) onDeleted();
            return result;
          }}
          title="Usunąć plik?"
          description={
            usedIn.length > 0
              ? `Plik zniknie z biblioteki i z magazynu R2 (razem z jego mniejszymi kopiami). Jest używany w: ${usedIn.map((usage) => usage.label).join("; ")} — te miejsca zostaną bez zdjęcia.`
              : "Plik zniknie z biblioteki i z magazynu R2 (razem z jego mniejszymi kopiami). Nigdzie nie jest używany."
          }
        />
      }
    />
  );
}

/** A /galeria photo: shown here so the library covers the whole bucket, edited in Galeria. */
function GalleryCard({
  entry,
  onDeleted,
}: {
  entry: Extract<InventoryItem, { kind: "gallery" }>;
  onDeleted: () => void;
}) {
  return (
    <PhotoCard
      media={
        <Image
          src={entry.thumbUrl}
          alt={entry.alt}
          fill
          sizes="(min-width: 1280px) 280px, (min-width: 640px) 45vw, 90vw"
          // r2.dev cannot resize at the edge; the thumb is already the right size.
          unoptimized
          loading="lazy"
          className="object-cover"
        />
      }
      topLeft="Galeria"
      topRight={
        <>
          <StatusBadge status={entry.status} />
          {entry.featuredOnHome ? (
            <span className={cn(amberBadge, "flex items-center gap-1")}>
              <Star className="size-3 fill-current" aria-hidden />
              Strona główna
            </span>
          ) : null}
        </>
      }
      fields={
        <div className="text-xs">
          <p className={cn("line-clamp-2", !entry.description && "text-muted-foreground")}>
            {entry.description || "Bez opisu pod zdjęciem"}
          </p>
          <p className="mt-1 text-muted-foreground">
            Użyte w:{" "}
            <Link href="/admin/gallery" className="text-foreground underline underline-offset-4">
              Galeria
            </Link>
            {entry.status === "draft" ? " · szkic, niewidoczne na stronie" : null}
          </p>
        </div>
      }
      meta={`${entry.width}×${entry.height} · ${formatBytes(entry.size)} · zdjęcie + miniatura`}
      actionsStart={
        <>
          <Link href="/admin/gallery" className="px-1 text-xs underline underline-offset-4">
            Edytuj w Galerii
          </Link>
          {openLink(entry.fullUrl, "Otwórz")}
        </>
      }
      actionsEnd={
        <ConfirmDelete
          iconOnly
          onConfirm={async () => {
            const result = await deleteGalleryPhoto(entry.id);
            if (result.ok) onDeleted();
            return result;
          }}
          title="Usunąć zdjęcie z galerii?"
          description={
            entry.status === "published"
              ? "Zdjęcie zniknie z /galeria i z magazynu R2 (razem z miniaturą)."
              : "Szkic zdjęcia zniknie z galerii i z magazynu R2 (razem z miniaturą)."
          }
        />
      }
    />
  );
}

const IMAGE_KEY = /\.(jpe?g|png|webp|avif|gif|svg)$/i;

/**
 * Objects in the bucket with no row in the database — usually a half-finished
 * upload. Nothing on the site points at them, so they can only be looked at
 * and deleted.
 */
function StrayCard({ entry, onDeleted }: { entry: Extract<InventoryItem, { kind: "stray" }>; onDeleted: () => void }) {
  const isImage = IMAGE_KEY.test(entry.url);
  const count = entry.keys.length;
  return (
    <PhotoCard
      media={
        isImage ? (
          // eslint-disable-next-line @next/next/no-img-element -- an arbitrary object, no known size or copies
          <img src={entry.url} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <FileQuestion className="size-8" aria-hidden />
          </div>
        )
      }
      topLeft="Poza bazą"
      topRight={<span className={amberBadge}>Nieużywany</span>}
      fields={
        <div className="text-xs">
          <p className="break-all font-mono text-[11px]">{entry.group.split("/").pop()}</p>
          <p className="mt-1 text-muted-foreground">
            Jest w magazynie, ale nie w bazie — zwykle zostaje po przerwanym przesyłaniu. Nigdzie się nie
            wyświetla; można go usunąć.
          </p>
        </div>
      }
      meta={`${formatBytes(entry.size)} · ${count} ${count === 1 ? "plik" : count < 5 ? "pliki" : "plików"}`}
      actionsStart={openLink(entry.url, "Otwórz")}
      actionsEnd={
        <ConfirmDelete
          iconOnly
          onConfirm={async () => {
            const result = await deleteStrayObjects(entry.group);
            if (result.ok) onDeleted();
            return result;
          }}
          title="Usunąć z magazynu?"
          description={`Usunie ${count === 1 ? "ten plik" : `te ${count} pliki (oryginał i kopie)`} z magazynu R2. Nic na stronie z nich nie korzysta.`}
        />
      }
    />
  );
}
