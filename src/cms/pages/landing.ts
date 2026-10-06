import { definePage, defineSection } from "@/cms/define";
import { f } from "@/cms/fields";
import {
  faqDefaults,
  heroDefaults,
  osrodekDefaults,
  pierwszyKontaktDefaults,
} from "@/content/home";
import { teamTeaserDefaults } from "@/content/team";
import { FAQ_FEATURED_MAX } from "@/lib/validations/content";

/**
 * The homepage (plans/CMS_PLAN.md §7). Kontakt (08) and the footer stay in
 * code until a global phase; Opinie is listed but locked — the reviews are
 * hardcoded verbatim quotes and are not editable here yet.
 */

export const LANDING_TITLE = "Ośrodek leczenia uzależnień Warszawa – Magdalenka | Insieme";
export const LANDING_DESCRIPTION =
  "Prywatny ośrodek leczenia uzależnień w Magdalence. Detoks, terapia stacjonarna, wsparcie dla rodziny. Rozmowa nie zobowiązuje do przyjazdu.";

const titledItem = (max: number) =>
  f.group("Punkt", {
    title: f.text("Tytuł", { max: 90 }),
    body: f.textarea("Treść", { max }),
  });

const contactPath = f.group("Ścieżka", {
  tabLabel: f.text("Etykieta przełącznika", { max: 30 }),
  cardTitle: f.text("Tytuł karty", { max: 60 }),
  cardBody: f.textarea("Opis karty", { max: 300 }),
  chooseLabel: f.text("Napis na karcie (niewybrana)", { max: 40 }),
  selectedLabel: f.text("Napis na karcie (wybrana)", { max: 40 }),
  title: f.text("Tytuł sekcji", { max: 90 }),
  lead: f.textarea("Wstęp", { max: 400 }),
  points: f.list("Obietnice", titledItem(300), { min: 1, max: 4, titleKey: "title" }),
  steps: f.list("Kroki", titledItem(400), {
    min: 1,
    max: 6,
    titleKey: "title",
    hint: "Numery kroków nadawane są automatycznie.",
  }),
  note: f.text("Notka przy przycisku", { max: 120, optional: true }),
  ctaLabel: f.text("Przycisk telefonu", { max: 30 }),
  secondary: f.link("Drugi link"),
});

