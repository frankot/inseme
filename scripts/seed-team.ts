/**
 * Seeds the team roster so /zespol and the homepage teaser have something to
 * render before an editor has typed anything.
 *
 *   npm run seed:team
 *   npm run seed:team -- --reset   # delete every existing member first
 *
 * Idempotent: rows are upserted on `slug`, so re-running updates in place.
 * Photos are left empty on purpose — `<TeamCard>` falls back to initials, and
 * real headshots belong in the media library, not in a seed script.
 */
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

async function main() {
  // Imported after dotenv: `src/lib/env.ts` validates at module load.
  const { db } = await import("../src/db");
  const { teamMembers } = await import("../src/db/schema");
  const { sanitizeRichText } = await import("../src/lib/sanitize");

  const reset = process.argv.slice(2).includes("--reset");
  if (reset) {
    await db.delete(teamMembers);
    console.log("· cleared existing team members");
  }

  const now = new Date();

  for (const person of PEOPLE) {
    const values = {
      name: person.name,
      slug: person.slug,
      role: person.role,
      qualifications: person.qualifications,
      shortBio: person.shortBio,
      longBio: sanitizeRichText(person.longBio),
      sortOrder: person.sortOrder,
      status: "published" as const,
      publishedAt: now,
      updatedAt: now,
    };

    await db
      .insert(teamMembers)
      .values(values)
      .onConflictDoUpdate({ target: teamMembers.slug, set: values });

    console.log(`✓ ${person.name} — /zespol/${person.slug}`);
  }

  console.log(`\n${PEOPLE.length} osób w zespole. Sprawdź /zespol.`);
}

