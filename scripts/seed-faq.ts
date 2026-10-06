/**
 * Seeds the FAQ. Which questions the homepage shows is not set here: that
 * lives in the CMS (Strona główna › Pytania, or the row menu in /admin/faq).
 * `seed:cms` starts it with the first six by order.
 *
 * Questions with a `category` are also embedded on the page that reads that
 * category — `alkohol` on /leczenie-alkoholizmu, `narkotyki` on
 * /leczenie-narkomanii, `rodzina` on /dla-rodziny,
 * `detoks` on /detoks-i-kwalifikacja, `nfz` in the NFZ article. They appear on
 * /faq as well.
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
      category: item.category ?? null,
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

  console.log(`\n${QUESTIONS.length} pytań opublikowanych. Sprawdź /admin/faq, sekcję 07 na stronie głównej i /faq.`);
}

type Question = { question: string; answer: string; category?: string };

const QUESTIONS: Question[] = [
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

  /* ------------------------------------------- alkohol: /leczenie-alkoholizmu */
  {
    category: "alkohol",
    question: "Skąd mam wiedzieć, czy to już uzależnienie?",
    answer:
      "Pierwszą orientację daje test przesiewowy, który możesz wypełnić anonimowo na naszej stronie. Rozpoznanie stawia jednak lekarz lub terapeuta po rozmowie — na podstawie objawów takich jak utrata kontroli nad piciem, głód alkoholowy czy objawy odstawienia, a nie samej ilości alkoholu.",
  },
  {
    category: "alkohol",
    question: "Czy uzależnienie od alkoholu można wyleczyć?",
    answer:
      "Uzależnienie jest chorobą przewlekłą — nie znika po jednym pobycie w ośrodku. Leczenie pozwala jednak przestać pić, zrozumieć mechanizmy choroby i nauczyć się z nią żyć. Dlatego po terapii stacjonarnej ważna jest jej kontynuacja.",
  },
  {
    category: "alkohol",
    question: "Czy wszywka (Esperal) wystarczy zamiast terapii?",
    answer:
      "Nie. Disulfiram nie zmniejsza głodu alkoholowego ani nie zmienia przyczyn picia — jedynie sprawia, że picie po jego przyjęciu wywołuje silne, nieprzyjemne objawy. Może być wsparciem dla osoby, która się leczy, ale o jego zastosowaniu decyduje lekarz po badaniu.",
  },
  {
    category: "alkohol",
    question: "Czy po terapii można pić okazjonalnie?",
    answer:
      "W przypadku uzależnienia celem leczenia jest abstynencja. Próby „kontrolowanego picia” u osób uzależnionych zwykle prowadzą do powrotu dawnego wzorca. Inaczej bywa przy piciu szkodliwym bez uzależnienia — dlatego tak ważna jest rzetelna diagnoza.",
  },

  /* ------------------------------------------- narkotyki: /leczenie-narkomanii */
  {
    category: "narkotyki",
    question: "Czy leczycie uzależnienie od marihuany?",
    answer:
      "Tak. Uzależnienie od marihuany bywa bagatelizowane, ale mechanizm jest taki sam jak przy innych substancjach: utrata kontroli, głód, objawy odstawienia i branie mimo szkód. O tym, czy to już uzależnienie, rozmawiamy w kwalifikacji.",
  },
  {
    category: "narkotyki",
    question: "Czy przed terapią potrzebny jest detoks?",
    answer:
      "Nie zawsze. Zależy to od substancji, czasu i sposobu przyjmowania oraz stanu zdrowia. Przy opioidach i lekach uspokajających detoks pod opieką lekarza jest zwykle konieczny. Decyzję podejmuje lekarz w kwalifikacji, a jeśli detoks jest potrzebny, pomagamy go zorganizować.",
  },
  {
    category: "narkotyki",
    question: "Biorę kilka substancji naraz. Czy mogę się u Was leczyć?",
    answer:
      "Tak — przyjmowanie kilku substancji, także z alkoholem lub lekami, jest częste. Powiedz o wszystkich w pierwszej rozmowie, bez obaw: od tego zależy, czy potrzebny jest detoks i jak zaplanować leczenie.",
  },
  {
    category: "narkotyki",
    question: "Leczyłem się już i wróciłem do brania. Czy mogę zacząć jeszcze raz?",
    answer:
      "Tak. Nawrót nie przekreśla leczenia i nie jest powodem do wstydu — uzależnienie jest chorobą przewlekłą. W kwalifikacji rozmawiamy o tym, co wtedy pomogło, a co nie, i od tego zaczynamy.",
  },

  /* --------------------------------------------------- rodzina: /dla-rodziny */
  {
    category: "rodzina",
    question: "Czy bliska osoba dowie się, że do Was dzwoniłem lub dzwoniłam?",
    answer:
      "Nie od nas. Rozmowa jest poufna, a o tym, czy i kiedy powiedzieć o niej bliskiej osobie, decydujesz Ty. Możesz też nie podawać nazwiska.",
  },
  {
    category: "rodzina",
    question: "Czy można zmusić kogoś do leczenia?",
    answer:
      "Do leczenia w prywatnym ośrodku — nie, pobyt jest dobrowolny. W przypadku uzależnienia od alkoholu istnieje sądowy obowiązek leczenia w placówce publicznej: procedurę zaczyna się od zgłoszenia do gminnej komisji rozwiązywania problemów alkoholowych w miejscu zamieszkania osoby pijącej.",
  },
  {
    category: "rodzina",
    question: "Czy rodzina może brać udział w terapii?",
    answer:
      "Tak. Oferujemy konsultacje dla bliskich przed leczeniem, w trakcie pobytu i przed powrotem do domu. W niedziele możliwe są odwiedziny, zgodnie z zasadami ośrodka.",
  },
  {
    category: "rodzina",
    question: "Gdzie mogę szukać wsparcia dla siebie?",
    answer:
      "Bezpłatnie: w grupach Al-Anon (dla rodzin i przyjaciół osób pijących), w poradni leczenia uzależnień w ramach NFZ — bez skierowania — oraz w grupach DDA. Możesz też porozmawiać z naszym terapeutą.",
  },

  /* -------------------------------------------- detoks: /detoks-i-kwalifikacja */
  {
    category: "detoks",
    question: "Czy mogę zrobić detoks w domu?",
    answer:
      "Po długotrwałym, codziennym piciu lub przy przyjmowaniu leków uspokajających nie jest to bezpieczne — mogą wystąpić drgawki albo majaczenie alkoholowe, których nie da się przewidzieć. O tym, czy detoks jest potrzebny i w jakiej formie, powinien zdecydować lekarz.",
  },
  {
    category: "detoks",
    question: "Ile trwa detoks alkoholowy?",
    answer:
      "Zwykle od kilku do kilkunastu dni, zależnie od nasilenia objawów odstawienia i stanu zdrowia. Przy lekach uspokajających trwa dłużej, bo dawki zmniejsza się stopniowo.",
  },
  {
    category: "detoks",
    question: "Czy detoks odbywa się w Insieme?",
    answer:
      "Nie. Jeśli lekarz uzna, że detoks jest potrzebny, pomagamy go zorganizować na prywatnym oddziale detoksykacyjnym, z którym współpracujemy, i ustalamy termin przyjęcia do Insieme po jego zakończeniu.",
  },
  {
    category: "detoks",
    question: "Biorę leki uspokajające lub nasenne. Czy mam je odstawić przed przyjazdem?",
    answer:
      "Nie odstawiaj ich samodzielnie. Powiedz nam o nich w pierwszej rozmowie — lekarz oceni, czy potrzebne jest stopniowe zmniejszanie dawek i jak je zaplanować.",
  },

  /* ---------------------------------------------------- nfz: artykuł o NFZ */
  {
    category: "nfz",
    question: "Czy na leczenie uzależnienia na NFZ potrzebne jest skierowanie?",
    answer:
      "Do poradni leczenia uzależnień — nie. Na oddział lub do ośrodka stacjonarnego zwykle potrzebne jest skierowanie od lekarza, najczęściej z poradni. Wymagania warto potwierdzić w wybranej placówce.",
  },
  {
    category: "nfz",
    question: "Jak sprawdzić, ile czeka się na odwyk na NFZ?",
    answer:
      "W Informatorze o terminach leczenia NFZ (terminyleczenia.nfz.gov.pl) — po wybraniu rodzaju świadczenia i województwa. Informacji udziela też Telefoniczna Informacja Pacjenta: 800 190 590.",
  },
  {
    category: "nfz",
    question: "Czy po pobycie w prywatnym ośrodku mogę kontynuować terapię na NFZ?",
    answer:
      "Tak. Ścieżki można łączyć — po pobycie prywatnym możesz kontynuować terapię w poradni leczenia uzależnień w ramach NFZ.",
  },
];

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
