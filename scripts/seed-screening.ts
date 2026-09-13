/**
 * Seeds the screening test that the homepage features: AUDIT, in the Polish
 * version published by PARPA / Krajowe Centrum Przeciwdziałania Uzależnieniom.
 *
 *   npm run seed:screening
 *   npm run seed:screening -- --reset   # rebuild questions/bands from scratch
 *
 * ── Why AUDIT rather than questions of our own ──────────────────────────────
 * AUDIT (Test Rozpoznawania Zaburzeń Związanych z Piciem Alkoholu) is the WHO
 * instrument Polish addiction services actually use, and it has an adapted,
 * validated Polish translation — see PARPA's "Adaptacja i walidacja testu AUDIT
 * do warunków polskich". The five questions this file used to carry were
 * invented for the design and had no validation behind them at all, which on a
 * treatment centre's site is the wrong kind of placeholder.
 *
 * Wording below follows the KCPU/PARPA "Autodiagnoza" sheet:
 *   https://kcpu.gov.pl/wp-content/uploads/2022/11/autodiagnoza.pdf
 *   https://www.parpa.pl/index.php/szkody-zdrowotne-i-uzaleznienie/1344-test-audit-wersja-zwalidowana
 * Verb forms are normalised to the "stwierdzał/a Pan/Pani" style the PARPA
 * sheet uses, since the KCPU rendering mixes feminine forms with "Pani/Pan".
 *
 * ── Three things to settle before this goes live ────────────────────────────
 * 1. Have a clinician on the team read the questions, the option labels and the
 *    band copy. Scoring is mechanical; the wording of a result is not.
 * 2. AUDIT is a WHO instrument. Reproduction and translation are permitted for
 *    non-commercial purposes; a private ośrodek's site is arguably commercial,
 *    so confirm with the client's lawyer and attribute WHO on the page.
 * 3. The original has skip logic — Q1 "nigdy" jumps to Q9, and Q2+Q3 = 0 does
 *    the same. The engine is deliberately linear (no branching), so all ten are
 *    asked. That costs the respondent a few seconds and changes no score: a
 *    non-drinker answers 0 to Q2–Q8 anyway.
 *
 * The natural companions for the other two tests /testy promises are DUDIT for
 * substances and a gambling screen; both want the same treatment as this one —
 * a published instrument, not questions we wrote.
 *
 * Idempotent on the test's slug. Without --reset an existing test keeps its
 * questions, so a re-run never clobbers edits made in the panel.
 */
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

const SLUG = "test-przesiewowy-alkohol";

/** Q1. Frequency of drinking at all. */
const FREQ_DRINKING = [
  { label: "nigdy", points: 0 },
  { label: "raz w miesiącu lub rzadziej", points: 1 },
  { label: "2 do 4 razy w miesiącu", points: 2 },
  { label: "2 do 3 razy w tygodniu", points: 3 },
  { label: "4 razy w tygodniu lub częściej", points: 4 },
];

/** Q2. Standard drinks on a typical drinking day. */
const QUANTITY = [
  { label: "1 lub 2 porcje", points: 0 },
  { label: "3 lub 4 porcje", points: 1 },
  { label: "5 lub 6 porcji", points: 2 },
  { label: "7, 8 lub 9 porcji", points: 3 },
  { label: "10 lub więcej porcji", points: 4 },
];

/** Q3–Q8. The standard AUDIT frequency scale. */
const FREQ = [
  { label: "nigdy", points: 0 },
  { label: "rzadziej niż raz w miesiącu", points: 1 },
  { label: "raz w miesiącu", points: 2 },
  { label: "raz w tygodniu", points: 3 },
  { label: "codziennie lub prawie codziennie", points: 4 },
];

/** Q9–Q10. Three options, scored 0 / 2 / 4 — not 0–4. */
const EVER = [
  { label: "nie", points: 0 },
  { label: "tak, ale nie w ostatnim roku", points: 2 },
  { label: "tak, w ciągu ostatniego roku", points: 4 },
];

/** Highest reachable total is 40: eight questions at 4, two more at 4. */
const QUESTIONS: { text: string; options: { label: string; points: number }[] }[] = [
  {
    text: "Jak często pije Pan/Pani napoje zawierające alkohol?",
    options: FREQ_DRINKING,
  },
  {
    text: "Ile porcji standardowych zawierających alkohol wypija Pan/Pani w trakcie typowego dnia picia?",
    options: QUANTITY,
  },
  {
    text: "Jak często wypija Pan/Pani sześć lub więcej porcji alkoholu podczas jednej okazji?",
    options: FREQ,
  },
  {
    text: "Jak często w ciągu ostatniego roku stwierdzał/a Pan/Pani, że nie może zaprzestać picia po jego rozpoczęciu?",
    options: FREQ,
  },
  {
    text: "Jak często w ciągu ostatniego roku z powodu picia alkoholu nie zrobił/a Pan/Pani tego, czego zazwyczaj od Pana/Pani oczekiwano?",
    options: FREQ,
  },
  {
    text: "Jak często w ciągu ostatniego roku musiał/a się Pan/Pani rano napić, aby dojść do siebie po dużym piciu z poprzedniego dnia?",
    options: FREQ,
  },
  {
    text: "Jak często w ciągu ostatniego roku doświadczał/a Pan/Pani poczucia winy lub wyrzutów sumienia po wypiciu alkoholu?",
    options: FREQ,
  },
  {
    text: "Jak często w ciągu ostatniego roku nie był/a Pan/Pani w stanie z powodu picia przypomnieć sobie, co wydarzyło się poprzedniego wieczoru?",
    options: FREQ,
  },
  {
    text: "Czy zdarzyło się, że Pan/Pani lub jakaś inna osoba doznała urazu w wyniku Pana/Pani picia?",
    options: EVER,
  },
  {
    text: "Czy ktoś z rodziny, znajomy, lekarz lub inny pracownik ochrony zdrowia był zaniepokojony Pana/Pani piciem lub sugerował jego ograniczenie?",
    options: EVER,
  },
];

