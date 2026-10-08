"use client";

import {
  GripVertical,
  Globe,
  ImagePlus,
  MoveLeft,
  MoveRight,
  Star,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import {
  deleteGalleryPhoto,
  publishGalleryPhoto,
  publishGalleryPhotos,
  reorderGalleryPhotos,
  setGalleryFeatured,
  unpublishGalleryPhoto,
  updateGalleryPhoto,
} from "@/app/admin/(shell)/gallery/actions";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import {
  EmptyPhotos,
  PhotoCard,
  PhotoGrid,
  PhotoSummary,
  StorageNotice,
  UploadDropzone,
} from "@/components/admin/photo-admin";
import { ExpandingInput } from "@/components/admin/expanding-input";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { GALLERY_ACCEPT, GALLERY_VARIANTS } from "@/lib/gallery-image";
import type { GalleryPhotoAdmin } from "@/lib/gallery-types";
import { formatBytes, uploadGalleryPhoto } from "@/lib/gallery-upload";
import { cn } from "@/lib/utils";

const STAGE_LABEL = {
  converting: "Przetwarzanie",
  uploading: "Wysyłanie",
  saving: "Zapisywanie",
} as const;

type Pending = { name: string; stage: keyof typeof STAGE_LABEL };

export function GalleryManager({
  initialPhotos,
  storageConfigured,
}: {
  initialPhotos: GalleryPhotoAdmin[];
  storageConfigured: boolean;
}) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [pending, setPending] = useState<Pending | null>(null);
  const [queued, setQueued] = useState(0);
  const [dragId, setDragId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const drafts = photos.filter((photo) => photo.status === "draft");
  const stored = photos.reduce((sum, photo) => sum + photo.totalSize, 0);

  async function handleFiles(files: File[]) {
    if (!files.length) return;
    setQueued(files.length);
    try {
      for (const [index, file] of files.entries()) {
        setQueued(files.length - index);
        const result = await uploadGalleryPhoto(file, ({ stage }) =>
          setPending({ name: file.name, stage }),
        );
        if (!result.ok) {
          toast.error(result.error);
          continue;
        }
        const added = result.data;
        setPhotos((current) => [added, ...current]);
        toast.success(
          `${file.name} → ${formatBytes(added.totalSize)} (WebP, ${added.full.width}×${added.full.height}).`,
        );
      }
    } finally {
      setPending(null);
      setQueued(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  /**
   * Commits the whole visible order. The list is already in its new shape
   * locally, so a failure re-reads from the server rather than trying to undo.
   */
  const commitOrder = useCallback((next: GalleryPhotoAdmin[]) => {
    setPhotos(next);
    void reorderGalleryPhotos(next.map((photo) => photo.id)).then((result) => {
      if (!result.ok) toast.error(result.error);
    });
  }, []);

  function move(id: string, delta: number) {
    const from = photos.findIndex((photo) => photo.id === id);
    const to = from + delta;
    if (from < 0 || to < 0 || to >= photos.length) return;
    const next = [...photos];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    commitOrder(next);
  }

  function dropOn(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const from = photos.findIndex((photo) => photo.id === dragId);
    const to = photos.findIndex((photo) => photo.id === targetId);
    if (from < 0 || to < 0) return;
    const next = [...photos];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    commitOrder(next);
  }

  return (
    <div className="flex flex-col gap-6">
      {!storageConfigured ? <StorageNotice what="dodawać zdjęcia" /> : null}

      <UploadDropzone
        accept={GALLERY_ACCEPT}
        disabled={!storageConfigured}
        busyLabel={pending ? `${STAGE_LABEL[pending.stage]}…` : null}
        icon={<ImagePlus className="size-4" aria-hidden />}
        label="Dodaj zdjęcia"
        status={
          pending ? (
            <>
              {pending.name}
              {queued > 1 ? ` — pozostało ${queued}` : null}
            </>
          ) : undefined
        }
        hint={
          <>
            Upuść zdjęcia tutaj albo wybierz je z dysku. Każde zostanie w przeglądarce
            zmniejszone do {GALLERY_VARIANTS.full.maxEdge} px i zapisane jako WebP — oryginał
            nie jest wysyłany.
          </>
        }
        acceptDrop={(file) => file.type.startsWith("image/")}
        ignoreDrop={dragId !== null}
        onFiles={(files) => void handleFiles(files)}
        inputRef={inputRef}
      />

      {photos.length > 0 ? (
        <PhotoSummary
          action={
            drafts.length > 0 ? (
            <BulkPublish
              ids={drafts.map((photo) => photo.id)}
              onDone={() =>
                setPhotos((current) =>
                  current.map((photo) =>
                    photo.status === "draft"
                      ? { ...photo, status: "published", publishedAt: new Date().toISOString() }
                      : photo,
                  ),
                )
              }
            />
            ) : null
          }
        >
          {photos.length} {photos.length === 1 ? "zdjęcie" : "zdjęć"} · {drafts.length} w wersji
          roboczej · {formatBytes(stored)} w magazynie
        </PhotoSummary>
      ) : null}

      {photos.length === 0 ? (
        <EmptyPhotos>Galeria jest pusta. Dodaj pierwsze zdjęcia — trafią tu jako wersje robocze.</EmptyPhotos>
      ) : (
        <PhotoGrid>
          {photos.map((photo, index) => (
            <GalleryCard
              key={photo.id}
              photo={photo}
              index={index}
              count={photos.length}
              isDragging={dragId === photo.id}
              onDragStart={() => setDragId(photo.id)}
              onDragEnd={() => setDragId(null)}
              onDropOn={() => dropOn(photo.id)}
              onMove={(delta) => move(photo.id, delta)}
              onChanged={(patch) =>
                setPhotos((current) =>
                  current.map((row) => (row.id === photo.id ? { ...row, ...patch } : row)),
                )
              }
              onDeleted={() =>
                setPhotos((current) => current.filter((row) => row.id !== photo.id))
              }
            />
          ))}
        </PhotoGrid>
      )}
    </div>
  );
}

function BulkPublish({ ids, onDone }: { ids: string[]; onDone: () => void }) {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      type="button"
      size="sm"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const result = await publishGalleryPhotos(ids);
          if (!result.ok) {
            toast.error(result.error);
            return;
          }
          onDone();
          toast.success(`Opublikowano ${ids.length} zdjęć.`);
        })
      }
    >
      <Globe className="size-4" aria-hidden />
      Opublikuj wszystkie robocze ({ids.length})
    </Button>
  );
}

