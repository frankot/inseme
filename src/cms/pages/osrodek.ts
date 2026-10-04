import { definePage, defineSection } from "@/cms/define";
import { f, paragraphs } from "@/cms/fields";
import { osrodekPageDefaults as copy, type OsrodekPageContent } from "@/content/osrodek";

/**
 * /osrodek, one section per band. The data keys are the content object's own
 * keys, so the page renders `{ ...osrodekPageDefaults, ...each section }` and
 * whatever is not listed here (breadcrumb home label, gallery href) stays in
 * code. The photo opening the page comes from /admin/gallery first; the image
 * here is its fallback. The four room photos are the exception: the CMS stores
 * them as `{ title, body, image }` and the view flattens them.
 */

const text = (label: string, max = 90) => f.text(label, { max });
const lines = (label: string, max: number, itemMax = 300) =>
  f.list(label, f.textarea("Pozycja", { max: itemMax }), { min: 1, max });

export const osrodekPage = definePage({
  key: "osrodek",
  adminSlug: "osrodek",
  label: "Ośrodek",
  route: "/osrodek",
  sections: [
    defineSection({
      id: "intro",
      label: "Otwarcie",
      canDisable: false,
      fields: f.group("Otwarcie", {
        breadcrumbLabel: text("Okruszek", 40),
        title: text("Tytuł (H1)"),
        lead: paragraphs("Wstęp", 1, 3),
        facts: f.list(
          "Dane obok wstępu",
          f.group("Dana", { label: text("Etykieta", 30), value: text("Wartość", 30) }),
          { min: 2, max: 6, titleKey: "label" },
        ),
        heroFallback: f.image("Zdjęcie otwierające", {
          hint: "Używane, dopóki w Galerii nie ma opublikowanego zdjęcia — wtedy pierwsze z nich.",
        }),
        statsLinkLabel: text("Link pod zdjęciem", 40),
        locationTitle: text("Lokalizacja: tytuł", 60),
        location: paragraphs("Lokalizacja: akapity", 1, 4),
      }),
    }),
    defineSection({
      id: "wnetrze",
      label: "Jak wygląda Insieme",
      fields: f.group("Jak wygląda Insieme", {
        aspectsEyebrow: text("Nadtytuł", 40),
        aspectsTitle: text("Tytuł"),
        aspectsLead: paragraphs("Wstęp", 1, 3),
        aspects: f.list(
          "Aspekty",
          f.group("Aspekt", {
            title: text("Nadtytuł", 40),
            lead: text("Zdanie główne", 120),
            body: paragraphs("Akapity", 1, 3),
          }),
          { min: 1, max: 6, titleKey: "title" },
        ),
      }),
    }),
    defineSection({
      id: "galeria",
      label: "Galeria",
      fields: f.group("Galeria", {
        galleryEyebrow: text("Nadtytuł", 40),
        galleryTitle: text("Tytuł"),
        galleryLead: paragraphs("Wstęp", 1, 3),
        galleryLinkLabel: text("Link do galerii", 40),
        spaces: f.list(
          "Pomieszczenia",
          f.group("Pomieszczenie", {
            title: text("Nazwa", 40),
            body: f.textarea("Opis", { max: 160 }),
            image: f.image("Zdjęcie"),
          }),
          { min: 4, max: 4, titleKey: "title", hint: "Dokładnie cztery — siatka zdjęć." },
        ),
      }),
    }),
    defineSection({
      id: "udogodnienia",
      label: "Udogodnienia",
      fields: f.group("Udogodnienia", {
        amenitiesEyebrow: text("Nadtytuł", 40),
        amenitiesTitle: text("Tytuł"),
        amenitiesLead: f.textarea("Wstęp", { max: 500 }),
        amenities: f.list(
          "Udogodnienia",
          f.group("Udogodnienie", {
            title: text("Nazwa", 80),
            body: paragraphs("Akapity", 1, 3),
          }),
          { min: 1, max: 8, titleKey: "title" },
        ),
      }),
    }),
    defineSection({
      id: "przyjazd",
      label: "Przyjazd",
      fields: f.group("Przyjazd", {
        arrivalEyebrow: text("Nadtytuł", 40),
        arrivalTitle: text("Tytuł"),
        arrivalLead: paragraphs("Wstęp", 1, 3),
        packingTitle: text("Co zabrać: tytuł", 60),
        packingLead: f.textarea("Co zabrać: wstęp", { max: 300 }),
        packing: lines("Co zabrać: lista", 14, 160),
        packingNotes: f.list("Co zabrać: notki", f.textarea("Notka", { max: 300 }), { max: 4 }),
        travelTitle: text("Dojazd: tytuł", 60),
        travelAddressLead: text("Dojazd: zdanie przed adresem", 60),
        travelAddress: lines("Dojazd: adres (miejscownik, „przy …”)", 3, 60),
        travel: lines("Dojazd: wskazówki", 6),
        firstDayTitle: text("Pierwszy dzień: tytuł", 120),
        firstDayBody: f.textarea("Pierwszy dzień: treść", { max: 500 }),
        firstDayCtaLabel: text("Pierwszy dzień: przycisk", 40),
      }),
    }),
  ],
  seed: () => ({
    schemaVersion: 1,
    seo: { title: copy.metaTitle, description: copy.metaDescription },
    sections: {
      intro: {
        enabled: true,
        data: pick(copy, [
          "breadcrumbLabel",
          "title",
          "lead",
          "facts",
          "heroFallback",
          "statsLinkLabel",
          "locationTitle",
          "location",
        ]),
      },
      wnetrze: {
        enabled: true,
        data: pick(copy, ["aspectsEyebrow", "aspectsTitle", "aspectsLead", "aspects"]),
      },
      galeria: {
        enabled: true,
        data: {
          ...pick(copy, ["galleryEyebrow", "galleryTitle", "galleryLead", "galleryLinkLabel"]),
          spaces: copy.spaces.map((space) => ({
            title: space.title,
            body: space.body,
            image: { src: space.src, alt: space.alt },
          })),
        },
      },
      udogodnienia: {
        enabled: true,
        data: pick(copy, ["amenitiesEyebrow", "amenitiesTitle", "amenitiesLead", "amenities"]),
      },
      przyjazd: {
        enabled: true,
        data: pick(copy, [
          "arrivalEyebrow",
          "arrivalTitle",
          "arrivalLead",
          "packingTitle",
          "packingLead",
          "packing",
          "packingNotes",
          "travelTitle",
          "travelAddressLead",
          "travelAddress",
          "travel",
          "firstDayTitle",
          "firstDayBody",
          "firstDayCtaLabel",
        ]),
      },
    },
  }),
});

function pick<K extends keyof OsrodekPageContent>(
  source: OsrodekPageContent,
  keys: K[],
): Pick<OsrodekPageContent, K> {
  return Object.fromEntries(keys.map((key) => [key, source[key]])) as Pick<OsrodekPageContent, K>;
}
