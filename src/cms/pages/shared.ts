import { f, paragraphs, points } from "@/cms/fields";
import type { StageBand } from "@/content/program";

/**
 * Field groups used by more than one page: the stage band (/program's stages
 * and the intent pages' 01) and the plain titled point.
 */

export const stageBandFields = {
  meta: f.text("Nadtytuł", { max: 40, optional: true }),
  title: f.text("Tytuł", { max: 90 }),
  intro: paragraphs("Wstęp", 1, 3, "Pierwszy akapit jest większy."),
  pointsTitle: f.text("Nagłówek listy", { max: 60, optional: true }),
  points: points("Punkty", 1, 8, "optional"),
  closing: f.list("Zakończenie", f.textarea("Akapit", { max: 400 }), {
    max: 2,
    hint: "Wyróżnione zdania pod listą.",
  }),
  link: f.link("Link", { optional: true }),
};

/** The editable part of a stage band — `id` stays in code (it is the anchor). */
export function stageBandData(band: StageBand) {
  return {
    meta: band.meta,
    title: band.title,
    intro: band.intro,
    pointsTitle: band.pointsTitle,
    points: band.points,
    closing: band.closing ?? [],
    link: band.link,
  };
}
