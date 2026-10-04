import { definePage, defineSection } from "@/cms/define";
import { f, paragraphs, points } from "@/cms/fields";
import { detoksIKwalifikacjaDefaults } from "@/content/intent/detoks-i-kwalifikacja";
import { dlaRodzinyDefaults } from "@/content/intent/dla-rodziny";
import { leczenieAlkoholizmuDefaults } from "@/content/intent/leczenie-alkoholizmu";
import type { IntentPageContent } from "@/content/intent/types";

import { stageBandData, stageBandFields } from "./shared";

/**
 * The three SEO intent pages (plans/CMS_PLAN.md §11.1). One definition, three
 * pages: the same eight sections, each page seeded from its own content file.
 * Section `id`s inside the content (the anchors) stay in code.
 */

const titled = (label: string, max: number) =>
  f.group(label, { title: f.text("Tytuł", { max: 90 }), body: f.textarea("Treść", { max }) });

const sections = [
  defineSection({
    id: "intro",
    label: "Otwarcie",
    canDisable: false,
    fields: f.group("Otwarcie", {
      breadcrumbLabel: f.text("Okruszek", { max: 40 }),
      title: f.textarea("Tytuł (H1)", { max: 90 }),
      lead: paragraphs("Wstęp", 1, 3, "Pierwszy akapit jest większy."),
      summaryTitle: f.text("Nagłówek skrótu", { max: 30 }),
      summary: f.list("W skrócie", f.textarea("Zdanie", { max: 220 }), {
        min: 3,
        max: 4,
        hint: "Bezpośrednia odpowiedź na pytanie strony — to cytują wyszukiwarki i asystenci AI.",
      }),
      image: f.image("Zdjęcie", { caption: true }),
    }),
  }),
  defineSection({
    id: "explain",
    label: "Pas z listą",
    numbered: true,
    fields: f.group("Pas z listą", stageBandFields),
  }),
  defineSection({
    id: "steps",
    label: "Kroki",
    numbered: true,
    fields: f.group("Kroki", {
      label: f.text("Nadtytuł", { max: 40 }),
      title: f.text("Tytuł", { max: 90 }),
      lead: paragraphs("Wstęp", 1, 2),
      steps: f.list("Kroki", titled("Krok", 400), { min: 2, max: 6, titleKey: "title" }),
      note: f.textarea("Notka", { max: 300, optional: true }),
      link: f.link("Link", { optional: true }),
    }),
  }),
  defineSection({
    id: "statement",
    label: "Ciemny pas",
    numbered: true,
    fields: f.group("Ciemny pas", {
      label: f.text("Nadtytuł", { max: 40 }),
      statement: f.textarea("Zdanie główne", { max: 140, hint: "Duży cytat otwierający pas." }),
      body: paragraphs("Akapity", 1, 2),
      points: points("Punkty", 0, 3, "optional"),
      closing: f.textarea("Zakończenie", { max: 400, optional: true }),
    }),
  }),
  defineSection({
    id: "cards",
    label: "Karty",
    numbered: true,
    fields: f.group("Karty", {
      label: f.text("Nadtytuł", { max: 40 }),
      title: f.text("Tytuł", { max: 90 }),
      lead: f.textarea("Wstęp", { max: 500 }),
      numbered: f.toggle("Numeruj karty", { hint: "Dla kolejnych etapów, nie dla zbioru." }),
      cards: f.list("Karty", titled("Karta", 300), { min: 2, max: 6, titleKey: "title" }),
      note: f.textarea("Notka", { max: 400, optional: true }),
      link: f.link("Link", { optional: true }),
    }),
  }),
  defineSection({
    id: "feature",
    label: "Zdjęcie z tekstem",
    numbered: true,
    fields: f.group("Zdjęcie z tekstem", {
      label: f.text("Nadtytuł", { max: 40 }),
      title: f.text("Tytuł", { max: 90 }),
      body: paragraphs("Akapity", 1, 2),
      image: f.image("Zdjęcie"),
      facts: f.list(
        "Liczby",
        f.group("Liczba", {
          value: f.text("Wartość", { max: 14 }),
          label: f.text("Podpis", { max: 40 }),
        }),
        { max: 4, titleKey: "value", hint: "Liczby albo punkty — zwykle jedno z dwojga." },
      ),
      points: points("Punkty", 0, 4, "optional"),
      note: f.textarea("Notka", { max: 400, optional: true }),
      link: f.link("Link", { optional: true }),
    }),
  }),
  defineSection({
    id: "faq",
    label: "Pytania",
    numbered: true,
    fields: f.group("Pytania", {
      label: f.text("Nadtytuł", { max: 40 }),
      title: f.text("Tytuł", { max: 90 }),
      lead: f.textarea("Wstęp", { max: 300 }),
      category: f.select(
        "Kategoria pytań",
        [
          { value: "alkohol", label: "alkohol" },
          { value: "rodzina", label: "rodzina" },
          { value: "detoks", label: "detoks" },
          { value: "nfz", label: "nfz" },
        ],
        { hint: "Pytania z tą kategorią w FAQ. Sekcja znika, gdy nie ma żadnego." },
      ),
    }),
  }),
  defineSection({
    id: "related",
    label: "Powiązane i telefon",
    fields: f.group("Powiązane i telefon", {
      label: f.text("Nadtytuł", { max: 40 }),
      title: f.text("Tytuł", { max: 90 }),
      linkLabel: f.text("Napis na kartach", { max: 20 }),
      links: f.list(
        "Linki",
        f.group("Link", {
          title: f.text("Tytuł", { max: 60 }),
          body: f.textarea("Opis", { max: 200 }),
          href: f.text("Adres", { max: 200, hint: "Ścieżka na stronie, np. /dla-rodziny" }),
        }),
        { min: 1, max: 4, titleKey: "title" },
      ),
      call: f.group("Telefon", {
        title: f.text("Tytuł", { max: 90 }),
        body: f.textarea("Treść", { max: 300 }),
        ctaLabel: f.text("Przycisk", { max: 30 }),
      }),
    }),
  }),
];

