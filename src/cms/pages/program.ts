import { definePage, defineSection } from "@/cms/define";
import { f, paragraphs } from "@/cms/fields";
import { jedenDzienDefaults } from "@/content/home";
import { programPageDefaults as copy } from "@/content/program";

import { stageBandData, stageBandFields } from "./shared";

/**
 * /program: the opening with the overview, one section per stage (the ids are
 * the band anchors — `rodzina` is linked from the homepage and /dla-rodziny),
 * and the day plan, which renders after the stationary stage.
 */

export const STAGE_IDS = ["stacjonarny", "ambulatoryjny", "rodzina", "pro"] as const;

const stageSection = (id: (typeof STAGE_IDS)[number], label: string) =>
  defineSection({
    id,
    label,
    fields: f.group(label, {
      cardTitle: f.text("Karta: tytuł", { max: 60 }),
      cardMeta: f.text("Karta: nadtytuł", { max: 40 }),
      summary: f.textarea("Karta: opis", { max: 300 }),
      ...stageBandFields,
    }),
  });

export const programPage = definePage({
  key: "program",
  adminSlug: "program",
  label: "Program",
  route: "/program",
  sections: [
    defineSection({
      id: "intro",
      label: "Otwarcie",
      canDisable: false,
      fields: f.group("Otwarcie", {
        breadcrumbLabel: f.text("Okruszek", { max: 40 }),
        title: f.text("Tytuł (H1)", { max: 90 }),
        lead: f.textarea("Wstęp", { max: 500 }),
        body: f.textarea("Drugi akapit", { max: 500 }),
        cardLinkLabel: f.text("Link na kartach etapów", { max: 30 }),
        detoxNote: f.textarea("Notka o detoksie", { max: 300 }),
        detoxLink: f.link("Link przy notce"),
      }),
    }),
    stageSection("stacjonarny", "Program stacjonarny"),
    defineSection({
      id: "dzien",
      label: "Jeden dzień",
      fields: f.group("Jeden dzień", {
        eyebrow: f.text("Nadtytuł", { max: 40 }),
        title: f.text("Tytuł", { max: 90 }),
        lead: f.textarea("Wstęp", { max: 400 }),
        body: paragraphs("Akapity", 0, 3),
        scheduleLabel: f.text("Nagłówek planu", { max: 60 }),
        note: f.textarea("Notka (niedziela)", { max: 400 }),
        entries: f.list(
          "Plan dnia",
          f.group("Pozycja", {
            time: f.text("Godzina", { max: 20 }),
            title: f.text("Co", { max: 60 }),
            detail: f.textarea("Szczegóły", { max: 200, optional: true }),
          }),
          { min: 1, max: 16, titleKey: "time" },
        ),
      }),
    }),
    stageSection("ambulatoryjny", "Program ambulatoryjny"),
    stageSection("rodzina", "Wsparcie dla bliskich"),
    stageSection("pro", "Program PRO"),
  ],
  seed: () => ({
    schemaVersion: 1,
    seo: { title: copy.metaTitle, description: copy.metaDescription },
    sections: {
      intro: {
        enabled: true,
        data: {
          breadcrumbLabel: copy.breadcrumbLabel,
          title: copy.title,
          lead: copy.lead,
          body: copy.body,
          cardLinkLabel: copy.cardLinkLabel,
          detoxNote: copy.detoxNote,
          detoxLink: copy.detoxLink,
        },
      },
      dzien: {
        enabled: true,
        data: {
          eyebrow: jedenDzienDefaults.eyebrow,
          title: jedenDzienDefaults.title,
          lead: jedenDzienDefaults.lead,
          body: jedenDzienDefaults.body,
          scheduleLabel: jedenDzienDefaults.scheduleLabel,
          note: jedenDzienDefaults.note,
          entries: jedenDzienDefaults.entries,
        },
      },
      ...Object.fromEntries(
        copy.stages.map((stage) => [
          stage.id,
          {
            enabled: true,
            data: {
              cardTitle: stage.cardTitle,
              cardMeta: stage.cardMeta,
              summary: stage.summary,
              ...stageBandData(stage),
            },
          },
        ]),
      ),
    },
  }),
});