const PEOPLE = [
  {
    name: "Marta Zielińska",
    slug: "marta-zielinska",
    role: "kierowniczka programu, terapeutka uzależnień",
    qualifications:
      "Certyfikat specjalisty psychoterapii uzależnień (PARPA), Studium Terapii Uzależnień, 16 lat praktyki",
    shortBio:
      "Prowadzi program i pierwsze rozmowy telefoniczne. Jeśli dzwonisz po raz pierwszy, najczęściej odbierze Marta.",
    longBio: `
      <p>Pracuję z osobami uzależnionymi od szesnastu lat — najpierw na oddziale detoksykacyjnym w Warszawie, potem w poradni, a od 2019 roku w Insieme. Najwięcej nauczyłam się nie na szkoleniach, tylko z rozmów, które kończyły się słowami „jeszcze nie teraz”. Wracały po pół roku.</p>
      <h3>Czym się zajmuję</h3>
      <ul>
        <li>pierwszy kontakt telefoniczny i kwalifikacja do programu</li>
        <li>terapia grupowa — dwa razy w tygodniu</li>
        <li>konsultacje dla rodzin, także bez udziału osoby uzależnionej</li>
      </ul>
      <h3>Jak pracuję</h3>
      <p>Nie zaczynam od diagnozy ani od listy zakazów. Zaczynam od pytania, co się działo w ostatnim tygodniu — bo to zwykle wystarczy, żeby zobaczyć, gdzie jesteśmy. <strong>Nie oceniam i nie moralizuję.</strong> Jeśli ktoś nie jest gotowy na terapię stacjonarną, mówię to wprost i proponuję coś innego.</p>
      <blockquote>Terapia nie polega na tym, żeby przekonać kogoś, że ma problem. Polega na tym, żeby był gdzie przyjść, kiedy sam to zobaczy.</blockquote>
    `,
    sortOrder: 0,
  },
  {
    name: "Tomasz Wieczorek",
    slug: "tomasz-wieczorek",
    role: "terapeuta uzależnień",
    qualifications:
      "Specjalista psychoterapii uzależnień, Szkoła Psychoterapii Poznawczo-Behawioralnej, 11 lat praktyki",
    shortBio:
      "Prowadzi sesje indywidualne i warsztat o nawrotach. Sam był po drugiej stronie tej rozmowy dwadzieścia lat temu.",
    longBio: `
      <p>Do terapii trafiłem najpierw jako pacjent — w 2004 roku, po ośmiu latach picia i trzech nieudanych próbach odstawienia na własną rękę. Nie mówię o tym każdemu i nie robię z tego wykładu, ale kiedy ktoś pyta, czy ja to rozumiem, odpowiadam zgodnie z prawdą.</p>
      <h3>Czym się zajmuję</h3>
      <ul>
        <li>sesje indywidualne — dwie w tygodniu na pacjenta</li>
        <li>warsztat o mechanizmie nawrotu i planie na pierwsze trzy miesiące po wyjeździe</li>
        <li>grupa wsparcia dla absolwentów programu, w czwartki</li>
      </ul>
      <h3>Jak pracuję</h3>
      <p>Pracuję głównie poznawczo-behawioralnie: konkretne sytuacje, konkretne reakcje, konkretny plan. Mniej interesuje mnie, dlaczego ktoś zaczął pić piętnaście lat temu, bardziej — co zrobi w piątek o dziewiętnastej, kiedy wszyscy w pracy idą na piwo.</p>
    `,
    sortOrder: 1,
  },
  {
    name: "Katarzyna Rembiszewska",
    slug: "katarzyna-rembiszewska",
    role: "lekarka psychiatra",
    qualifications:
      "Specjalizacja z psychiatrii, Warszawski Uniwersytet Medyczny, 14 lat praktyki klinicznej",
    shortBio:
      "Prowadzi detoks i konsultacje psychiatryczne. Decyduje o farmakoterapii i o tym, czy pobyt jest bezpieczny.",
    longBio: `
      <p>Odpowiadam za medyczną stronę pobytu: kwalifikację do detoksu, prowadzenie odstawienia i leczenie tego, co bardzo często towarzyszy uzależnieniu — depresji, zaburzeń lękowych, bezsenności.</p>
      <h3>Czym się zajmuję</h3>
      <ul>
        <li>ocena stanu zdrowia przed przyjęciem — zwykle jeszcze przez telefon</li>
        <li>detoks alkoholowy i od benzodiazepin, 7–10 dni pod nadzorem</li>
        <li>konsultacje psychiatryczne w trakcie pobytu i ustalenie leczenia na później</li>
      </ul>
      <h3>O czym warto wiedzieć</h3>
      <p>Odstawienie alkoholu po wieloletnim ciągu <strong>nie jest bezpieczne w domu</strong> — może skończyć się drgawkami albo majaczeniem. Jeśli dzwonisz i opisujesz taką sytuację, powiem to wprost, nawet jeśli akurat nie mamy miejsca; wtedy kierujemy gdzie indziej.</p>
      <p>Leki, które przyjmujesz na co dzień, przywieź ze sobą razem z opakowaniami. To skraca pierwszą konsultację o dobre pół godziny.</p>
    `,
    sortOrder: 2,
  },
  {
    name: "Paweł Lisiecki",
    slug: "pawel-lisiecki",
    role: "psycholog, terapeuta rodzinny",
    qualifications:
      "Psychologia kliniczna UW, całościowy kurs psychoterapii systemowej, 9 lat praktyki",
    shortBio:
      "Pracuje z rodzinami — także wtedy, gdy osoba uzależniona jeszcze nie chce o niczym słyszeć.",
    longBio: `
      <p>Bardzo często pierwszy telefon do ośrodka wykonuje nie pacjent, tylko żona, mąż, matka albo dorosłe dziecko. Ta rozmowa też jest terapią i nie jest gorszym początkiem niż każdy inny.</p>
      <h3>Czym się zajmuję</h3>
      <ul>
        <li>konsultacje dla rodzin — również bez wiedzy osoby uzależnionej</li>
        <li>sesje rodzinne w trakcie pobytu, zwykle od drugiego tygodnia</li>
        <li>przygotowanie domu na powrót: co się zmieni, a co nie</li>
      </ul>
      <h3>Jak pracuję</h3>
      <p>Zaczynam od tego, co bliscy już próbowali — bo zwykle próbowali dużo i są wyczerpani. Część z tych rzeczy pomagała, część nieświadomie podtrzymywała picie. Rozdzielenie jednego od drugiego jest zwykle pierwszą realną ulgą.</p>
    `,
    sortOrder: 3,
  },
  {
    name: "Grażyna Sobczak",
    slug: "grazyna-sobczak",
    role: "pielęgniarka koordynująca",
    qualifications:
      "Licencjat pielęgniarstwa, kurs kwalifikacyjny w opiece psychiatrycznej, 22 lata w zawodzie",
    shortBio:
      "Jest w ośrodku codziennie. Wydaje leki, mierzy parametry i zwykle pierwsza zauważa, że ktoś ma gorszy dzień.",
    longBio: `
      <p>W pielęgniarstwie jestem od dwudziestu dwóch lat, z czego siedemnaście w opiece psychiatrycznej. W Insieme odpowiadam za codzienną opiekę — najbardziej intensywną w pierwszym tygodniu, kiedy organizm dopiero się uspokaja.</p>
      <h3>Czym się zajmuję</h3>
      <ul>
        <li>opieka w trakcie detoksu — pomiary, leki, obserwacja przez całą dobę</li>
        <li>przyjęcie nowych osób i przejście przez pierwszy dzień</li>
        <li>kontakt z lekarzem, kiedy coś odbiega od normy</li>
      </ul>
      <p>Pierwsze dwie doby są najtrudniejsze i nikt nie zostaje z nimi sam. To jedyny moment pobytu, w którym pukamy do pokoju także w nocy.</p>
    `,
    sortOrder: 4,
  },
  {
    name: "Igor Mazurkiewicz",
    slug: "igor-mazurkiewicz",
    role: "instruktor terapii uzależnień",
    qualifications:
      "Studium Terapii Uzależnień w trakcie certyfikacji, instruktor pracy z ciałem, 6 lat praktyki",
    shortBio:
      "Prowadzi zajęcia ruchowe, psychoedukację i weekendowe wyjścia do lasu. Odpowiada za to, żeby dzień miał kształt.",
    longBio: `
      <p>Odpowiadam za tę część programu, która nie odbywa się w fotelu. Sen, ruch, jedzenie i rytm dnia brzmią banalnie obok terapii, ale przy odstawieniu to one najszybciej zaczynają działać.</p>
      <h3>Czym się zajmuję</h3>
      <ul>
        <li>poranne zajęcia ruchowe i praca z oddechem</li>
        <li>psychoedukacja: co dzieje się z organizmem w pierwszych tygodniach</li>
        <li>wyjścia do lasu i sobotnie zajęcia w ogrodzie</li>
      </ul>
      <p>Nikogo nie zmuszam do porannej gimnastyki. Ale po tygodniu przychodzą prawie wszyscy, głównie dlatego, że wreszcie zaczynają spać.</p>
    `,
    sortOrder: 5,
  },
];

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
