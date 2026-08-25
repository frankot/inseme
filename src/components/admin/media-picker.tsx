"use client";

import { ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { listMedia } from "@/app/admin/(shell)/media/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { MediaSummary } from "@/lib/media-types";
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

      <div className="flex flex-col gap-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button type="button" variant="outline" size="sm" />}>
            {value ? "Zmień" : label}
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Biblioteka mediów</DialogTitle>
              <DialogDescription>
                Wybierz plik. Nowe pliki dodasz w zakładce Media.
              </DialogDescription>
            </DialogHeader>
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
                Biblioteka jest pusta.
              </p>
            )}
          </DialogContent>
        </Dialog>

        {value ? (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
            <X className="size-4" aria-hidden />
            Usuń zdjęcie
          </Button>
        ) : null}
      </div>
    </div>
  );
}
