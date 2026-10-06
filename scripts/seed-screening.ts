/**
 * Seeds the screening test that the homepage features: a general twenty-
 * question yes/no self-check covering both substances and behaviours.
 *
 *   npm run seed:screening
 *   npm run seed:screening -- --reset   # rebuild questions/bands from scratch
 *
 * ── Copy and the homepage card ──────────────────────────────────────────────
 * The source sheet gives every question a short headline and a longer body.
 * The engine has a single `text` per question and the player sets it in the
 * heading face at up to 28px, so each pair is folded into one question of
 * roughly a hundred characters — about three lines in the homepage card. The
 * description, intro and disclaimer are condensed the same way: the intro sits
 * in that card at heading size, the disclaimer in a narrow meta column beside
 * it. Band bodies stay at two sentences because the e-mail form follows them.
 *
 * The test has no clinical cut-off; the bands (0–3 / 4–7 / 8–20) are the
 * authors' orientation ranges and the copy says so.
 *
 * ── Replacing AUDIT ─────────────────────────────────────────────────────────
 * This test replaced the AUDIT questionnaire previously seeded here. A run
 * deletes that test (submissions keep their rows — `test_id` is set null) and
 * points the homepage's test slot at the new one, since a slot holding a
 * deleted id makes the section disappear.
 *
 * Idempotent on the test's slug. Without --reset an existing test keeps its
 * questions, so a re-run never clobbers edits made in the panel.
 */
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

const SLUG = "czy-to-juz-problem";
const RETIRED_SLUGS = ["test-przesiewowy-alkohol"];

const YES_NO = [
  { label: "Tak", points: 1 },
  { label: "Nie", points: 0 },
];

/** One point per „tak” — the total is the number of areas showing a signal. */
const QUESTIONS = [
  "Czy zdarza Ci się używać lub angażować w dane zachowanie dłużej, częściej albo intensywniej, niż planowałeś/aś?",
  "Czy Twoje używanie lub zachowanie powoduje problemy w życiu osobistym, zawodowym, finansowym albo zdrowotnym?",
  "Czy próbowałeś/aś ograniczyć lub przestać, ale nie udało się utrzymać zmiany?",
  "Czy z tego powodu zaniedbujesz pracę, naukę, dom albo inne ważne zobowiązania?",
  "Czy używanie, myślenie o nim albo dochodzenie do siebie po nim zajmuje Ci coraz więcej czasu?",
  "Czy sięgasz po to przede wszystkim wtedy, gdy pojawia się stres, smutek, złość, samotność albo inne trudne emocje?",
  "Czy w ostatnich miesiącach używasz lub angażujesz się w to częściej albo intensywniej niż wcześniej?",
  "Czy potrzebujesz coraz więcej — większej ilości albo częstszego powtarzania — żeby uzyskać podobny efekt?",
  "Czy gdy nie możesz tego zrobić, pojawia się silny niepokój, rozdrażnienie, napięcie albo przymus powrotu?",
  "Czy zdarza Ci się myśleć, że Twoje używanie lub zachowanie wymyka się spod kontroli?",
  "Czy z tego powodu zapomniałeś/aś o ważnych spotkaniach, obowiązkach lub wydarzeniach albo z nich zrezygnowałeś/aś?",
  "Czy po okresie przerwy lub wyraźnego ograniczenia wracasz do wcześniejszego schematu?",
  "Czy myślenie, planowanie, używanie lub jego konsekwencje zajmują coraz ważniejsze miejsce w Twoim życiu?",
  "Czy używasz lub angażujesz się w to w sytuacjach, w których może to zagrażać Tobie albo innym?",
  "Czy zauważasz problemy ze zdrowiem fizycznym lub psychicznym, które mogą mieć z tym związek?",
  "Czy wracasz do tego mimo konfliktów, trudności finansowych, zawodowych lub rodzinnych?",
  "Czy kiedy już zaczniesz, trudno Ci przestać w momencie, który wcześniej zakładałeś/aś?",
  "Czy rodzina, partner, przyjaciele albo inne bliskie osoby mówią, że niepokoi ich Twoje używanie lub zachowanie?",
  "Czy pojawiły się obniżony nastrój, problemy ze snem, rozdrażnienie, lęk lub inne wyraźne zmiany samopoczucia?",
  "Czy rozważałeś/aś konsultację ze specjalistą, ale odkładałeś/aś ją, bo przecież „masz to pod kontrolą”?",
];

