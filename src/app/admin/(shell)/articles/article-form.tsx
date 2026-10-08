"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { saveArticle } from "@/app/admin/(shell)/articles/actions";
import { BlockEditor } from "@/components/admin/block-editor";
import { Field } from "@/components/admin/field";
import { RecoveryNotice, useFormRecovery } from "@/components/admin/form-recovery";
import { SaveActions, SAVED_MESSAGE, type SaveMode } from "@/components/admin/save-actions";
import { MediaPicker } from "@/components/admin/media-picker";
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
}) {
  const router = useRouter();
  const [coverImage, setCoverImage] = useState<MediaSummary | null>(defaultCoverImage);
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
    const result = await saveArticle(id, values, mode === "publish");
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    recovery.markSaved(values);
    toast.success(SAVED_MESSAGE[mode]);
    router.push("/admin/articles");
  }

  return (
    <form onSubmit={(event) => event.preventDefault()} className="flex flex-col gap-6" noValidate>
      <RecoveryNotice recovery={recovery} />

      <Card>
        <CardHeader>
          <CardTitle>Podstawy</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
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
            <Field
              label="Adres (slug)"
              htmlFor="slug"
              hint={slugLocked ? "Stały adres — linkują do niego inne strony." : undefined}
              error={errors.slug?.message}
            >
              <Input id="slug" readOnly={slugLocked} {...register("slug")} />
            </Field>
          </div>

          <Field
            label="Wstęp (zajawka)"
            htmlFor="excerpt"
            hint="Kilka zdań wprowadzenia pod tytułem artykułu, przed treścią. Ten sam tekst jest na liście artykułów, na stronie głównej i — gdy „Opis meta” jest pusty — w Google. Do 400 znaków."
            error={errors.excerpt?.message}
          >
            <Textarea id="excerpt" rows={3} {...register("excerpt")} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
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
            <Field
              label="Osoba spoza zespołu"
              htmlFor="authorReviewer"
              hint="Tylko gdy weryfikował(a) ktoś, kogo nie ma w zakładce Zespół. Imię, nazwisko i funkcja."
              error={errors.authorReviewer?.message}
            >
              <Input id="authorReviewer" {...register("authorReviewer")} />
            </Field>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Treść</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Zdjęcie główne i SEO</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Field label="Zdjęcie główne">
            <MediaPicker
              value={coverImage}
              onChange={(item) => {
                setCoverImage(item);
                setValue("coverImageId", item?.id ?? null, { shouldDirty: true });
              }}
            />
          </Field>
          <Field label="Tytuł meta" htmlFor="metaTitle" error={errors.metaTitle?.message}>
            <Input id="metaTitle" {...register("metaTitle")} />
          </Field>
          <Field
            label="Opis meta"
            htmlFor="metaDescription"
            error={errors.metaDescription?.message}
          >
            <Textarea id="metaDescription" rows={3} {...register("metaDescription")} />
          </Field>
        </CardContent>
      </Card>

      <SaveActions
        status={status}
        publishedAt={publishedAt}
        submitting={isSubmitting}
        canDraft={!slugLocked}
        onSave={(mode) => void handleSubmit((values) => onSubmit(values, mode))()}
      />
    </form>
  );
}
