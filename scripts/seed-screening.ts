/**
 * Seeds the screening test that the homepage features.
 *
 * The questions are the ones the homepage carried hard-coded in
 * `src/content/home.ts` before the B3 engine existed — moving them into the
 * database is what turns that section into CMS content.
 *
 *   npm run seed:screening
 *   npm run seed:screening -- --reset   # rebuild questions/bands from scratch
 *
 * Idempotent on the test's slug. Without --reset an existing test keeps its
 * questions, so a re-run never clobbers edits made in the panel.
 */
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

const SLUG = "test-przesiewowy-alkohol";

const SCALE = [
  { label: "Nigdy", points: 0 },
  { label: "Rzadko", points: 1 },
  { label: "Czasem", points: 2 },
  { label: "Często", points: 3 },
];

const QUESTIONS = [
  "Jak często zdarza się, że wypijasz lub bierzesz więcej, niż zamierzałeś?",
  "Czy w ostatnim roku próbowałeś ograniczyć i nie udało się utrzymać tego dłużej niż kilka dni?",
  "Czy zdarza Ci się sięgać po alkohol lub substancję z rana, żeby poczuć się normalnie?",
  "Czy z tego powodu coś w Twoim życiu przestało działać — praca, relacje, zdrowie, pieniądze?",
  "Czy ktoś bliski powiedział Ci, że się o Ciebie martwi?",
];

const BANDS = [
  {
    minScore: 0,
    maxScore: 4,
    resultTitle: "Na razie nic nie wskazuje na poważny problem.",
    resultBody:
      "Wynik jest niski. Jeśli mimo tego coś Cię niepokoi — samo pytanie „czy to już problem?” bywa ważniejsze niż punkty. Możesz zadzwonić i po prostu o tym pogadać.",
  },
  {
    minScore: 5,
    maxScore: 9,
    resultTitle: "Warto się temu przyjrzeć spokojnie.",
    resultBody:
      "Kilka odpowiedzi wskazuje na wzorzec, który zwykle się nie cofa sam. Nie znaczy to, że potrzebujesz ośrodka — znaczy, że warto z kimś przejść przez to na głos, zanim zrobi się trudniej.",
  },
  {
    minScore: 10,
    maxScore: 15,
    resultTitle: "Zalecamy kontakt ze specjalistą.",
    resultBody:
      "Odpowiedzi układają się w obraz, z którym zwykle nie da się poradzić sobie samemu. To nie ocena — to informacja. Rozmowa z terapeutą nie zobowiązuje do przyjazdu i nie kończy się ofertą.",
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
    title: "Test przesiewowy — alkohol i substancje",
    description:
      "Pięć pytań o ostatnie dwanaście miesięcy. Odpowiedzi nie zapisujemy — wynik zobaczysz od razu na ekranie.",
    introText:
      "Myśląc o ostatnich dwunastu miesiącach — jak często zdarzały się poniższe sytuacje?",
    disclaimerText:
      "Test ma charakter orientacyjny i nie jest diagnozą. Nie zastępuje rozmowy z terapeutą ani badania lekarskiego.",
    metaTitle: "Test przesiewowy — alkohol i substancje | Insieme",
    metaDescription:
      "Anonimowy test przesiewowy: pięć pytań, wynik od razu na ekranie. Odpowiedzi nie są zapisywane.",
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

  for (const [index, text] of QUESTIONS.entries()) {
    const [question] = await db
      .insert(screeningTestQuestions)
      .values({ testId: test.id, text, sortOrder: index })
      .returning({ id: screeningTestQuestions.id });

    await db.insert(screeningTestAnswerOptions).values(
      SCALE.map((option, order) => ({
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

  console.log(`✓ ${values.title}`);
  console.log(`  ${QUESTIONS.length} pytań · ${BANDS.length} przedziały · /testy/${SLUG}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
