import type { TestEditorInput } from "@/lib/validations/screening";

/**
 * Starting values for the test editor. A plain module, not part of the client
 * component, because the server-rendered "Nowy test" page builds its defaults
 * from it too.
 */

/** The scale a new test starts with — the yes/no screener is the common case. */
export const DEFAULT_OPTIONS: TestEditorInput["questions"][number]["options"] = [
  { label: "Nie", points: 0 },
  { label: "Tak", points: 1 },
];

/** A new test: the basics empty, one question with the default scale, no results yet. */
export function emptyTest(): TestEditorInput {
  return {
    title: "",
    slug: "",
    description: "",
    introText: "",
    disclaimerText:
      "Test ma charakter orientacyjny i nie jest diagnozą. Nie zastępuje rozmowy z terapeutą ani badania lekarskiego.",
    metaTitle: "",
    metaDescription: "",
    sortOrder: 0,
    questions: [{ text: "", options: structuredClone(DEFAULT_OPTIONS) }],
    bands: [],
  };
}
