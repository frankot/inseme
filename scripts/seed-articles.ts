/**
 * Seeds four example articles so the poradnik — the homepage teaser, /artykuly
 * and an article page — has something to render before an editor has written
 * anything.
 *
 *   npm run seed:articles
 *   npm run seed:articles -- --reset   # delete every existing article first
 *
 * Idempotent: rows are upserted on `slug`, so re-running updates in place.
 * Covers are left empty on purpose — `<ArticleCard>` falls back to a plain
 * field, and real photographs belong in the media library, not in a script.
 *
 * The copy is example text written to the right shape and tone. It carries a
 * reviewer name because publishing refuses without one; have a real person read
 * every article before it goes near production.
 */
import { config as loadEnv } from "dotenv";

// Type-only: erased at compile time, so it does not pull in the env validation
// that the runtime imports below deliberately defer until dotenv has run.
import type { Block } from "../src/lib/blocks";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

type Seed = {
  slug: string;
  title: string;
  excerpt: string;
  reviewer: string;
  /** Days back from today, so the four land in a readable order. */
  daysAgo: number;
  paragraphs: string[];
  steps?: { title: string; description: string }[];
  stepsHeading?: string;
};

async function main() {
  // Imported after dotenv: `src/lib/env.ts` validates at module load.
  const { db } = await import("../src/db");
  const { articles } = await import("../src/db/schema");
  // `sanitize-blocks` is marked server-only and refuses to load in a plain node
  // script, so the one HTML string this seed produces is sanitised directly.
  const { sanitizeRichText } = await import("../src/lib/sanitize");
  const { createBlock } = await import("../src/lib/blocks");

  const reset = process.argv.slice(2).includes("--reset");
  if (reset) {
    await db.delete(articles);
    console.log("· cleared existing articles");
  }

  const now = new Date();

  for (const item of ARTICLES) {
    const blocks: Block[] = [
      {
        ...createBlock("richtext"),
        type: "richtext" as const,
        html: sanitizeRichText(item.paragraphs.map((p) => `<p>${p}</p>`).join("")),
      },
    ];

    if (item.steps) {
      blocks.push({
        ...createBlock("step_list"),
        type: "step_list" as const,
        heading: item.stepsHeading ?? "",
        steps: item.steps.map((step) => ({ id: crypto.randomUUID(), ...step })),
      });
    }

    blocks.push({
      ...createBlock("cta"),
      type: "cta" as const,
      heading: "Nie wiesz, od czego zacząć?",
      text: "Zadzwoń. Rozmowa nie zobowiązuje do przyjazdu i nie musisz podawać nazwiska.",
      buttonLabel: "Zadzwoń: 669 916 005",
      buttonHref: "tel:+48669916005",
    });

    const publishedAt = new Date(now.getTime() - item.daysAgo * 24 * 60 * 60 * 1000);
    const values = {
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      body: blocks,
      authorReviewer: item.reviewer,
      status: "published" as const,
      publishedAt,
      updatedAt: now,
    };

    await db
      .insert(articles)
      .values(values)
      .onConflictDoUpdate({ target: articles.slug, set: values });

    console.log(`✓ ${item.title} — /artykuly/${item.slug}`);
  }

  console.log(`\n${ARTICLES.length} artykuły opublikowane. Sprawdź /artykuly i sekcję 07 na stronie.`);
}

