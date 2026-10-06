/**
 * Seeds the team roster so /zespol and the homepage teaser render the real
 * Insieme team.
 *
 *   npm run seed:team
 *   npm run seed:team -- --reset   # delete every existing member first
 *
 * Idempotent: rows are upserted on `slug`, so re-running updates in place.
 * The placeholder roster from early development is removed by slug on every
 * run. Photos are left empty on purpose — they are assigned in /admin/team,
 * and an upsert never touches `photoId`, so re-running keeps them.
 */
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

async function main() {
  // Imported after dotenv: `src/lib/env.ts` validates at module load.
  const { inArray } = await import("drizzle-orm");
  const { db } = await import("../src/db");
  const { teamMembers } = await import("../src/db/schema");
  const { sanitizeRichText } = await import("../src/lib/sanitize");

  const reset = process.argv.slice(2).includes("--reset");
  if (reset) {
    await db.delete(teamMembers);
    console.log("· cleared existing team members");
  } else {
    const removed = await db
      .delete(teamMembers)
      .where(inArray(teamMembers.slug, PLACEHOLDER_SLUGS))
      .returning({ name: teamMembers.name });
    for (const row of removed) console.log(`· removed placeholder ${row.name}`);
  }

  const now = new Date();

  for (const [index, person] of PEOPLE.entries()) {
    const values = {
      name: person.name,
      slug: person.slug,
      role: person.role,
      qualifications: person.qualifications,
      shortBio: person.shortBio,
      longBio: sanitizeRichText(person.longBio),
      sortOrder: index,
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

/** The made-up roster the site launched with. */
const PLACEHOLDER_SLUGS = [
  "marta-zielinska",
  "tomasz-wieczorek",
  "katarzyna-rembiszewska",
  "pawel-lisiecki",
  "grazyna-sobczak",
  "igor-mazurkiewicz",
];

/** Order here is the order on /zespol. */
const PEOPLE = [
  {
    name: "Dominika Walczak",
    slug: "dominika-walczak",
    role: "właścicielka · managerka · kierowniczka ośrodka",
    qualifications:
      "Studia psychologiczne · Studium Pomocy Psychologicznej i Interwencji Kryzysowej · Program Rozwoju Osobistego · wieloletnie doświadczenie managerskie",
    shortBio:
      "Tworzę i prowadzę Insieme, odpowiadając za kierunek rozwoju ośrodka, organizację jego pracy i standard opieki nad pacjentem. Zależy mi, żeby leczenie uzależnienia nie było jedynie okresem abstynencji, ale początkiem trwałej zmiany sposobu funkcjonowania i poprawy jakości życia.",
    longBio: `
      <h3>Czym się zajmuję</h3>
      <ul>
        <li>koordynuję codzienne funkcjonowanie ośrodka</li>
        <li>współpracuję z zespołem przy rozwijaniu programu leczenia</li>
        <li>dbam o standard opieki i warunki pobytu pacjentów</li>
        <li>pozostaję w kontakcie z pacjentami i ich bliskimi na różnych etapach leczenia</li>
        <li>rozwijam kolejne formy terapii i wsparcia oferowane przez Insieme</li>
      </ul>
      <h3>Co jest dla mnie ważne</h3>
      <p>Wiem, jak dużo odwagi wymaga przyznanie przed sobą, że dotychczasowy sposób życia przestał działać. Własne doświadczenie pracy nad sobą nauczyło mnie, że uzależnienie może stać się punktem wyjścia do znacznie głębszej zmiany.</p>
      <p>Chcę, żeby Insieme było miejscem stabilnym, bezpiecznym i ludzkim — takim, w którym pacjent jest traktowany podmiotowo, ale jednocześnie otrzymuje jasne zasady, strukturę i profesjonalną pomoc potrzebną do rozpoczęcia zmiany.</p>
    `,
  },
  {
    name: "Leszek Kapler",
    slug: "leszek-kapler",
    role: "superwizor ośrodka · psychoterapeuta · specjalista terapii uzależnień · trener",
    qualifications:
      "Ponad 30 lat doświadczenia w pomocy psychologicznej · psychoterapia osób dorosłych i rodzin · szkolenie i superwizja psychoterapeutów · członek Polskiego Towarzystwa Psychologicznego",
    shortBio:
      "Od ponad 30 lat zajmuje się psychoterapią, pomocą psychologiczną oraz prowadzeniem treningów i warsztatów. W Insieme odpowiada za superwizję pracy zespołu i wspiera terapeutów w przyglądaniu się procesom leczenia pacjentów.",
    longBio: `
      <h3>Czym się zajmuje</h3>
      <ul>
        <li>superwizuje pracę zespołu terapeutycznego Insieme</li>
        <li>wspiera terapeutów w analizie procesu leczenia</li>
        <li>prowadzi psychoterapię osób dorosłych i rodzin</li>
        <li>prowadzi treningi i warsztaty psychologiczne</li>
        <li>tworzy i prowadzi Program Rozwoju Osobistego PRO na Mazurach</li>
      </ul>
      <h3>Jak pracuje</h3>
      <p>Pracuje integracyjnie — dobiera sposób pomocy do konkretnej osoby i problemu, korzystając z różnych podejść psychoterapeutycznych.</p>
      <p>Ważne są dla niego uważność, współczucie i konstruktywna zmiana. Superwizja pozwala zespołowi spojrzeć na proces pacjenta z szerszej perspektywy i wspólnie szukać najlepszych kierunków dalszej pracy.</p>
    `,
  },
  {
    name: "Szymon Korzeniowski",
    slug: "szymon-korzeniowski",
    role: "lekarz psychiatra",
    qualifications:
      "I Wydział Lekarski Warszawskiego Uniwersytetu Medycznego · doświadczenie w psychiatrii dorosłych · praca z uzależnieniami od substancji i uzależnieniami behawioralnymi",
    shortBio:
      "Pracuje również w Mazowieckim Specjalistycznym Centrum Zdrowia w Tworkach oraz w Centrum Zdrowia Psychicznego. Zajmuje się diagnostyką i leczeniem zaburzeń psychicznych osób dorosłych.",
    longBio: `
      <h3>Czym się zajmuje</h3>
      <ul>
        <li>kwalifikacją medyczną do rozpoczęcia leczenia</li>
        <li>konsultacjami psychiatrycznymi podczas pobytu</li>
        <li>oceną stanu psychicznego pacjenta</li>
        <li>diagnostyką współwystępujących trudności psychicznych</li>
        <li>doborem farmakoterapii, jeśli istnieją do niej wskazania</li>
      </ul>
      <h3>Jak pracuje</h3>
      <p>Każdy problem traktuje w kontekście indywidualnej historii pacjenta. Podczas konsultacji ważne jest dla niego uważne wysłuchanie osoby, poznanie jej aktualnej sytuacji i dopiero na tej podstawie dobranie odpowiedniego postępowania.</p>
      <p>Konsultacja psychiatryczna jest w Insieme częścią szerszego procesu — opieka medyczna i psychoterapia uzupełniają się, zamiast funkcjonować osobno.</p>
    `,
  },
  {
    name: "Aleksandra Latosiewicz-Kordek",
    slug: "aleksandra-latosiewicz-kordek",
    role: "lekarka psychiatra",
    qualifications:
      "Uniwersytet Medyczny w Lublinie · specjalizacja z psychiatrii dorosłych · doświadczenie na oddziałach ogólnopsychiatrycznych, detoksykacyjnych i w Poradni Zdrowia Psychicznego",
    shortBio:
      "Na co dzień pracuje w Mazowieckim Specjalistycznym Centrum Zdrowia w Pruszkowie i stale rozwija kwalifikacje podczas szkoleń oraz konferencji psychiatrycznych.",
    longBio: `
      <h3>Czym się zajmuje</h3>
      <ul>
        <li>konsultacjami psychiatrycznymi pacjentów</li>
        <li>oceną aktualnego stanu psychicznego</li>
        <li>diagnostyką współwystępujących zaburzeń</li>
        <li>oceną wskazań do leczenia farmakologicznego</li>
        <li>monitorowaniem leczenia psychiatrycznego podczas pobytu</li>
      </ul>
      <h3>Jak pracuje</h3>
      <p>Patrzy na uzależnienie również z perspektywy medycznej i psychiatrycznej. Pozwala to uwzględnić w procesie leczenia objawy i trudności, które mogą współwystępować z samym uzależnieniem.</p>
      <p>Jej doświadczenie obejmuje zarówno psychiatrię ogólną, jak i pracę na oddziałach detoksykacyjnych, dzięki czemu może szerzej oceniać sytuację zdrowotną pacjenta.</p>
    `,
  },
  {
    name: "Aleksandra Bieniasz",
    slug: "aleksandra-bieniasz",
    role: "specjalistka terapii uzależnień · terapeutka",
    qualifications:
      "Ponad 17 lat doświadczenia · Specjalistka Terapii Uzależnień · magister pedagogiki, specjalizacja resocjalizacja · terapia indywidualna i grupowa",
    shortBio:
      "Od 2007 roku pracuje z osobami uzależnionymi i współuzależnionymi. Doświadczenie zdobywała między innymi w ośrodku terapii uzależnień oraz współprowadząc grupę terapeutyczną w poradni MONAR.",
    longBio: `
      <h3>Czym się zajmuje</h3>
      <ul>
        <li>terapią indywidualną i grupową</li>
        <li>pracą nad mechanizmami uzależnienia</li>
        <li>rozpoznawaniem i regulowaniem emocji</li>
        <li>pracą nad relacjami i schematami funkcjonowania</li>
        <li>wzmacnianiem zasobów potrzebnych do dalszego zdrowienia</li>
      </ul>
      <h3>Jak pracuje</h3>
      <p>Łączy klasyczną terapię uzależnień z pracą nad emocjami i elementami podejścia coachingowego. Szczególnie ważne są dla niej zrozumienie, uważność i autentyczna relacja z pacjentem.</p>
      <p>Wierzy, że zmiana wymaga jednocześnie łagodności wobec siebie, konsekwencji i gotowości do uczciwego przyglądania się własnym sposobom funkcjonowania.</p>
    `,
  },
  {
    name: "Robert Sławiński",
    slug: "robert-slawinski",
    role: "instruktor terapii uzależnień · terapeuta",
    qualifications:
      "Studium Pomocy Psychologicznej · Studium Terapii Uzależnień i Współuzależnienia IPZ · od 2008 roku w pracy z osobami uzależnionymi",
    shortBio:
      "Doświadczenie zdobywał zarówno w ośrodkach stacjonarnych, jak i ambulatoryjnych. Prowadzi terapię osób uzależnionych od alkoholu i innych substancji psychoaktywnych oraz pracuje z ich rodzinami.",
    longBio: `
      <h3>Czym się zajmuje</h3>
      <ul>
        <li>terapią indywidualną</li>
        <li>terapią grupową</li>
        <li>pracą nad motywacją do zmiany</li>
        <li>pomocą osobom uzależnionym od alkoholu i innych substancji</li>
        <li>wsparciem członków rodzin osób uzależnionych</li>
      </ul>
      <h3>Jak pracuje</h3>
      <p>Najbardziej interesuje go człowiek i to, co może uruchomić jego rzeczywistą motywację do zmiany.</p>
      <p>Łączy doświadczenie pracy stacjonarnej i ambulatoryjnej, dzięki czemu patrzy na terapię nie tylko przez pryzmat samego pobytu w ośrodku, ale całego procesu zdrowienia. Swoją pracę regularnie poddaje superwizji.</p>
    `,
  },
  {
    name: "Katarzyna Stefanowicz",
    slug: "katarzyna-stefanowicz",
    role: "instruktorka terapii uzależnień · terapeutka · trenerka pracy z ciałem",
    qualifications:
      "Od 2010 roku w pracy z osobami uzależnionymi · Szkoła Psychoterapii Uzależnień CEDR · Studium Umiejętności Psychologicznych · szkolenia z pracy z ciałem, ruchem i uważnością",
    shortBio:
      "Doświadczenie zdobywała przez kilkanaście lat w placówkach stacjonarnych i ambulatoryjnych, pracując z osobami uzależnionymi od alkoholu i innych substancji psychoaktywnych.",
    longBio: `
      <h3>Czym się zajmuje</h3>
      <ul>
        <li>terapią osób uzależnionych</li>
        <li>pracą nad emocjami i potrzebami</li>
        <li>rozwijaniem świadomości ciała</li>
        <li>technikami uważności i regulowania napięcia</li>
        <li>wzmacnianiem osobistych zasobów pacjenta</li>
      </ul>
      <h3>Jak pracuje</h3>
      <p>Szczególnie bliska jest jej praca poprzez ciało i ruch. Zwraca uwagę na to, jak emocje przejawiają się nie tylko w myślach, ale również w napięciu, gestach i sposobie funkcjonowania ciała.</p>
      <p>W relacji terapeutycznej najważniejsze są dla niej bezpieczeństwo, uważność i zaufanie. Pomaga pacjentom odzyskiwać kontakt ze sobą, a jednocześnie uczciwie przyglądać się konsekwencjom dotychczasowych wyborów.</p>
    `,
  },
  {
    name: "Paweł Częstochowski",
    slug: "pawel-czestochowski",
    role: "specjalista terapii uzależnień · pedagog · terapeuta",
    qualifications:
      "Pedagog · specjalista terapii uzależnień · doświadczenie w pracy stacjonarnej i ambulatoryjnej",
    shortBio:
      "Doświadczenie zdobywał, prowadząc zarówno grupy terapeutyczne, jak i terapię indywidualną w różnych formach leczenia uzależnień.",
    longBio: `
      <h3>Czym się zajmuje</h3>
      <ul>
        <li>terapią grupową i indywidualną</li>
        <li>pracą nad mechanizmami uzależnienia</li>
        <li>rozwijaniem samoświadomości</li>
        <li>rozpoznawaniem własnych zasobów i ograniczeń</li>
        <li>przygotowaniem do dalszego procesu zdrowienia</li>
      </ul>
      <h3>Jak pracuje</h3>
      <p>Trzeźwienie traktuje jako proces poznawania siebie — nie tylko swoich trudności, ale również możliwości i zasobów.</p>
      <p>Pomaga pacjentom przyglądać się temu, co dotychczas utrudniało zmianę, oraz budować większą akceptację siebie i odpowiedzialność za dalsze decyzje.</p>
    `,
  },
  {
    name: "Łukasz Drężek",
    slug: "lukasz-drezek",
    role: "specjalista terapii uzależnień · teolog · terapeuta",
    qualifications:
      "Studium Terapii Uzależnień IPZ PTP · dialog motywujący · praca z ciałem · techniki uważności · przygotowanie do uwzględniania aspektu duchowego w terapii",
    shortBio:
      "Z osobami uzależnionymi pracuje od 2021 roku. Swoje przygotowanie rozwija poprzez specjalistyczne szkolenia z dialogu motywującego, pracy z ciałem i regulacji emocji.",
    longBio: `
      <h3>Czym się zajmuje</h3>
      <ul>
        <li>terapią osób uzależnionych</li>
        <li>wzmacnianiem motywacji do zmiany</li>
        <li>pracą nad emocjami i napięciem</li>
        <li>rozwijaniem uważności i samoświadomości</li>
        <li>poszukiwaniem indywidualnych zasobów wspierających zdrowienie</li>
      </ul>
      <h3>Jak pracuje</h3>
      <p>Chętnie korzysta z technik uważności, które pomagają zatrzymać automatyczne reakcje, lepiej rozpoznawać emocje i obniżać napięcie.</p>
      <p>Jeśli jest to ważne dla pacjenta, w procesie może również uwzględniać wymiar duchowy jako jeden z osobistych zasobów zdrowienia — bez narzucania konkretnego światopoglądu.</p>
    `,
  },
  {
    name: "Małgorzata Duda",
    slug: "malgorzata-duda",
    role: "terapeutka · trenerka rozwoju osobistego",
    qualifications:
      "Od 2017 roku w pracy z osobami uzależnionymi i współuzależnionymi · Akademia Psychologii Terapeutycznej · Szkoła Trenerów i Menadżerów · Wyższa Szkoła Biznesu i Nauk o Zdrowiu",
    shortBio:
      "Pracuje z osobami uzależnionymi i współuzależnionymi, wspierając je zarówno w procesie zmiany, jak i w szerszej pracy nad funkcjonowaniem w życiu.",
    longBio: `
      <h3>Czym się zajmuje</h3>
      <ul>
        <li>pracą terapeutyczną z osobami uzależnionymi</li>
        <li>wsparciem osób współuzależnionych</li>
        <li>wzmacnianiem poczucia własnej wartości</li>
        <li>pracą nad relacją z samym sobą</li>
        <li>rozwijaniem osobistych zasobów i równowagi</li>
      </ul>
      <h3>Jak pracuje</h3>
      <p>Opiera relację na wzajemnym zaufaniu i indywidualnym podejściu. Zwraca uwagę nie tylko na samo uzależnienie, ale również na inne obszary życia, które wymagają odbudowania.</p>
      <p>Ważne są dla niej akceptacja siebie, wzmacnianie wewnętrznych zasobów i stopniowe odzyskiwanie równowagi w relacjach i codziennym funkcjonowaniu.</p>
    `,
  },
];

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