export const landingPage = definePage({
  key: "landing",
  adminSlug: "strona-glowna",
  label: "Strona główna",
  route: "/",
  sections: [
    defineSection({
      id: "hero",
      label: "Hero",
      canDisable: false,
      fields: f.group("Hero", {
        eyebrow: f.text("Nadtytuł", { max: 90 }),
        title: f.textarea("Tytuł", { max: 90 }),
        lead: f.textarea("Wstęp", { max: 400 }),
        trust: f.list("Zapewnienia pod przyciskiem", f.text("Zapewnienie", { max: 70 }), {
          max: 4,
        }),
        rpwdl: f.group("Wpis do RPWDL", {
          statement: f.text("Zdanie nad numerem", { max: 90, optional: true }),
          number: f.text("Numer w RPWDL", { max: 20 }),
        }),
        image: f.image("Zdjęcie w tle"),
      }),
    }),
    defineSection({
      id: "kontakt",
      label: "Pierwszy kontakt",
      numbered: true,
      fields: f.group("Pierwszy kontakt", {
        eyebrow: f.text("Nadtytuł", { max: 40 }),
        paths: f.list("Ścieżki", contactPath, {
          min: 2,
          max: 2,
          fixedLabels: ["Dla siebie", "Dla bliskiej osoby"],
        }),
      }),
    }),
    defineSection({
      id: "test",
      label: "Test przesiewowy",
      numbered: true,
      fields: f.group("Test przesiewowy", {
        testId: f.ref("Test na stronie głównej", "test", {
          hint: "Puste = test „Czy to już problem?”. Tytuł i opis pochodzą z samego testu.",
        }),
      }),
    }),
    defineSection({
      id: "osrodek",
      label: "Ośrodek",
      numbered: true,
      fields: f.group("Ośrodek", {
        eyebrow: f.text("Nadtytuł", { max: 40 }),
        title: f.textarea("Tytuł", { max: 120 }),
        body: f.textarea("Opis", { max: 500 }),
        stats: f.list(
          "Liczby",
          f.group("Liczba", {
            value: f.text("Wartość", { max: 12 }),
            label: f.text("Podpis", { max: 40 }),
          }),
          { max: 4, titleKey: "value" },
        ),
        // No photo fields: the mosaic shows the gallery photos starred in
        // /admin/gallery (up to four, in gallery order), with the figures in
        // `osrodekDefaults` as the fallback while none are.
      }),
    }),
    defineSection({
      id: "poradnik",
      label: "Z poradnika",
      numbered: true,
      fields: f.group("Z poradnika", {
        articleId: f.ref("Artykuł", "article", {
          hint: "Puste = najnowszy opublikowany artykuł. Bez artykułów sekcja pokazuje program i ceny.",
        }),
      }),
    }),
    defineSection({
      id: "zespol",
      label: "Zespół",
      numbered: true,
      fields: f.group("Zespół", {
        eyebrow: f.text("Nadtytuł", { max: 40 }),
        title: f.text("Tytuł", { max: 90 }),
        lead: f.textarea("Wstęp", { max: 500 }),
        teamIds: f.ref("Osoby", "team", {
          multiple: true,
          max: 4,
          hint: "Puste = pierwsze cztery osoby według kolejności w Zespole.",
        }),
      }),
    }),
    defineSection({
      id: "opinie",
      label: "Opinie",
      numbered: true,
      locked:
        "Opinie to cytaty z Google i osrodkiterapii.pl, wpisane w kodzie (content/opinie.ts). Edycja w CMS — wkrótce.",
      fields: f.group("Opinie", {}),
    }),
    defineSection({
      id: "faq",
      label: "Pytania",
      numbered: true,
      fields: f.group("Pytania", {
        eyebrow: f.text("Nadtytuł", { max: 40 }),
        title: f.text("Tytuł", { max: 90 }),
        note: f.textarea("Notka", { max: 300 }),
        faqIds: f.ref("Pytania na stronie głównej", "faq", {
          multiple: true,
          max: FAQ_FEATURED_MAX,
          hint: `Do ${FAQ_FEATURED_MAX}. Puste = pierwsze pytania według kolejności w FAQ.`,
        }),
      }),
    }),
  ],
  seed: () => ({
    schemaVersion: 1,
    seo: { title: LANDING_TITLE, description: LANDING_DESCRIPTION },
    sections: {
      hero: {
        enabled: true,
        data: {
          eyebrow: heroDefaults.eyebrow,
          title: heroDefaults.title,
          lead: heroDefaults.lead,
          trust: heroDefaults.trust,
          rpwdl: { statement: heroDefaults.rpwdl.statement, number: heroDefaults.rpwdl.number },
          image: heroDefaults.image,
        },
      },
      kontakt: {
        enabled: true,
        data: {
          eyebrow: pierwszyKontaktDefaults.eyebrow,
          paths: pierwszyKontaktDefaults.paths.map((path) => ({
            tabLabel: path.tabLabel,
            cardTitle: path.cardTitle,
            cardBody: path.cardBody,
            chooseLabel: path.chooseLabel,
            selectedLabel: path.selectedLabel,
            title: path.title,
            lead: path.lead,
            points: path.points,
            steps: path.steps.map(({ title, body }) => ({ title, body })),
            note: path.note || undefined,
            ctaLabel: path.ctaLabel,
            secondary: { label: path.secondaryLabel, href: path.secondaryHref },
          })),
        },
      },
      test: { enabled: true, data: { testId: null } },
      osrodek: {
        enabled: true,
        data: {
          eyebrow: osrodekDefaults.eyebrow,
          title: osrodekDefaults.title,
          body: osrodekDefaults.body,
          stats: osrodekDefaults.stats,
          figures: osrodekDefaults.figures,
        },
      },
      poradnik: { enabled: true, data: { articleId: null } },
      zespol: {
        enabled: true,
        data: {
          eyebrow: teamTeaserDefaults.eyebrow,
          title: teamTeaserDefaults.title,
          lead: teamTeaserDefaults.lead,
          teamIds: [],
        },
      },
      opinie: { enabled: true, data: {} },
      faq: {
        enabled: true,
        data: {
          eyebrow: faqDefaults.eyebrow,
          title: faqDefaults.title,
          note: faqDefaults.note,
          faqIds: [],
        },
      },
    },
  }),
});