const ARTICLES: Seed[] = [
  {
    slug: "jak-rozmawiac-z-bliska-osoba-o-leczeniu",
    title: "Jak rozmawiać z bliską osobą o leczeniu",
    excerpt:
      "Najtrudniejsza rozmowa w rodzinie zwykle kończy się kłótnią. Kilka rzeczy, które realnie zmieniają jej przebieg.",
    reviewer: "Marta Zielińska, terapeutka uzależnień",
    daysAgo: 3,
    paragraphs: [
      "Większość rodzin próbuje tej rozmowy wiele razy, zanim ktokolwiek zadzwoni do ośrodka. Zwykle zaczyna się od troski, a kończy się awanturą i milczeniem na kilka dni. To nie znaczy, że rozmowa nie ma sensu — znaczy, że forma jest ważniejsza niż argumenty.",
      "Osoba uzależniona najczęściej wie, że ma problem. Kolejna lista dowodów niczego nie zmienia, bo nie brakuje jej wiedzy, tylko poczucia, że da się z tego wyjść bez upokorzenia. Dlatego rozmowa, która zaczyna się od „zobacz, co robisz”, przegrywa, zanim się zacznie.",
      "Poniżej to, co w praktyce działa najczęściej. Nie jest to scenariusz — raczej kilka zasad, do których warto wrócić przed rozmową.",
    ],
    stepsHeading: "Zanim zaczniesz rozmowę",
    steps: [
      {
        title: "Wybierz moment na trzeźwo",
        description: "Nie w trakcie picia i nie nazajutrz rano, kiedy wstyd jest największy. Najlepiej kilka dni później, w spokojnej porze dnia.",
      },
      {
        title: "Mów o sobie, nie o niej",
        description: "„Boję się o Ciebie i nie śpię po nocach” trafia; „jesteś alkoholikiem” uruchamia obronę i zamyka rozmowę.",
      },
      {
        title: "Przyjdź z jedną konkretną propozycją",
        description: "Nie „musisz się leczyć”, tylko „umówmy jedną konsultację, pojadę z Tobą”. Mały krok jest do przyjęcia, wielki nie.",
      },
      {
        title: "Ustal, czego nie zrobisz",
        description: "Granice pomagają bardziej niż groźby — pod warunkiem że dotyczą Ciebie i że ich dotrzymasz.",
      },
    ],
  },
  {
    slug: "detoks-alkoholowy-jak-wyglada",
    title: "Detoks alkoholowy — jak naprawdę wygląda",
    excerpt:
      "Ile trwa, co się dzieje każdego dnia i dlaczego odstawienie na własną rękę bywa niebezpieczne.",
    reviewer: "lek. med. Tomasz Wieczorek, psychiatra",
    daysAgo: 9,
    paragraphs: [
      "Detoks to kilka dni, w czasie których organizm radzi sobie z odstawieniem, a pacjent jest pod opieką lekarza i pielęgniarek. W praktyce trwa od siedmiu do dziesięciu dni i kończy się wtedy, gdy objawy ustępują, a nie wtedy, gdy mija ustalona z góry liczba dni.",
      "Najtrudniejsze są zwykle pierwsze dwie doby: drżenie, bezsenność, nadciśnienie, silny lęk. Leki dobiera lekarz, a dawkę zmniejsza się stopniowo. Chodzi o to, żeby ten czas był bezpieczny i możliwie znośny — nie o to, żeby „przecierpieć”.",
      "Samodzielne odstawienie po długim, ciężkim piciu bywa groźne: przy zespole abstynencyjnym mogą wystąpić drgawki i majaczenie alkoholowe, które są stanem zagrożenia życia. To jedyny etap leczenia, przy którym naprawdę nie warto oszczędzać na opiece medycznej.",
      "Detoks sam w sobie nie jest leczeniem uzależnienia — oczyszcza pole. Terapia zaczyna się po nim i to ona decyduje o tym, co będzie za rok.",
    ],
  },
  {
    slug: "ile-kosztuje-leczenie-uzaleznienia",
    title: "Ile kosztuje leczenie uzależnienia i od czego zależy cena",
    excerpt:
      "Co składa się na koszt pobytu, dlaczego nie ma jednej ceny i o co pytać, dzwoniąc do ośrodka.",
    reviewer: "Marta Zielińska, terapeutka uzależnień",
    daysAgo: 18,
    paragraphs: [
      "Cena pobytu w prywatnym ośrodku zależy od kilku rzeczy: długości programu, tego czy potrzebny jest detoks, czy konieczna jest konsultacja psychiatryczna i jakie leki przyjmuje pacjent. Dlatego żaden uczciwy cennik nie kończy się jedną liczbą.",
      "Warto pytać wprost, co jest w cenie: czy detoks liczony jest osobno, czy w kwocie mieszczą się badania i leki, czy terapia indywidualna jest limitowana, i co dzieje się z opłatą, jeśli pobyt zostanie skrócony.",
      "Druga sprawa to moment, w którym poznajesz kwotę. Konkretną cenę powinieneś usłyszeć w pierwszej rozmowie telefonicznej, przed przyjazdem — nie po przyjeździe i nie przy wypisie.",
      "Leczenie w publicznej ochronie zdrowia jest bezpłatne i to zawsze warta rozważenia droga; różnicą bywa czas oczekiwania i wielkość grupy, nie sam program terapeutyczny.",
    ],
  },
  {
    slug: "nawrot-po-terapii-co-robic",
    title: "Nawrót po terapii — co wtedy zrobić",
    excerpt:
      "Nawrót nie przekreśla kilku tygodni pracy. Ma swój przebieg, który da się rozpoznać wcześniej niż przy pierwszym kieliszku.",
    reviewer: "Katarzyna Rembiszewska, psycholożka",
    daysAgo: 27,
    paragraphs: [
      "Nawrót rzadko zaczyna się od picia. Zaczyna się tygodnie wcześniej: od odstawienia grupy wsparcia, od wracania do dawnych miejsc i ludzi, od przekonania, że „już sobie poradzę sam”. Pierwszy kieliszek jest ostatnim elementem, nie pierwszym.",
      "Dlatego po pobycie uczymy rozpoznawać własne sygnały ostrzegawcze i mieć plan na konkretny wieczór, a nie ogólne postanowienie. Plan zwykle sprowadza się do jednego numeru telefonu i jednej rzeczy do zrobienia zamiast picia.",
      "Jeśli nawrót już się wydarzył, najgorsze, co można zrobić, to zniknąć na miesiąc ze wstydu. Krótki kontakt z terapeutą w ciągu kilku dni zmienia epizod w coś, z czego da się wyciągnąć wnioski — zamiast w powrót do punktu wyjścia.",
      "Nawrót nie znaczy, że terapia była nieskuteczna. Znaczy, że plan po pobycie wymaga poprawki.",
    ],
  },
];

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
