"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, FormProvider, useFieldArray, useForm, type UseFormReturn } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
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

/** One source per line, as the change note's preview of the published list. */
function beforeSources(value: unknown) {
  const list = Array.isArray(value) ? (value as ArticleInput["sources"]) : [];
  return list.length
    ? list.map((source) => (source.url ? `${source.title} — ${source.url}` : source.title)).join("\n")
    : <em>(brak)</em>;
}

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
              <CardTitle>Źródła</CardTitle>
            </CardHeader>
            <CardContent>
              <TrackedField name="sources" before={beforeSources}>
                <SourcesField form={form} />
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

/**
 * Optional sources, listed in small type at the foot of the article: a name a
 * reader can recognise and, for anything online, its address. In the order
 * typed here.
 */
function SourcesField({ form }: { form: UseFormReturn<ArticleInput> }) {
  const {
    control,
    register,
    formState: { errors },
  } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "sources" });

  return (
    <div className="flex flex-col gap-4">
      {fields.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Brak. Opcjonalnie — np. „Odpowiedź Ministra Zdrowia na interpelację nr 19628, 7.10.2026”
          i adres strony. Pojawią się pod artykułem jako numerowana lista źródeł.
        </p>
      ) : (
        fields.map((field, index) => (
          <div
            key={field.id}
            className="grid items-start gap-3 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto]"
          >
            <Field
              label="Nazwa"
              htmlFor={`sources.${index}.title`}
              error={errors.sources?.[index]?.title?.message}
            >
              <Input
                id={`sources.${index}.title`}
                placeholder="np. Charakterystyka produktu leczniczego Anticol"
                {...register(`sources.${index}.title`)}
              />
            </Field>
            <Field
              label="Adres (opcjonalnie)"
              htmlFor={`sources.${index}.url`}
              error={errors.sources?.[index]?.url?.message}
            >
              <Input
                id={`sources.${index}.url`}
                type="url"
                placeholder="https://…"
                {...register(`sources.${index}.url`)}
              />
            </Field>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive sm:mt-7"
              aria-label="Usuń źródło"
              onClick={() => remove(index)}
            >
              <Trash2 className="size-4" aria-hidden />
            </Button>
          </div>
        ))
      )}

      {errors.sources?.message ? (
        <p className="text-sm text-destructive">{errors.sources.message}</p>
      ) : null}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="self-start"
        disabled={fields.length >= 30}
        onClick={() => append({ title: "", url: "" })}
      >
        <Plus className="size-4" aria-hidden /> Dodaj źródło
      </Button>
    </div>
  );
}
