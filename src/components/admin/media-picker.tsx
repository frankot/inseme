"use client";

import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { listMedia, updateMediaAltText } from "@/app/admin/(shell)/media/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { MediaSummary } from "@/lib/media-types";
import { uploadMediaFile } from "@/lib/media-upload";
import { ALLOWED_UPLOAD_TYPES_CLIENT } from "@/lib/upload-limits";
import { cn } from "@/lib/utils";

export function MediaPicker({
  value,
  onChange,
  label = "Wybierz zdjęcie",
}: {
  value: MediaSummary | null;
  onChange: (media: MediaSummary | null) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaSummary[] | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [isDropTarget, setIsDropTarget] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open || items) return;
    startTransition(async () => {
      const result = await listMedia();
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setItems(result.data);
    });
  }, [open, items]);

  /** Uploading here puts the file in the shared library and picks it right away. */
  async function upload(file: File | undefined) {
    if (!file || isUploading) return;
    setIsUploading(true);
    try {
      const result = await uploadMediaFile(file);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setItems((current) => [result.data, ...(current ?? [])]);
      onChange(result.data);
      toast.success(`Dodano ${file.name}.`);
      setOpen(false);
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex items-start gap-3">
      {value ? (
        <div className="relative size-24 shrink-0 overflow-hidden rounded-md border bg-muted">
          <Image
            src={value.url}
            alt={value.altText ?? ""}
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex size-24 shrink-0 items-center justify-center rounded-md border border-dashed bg-muted/30 text-muted-foreground">
          <ImageIcon className="size-5" aria-hidden />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button type="button" variant="outline" size="sm" />}>
              {value ? "Zmień" : label}
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Biblioteka mediów</DialogTitle>
                <DialogDescription>
                  Wybierz plik z biblioteki albo prześlij nowy — trafi też do zakładki Media.
                </DialogDescription>
              </DialogHeader>

              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="file"
                  accept={ALLOWED_UPLOAD_TYPES_CLIENT.join(",")}
                  className="hidden"
                  onChange={(event) => void upload(event.target.files?.[0])}
                />
                <Button
                  type="button"
                  size="sm"
                  disabled={isUploading}
                  onClick={() => inputRef.current?.click()}
                >
                  {isUploading ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  ) : (
                    <Upload className="size-4" aria-hidden />
                  )}
                  {isUploading ? "Przesyłanie…" : "Prześlij plik"}
                </Button>
                <span className="text-xs text-muted-foreground">
                  albo upuść plik w oknie poniżej
                </span>
              </div>

              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDropTarget(true);
                }}
                onDragLeave={() => setIsDropTarget(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setIsDropTarget(false);
                  void upload(event.dataTransfer.files?.[0]);
                }}
                className={cn(
                  "rounded-md border border-dashed p-2 transition-colors",
                  isDropTarget ? "border-ring bg-muted/50" : "border-transparent",
                )}
              >
                {isPending && !items ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">Wczytywanie…</p>
                ) : items && items.length > 0 ? (
                  <div className="grid max-h-[60vh] grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-4">
                    {items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onChange(item);
                          setOpen(false);
                        }}
                        className={cn(
                          "group relative aspect-square overflow-hidden rounded-md border bg-muted transition-colors hover:border-ring",
                          value?.id === item.id && "border-primary ring-2 ring-primary/30",
                        )}
                      >
                        <Image
                          src={item.url}
                          alt={item.altText ?? ""}
                          fill
                          sizes="200px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    Biblioteka jest pusta — prześlij pierwszy plik.
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {value ? (
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
              <X className="size-4" aria-hidden />
              Usuń zdjęcie
            </Button>
          ) : null}
        </div>

        {value ? <AltTextField key={value.id} media={value} onChange={onChange} /> : null}
      </div>
    </div>
  );
}

/**
 * Alt text belongs to the library row, not to the record being edited, so it
 * saves on its own — otherwise a file uploaded from a form could only be
 * described by leaving for /admin/media. Keyed by media id at the call site, so
 * picking a different file resets the field.
 */
function AltTextField({
  media,
  onChange,
}: {
  media: MediaSummary;
  onChange: (media: MediaSummary) => void;
}) {
  const [altText, setAltText] = useState(media.altText ?? "");
  const [isPending, startTransition] = useTransition();

  function save() {
    const next = altText.trim();
    if (next === (media.altText ?? "")) return;
    startTransition(async () => {
      const result = await updateMediaAltText({ id: media.id, altText: next });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      onChange({ ...media, altText: next || null });
      toast.success("Zapisano opis.");
    });
  }

  return (
    <Input
      value={altText}
      onChange={(event) => setAltText(event.target.value)}
      onBlur={save}
      disabled={isPending}
      placeholder="Opis alternatywny (alt)"
      aria-label="Opis alternatywny pliku"
      className="max-w-sm"
    />
  );
}
