/**
 * Seeds the FAQ. The first `FEATURED` questions are marked for the homepage
 * section; the rest appear only on /faq. Editors change both in /admin/faq.
 *
 *   npm run seed:faq
 *   npm run seed:faq -- --reset   # delete every existing question first
 *
 * Idempotent: rows are matched on the question text, so re-running updates the
 * answer and ordering in place rather than duplicating the list.
 */
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

/** The seed writes plain prose; the editor stores HTML, so wrap it the same way. */
function paragraph(text: string): string {
  return `<p>${text}</p>`;
}

async function main() {
  // Imported after dotenv: `src/lib/env.ts` validates at module load.
  const { db } = await import("../src/db");
  const { faqItems } = await import("../src/db/schema");
  const { sanitizeRichText } = await import("../src/lib/sanitize");
  const { eq } = await import("drizzle-orm");

  const reset = process.argv.slice(2).includes("--reset");
  if (reset) {
    await db.delete(faqItems);
    console.log("· cleared existing questions");
  }

  const now = new Date();

  for (const [i, item] of QUESTIONS.entries()) {
    const values = {
      question: item.question,
      answer: sanitizeRichText(paragraph(item.answer)),
      category: null,
      sortOrder: i * 10,
      featured: i < FEATURED,
      status: "published" as const,
      publishedAt: now,
      updatedAt: now,
    };

    // `question` carries no unique index — the editor is free to rename one —
    // so the upsert is a lookup rather than ON CONFLICT.
    const existing = await db.query.faqItems.findFirst({
      where: eq(faqItems.question, item.question),
    });

    if (existing) {
      await db.update(faqItems).set(values).where(eq(faqItems.id, existing.id));
      console.log(`· zaktualizowano: ${item.question}`);
    } else {
      await db.insert(faqItems).values(values);
      console.log(`✓ dodano: ${item.question}`);
    }
  }

  console.log(`\n${QUESTIONS.length} pytań opublikowanych. Sprawdź /admin/faq, sekcję 07 na stronie głównej i /faq.`);
}

/** How many of the questions below, from the top, the homepage features. */
const FEATURED = 6;

const QUESTIONS = [
  {
    question: "Czy mogę zadzwonić w imieniu bliskiej osoby?",
    answer:
      "Tak. Możesz zadzwonić zarówno wtedy, gdy bliska osoba nie chce jeszcze leczenia, jak i wtedy, gdy jest już zdecydowana. Za jej zgodą możesz również pomóc w organizacji przyjęcia.",
  },
  {
    question: "Co jeśli bliska osoba nie chce się leczyć?",
    answer:
      "Możesz skontaktować się z nami samodzielnie. Porozmawiamy o sytuacji, podpowiemy, jak rozmawiać o leczeniu i jakie działania możesz podjąć, nie przejmując odpowiedzialności za decyzję drugiej osoby.",
  },
  {
    question: "Czy rozmowa do czegoś zobowiązuje?",
    answer:
      "Nie. Pierwszy kontakt służy poznaniu sytuacji, odpowiedzi na pytania i przedstawieniu możliwych dalszych kroków.",
  },
  {
    question: "Czy leczycie tylko uzależnienie od alkoholu?",
    answer:
      "Nie. Prowadzimy terapię osób uzależnionych od alkoholu, narkotyków i leków, a także zmagających się z uzależnieniami behawioralnymi takimi jak np. patologiczny hazard.",
  },
  {
    question: "Czy można przyjechać od razu?",
    answer:
      "Czasem przyjęcie jest możliwe w bardzo krótkim terminie. Zależy to od dostępności miejsca oraz sytuacji zdrowotnej pacjenta. Termin zawsze ustalamy indywidualnie.",
  },
  {
    question: "Czy przed przyjęciem muszę być trzeźwy?",
    answer:
      "Tak. Przed rozpoczęciem terapii wymagamy kilkudniowej lub dłuższej abstynencji — jej długość zależy m.in. od rodzaju używanej substancji i sytuacji pacjenta. Jeśli ten warunek nie jest spełniony, możemy skierować pacjenta na wcześniejszą detoksykację.",
  },
  {
    question: "Czy potrzebne jest skierowanie?",
    answer:
      "Nie. Do rozpoczęcia leczenia w Insieme nie potrzebujesz skierowania. Proces zaczynamy od rozmowy i kwalifikacji prowadzonej przez naszego lekarza.",
  },
  {
    question: "Jak długo trwa leczenie?",
    answer:
      "Program stacjonarny obejmuje minimum 28 dni pobytu. Po jego zakończeniu możliwa jest kontynuacja leczenia w formie ambulatoryjnej, cały proces standardowo trwa około 12–13 miesięcy.",
  },
  {
    question: "Czy mogę otrzymać zwolnienie lekarskie?",
    answer:
      "Tak, lekarz może wystawić zwolnienie na cały okres leczenia.",
  },
  {
    question: "Czy mogę mieć telefon?",
    answer:
      "Tak, pacjenci uzależnieni od alkoholu i/lub innych substancji mogą korzystać z telefonów w sposób niezakłócający terapii. W przypadku pacjentów zmagających się z patologicznym hazardem zasady korzystania z telefonu ustalamy indywidualnie.",
  },
  {
    question: "Czy rodzina może mnie odwiedzać?",
    answer:
      "Tak. Odwiedziny osób najbliższych odbywają się w niedziele, zgodnie z zasadami obowiązującymi w ośrodku.",
  },
  {
    question: "Ile kosztuje leczenie?",
    answer:
      "Cena zależy przede wszystkim od długości pobytu i zakresu świadczeń. Aktualny koszt programu przedstawiamy jasno przed podjęciem decyzji o rozpoczęciu terapii.",
  },
  {
    question: "Czy pobyt jest poufny?",
    answer:
      "Tak. Obowiązuje nas tajemnica zawodowa i zasady ochrony dokumentacji medycznej.",
  },
  {
    question: "Co powinienem zabrać ze sobą?",
    answer:
      "Po ustaleniu terminu otrzymasz dokładne informacje dotyczące przygotowania do pobytu oraz listę rzeczy, które warto zabrać.",
  },
  {
    question: "Jak wygląda pierwszy dzień?",
    answer:
      "Pierwszy dzień służy przede wszystkim spokojnemu wejściu w leczenie, poznaniu ośrodka i zespołu oraz zmniejszeniu napięcia związanego z rozpoczęciem terapii.",
  },
];

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