function GalleryCard({
  photo,
  index,
  count,
  isDragging,
  onDragStart,
  onDragEnd,
  onDropOn,
  onMove,
  onChanged,
  onDeleted,
}: {
  photo: GalleryPhotoAdmin;
  index: number;
  count: number;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDropOn: () => void;
  onMove: (delta: number) => void;
  onChanged: (patch: Partial<GalleryPhotoAdmin>) => void;
  onDeleted: () => void;
}) {
  const [description, setDescription] = useState(photo.description ?? "");
  const [altText, setAltText] = useState(photo.altText ?? "");
  const [isPending, startTransition] = useTransition();
  const [isOver, setIsOver] = useState(false);

  /**
   * Captions autosave on blur. The inputs deliberately stay *enabled* while the
   * save is in flight: tabbing from the caption into the alt field blurs the
   * caption, which starts this transition, and disabling the fields on
   * `isPending` would yank the alt field out from under the cursor mid-word —
   * the keystrokes land nowhere and the alt text is silently lost. An autosave
   * the editor never asked for must not take the keyboard away.
   */
  function saveText() {
    if (description === (photo.description ?? "") && altText === (photo.altText ?? "")) return;
    startTransition(async () => {
      const result = await updateGalleryPhoto(photo.id, {
        altText,
        description,
        sortOrder: photo.sortOrder,
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      onChanged({ description: description || null, altText: altText || null });
      toast.success("Zapisano opis.");
    });
  }

  function togglePublish() {
    startTransition(async () => {
      const published = photo.status === "published";
      const result = published
        ? await unpublishGalleryPhoto(photo.id)
        : await publishGalleryPhoto(photo.id);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      onChanged({
        status: published ? "draft" : "published",
        publishedAt: published ? null : new Date().toISOString(),
      });
      toast.success(published ? "Cofnięto publikację." : "Opublikowano.");
    });
  }

  function toggleFeatured() {
    startTransition(async () => {
      const next = !photo.featuredOnHome;
      const result = await setGalleryFeatured(photo.id, next);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      onChanged({ featuredOnHome: next });
      toast.success(
        next
          ? photo.status === "published"
            ? "Zdjęcie jest na stronie głównej."
            : "Wybrane na stronę główną — pojawi się po opublikowaniu."
          : "Zdjęcie zdjęte ze strony głównej.",
      );
    });
  }

  return (
    <PhotoCard
      draggable
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      onDragEnd={() => {
        setIsOver(false);
        onDragEnd();
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsOver(false);
        onDropOn();
      }}
      className={cn(
        isDragging && "opacity-40",
        isOver && !isDragging && "border-ring ring-2 ring-ring/25",
      )}
      media={
        <Image
          src={photo.thumb.url}
          alt={photo.alt}
          fill
          sizes="(min-width: 1280px) 280px, (min-width: 640px) 45vw, 90vw"
          // r2.dev cannot resize at the edge; the thumb is already the right size.
          unoptimized
          loading="lazy"
          className="object-cover"
        />
      }
      topLeft={
        <>
          <GripVertical className="size-3 text-muted-foreground" aria-hidden />
          {index + 1}
        </>
      }
      topRight={
        <>
          <StatusBadge status={photo.status} />
          {photo.featuredOnHome ? (
            <span className="flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-medium text-amber-900 dark:bg-amber-950 dark:text-amber-200">
              <Star className="size-3 fill-current" aria-hidden />
              Strona główna
            </span>
          ) : null}
        </>
      }
      fields={
        <>
          <ExpandingInput
            value={description}
            onChange={setDescription}
            onBlur={saveText}
            placeholder="Opis pod zdjęciem"
            aria-label={`Opis zdjęcia ${index + 1}`}
          />
          <ExpandingInput
            value={altText}
            onChange={setAltText}
            onBlur={saveText}
            placeholder="Opis alternatywny (alt)"
            aria-label={`Opis alternatywny zdjęcia ${index + 1}`}
          />
        </>
      }
      meta={`${photo.full.width}×${photo.full.height} · ${formatBytes(photo.totalSize)} · WebP`}
      actionsStart={
        // Drag moves a photo a long way; these move it one place, from a keyboard.
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={index === 0}
            aria-label={`Przesuń zdjęcie ${index + 1} wcześniej`}
            onClick={() => onMove(-1)}
          >
            <MoveLeft className="size-4" aria-hidden />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={index === count - 1}
            aria-label={`Przesuń zdjęcie ${index + 1} później`}
            onClick={() => onMove(1)}
          >
            <MoveRight className="size-4" aria-hidden />
          </Button>
        </>
      }
      actionsEnd={
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={isPending}
            onClick={toggleFeatured}
            aria-pressed={photo.featuredOnHome}
            aria-label={
              photo.featuredOnHome ? "Zdejmij ze strony głównej" : "Pokaż na stronie głównej"
            }
            title={photo.featuredOnHome ? "Zdejmij ze strony głównej" : "Pokaż na stronie głównej"}
          >
            <Star
              className={cn("size-4", photo.featuredOnHome && "fill-amber-400 text-amber-500")}
              aria-hidden
            />
          </Button>
          <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={togglePublish}>
            {photo.status === "published" ? "Ukryj" : "Opublikuj"}
          </Button>
          <ConfirmDelete
            iconOnly
            onConfirm={async () => {
              const result = await deleteGalleryPhoto(photo.id);
              if (result.ok) onDeleted();
              return result;
            }}
            title="Usunąć zdjęcie?"
            description="Zdjęcie zniknie z galerii, a oba pliki (miniatura i wersja pełna) zostaną skasowane z magazynu R2."
          />
        </>
      }
    />
  );
}
