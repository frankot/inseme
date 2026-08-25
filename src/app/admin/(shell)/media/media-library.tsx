"use client";

import { Loader2, Upload } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import {
  createUploadUrl,
  deleteMedia,
  registerMedia,
  updateMediaAltText,
} from "@/app/admin/(shell)/media/actions";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MediaSummary } from "@/lib/media-types";
import { ALLOWED_UPLOAD_TYPES_CLIENT, MAX_UPLOAD_BYTES_CLIENT } from "@/lib/upload-limits";

/** Images get their intrinsic size read in the browser so the DB has real dimensions. */
async function readImageSize(file: File): Promise<{ width: number; height: number } | null> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") return null;
  try {
    const bitmap = await createImageBitmap(file);
    const size = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return size;
  } catch {
    return null;
  }
}

export function MediaLibrary({
  initialItems,
  storageConfigured,
}: {
  initialItems: MediaSummary[];
  storageConfigured: boolean;
}) {
  const [items, setItems] = useState(initialItems);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    if (file.size > MAX_UPLOAD_BYTES_CLIENT) {
      toast.error(`${file.name}: plik jest za duży (maks. 15 MB).`);
      return;
    }
    const contentType = ALLOWED_UPLOAD_TYPES_CLIENT.find((type) => type === file.type);
    if (!contentType) {
      toast.error(`${file.name}: nieobsługiwany typ pliku.`);
      return;
    }

    const prepared = await createUploadUrl({
      fileName: file.name,
      contentType,
      size: file.size,
    });
    if (!prepared.ok) {
      toast.error(prepared.error);
      return;
    }

    const response = await fetch(prepared.data.uploadUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });
    if (!response.ok) {
      toast.error(`${file.name}: przesyłanie nie powiodło się (${response.status}).`);
      return;
    }

    const dimensions = await readImageSize(file);
    const registered = await registerMedia({
      key: prepared.data.key,
      url: prepared.data.publicUrl,
      mimeType: contentType,
      size: file.size,
      width: dimensions?.width ?? null,
      height: dimensions?.height ?? null,
    });
    if (!registered.ok) {
      toast.error(registered.error);
      return;
    }

    setItems((current) => [registered.data, ...current]);
    toast.success(`Dodano ${file.name}.`);
  }

  async function handleFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    setIsUploading(true);
    try {
      for (const file of Array.from(fileList)) {
        await uploadFile(file);
      }
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {!storageConfigured ? (
        <p className="rounded-md border border-dashed px-4 py-3 text-sm text-muted-foreground">
          Magazyn plików (Cloudflare R2) nie jest jeszcze skonfigurowany — uzupełnij zmienne
          <code className="mx-1 rounded bg-muted px-1 py-0.5 text-xs">R2_*</code>
          w pliku <code className="rounded bg-muted px-1 py-0.5 text-xs">.env.local</code>,
          aby włączyć przesyłanie plików.
        </p>
      ) : null}

      <div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ALLOWED_UPLOAD_TYPES_CLIENT.join(",")}
          className="hidden"
          onChange={(event) => void handleFiles(event.target.files)}
        />
        <Button
          type="button"
          disabled={!storageConfigured || isUploading}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Upload className="size-4" aria-hidden />
          )}
          {isUploading ? "Przesyłanie…" : "Dodaj pliki"}
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="rounded-md border border-dashed px-4 py-12 text-center text-sm text-muted-foreground">
          Biblioteka jest pusta.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              onDeleted={() => setItems((current) => current.filter((row) => row.id !== item.id))}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function MediaCard({ item, onDeleted }: { item: MediaSummary; onDeleted: () => void }) {
  const [altText, setAltText] = useState(item.altText ?? "");
  const [isPending, startTransition] = useTransition();
  const isImage = item.mimeType.startsWith("image/");

  function saveAltText() {
    if (altText === (item.altText ?? "")) return;
    startTransition(async () => {
      const result = await updateMediaAltText({ id: item.id, altText });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Zapisano opis.");
    });
  }

  return (
    <li className="flex flex-col gap-3 rounded-lg border p-3">
      <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
        {isImage ? (
          <Image
            src={item.url}
            alt={item.altText ?? ""}
            fill
            sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            {item.mimeType}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Input
          value={altText}
          onChange={(event) => setAltText(event.target.value)}
          onBlur={saveAltText}
          placeholder="Opis alternatywny (alt)"
          aria-label={`Opis alternatywny pliku ${item.id}`}
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground">
          {item.width && item.height ? `${item.width}×${item.height} · ` : ""}
          {(item.size / 1024).toFixed(0)} kB
        </p>
      </div>

      <div className="flex items-center justify-between">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs underline underline-offset-4"
        >
          Otwórz plik
        </a>
        <ConfirmDelete
          onConfirm={async () => {
            const result = await deleteMedia(item.id);
            if (result.ok) onDeleted();
            return result;
          }}
          title="Usunąć plik?"
          description="Plik zniknie z biblioteki i z magazynu R2. Miejsca, w których był użyty, zostaną puste."
          iconOnly
        />
      </div>
    </li>
  );
}
