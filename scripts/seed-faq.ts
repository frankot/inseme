/**
 * Seeds the FAQ with the questions the homepage used to carry as hardcoded
 * defaults, so /admin/faq opens on real rows instead of an empty table.
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
      category: CATEGORY,
      sortOrder: i * 10,
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

  console.log(`\n${QUESTIONS.length} pytań opublikowanych. Sprawdź /admin/faq i sekcję 06 na stronie.`);
}

/** Groups these seven as the set the homepage shows; see `getPublishedFaq()`. */
const CATEGORY = "strona główna";

const QUESTIONS = [
  {
    question: "Czy mogę zadzwonić w imieniu bliskiej osoby?",
    answer:
      "Tak i bardzo często tak się to zaczyna. Powiemy, co zwykle pomaga, a co pogarsza sprawę, i jak rozmawiać, żeby nie skończyło się kłótnią. Do tej osoby nie dzwonimy bez Twojej wiedzy.",
  },
  {
    question: "Czy rozmowa do czegoś zobowiązuje?",
    answer:
      "Nie. Nie musisz podawać nazwiska, nie wysyłamy po niej ofert i nie dzwonimy drugi raz bez Twojej zgody.",
  },
  {
    question: "Czy można przyjechać od razu?",
    answer:
      "Przy detoksie zwykle tak, często tego samego dnia. Mamy dwanaście miejsc, więc konkretny termin ustalamy w rozmowie — i mówimy wprost, jeśli miejsca nie ma.",
  },
  {
    question: "Czy potrzebne jest skierowanie?",
    answer:
      "Nie. Pobyt jest prywatny, nie wymaga skierowania ani ubezpieczenia. Potrzebna jest lista przyjmowanych leków, jeśli jakieś przyjmujesz.",
  },
  {
    question: "Czy mogę mieć telefon i czy są odwiedziny?",
    answer:
      "Telefon zostaje przy Tobie. Odwiedziny są możliwe, zwykle po pierwszym tygodniu — termin ustalasz z terapeutą prowadzącym.",
  },
  {
    question: "Ile to kosztuje i od czego zależy cena?",
    answer:
      "Koszt zależy od długości pobytu, potrzeby detoksu, konsultacji psychiatrycznej i stanu zdrowia. Konkretną kwotę podajemy w pierwszej rozmowie, przed przyjazdem — nie po.",
  },
  {
    question: "Czy pobyt jest poufny? Czy informacje trafią do rodziny?",
    answer:
      "Bez Twojej pisemnej zgody nie przekazujemy nikomu informacji o pobycie — także rodzinie. Zaświadczenia i dokumenty wydajemy wyłącznie Tobie.",
  },
];

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
