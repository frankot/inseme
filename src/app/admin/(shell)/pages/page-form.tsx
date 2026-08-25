"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { savePage } from "@/app/admin/(shell)/pages/actions";
import { BlockEditor } from "@/components/admin/block-editor";
import { Field } from "@/components/admin/field";
import { MediaPicker } from "@/components/admin/media-picker";
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
import { pageSchema, type PageInput } from "@/lib/validations/content";

const pageTypeLabels: Record<string, string> = {
  standard: "Strona zwykła",
  service: "Strona usługi",
};

export function PageForm({
  id,
  defaultValues,
  defaultOgImage,
  mediaLibrary,
}: {
  id: string | null;
  defaultValues: PageInput;
  defaultOgImage: MediaSummary | null;
  mediaLibrary: MediaSummary[];
}) {
  const router = useRouter();
  const [ogImage, setOgImage] = useState<MediaSummary | null>(defaultOgImage);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<PageInput>({
    resolver: zodResolver(pageSchema),
    defaultValues,
  });

  async function onSubmit(values: PageInput) {
    const result = await savePage(id, values);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Zapisano szkic.");
    if (!id) router.push(`/admin/pages/${result.data.id}`);
    else router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
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
                  // Only fill an empty slug — never silently change a live URL.
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
              hint="Fragment adresu URL, np. „cennik”."
              error={errors.slug?.message}
            >
              <Input id="slug" {...register("slug")} />
            </Field>
          </div>

          <Field label="Typ strony" error={errors.pageType?.message}>
            <Controller
              control={control}
              name="pageType"
              render={({ field }) => (
                <Select value={field.value} onValueChange={(next) => field.onChange(next)}>
                  <SelectTrigger className="w-56">
                    <SelectValue>
                      {(value: string) => pageTypeLabels[value] ?? "Strona zwykła"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Strona zwykła</SelectItem>
                    <SelectItem value="service">Strona usługi</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nagłówek hero" htmlFor="heroTitle" error={errors.heroTitle?.message}>
              <Input id="heroTitle" {...register("heroTitle")} />
            </Field>
            <Field
              label="Podtytuł hero"
              htmlFor="heroSubtitle"
              error={errors.heroSubtitle?.message}
            >
              <Input id="heroSubtitle" {...register("heroSubtitle")} />
            </Field>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sekcje treści</CardTitle>
        </CardHeader>
        <CardContent>
          <Controller
            control={control}
            name="sections"
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
          <CardTitle>SEO i udostępnianie</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Field
            label="Tytuł meta"
            htmlFor="metaTitle"
            hint="Do 70 znaków. Pusty = tytuł strony."
            error={errors.metaTitle?.message}
          >
            <Input id="metaTitle" {...register("metaTitle")} />
          </Field>
          <Field
            label="Opis meta"
            htmlFor="metaDescription"
            hint="Do 180 znaków."
            error={errors.metaDescription?.message}
          >
            <Textarea id="metaDescription" rows={3} {...register("metaDescription")} />
          </Field>
          <Field label="Obraz Open Graph">
            <MediaPicker
              value={ogImage}
              onChange={(item) => {
                setOgImage(item);
                setValue("ogImageId", item?.id ?? null, { shouldDirty: true });
              }}
            />
          </Field>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Zapisywanie…" : "Zapisz szkic"}
        </Button>
      </div>
    </form>
  );
}
