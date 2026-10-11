"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ChevronUp, Copy, Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
  FormProvider,
  type FieldErrors,
} from "react-hook-form";
import { toast } from "sonner";

import { saveTest } from "@/app/admin/(shell)/tests/actions";
import { Field } from "@/components/admin/field";
import { RecoveryNotice, useFormRecovery } from "@/components/admin/form-recovery";
import { SaveActions, SAVED_MESSAGE, type SaveMode } from "@/components/admin/save-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/slug";
import { cn } from "@/lib/utils";
import { testEditorSchema, type TestEditorInput } from "@/lib/validations/screening";

import { DEFAULT_OPTIONS } from "./defaults";

type Band = TestEditorInput["bands"][number];

/**
 * The whole test on one page, saved at once: the basics, the questions with
 * their answers and points, the result ranges, and — folded away — the
 * address and SEO. Same form for a new test and an existing one.
 *
 * A new question copies the previous question's answers, because a screening
 * test almost always repeats one scale; "Użyj tej skali wszędzie" applies one
 * question's answers to all. Blank questions and ranges are dropped on save,
 * so an untouched empty card never blocks it.
 */
export function TestEditor({
  id,
  status,
  publishedAt,
  defaultValues,
}: {
  id: string | null;
  status: "draft" | "published" | null;
  publishedAt: string | null;
  defaultValues: TestEditorInput;
}) {
  const router = useRouter();
  const form = useForm<TestEditorInput>({
    resolver: zodResolver(testEditorSchema),
    defaultValues,
  });
  const {
    control,
    register,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;
  const recovery = useFormRecovery({ form, storageKey: `test:${id ?? "new"}` });

  const questions = useFieldArray({ control, name: "questions" });
  const bands = useFieldArray({ control, name: "bands", keyName: "key" });
  const watchedQuestions = useWatch({ control, name: "questions" }) ?? [];
  const watchedBands = useWatch({ control, name: "bands" }) ?? [];
  const maxScore = watchedQuestions.reduce(
    (total, question) =>
      total + Math.max(0, ...(question?.options ?? []).map((option) => Number(option?.points) || 0)),
    0,
  );

  const advancedError = Boolean(
    errors.slug || errors.metaTitle || errors.metaDescription || errors.sortOrder,
  );
  const [advancedOpen, setAdvancedOpen] = useState(false);

  function addQuestion() {
    const previous = getValues("questions").at(-1);
    questions.append(
      { text: "", options: structuredClone(previous?.options.length ? previous.options : DEFAULT_OPTIONS) },
      { focusName: `questions.${questions.fields.length}.text` },
    );
  }

  function applyScaleEverywhere(from: number) {
    if (!confirm("Ustawić te same odpowiedzi we wszystkich pytaniach?")) return;
    const scale = getValues(`questions.${from}.options`);
    getValues("questions").forEach((_, index) => {
      if (index !== from) {
        setValue(`questions.${index}.options`, structuredClone(scale), { shouldDirty: true });
      }
    });
    toast.success("Odpowiedzi są teraz takie same we wszystkich pytaniach.");
  }

  function addBand() {
    const last = getValues("bands").at(-1);
    const minScore = last ? Math.min(Number(last.maxScore) + 1, maxScore) : 0;
    bands.append(
      { minScore, maxScore, resultTitle: "", resultBody: "" },
      { focusName: `bands.${bands.fields.length}.resultTitle` },
    );
  }

  /** Drops cards nobody filled in, so they don't fail validation. */
  function dropBlanks() {
    const blankQuestions = getValues("questions")
      .map((question, index) => (question.text.trim() ? -1 : index))
      .filter((index) => index >= 0);
    if (blankQuestions.length) questions.remove(blankQuestions);
    const blankBands = getValues("bands")
      .map((band, index) => (band.resultTitle.trim() || band.resultBody.trim() ? -1 : index))
      .filter((index) => index >= 0);
    if (blankBands.length) bands.remove(blankBands);
  }

  async function onSubmit(values: TestEditorInput, mode: SaveMode) {
    const result = await saveTest(id, values, mode === "publish");
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    // New ranges got ids on the server; keep them, so the next save updates
    // the same rows (submissions point at them) instead of replacing them.
    result.data.bandIds.forEach((bandId, index) => setValue(`bands.${index}.bandId`, bandId));
    recovery.markSaved(getValues());
    toast.success(SAVED_MESSAGE[mode]);
    if (id) router.refresh();
    else router.replace(`/admin/tests/${result.data.id}`);
  }

  return (
    <FormProvider {...form}>
      <form noValidate className="flex flex-col gap-6" onSubmit={(event) => event.preventDefault()}>
        <RecoveryNotice recovery={recovery} />

        {/* 1 — basics */}
        <Section step={1} title="Podstawy" description="Co odwiedzający zobaczy, zanim zacznie odpowiadać.">
          <Field label="Tytuł testu" htmlFor="title" error={errors.title?.message}>
            <Input
              id="title"
              placeholder="np. Czy to już problem?"
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
            label="Krótki opis"
            htmlFor="description"
            hint="Jedno-dwa zdania na liście testów."
            error={errors.description?.message}
          >
            <Textarea id="description" rows={2} {...register("description")} />
          </Field>
          <Field
            label="Wstęp"
            htmlFor="introText"
            hint="Widoczny nad pierwszym pytaniem — np. czego dotyczą pytania i że odpowiedzi nie są zapisywane."
            error={errors.introText?.message}
          >
            <Textarea id="introText" rows={3} {...register("introText")} />
          </Field>
          <Field
            label="Zastrzeżenie"
            htmlFor="disclaimerText"
            hint="Przy wyniku i w PDF. Treść musi zaakceptować osoba merytorycznie odpowiedzialna."
            error={errors.disclaimerText?.message}
          >
            <Textarea id="disclaimerText" rows={2} {...register("disclaimerText")} />
          </Field>
        </Section>

        {/* 2 — questions */}
        <Section
          step={2}
          title="Pytania"
          description={
            watchedQuestions.length === 0
              ? "Dodaj pierwsze pytanie."
              : `${watchedQuestions.length} ${plural(watchedQuestions.length, "pytanie", "pytania", "pytań")} · maksymalny wynik: ${maxScore} pkt`
          }
        >
          {questions.fields.map((field, index) => (
            <QuestionCard
              key={field.id}
              index={index}
              count={questions.fields.length}
              onMove={(to) => questions.move(index, to)}
              onRemove={() => questions.remove(index)}
              onScaleEverywhere={() => applyScaleEverywhere(index)}
            />
          ))}
          <AddButton onClick={addQuestion}>Dodaj pytanie</AddButton>
        </Section>

        {/* 3 — results */}
        <Section
          step={3}
          title="Wyniki"
          description={`Co zobaczy osoba z daną sumą punktów. Zakres: 0–${maxScore} pkt.`}
        >
          <Coverage bands={watchedBands} maxScore={maxScore} />
          {bands.fields.map((field, index) => (
            <BandCard key={field.key} index={index} onRemove={() => bands.remove(index)} />
          ))}
          <AddButton onClick={addBand}>Dodaj wynik</AddButton>
        </Section>

        {/* 4 — address and SEO, rarely touched */}
        <details
          open={advancedOpen || advancedError}
          onToggle={(event) => setAdvancedOpen(event.currentTarget.open)}
          className="rounded-xl border bg-card"
        >
          <summary className="flex cursor-pointer items-center gap-3 px-6 py-4 text-sm font-medium">
            <StepBadge step={4} />
            Adres i SEO
            <span className="font-normal text-muted-foreground">— zwykle bez zmian</span>
          </summary>
          <div className="flex flex-col gap-4 border-t px-6 py-5">
            <Field
              label="Adres (slug)"
              htmlFor="slug"
              hint="Tworzy się sam z tytułu. Nie zmieniaj po publikacji — stare linki przestaną działać."
              error={errors.slug?.message}
            >
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                /testy/
                <Input id="slug" className="flex-1" {...register("slug")} />
              </div>
            </Field>
            <Field label="Tytuł meta (Google)" htmlFor="metaTitle" error={errors.metaTitle?.message}>
              <Input id="metaTitle" {...register("metaTitle")} />
            </Field>
            <Field label="Opis meta (Google)" htmlFor="metaDescription" error={errors.metaDescription?.message}>
              <Textarea id="metaDescription" rows={2} {...register("metaDescription")} />
            </Field>
            <Field
              label="Kolejność na liście testów"
              htmlFor="sortOrder"
              hint="Niższa liczba = wyżej."
              error={errors.sortOrder?.message}
            >
              <Input
                id="sortOrder"
                type="number"
                min={0}
                className="w-28"
                {...register("sortOrder", { valueAsNumber: true })}
              />
            </Field>
          </div>
        </details>

        <SaveActions
          status={status}
          publishedAt={publishedAt}
          submitting={isSubmitting}
          onSave={(mode) => {
            dropBlanks();
            void handleSubmit(
              (values) => onSubmit(values, mode),
              (invalid) => toast.error(firstError(invalid) ?? "Popraw zaznaczone pola."),
            )();
          }}
        />
      </form>
    </FormProvider>
  );
}

/* --------------------------------------------------------------- questions */

function QuestionCard({
  index,
  count,
  onMove,
  onRemove,
  onScaleEverywhere,
}: {
  index: number;
  count: number;
  onMove: (to: number) => void;
  onRemove: () => void;
  onScaleEverywhere: () => void;
}) {
  const { control, register, formState } = useFormContext<TestEditorInput>();
  const options = useFieldArray({ control, name: `questions.${index}.options` });
  const error = formState.errors.questions?.[index];

  return (
    <div className="rounded-lg border bg-background p-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium tabular-nums">Pytanie {index + 1}</span>
        <div className="ml-auto flex items-center">
          <IconButton label="Przesuń wyżej" disabled={index === 0} onClick={() => onMove(index - 1)}>
            <ChevronUp />
          </IconButton>
          <IconButton label="Przesuń niżej" disabled={index === count - 1} onClick={() => onMove(index + 1)}>
            <ChevronDown />
          </IconButton>
          <IconButton label="Usuń pytanie" onClick={onRemove} destructive>
            <Trash2 />
          </IconButton>
        </div>
      </div>

      <Textarea
        rows={2}
        className="mt-2"
        placeholder="Treść pytania"
        aria-label={`Treść pytania ${index + 1}`}
        aria-invalid={error?.text ? true : undefined}
        {...register(`questions.${index}.text`)}
      />
      {error?.text ? <p className="mt-1 text-sm text-destructive">{error.text.message}</p> : null}

      <div className="mt-4 flex flex-col gap-2">
        <div className="grid grid-cols-[minmax(0,1fr)_5rem_2rem] gap-2 text-xs text-muted-foreground">
          <span>Odpowiedź</span>
          <span>Punkty</span>
        </div>
        {options.fields.map((field, optionIndex) => {
          const optionError = error?.options?.[optionIndex];
          return (
            <div key={field.id} className="grid grid-cols-[minmax(0,1fr)_5rem_2rem] items-center gap-2">
              <Input
                placeholder="np. Tak"
                aria-label={`Odpowiedź ${optionIndex + 1}`}
                aria-invalid={optionError?.label ? true : undefined}
                {...register(`questions.${index}.options.${optionIndex}.label`)}
              />
              <Input
                type="number"
                min={0}
                aria-label={`Punkty za odpowiedź ${optionIndex + 1}`}
                aria-invalid={optionError?.points ? true : undefined}
                {...register(`questions.${index}.options.${optionIndex}.points`, { valueAsNumber: true })}
              />
              <IconButton label="Usuń odpowiedź" onClick={() => options.remove(optionIndex)}>
                <X />
              </IconButton>
            </div>
          );
        })}
        {options.fields.length === 0 ? (
          <p className="text-xs text-amber-700 dark:text-amber-400">
            Bez odpowiedzi tego testu nie da się opublikować.
          </p>
        ) : null}
        <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
          <TextButton
            onClick={() => options.append({ label: "", points: options.fields.length }, { shouldFocus: true })}
          >
            <Plus /> Dodaj odpowiedź
          </TextButton>
          {count > 1 && options.fields.length > 0 ? (
            <TextButton onClick={onScaleEverywhere}>
              <Copy /> Użyj tych odpowiedzi we wszystkich pytaniach
            </TextButton>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- results */

function BandCard({ index, onRemove }: { index: number; onRemove: () => void }) {
  const { register, formState } = useFormContext<TestEditorInput>();
  const error = formState.errors.bands?.[index];

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-background p-4">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-muted-foreground">Od</span>
        <Input
          type="number"
          min={0}
          className="w-20"
          aria-label="Od (punkty)"
          {...register(`bands.${index}.minScore`, { valueAsNumber: true })}
        />
        <span className="text-muted-foreground">do</span>
        <Input
          type="number"
          min={0}
          className="w-20"
          aria-label="Do (punkty)"
          aria-invalid={error?.maxScore ? true : undefined}
          {...register(`bands.${index}.maxScore`, { valueAsNumber: true })}
        />
        <span className="text-muted-foreground">pkt</span>
        <IconButton label="Usuń wynik" onClick={onRemove} destructive className="ml-auto">
          <Trash2 />
        </IconButton>
      </div>
      {error?.maxScore ? <p className="text-sm text-destructive">{error.maxScore.message}</p> : null}
      <Input
        placeholder="Tytuł wyniku, np. „Niskie ryzyko”"
        aria-label="Tytuł wyniku"
        aria-invalid={error?.resultTitle ? true : undefined}
        {...register(`bands.${index}.resultTitle`)}
      />
      {error?.resultTitle ? <p className="text-sm text-destructive">{error.resultTitle.message}</p> : null}
      <Textarea
        rows={3}
        placeholder="Co ten wynik oznacza i co warto zrobić dalej"
        aria-label="Treść wyniku"
        aria-invalid={error?.resultBody ? true : undefined}
        {...register(`bands.${index}.resultBody`)}
      />
      {error?.resultBody ? <p className="text-sm text-destructive">{error.resultBody.message}</p> : null}
    </div>
  );
}

/** Gaps and overlaps, as warnings — mid-edit they are normal, and scoring falls back. */
function Coverage({ bands, maxScore }: { bands: Partial<Band>[]; maxScore: number }) {
  const problems = describeCoverage(
    bands
      .map((band) => ({ min: Number(band?.minScore), max: Number(band?.maxScore) }))
      .filter((band) => Number.isFinite(band.min) && Number.isFinite(band.max))
      .sort((a, b) => a.min - b.min),
    maxScore,
  );
  if (problems.length === 0) return null;
  return (
    <ul className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
      {problems.map((problem) => (
        <li key={problem}>{problem}</li>
      ))}
    </ul>
  );
}

function describeCoverage(bands: { min: number; max: number }[], maxScore: number): string[] {
  if (bands.length === 0) return ["Dodaj przynajmniej jeden wynik — bez tego testu nie da się opublikować."];
  const problems: string[] = [];
  if (bands[0].min > 0) problems.push(`Wyniki 0–${bands[0].min - 1} pkt nie mają opisu.`);
  for (let i = 1; i < bands.length; i += 1) {
    const previous = bands[i - 1];
    const current = bands[i];
    if (current.min > previous.max + 1) problems.push(`Luka między ${previous.max} a ${current.min} pkt.`);
    else if (current.min <= previous.max) {
      problems.push(`Zakresy ${previous.min}–${previous.max} i ${current.min}–${current.max} nachodzą na siebie.`);
    }
  }
  const last = bands[bands.length - 1];
  if (last.max < maxScore) problems.push(`Wyniki powyżej ${last.max} pkt trafią do ostatniego zakresu.`);
  return problems;
}

/* ------------------------------------------------------------------ pieces */

function Section({
  step,
  title,
  description,
  children,
}: {
  step: number;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <StepBadge step={step} />
          <div>
            <h2 className="font-medium leading-6">{title}</h2>
            {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:pl-9">{children}</div>
      </CardContent>
    </Card>
  );
}

function StepBadge({ step }: { step: number }) {
  return (
    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium tabular-nums">
      {step}
    </span>
  );
}

function AddButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-lg border border-dashed py-3 text-sm text-muted-foreground transition-colors hover:border-ring hover:text-foreground"
    >
      <Plus className="size-4" aria-hidden /> {children}
    </button>
  );
}

function TextButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline [&_svg]:size-3.5"
    >
      {children}
    </button>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  destructive,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  destructive?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn("size-8", destructive && "hover:text-destructive", className)}
    >
      {children}
    </Button>
  );
}

function plural(n: number, one: string, few: string, many: string): string {
  if (n === 1) return one;
  const tens = n % 100;
  const units = n % 10;
  return units >= 2 && units <= 4 && (tens < 12 || tens > 14) ? few : many;
}

/** The first message in a nested error tree, for the toast on a failed save. */
function firstError(errors: FieldErrors): string | undefined {
  for (const value of Object.values(errors)) {
    if (!value) continue;
    if (typeof value === "object" && "message" in value && typeof value.message === "string") {
      return value.message;
    }
    if (typeof value === "object") {
      const nested = firstError(value as FieldErrors);
      if (nested) return nested;
    }
  }
  return undefined;
}
