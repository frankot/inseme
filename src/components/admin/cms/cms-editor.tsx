"use client";

import {
  AlertTriangle,
  Check,
  ChevronDown,
  ExternalLink,
  Eye,
  EyeOff,
  Lock,
  PencilOff,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, useController, useForm, useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { discardDraft, publishDraft, saveDraft } from "@/app/admin/(shell)/cms/actions";
import { FieldControl, RefOptionsProvider, type RefOptions } from "@/components/admin/cms/fields";
import { CmsPreview, type PreviewHandle } from "@/components/admin/cms/preview";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { seoLimits, type SectionDef } from "@/cms/define";
import { cmsPageList, getPageDef } from "@/cms/registry";
import type { PageDoc } from "@/cms/types";
import { cn } from "@/lib/utils";

type Status =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved"; at: string }
  | { kind: "error"; message: string }
  | { kind: "conflict" };

const SEO = "seo";
const AUTOSAVE_MS = 800;

/**
 * The one editor every CMS page uses (plans/CMS_PLAN.md §4.3): the section
 * outline, the selected section's form, and the live preview of the draft.
 * The form is the whole page doc; changes autosave to the draft, the preview
 * refreshes after each save, `Opublikuj` makes the draft live.
 */
export function CmsEditor({
  pageKey,
  initialDoc,
  publishedDoc,
  initialVersion,
  initialErrors,
  hasDraft: initialHasDraft,
  publishedLabel,
  refOptions,
}: {
  pageKey: string;
  initialDoc: PageDoc;
  publishedDoc: PageDoc;
  initialVersion: number;
  initialErrors: Record<string, string[]>;
  hasDraft: boolean;
  publishedLabel: string;
  refOptions: RefOptions;
}) {
  // The definition is code, imported here rather than serialised from the server.
  const def = getPageDef(pageKey)!;
  const router = useRouter();
  const form = useForm<PageDoc>({ defaultValues: initialDoc });
  const [selected, setSelected] = useState<string>(def.sections[0].id);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState(initialErrors);
  const [hasDraft, setHasDraft] = useState(initialHasDraft);
  const [confirm, setConfirm] = useState<"publish" | "discard" | null>(null);
  const [busy, setBusy] = useState(false);

  const version = useRef(initialVersion);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlight = useRef<Promise<boolean> | null>(null);
  const again = useRef(false);
  const suppress = useRef(false);
  const preview = useRef<PreviewHandle>(null);
  // What "Odrzuć szkic" and "Przywróć opublikowaną" go back to; moves on publish.
  const published = useRef(publishedDoc);

  /**
   * Sends the current form to the draft. Resolves false on failure. A change
   * made while a save is in flight queues one more round rather than racing it.
   */
  const save = useCallback(async (): Promise<boolean> => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    if (inFlight.current) {
      again.current = true;
      return inFlight.current;
    }

    const once = async () => {
      setStatus({ kind: "saving" });
      const result = await saveDraft(pageKey, form.getValues(), version.current);
      if (!result.ok) {
        setStatus("conflict" in result ? { kind: "conflict" } : { kind: "error", message: result.error });
        return false;
      }
      version.current = result.data.version;
      setErrors(result.data.errors);
      setHasDraft(true);
      setStatus({ kind: "saved", at: result.data.savedAt });
      preview.current?.refresh();
      return true;
    };

    const run = (async () => {
      let ok: boolean;
      do {
        again.current = false;
        ok = await once();
      } while (ok && again.current);
      return ok;
    })();
    inFlight.current = run;
    try {
      return await run;
    } finally {
      inFlight.current = null;
    }
  }, [form, pageKey]);

  // Autosave: every change restarts a short timer.
  useEffect(() => {
    return form.subscribe({
      formState: { values: true },
      callback: () => {
        if (suppress.current) return;
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => void save(), AUTOSAVE_MS);
        setStatus((current) => (current.kind === "conflict" ? current : { kind: "idle" }));
      },
    });
  }, [form, save]);

  // Don't let a pending save be lost to a closed tab.
  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (timer.current || inFlight.current) event.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  /** Switch to another CMS page — after the pending save, so nothing is lost. */
  async function goTo(href: string) {
    if (timer.current || inFlight.current) await save();
    router.push(href);
  }

  function select(id: string) {
    setSelected(id);
    if (id !== SEO) preview.current?.focus(id);
  }

  async function publish() {
    setBusy(true);
    try {
      if (!(await save())) return;
      const result = await publishDraft(pageKey, version.current);
      if (!result.ok) {
        if ("conflict" in result) setStatus({ kind: "conflict" });
        toast.error(result.error);
        return;
      }
      version.current = result.data.version;
      published.current = structuredClone(form.getValues());
      setHasDraft(false);
      toast.success("Opublikowano — strona odświeży się w ciągu kilku sekund.");
      router.refresh();
    } finally {
      setBusy(false);
      setConfirm(null);
    }
  }

  async function discard() {
    setBusy(true);
    try {
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
      await inFlight.current;
      const result = await discardDraft(pageKey, version.current);
      if (!result.ok) {
        if ("conflict" in result) setStatus({ kind: "conflict" });
        toast.error(result.error);
        return;
      }
      version.current = result.data.version;
      suppress.current = true;
      form.reset(published.current);
      queueMicrotask(() => {
        suppress.current = false;
      });
      setHasDraft(false);
      setErrors({});
      setStatus({ kind: "idle" });
      preview.current?.refresh();
      toast.success("Odrzucono szkic.");
    } finally {
      setBusy(false);
      setConfirm(null);
    }
  }

  const section = def.sections.find((s) => s.id === selected);
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <FormProvider {...form}>
      <RefOptionsProvider value={refOptions}>
        <div className="-mx-4 -my-6 flex h-[calc(100svh-3.5rem)] flex-col overflow-hidden lg:-mx-8">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b px-4 py-2.5">
            <div className="min-w-0">
              <Link href="/admin/cms" className="text-xs text-muted-foreground hover:underline">
                CMS
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="-ml-1 flex items-center gap-1 rounded-md px-1 text-lg font-semibold leading-tight outline-none hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring/50"
                  aria-label={`${def.label} — przełącz stronę CMS`}
                >
                  <h1 className="truncate">{def.label}</h1>
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-60">
                  {cmsPageList.map((page) => (
                    <DropdownMenuItem
                      key={page.key}
                      onClick={() => void goTo(`/admin/cms/${page.adminSlug}`)}
                    >
                      {page.key === def.key ? <Check aria-hidden /> : <span className="size-4" />}
                      {page.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <SaveStatus status={status} hasDraft={hasDraft} publishedLabel={publishedLabel} />
            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                render={<a href={`/admin/preview/${def.key}`} target="_blank" rel="noopener" />}
              >
                <ExternalLink aria-hidden /> Podgląd
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!hasDraft || busy}
                onClick={() => setConfirm("discard")}
              >
                Odrzuć szkic
              </Button>
              <Button
                size="sm"
                disabled={!hasDraft || hasErrors || busy || status.kind === "conflict"}
                title={hasErrors ? "Popraw błędy oznaczone w konspekcie." : undefined}
                onClick={() => setConfirm("publish")}
              >
                Opublikuj
              </Button>
            </div>
          </div>

          {/*
            One row pinned to the space left under the header. Without the
            explicit `minmax(0,1fr)` row the grid's implicit row grows to the
            tallest column, the editor outgrows the viewport and the whole
            admin page scrolls past its end. Each column scrolls on its own.
          */}
          <div className="grid min-h-0 flex-1 grid-cols-[12rem_minmax(20rem,28rem)_minmax(0,1fr)] grid-rows-[minmax(0,1fr)] overflow-hidden">
            {/* Outline */}
            <nav aria-label="Sekcje strony" className="overflow-y-auto border-r p-2">
              <p className="px-2 pt-1 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Sekcje
              </p>
              <OutlineRow
                active={selected === SEO}
                onClick={() => select(SEO)}
                icon={<Search className="size-3.5" aria-hidden />}
                label="SEO"
                error={Boolean(errors.seo)}
              />
              <Outline def={def.sections} selected={selected} errors={errors} onSelect={select} />
            </nav>

            {/* Form */}
            <div className="overflow-y-auto border-r p-4">
              {selected === SEO ? (
                <SeoForm />
              ) : section ? (
                <SectionForm
                  key={section.id}
                  section={section}
                  errors={errors[section.id] ?? []}
                  onRestore={() =>
                    form.setValue(`sections.${section.id}`, published.current.sections[section.id], {
                      shouldDirty: true,
                    })
                  }
                />
              ) : null}
            </div>

            {/* Preview */}
            <CmsPreview ref={preview} pageKey={def.key} />
          </div>
        </div>

        <AlertDialog open={confirm !== null} onOpenChange={(open) => !open && setConfirm(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {confirm === "publish" ? "Opublikować zmiany?" : "Odrzucić szkic?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {confirm === "publish"
                  ? "Szkic zastąpi treść widoczną na stronie."
                  : "Zmiany w szkicu zostaną usunięte, a formularz wróci do wersji opublikowanej."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={busy}>Anuluj</AlertDialogCancel>
              <AlertDialogAction
                disabled={busy}
                onClick={() => void (confirm === "publish" ? publish() : discard())}
              >
                {confirm === "publish" ? "Opublikuj" : "Odrzuć szkic"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </RefOptionsProvider>
    </FormProvider>
  );
}

function SaveStatus({
  status,
  hasDraft,
  publishedLabel,
}: {
  status: Status;
  hasDraft: boolean;
  publishedLabel: string;
}) {
  const time = (iso: string) =>
    new Date(iso).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
  const text =
    status.kind === "saving"
      ? "Zapisywanie…"
      : status.kind === "saved"
        ? `● Szkic zapisany ${time(status.at)}`
        : status.kind === "error"
          ? `Błąd zapisu — ${status.message}`
          : status.kind === "conflict"
            ? "Ktoś inny zmienił tę stronę — odśwież, aby zobaczyć zmiany."
            : hasDraft
              ? "● Szkic ma nieopublikowane zmiany"
              : publishedLabel;
  return (
    <p
      role="status"
      className={cn(
        "text-xs",
        status.kind === "error" || status.kind === "conflict" ? "text-destructive" : "text-muted-foreground",
      )}
    >
      {text}
    </p>
  );
}

function Outline({
  def,
  selected,
  errors,
  onSelect,
}: {
  def: SectionDef[];
  selected: string;
  errors: Record<string, string[]>;
  onSelect: (id: string) => void;
}) {
  const { setValue } = useFormContext<PageDoc>();
  const sections = useWatch({ name: "sections" }) as PageDoc["sections"] | undefined;
  let n = 0;
  return def.map((section) => {
    const enabled = sections?.[section.id]?.enabled ?? true;
    const number = section.numbered && enabled ? String(++n).padStart(2, "0") : null;
    const canToggle = section.canDisable !== false && !section.locked;
    return (
      <OutlineRow
        key={section.id}
        active={selected === section.id}
        onClick={() => onSelect(section.id)}
        icon={
          // Padlock: always on the page, can't be hidden. Pencil-off: not
          // editable in the CMS yet (Opinie). Eye: click to hide or show.
          section.locked ? (
            <PencilOff className="size-3.5" aria-hidden />
          ) : !canToggle ? (
            <Lock className="size-3.5" aria-hidden />
          ) : enabled ? (
            <Eye className="size-3.5" aria-hidden />
          ) : (
            <EyeOff className="size-3.5" aria-hidden />
          )
        }
        onIconClick={
          canToggle
            ? () => setValue(`sections.${section.id}.enabled`, !enabled, { shouldDirty: true })
            : undefined
        }
        iconLabel={
          canToggle
            ? enabled
              ? `Ukryj sekcję „${section.label}”`
              : `Pokaż sekcję „${section.label}”`
            : section.locked
              ? "Tej sekcji nie edytuje się jeszcze w CMS"
              : "Tej sekcji nie można ukryć"
        }
        label={section.label}
        number={number}
        dim={!enabled || Boolean(section.locked)}
        error={Boolean(errors[section.id])}
      />
    );
  });
}

function OutlineRow({
  active,
  onClick,
  icon,
  onIconClick,
  iconLabel,
  label,
  number,
  dim,
  error,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  /** Set for the eye: a click on it switches the section on or off. */
  onIconClick?: () => void;
  iconLabel?: string;
  label: string;
  number?: string | null;
  dim?: boolean;
  error?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex w-full items-center rounded-md text-sm transition-colors",
        active ? "bg-accent font-medium text-accent-foreground" : "hover:bg-accent/50",
        dim && "text-muted-foreground",
      )}
    >
      {onIconClick ? (
        <button
          type="button"
          onClick={onIconClick}
          aria-label={iconLabel}
          title={iconLabel}
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
        >
          {icon}
        </button>
      ) : (
        <span title={iconLabel} className="flex size-7 shrink-0 items-center justify-center text-muted-foreground/60">
          {icon}
        </span>
      )}
      <button
        type="button"
        onClick={onClick}
        aria-current={active ? "true" : undefined}
        className="flex min-w-0 flex-1 items-center gap-2 py-1.5 pr-2 text-left"
      >
        <span className="w-5 shrink-0 text-xs tabular-nums text-muted-foreground">{number}</span>
        <span className="min-w-0 flex-1 truncate">{label}</span>
        {error && <AlertTriangle className="size-3.5 shrink-0 text-destructive" aria-label="Błędy" />}
      </button>
    </div>
  );
}

function SectionForm({
  section,
  errors,
  onRestore,
}: {
  section: SectionDef;
  errors: string[];
  onRestore: () => void;
}) {
  const { field } = useController({ name: `sections.${section.id}.enabled` });
  const canDisable = section.canDisable !== false && !section.locked;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-base font-semibold">{section.label}</h2>
        {!section.locked && (
          <button
            type="button"
            className="text-xs text-muted-foreground underline-offset-2 hover:underline"
            onClick={onRestore}
          >
            Przywróć opublikowaną
          </button>
        )}
      </div>

      {canDisable && (
        // Not a wrapping <label>: the switch renders a button plus a hidden
        // input, and a label around both toggles it twice per click.
        <div className="flex items-center gap-3 rounded-md border px-3 py-2 text-sm">
          <Switch
            id={`visible-${section.id}`}
            checked={Boolean(field.value)}
            onCheckedChange={(v) => field.onChange(v)}
          />
          <Label htmlFor={`visible-${section.id}`}>Widoczna na stronie</Label>
        </div>
      )}

      {errors.length > 0 && (
        <ul className="flex flex-col gap-1 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

      {section.locked ? (
        <p className="rounded-md border border-dashed px-3 py-6 text-center text-sm text-muted-foreground">
          {section.locked}
        </p>
      ) : (
        <FieldControl spec={section.fields} name={`sections.${section.id}.data`} />
      )}
    </div>
  );
}

function SeoForm() {
  const title = useController({ name: "seo.title" }).field;
  const description = useController({ name: "seo.description" }).field;
  const count = (value: unknown) => (typeof value === "string" ? value.length : 0);
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-base font-semibold">SEO</h2>
      <p className="text-sm text-muted-foreground">
        Tytuł i opis, które pokazują wyszukiwarki. Google wyświetla zwykle do{" "}
        {seoLimits.recommended.title} znaków tytułu i {seoLimits.recommended.description} znaków
        opisu — dłuższe są ucinane.
      </p>
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between">
          <Label htmlFor="seo-title">Tytuł strony</Label>
          <Len n={count(title.value)} rec={seoLimits.recommended.title} />
        </div>
        <Input id="seo-title" value={title.value ?? ""} onChange={(e) => title.onChange(e.target.value)} />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between">
          <Label htmlFor="seo-description">Opis</Label>
          <Len n={count(description.value)} rec={seoLimits.recommended.description} />
        </div>
        <Textarea
          id="seo-description"
          rows={4}
          value={description.value ?? ""}
          onChange={(e) => description.onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

function Len({ n, rec }: { n: number; rec: number }) {
  return (
    <span className={cn("text-xs tabular-nums", n > rec ? "text-amber-600" : "text-muted-foreground")}>
      {n} / {rec}
    </span>
  );
}
