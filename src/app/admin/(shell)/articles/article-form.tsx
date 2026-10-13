"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  discardArticleChanges,
  saveArticle,
  unpublishArticle,
} from "@/app/admin/(shell)/articles/actions";
import { BlockEditor } from "@/components/admin/block-editor";
import { PublishedProvider } from "@/components/admin/cms/diff";
import { Field } from "@/components/admin/field";
import { RecoveryNotice, useFormRecovery } from "@/components/admin/form-recovery";
import { SaveActions, SAVED_MESSAGE, type SaveMode } from "@/components/admin/save-actions";
import { MediaPicker } from "@/components/admin/media-picker";
import { PendingChangesBanner, TrackedField } from "@/components/admin/pending-changes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { MediaSummary } from "@/lib/media-types";
import { slugify } from "@/lib/slug";
import { articleSchema, type ArticleInput } from "@/lib/validations/content";

/** Who can be picked as the reviewer — everyone in Zespół, drafts included. */
export type ReviewerOption = { id: string; name: string; role: string | null; published: boolean };

/** The Select needs a string; "no team member" is this sentinel, never a uuid. */
const NO_REVIEWER = "none";

export function ArticleForm({
  id,
  status,
  publishedAt,
  defaultValues,
  defaultCoverImage,
  mediaLibrary,
  team,
  slugLocked = false,
  published = null,
  pendingSavedAt = null,
}: {
  id: string | null;
  defaultValues: ArticleInput;
  defaultCoverImage: MediaSummary | null;
  mediaLibrary: MediaSummary[];
  team: ReviewerOption[];
  /** A protected article (`lib/protected-articles.ts`) keeps its address. */
  slugLocked?: boolean;
  status: "draft" | "published" | null;
  publishedAt: string | null;
  /** The live article in the form's shape — given for a published article only. */
  published?: ArticleInput | null;
  /** When the pending changes were saved; null when there are none. */
  pendingSavedAt?: string | null;
}) {
  const router = useRouter();
  const [coverImage, setCoverImage] = useState<MediaSummary | null>(defaultCoverImage);
  const [pendingAt, setPendingAt] = useState(pendingSavedAt);
  const [busy, setBusy] = useState(false);
  const mediaById = (mediaId: unknown) => mediaLibrary.find((item) => item.id === mediaId) ?? null;
  const form = useForm<ArticleInput>({
    resolver: zodResolver(articleSchema),
    defaultValues,
  });
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = form;
  const recovery = useFormRecovery({
    form,
    storageKey: `article:${id ?? "new"}`,
    onRestore: (values) =>
      setCoverImage(mediaLibrary.find((item) => item.id === values.coverImageId) ?? null),
  });

  async function onSubmit(values: ArticleInput, mode: SaveMode) {
    const result = await saveArticle(id, values, mode);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    recovery.markSaved(values);
    toast.success(SAVED_MESSAGE[mode]);
    router.push("/admin/articles");
  }

  const save = (mode: SaveMode) => void handleSubmit((values) => onSubmit(values, mode))();

  async function hide() {
    if (!id) return;
    setBusy(true);
    const result = await unpublishArticle(id);
    setBusy(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Ukryto — artykuł nie jest widoczny na stronie.");
    router.refresh();
  }

  async function discard() {
    if (!id || !published) return;
    setBusy(true);
    const result = await discardArticleChanges(id);
    setBusy(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    form.reset(published);
    setCoverImage(mediaById(published.coverImageId));
    recovery.markSaved(published);
    setPendingAt(null);
    toast.success("Odrzucono zmiany — formularz pokazuje wersję ze strony.");
    router.refresh();
  }

  const publishedCover = published ? mediaById(published.coverImageId) : null;

  return (
    <FormProvider {...form}>
      <PublishedProvider value={status === "published" ? published : null}>
        <form onSubmit={(event) => event.preventDefault()} className="flex flex-col gap-6" noValidate>
          <RecoveryNotice recovery={recovery} />
          {status === "published" && pendingAt ? (
            <PendingChangesBanner
              savedAt={pendingAt}
              busy={busy || isSubmitting}
              onPublish={() => save("publish")}
              onDiscard={() => void discard()}
            />
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle>Podstawy</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <TrackedField name="title">
                  <Field label="Tytuł" htmlFor="title" error={errors.title?.message}>
                    <Input
                      id="title"
                      {...register("title", {
                        onBlur: (event) => {
                          if (!getValues("slug")) {
                            setValue("slug", slugify(event.target.value), { shouldValidate: true });
                          }
                        },
                      })}
                    />
                  </Field>
                </TrackedField>
                <TrackedField name="slug">
                  <Field
                    label="Adres (slug)"
                    htmlFor="slug"
                    hint={slugLocked ? "Stały adres — linkują do niego inne strony." : undefined}
                    error={errors.slug?.message}
                  >
                    <Input id="slug" readOnly={slugLocked} {...register("slug")} />
                  </Field>
                </TrackedField>
              </div>

              <TrackedField name="excerpt">
                <Field
                  label="Wstęp (zajawka)"
                  htmlFor="excerpt"
                  hint="Kilka zdań wprowadzenia pod tytułem artykułu, przed treścią. Ten sam tekst jest na liście artykułów, na stronie głównej i — gdy „Opis meta” jest pusty — w Google. Do 400 znaków."
                  error={errors.excerpt?.message}
                >
                  <Textarea id="excerpt" rows={3} {...register("excerpt")} />
                </Field>
              </TrackedField>

              <div className="grid gap-4 sm:grid-cols-2">
                <TrackedField name="reviewerId" before={(value) => team.find((member) => member.id === value)?.name ?? <em>(nikt z zespołu)</em>}>
                  <Field
                    label="Osoba weryfikująca z zespołu"
                    hint="Wymagane przed publikacją (to albo pole obok). Artykuł pokaże jej zdjęcie, funkcję i link do biogramu."
                    error={errors.reviewerId?.message}
                  >
                    <Controller
                      control={control}
                      name="reviewerId"
                      render={({ field }) => (
                        <Select
                          value={field.value ?? NO_REVIEWER}
                          onValueChange={(next) =>
                            field.onChange(next === NO_REVIEWER ? null : next)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue>
                              {(value: string) => {
                                const person = team.find((member) => member.id === value);
                                return person ? person.name : "— nikt z zespołu —";
                              }}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={NO_REVIEWER}>— nikt z zespołu —</SelectItem>
                            {team.map((member) => (
                              <SelectItem key={member.id} value={member.id}>
                                {member.name}
                                {member.role ? ` — ${member.role}` : ""}
                                {member.published ? "" : " (szkic)"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                </TrackedField>
                <TrackedField name="authorReviewer">
                  <Field
                    label="Osoba spoza zespołu"
                    htmlFor="authorReviewer"
                    hint="Tylko gdy weryfikował(a) ktoś, kogo nie ma w zakładce Zespół. Imię, nazwisko i funkcja."
                    error={errors.authorReviewer?.message}
                  >
                    <Input id="authorReviewer" {...register("authorReviewer")} />
                  </Field>
                </TrackedField>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Treść</CardTitle>
            </CardHeader>
            <CardContent>
              <TrackedField name="body" before={() => null}>
                <Controller
                  control={control}
                  name="body"
                  render={({ field }) => (
                    <BlockEditor
                      value={field.value}
                      onChange={field.onChange}
                      mediaLibrary={mediaLibrary}
                    />
                  )}
                />
              </TrackedField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Zdjęcie główne i SEO</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <TrackedField name="coverImageId" before={() =>
                  publishedCover ? (
                    // eslint-disable-next-line @next/next/no-img-element -- a small preview in the change note
                    <img src={publishedCover.url} alt="" className="h-24 w-auto rounded" />
                  ) : (
                    <em>(bez zdjęcia)</em>
                  )
                }
                onRestore={() => setCoverImage(publishedCover)}>
                <Field label="Zdjęcie główne">
                  <MediaPicker
                    value={coverImage}
                    onChange={(item) => {
                      setCoverImage(item);
                      setValue("coverImageId", item?.id ?? null, { shouldDirty: true });
                    }}
                  />
                </Field>
              </TrackedField>
              <TrackedField name="metaTitle">
                <Field label="Tytuł meta" htmlFor="metaTitle" error={errors.metaTitle?.message}>
                  <Input id="metaTitle" {...register("metaTitle")} />
                </Field>
              </TrackedField>
              <TrackedField name="metaDescription">
                <Field
                  label="Opis meta"
                  htmlFor="metaDescription"
                  error={errors.metaDescription?.message}
                >
                  <Textarea id="metaDescription" rows={3} {...register("metaDescription")} />
                </Field>
              </TrackedField>
            </CardContent>
          </Card>

          <SaveActions
            status={status}
            publishedAt={publishedAt}
            submitting={isSubmitting || busy}
            canDraft={!slugLocked}
            pendingChanges={id ? { savedAt: pendingAt } : undefined}
            onHide={() => void hide()}
            onSave={save}
          />
        </form>
      </PublishedProvider>
    </FormProvider>
  );
}