/**
 * Orientation ranges, not clinical thresholds. Bodies are kept free of any
 * promise about treatment working — see art. 14 ustawy o działalności
 * leczniczej.
 */
const BANDS = [
  {
    minScore: 0,
    maxScore: 3,
    resultTitle: "Niewiele sygnałów ostrzegawczych.",
    resultBody:
      "Twoje odpowiedzi wskazują na niewiele obszarów, które mogą budzić niepokój — ale znaczenie ma nie tylko ich liczba, lecz także to, jak wpływają na Twoje życie. Jeśli coś Cię niepokoi albo czujesz, że tracisz kontrolę, warto o tym porozmawiać.",
  },
  {
    minScore: 4,
    maxScore: 7,
    resultTitle: "Warto przyjrzeć się temu dokładniej.",
    resultBody:
      "W odpowiedziach pojawia się kilka sygnałów, które mogą wskazywać na rozwijający się problem. To dobry moment, żeby nie zostawać z wątpliwościami samemu — rozmowa ze specjalistą pomoże ocenić, co się dzieje i czy potrzebna jest dalsza pomoc.",
  },
  {
    minScore: 8,
    maxScore: 20,
    resultTitle: "Wiele sygnałów wymaga uwagi.",
    resultBody:
      "Trudności dotyczą wielu obszarów życia i mogą wskazywać na istotny problem. Nie musisz sam/a rozstrzygać, czy to już uzależnienie — właśnie temu służy konsultacja ze specjalistą terapii uzależnień.",
  },
];

async function main() {
  const { db } = await import("../src/db");
  const {
    cmsPages,
    screeningTestAnswerOptions,
    screeningTestQuestions,
    screeningTestResultBands,
    screeningTests,
  } = await import("../src/db/schema");
  const { eq, inArray } = await import("drizzle-orm");

  const reset = process.argv.slice(2).includes("--reset");
  const now = new Date();

  const retired = await db
    .delete(screeningTests)
    .where(inArray(screeningTests.slug, RETIRED_SLUGS))
    .returning({ title: screeningTests.title });
  for (const row of retired) console.log(`✗ usunięto „${row.title}”`);

  const values = {
    slug: SLUG,
    title: "Czy moje używanie lub zachowanie zaczyna być problemem?",
    description:
      "Dwadzieścia pytań o najczęstsze sygnały uzależnienia: utratę kontroli, nieudane próby ograniczenia, wpływ na codzienność, relacje i zdrowie. Odpowiedzi nie zapisujemy — wynik zobaczysz od razu.",
    introText:
      "Pomyśl o ostatnich dwunastu miesiącach — o substancji albo zachowaniu, które Cię niepokoi. Odpowiadasz tylko „tak” lub „nie”.",
    disclaimerText:
      "To nie jest test diagnostyczny i nie ma klinicznego progu. Liczba odpowiedzi „tak” pokazuje, w ilu obszarach pojawiają się sygnały warte uwagi — rozpoznanie wymaga indywidualnej oceny specjalisty.",
    metaTitle: "Czy to już problem? Test przesiewowy uzależnień | Insieme",
    metaDescription:
      "Anonimowy test przesiewowy: 20 pytań „tak / nie” o sygnały uzależnienia od substancji lub zachowań. Wynik od razu na ekranie, odpowiedzi nie są zapisywane.",
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

  await pointHomepageAt(test.id);

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
      YES_NO.map((option, order) => ({
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
  console.log(
    `  ${QUESTIONS.length} pytań · max ${QUESTIONS.length} pkt · ${BANDS.length} przedziały · /testy/${SLUG}`,
  );

  /** Sets the homepage's test slot — published doc and any open draft. */
  async function pointHomepageAt(testId: string) {
    const page = await db.query.cmsPages.findFirst({ where: eq(cmsPages.key, "landing") });
    if (!page) return;

    const withTest = <T,>(doc: T): T => {
      const d = doc as { sections?: Record<string, { data?: object }> } | null;
      if (d?.sections?.test) d.sections.test.data = { ...d.sections.test.data, testId };
      return doc;
    };

    await db
      .update(cmsPages)
      .set({ published: withTest(page.published), draft: withTest(page.draft) })
      .where(eq(cmsPages.key, "landing"));
    console.log("✓ strona główna wskazuje nowy test");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