/** Content blocks carry their anchor `id`; the stored doc does not. */
function omitId<T extends { id: string }>(block: T): Omit<T, "id"> {
  const copy: Partial<T> = { ...block };
  delete copy.id;
  return copy as Omit<T, "id">;
}

function intentSeed(copy: IntentPageContent) {
  const explain = stageBandData(copy.explain);
  const steps = omitId(copy.steps);
  const statement = omitId(copy.statement);
  const cards = omitId(copy.cards);
  const feature = omitId(copy.feature);
  const on = (data: unknown) => ({ enabled: true, data });
  return {
    schemaVersion: 1 as const,
    seo: { title: copy.metaTitle, description: copy.metaDescription },
    sections: {
      intro: on({ breadcrumbLabel: copy.breadcrumbLabel, ...copy.intro }),
      explain: on(explain),
      steps: on(steps),
      statement: on(statement),
      cards: on({ ...cards, numbered: cards.numbered ?? false }),
      feature: on({ ...feature, facts: feature.facts ?? [], points: feature.points ?? [] }),
      faq: on(copy.faq),
      related: on({ ...copy.related, call: copy.call }),
    },
  };
}

const intentPage = (key: string, label: string, copy: IntentPageContent) =>
  definePage({
    key,
    adminSlug: key,
    label,
    route: copy.path,
    sections,
    seed: () => intentSeed(copy),
  });

export const leczenieAlkoholizmuPage = intentPage(
  "leczenie-alkoholizmu",
  "Leczenie alkoholizmu",
  leczenieAlkoholizmuDefaults,
);
export const dlaRodzinyPage = intentPage("dla-rodziny", "Dla rodziny", dlaRodzinyDefaults);
export const detoksIKwalifikacjaPage = intentPage(
  "detoks-i-kwalifikacja",
  "Detoks i kwalifikacja",
  detoksIKwalifikacjaDefaults,
);
