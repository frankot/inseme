"use client";

import { FileText, Upload } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { deleteMedia, updateMediaAltText } from "@/app/admin/(shell)/media/actions";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { ExpandingInput } from "@/components/admin/expanding-input";
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
import type { MediaSummary } from "@/lib/media-types";
import { uploadMediaFile } from "@/lib/media-upload";
import { ALLOWED_UPLOAD_TYPES_CLIENT } from "@/lib/upload-limits";

/** "image/jpeg" → "JPG", "application/pdf" → "PDF". */
function typeLabel(mimeType: string): string {
  const sub = mimeType.split("/")[1] ?? mimeType;
  return { jpeg: "JPG", "svg+xml": "SVG" }[sub] ?? sub.toUpperCase();
}

/**
 * The library, laid out like Galeria (`photo-admin.tsx`): the same upload
 * area, summary line, grid and cards. What differs is only the content — a
 * library file has an alt text but no caption or publishing, and may be a PDF
 * or an SVG rather than a photo.
 */
export function MediaLibrary({
  initialItems,
  storageConfigured,
}: {
  initialItems: MediaSummary[];
  storageConfigured: boolean;
}) {
  const [items, setItems] = useState(initialItems);
  const [pending, setPending] = useState<{ name: string; left: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const missingAlt = items.filter((item) => item.mimeType.startsWith("image/") && !item.altText?.trim());
  const stored = items.reduce((sum, item) => sum + item.size, 0);

  async function handleFiles(files: File[]) {
    if (!files.length) return;
    try {
      for (const [index, file] of files.entries()) {
        setPending({ name: file.name, left: files.length - index });
        const result = await uploadMediaFile(file);
        if (!result.ok) {
          toast.error(result.error);
          continue;
        }
        setItems((current) => [result.data, ...current]);
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

      <UploadDropzone
        accept={ALLOWED_UPLOAD_TYPES_CLIENT.join(",")}
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
            Upuść pliki tutaj albo wybierz je z dysku: zdjęcia (JPG, PNG, WebP, AVIF), SVG lub
            PDF. Do każdego zdjęcia powstają w przeglądarce mniejsze kopie, żeby telefony
            pobierały tylko tyle, ile potrzebują.
          </>
        }
        acceptDrop={(file) => (ALLOWED_UPLOAD_TYPES_CLIENT as readonly string[]).includes(file.type)}
        onFiles={(files) => void handleFiles(files)}
        inputRef={inputRef}
      />

      {items.length > 0 ? (
        <PhotoSummary>
          {items.length} {items.length === 1 ? "plik" : "plików"}
          {missingAlt.length > 0 ? ` · ${missingAlt.length} bez opisu (alt)` : ""} ·{" "}
          {formatBytes(stored)} w magazynie
        </PhotoSummary>
      ) : null}

      {items.length === 0 ? (
        <EmptyPhotos>Biblioteka jest pusta. Dodaj pierwsze pliki.</EmptyPhotos>
      ) : (
        <PhotoGrid>
          {items.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              onChanged={(altText) =>
                setItems((current) => current.map((row) => (row.id === item.id ? { ...row, altText } : row)))
              }
              onDeleted={() => setItems((current) => current.filter((row) => row.id !== item.id))}
            />
          ))}
        </PhotoGrid>
      )}
    </div>
  );
}

function MediaCard({
  item,
  onChanged,
  onDeleted,
}: {
  item: MediaSummary;
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
        isImage && !item.altText?.trim() ? (
          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-medium text-amber-900 dark:bg-amber-950 dark:text-amber-200">
            Brak opisu
          </span>
        ) : null
      }
      fields={
        <ExpandingInput
          value={altText}
          onChange={setAltText}
          onBlur={saveAltText}
          placeholder="Opis alternatywny (alt)"
          aria-label={`Opis alternatywny pliku ${typeLabel(item.mimeType)}`}
        />
      }
      meta={[
        item.width && item.height ? `${item.width}×${item.height}` : null,
        formatBytes(item.size),
        typeLabel(item.mimeType),
      ]
        .filter(Boolean)
        .join(" · ")}
      actionsStart={
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-1 text-xs underline underline-offset-4"
        >
          Otwórz plik
        </a>
      }
      actionsEnd={
        <ConfirmDelete
          iconOnly
          onConfirm={async () => {
            const result = await deleteMedia(item.id);
            if (result.ok) onDeleted();
            return result;
          }}
          title="Usunąć plik?"
          description="Plik zniknie z biblioteki i z magazynu R2 (razem z jego mniejszymi kopiami). Miejsca, w których był użyty, zostaną puste."
        />
      }
    />
  );
}