/**
 * The four AUDIT bands and their standard cut-offs. The titles are the
 * instrument's own categories; the bodies are ours, and are deliberately free
 * of any promise about treatment working — see art. 14 ustawy o działalności
 * leczniczej.
 */
const BANDS = [
  {
    minScore: 0,
    maxScore: 7,
    resultTitle: "Picie o niskim poziomie ryzyka.",
    resultBody:
      "Wynik nie wskazuje na wzorzec picia, który zwykle prowadzi do szkód. Jeśli mimo to coś Cię niepokoi — samo pytanie „czy to już problem?” bywa ważniejsze niż punkty. Możesz zadzwonić i po prostu o tym porozmawiać.",
  },
  {
    minScore: 8,
    maxScore: 15,
    resultTitle: "Ryzykowne spożywanie alkoholu.",
    resultBody:
      "Wzorzec picia, przy którym szkody jeszcze nie muszą być widoczne, ale ryzyko rośnie. To moment, w którym najłatwiej coś zmienić — i w którym najczęściej nikt jeszcze o niczym nie mówi na głos.",
  },
  {
    minScore: 16,
    maxScore: 19,
    resultTitle: "Szkodliwe picie alkoholu.",
    resultBody:
      "Odpowiedzi wskazują na picie, które prawdopodobnie już powoduje szkody — zdrowotne, zawodowe albo w relacjach. Warto omówić je z terapeutą albo lekarzem, niezależnie od tego, co zdecydujesz dalej.",
  },
  {
    minScore: 20,
    maxScore: 40,
    resultTitle: "Wynik wskazuje na podejrzenie uzależnienia.",
    resultBody:
      "Test nie stawia diagnozy — robi to człowiek, po rozmowie. Ale taki wynik zwykle oznacza, że samo ograniczanie picia nie wystarcza. Rozmowa z terapeutą nie zobowiązuje do przyjazdu i nie kończy się ofertą.",
  },
];

async function main() {
  const { db } = await import("../src/db");
  const {
    screeningTestAnswerOptions,
    screeningTestQuestions,
    screeningTestResultBands,
    screeningTests,
  } = await import("../src/db/schema");
  const { eq } = await import("drizzle-orm");

  const reset = process.argv.slice(2).includes("--reset");
  const now = new Date();

  const values = {
    slug: SLUG,
    title: "Test AUDIT — rozpoznawanie problemów alkoholowych",
    description:
      "Dziesięć pytań Światowej Organizacji Zdrowia, w polskiej wersji opracowanej przez PARPA. Odpowiedzi nie zapisujemy — wynik zobaczysz od razu na ekranie.",
    // Q2 and Q3 are meaningless without this: "porcja" is a unit, not a glass.
    introText:
      "Pytania dotyczą ostatnich dwunastu miesięcy. Jedna porcja standardowa to 10 g czystego alkoholu — ok. 250 ml piwa 5%, 100 ml wina 12% albo 30 ml wódki 40%.",
    disclaimerText:
      "AUDIT jest testem przesiewowym Światowej Organizacji Zdrowia i nie jest diagnozą. Wskazuje prawdopodobieństwo problemu, a nie jego pewność — nie zastępuje rozmowy z terapeutą ani badania lekarskiego.",
    metaTitle: "Test AUDIT — czy piję ryzykownie? | Insieme",
    metaDescription:
      "Anonimowy test AUDIT w polskiej wersji PARPA: dziesięć pytań, wynik od razu na ekranie. Odpowiedzi nie są zapisywane.",
    sortOrder: 0,
    status: "published" as const,
    publishedAt: now,
    updatedAt: now,
  };

  const [test] = await db
    .insert(screeningTests)
    .values(values)
    .onConflictDoUpdate({ target: screeningTests.slug, set: values })
    .returning({ id: screeningTests.id });

  const existing = await db
    .select({ id: screeningTestQuestions.id })
    .from(screeningTestQuestions)
    .where(eq(screeningTestQuestions.testId, test.id));

  if (existing.length > 0 && !reset) {
    console.log(
      `✓ test „${values.title}” istnieje i ma ${existing.length} pytań — pomijam.\n  Użyj --reset, żeby odtworzyć pytania i przedziały.`,
    );
    return;
  }

  if (reset) {
    // Options cascade with their question; bands are removed explicitly.
    await db.delete(screeningTestQuestions).where(eq(screeningTestQuestions.testId, test.id));
    await db.delete(screeningTestResultBands).where(eq(screeningTestResultBands.testId, test.id));
  }

  for (const [index, item] of QUESTIONS.entries()) {
    const [question] = await db
      .insert(screeningTestQuestions)
      .values({ testId: test.id, text: item.text, sortOrder: index })
      .returning({ id: screeningTestQuestions.id });

    await db.insert(screeningTestAnswerOptions).values(
      item.options.map((option, order) => ({
        questionId: question.id,
        label: option.label,
        points: option.points,
        sortOrder: order,
      })),
    );
  }

  await db.insert(screeningTestResultBands).values(
    BANDS.map((band, index) => ({ testId: test.id, ...band, sortOrder: index })),
  );

  const maxScore = QUESTIONS.reduce(
    (total, item) => total + Math.max(...item.options.map((o) => o.points)),
    0,
  );

  console.log(`✓ ${values.title}`);
  console.log(
    `  ${QUESTIONS.length} pytań · max ${maxScore} pkt · ${BANDS.length} przedziały · /testy/${SLUG}`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
