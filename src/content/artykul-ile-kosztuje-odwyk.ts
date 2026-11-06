/**
 * „Ile kosztuje odwyk prywatnie i od czego zależy cena” — seed source for
 * `npm run seed:article:koszt` (article O1 in plans/INSIEME_PLAN_TRESCI_v2.md).
 * Once seeded, the database row is what the site renders; editing here changes
 * nothing live unless the seed is re-run with --reset. The cover photo is set
 * in the panel and a re-run leaves it alone.
 *
 * Built on Dominika Walczak's video about what makes up the price („cena
 * ważne.mp4” / „Rolka o cenie”, Drive folder from Oct 2026, transcribed Nov 6,
 * 2026): ambulatory session 250–300 zł, the team present outside sessions,
 * supervision, 15–25 tys. zł as the cost of a properly run month, and her
 * warning about offers under 10 tys. zł. Her ask: the article should carry,
 * without saying it outright, that good therapy cannot be done cheaply. It
 * does that through what the price pays for, the hourly comparison, NFZ's own
 * spend per patient and the questions to ask.
 *
 * Insieme's own facts come from the centre's two client e-mail templates
 * (Nov 6, 2026): 18 000 zł for 28 days, ~156 h of therapy (Mon–Sat, 9–12 and
 * 15–18), a lead therapist and min. one 50-min individual session a week,
 * psychiatrist, mostly 3-bed rooms on purpose, one family consultation
 * (Rodzina PLUS 1 000 zł extra), sick note and treatment summary included,
 * 50% deposit (9 000 zł), detox at a partner unit ~4 500 zł for 3 days,
 * ambulatory programme 10–12 months (weekly group + 2 individual sessions a
 * month), no referral needed.
 *
 * Market ranges come from price lists published by private centres, checked on
 * Nov 6, 2026 (WANT, MyWay, Uzależniony.pl Tarnów, Twoja Przystań, Przy-Stań,
 * AlkoVip). The article names none of them (plan: no comparisons by name).
 * NFZ figure: Menedżer Zdrowia, 26.09.2025 — 234 096 806 zł / 17 372 patients
 * in 2024 for stationary alcohol therapy ≈ 13 476 zł per patient.
 *
 * Before publishing (plan: T+P):
 *  - the centre fills the one [DO UZUPEŁNIENIA…] gap: deposit and refund
 *    rules when someone cancels or leaves early;
 *  - Dominika approves the „Z praktyki ośrodka” quote, written from her video;
 *  - the ambulatory programme is 10–12 months here (e-mail) but 12–13 on
 *    /program and /cennik — one of them must change;
 *  - a lawyer reads it (prices, art. 14), a reviewer is set in /admin/articles.
 * The seed leaves it as a draft without a reviewer.
 */
import type { ArticleSeed } from "./article-seed";

const MZ_KOSZTY =
  "https://www.termedia.pl/mz/Ile-kosztuje-problem-alkoholowy-,64183.html";
const ROZP_2820 = "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20230002820";
const RPWDL = "https://rpwdl.ezdrowie.gov.pl/";
const TERMINY_NFZ = "https://terminyleczenia.nfz.gov.pl";

/** An external link that opens in a new tab, like the NFZ article's. */
const ext = (href: string, label: string) => `<a href="${href}" target="_blank">${label}</a>`;

export const kosztOdwykuArticleSeed: ArticleSeed = {
  slug: "ile-kosztuje-odwyk",
  title: "Ile kosztuje odwyk prywatnie i od czego zależy cena",
  excerpt:
    "Ile kosztuje 28 dni terapii w prywatnym ośrodku, za co właściwie się płaci, co bywa płatne osobno i o co zapytać, zanim wybierzesz ośrodek.",
  metaTitle: "Ile kosztuje odwyk prywatnie? Ceny 2026 i co obejmują",
  metaDescription:
    "28 dni terapii w prywatnym ośrodku kosztuje zwykle 10–16 tys. zł. Za co płacisz, co jest płatne osobno i o co zapytać. Stan na listopad 2026.",
  sources: [
    {
      title: "Menedżer Zdrowia: Ile kosztuje problem alkoholowy? Dane NFZ za 2024 r., 26 września 2025 r.",
      url: MZ_KOSZTY,
    },
    {
      title:
        "Rozporządzenie Ministra Zdrowia z 29 grudnia 2023 r. w sprawie funkcjonowania podmiotów leczniczych sprawujących opiekę nad uzależnionymi od alkoholu (Dz.U. 2023 poz. 2820)",
      url: ROZP_2820,
    },
    { title: "Rejestr Podmiotów Wykonujących Działalność Leczniczą", url: RPWDL },
    { title: "NFZ: Informator o terminach leczenia", url: TERMINY_NFZ },
    {
      title: "Cenniki prywatnych ośrodków leczenia uzależnień opublikowane na ich stronach, stan na 6 listopada 2026 r.",
      url: "",
    },
  ],
  sections: [
    {
      kind: "text",
      html: `
        <p><strong>Za 28 dni terapii w prywatnym ośrodku stacjonarnym trzeba dziś zapłacić zwykle od 10 do 16 tys. zł, a za programy z większą liczbą godzin terapii i opieki do ok. 20 tys. zł.</strong> Krótsze pobyty i terapia dzienna bez noclegu kosztują mniej, dłuższe programy więcej. Najwięcej o cenie mówi jednak to, ile terapii faktycznie dostajesz: ile godzin zajęć, kto je prowadzi i czy zespół pracuje z pacjentem także poza nimi. W placówkach z umową z NFZ leczenie jest bezpłatne.</p>
        <p><strong>W skrócie:</strong></p>
        <ul>
          <li>Według cenników prywatnych ośrodków 28 dni terapii stacjonarnej kosztuje zwykle 10–16 tys. zł, 6 tygodni 16–23 tys. zł, a 28 dni terapii dziennej 5–8 tys. zł.</li>
          <li>Największą część ceny stanowi praca zespołu: liczba godzin terapii, terapeuta prowadzący, lekarz psychiatra i superwizja. Nocleg i wyżywienie to mniejsza część.</li>
          <li>Detoks, terapia po wyjeździe i dodatkowe wsparcie dla rodziny są zwykle płatne osobno.</li>
          <li>28 dni w Insieme kosztuje 18 000 zł. Co obejmuje ta kwota, piszemy niżej i w <a href="/cennik">cenniku</a>.</li>
        </ul>
        <p>Stan na 6 listopada 2026 r.</p>

        <h2>Ile kosztuje odwyk w prywatnym ośrodku</h2>
        <p>Sprawdziliśmy cenniki prywatnych ośrodków, które publikują ceny w internecie. Kwoty dotyczą całego pobytu z noclegiem, wyżywieniem i programem terapii:</p>
        <ul>
          <li><strong>14–21 dni:</strong> ok. 4–14 tys. zł, zależnie od długości i pokoju. Tak krótkie pobyty to zwykle programy dla osób po nawrocie albo pierwszy etap leczenia.</li>
          <li><strong>28 dni:</strong> zwykle 10–16 tys. zł. Najtańsze oferty zaczynają się od ok. 7 tys. zł, programy z większą liczbą godzin terapii kosztują do ok. 20 tys. zł. To najczęstsza długość programu w ośrodkach prywatnych.</li>
          <li><strong>6 tygodni:</strong> ok. 16–23 tys. zł.</li>
          <li><strong>8 tygodni:</strong> ok. 21–28 tys. zł.</li>
          <li><strong>Terapia dzienna bez noclegu, 28 dni:</strong> ok. 5–8 tys. zł.</li>
          <li><strong>Detoks alkoholowy, 3–5 dni:</strong> ok. 3–5 tys. zł. Odtrucie od narkotyków lub leków trwa zwykle dłużej i kosztuje więcej.</li>
        </ul>
        <p>Pokój jednoosobowy podnosi cenę, w sprawdzonych cennikach o ok. 3 tys. zł za 28 dni. Niższe kwoty to często promocje z terminem ważności. Porównując oferty, zawsze sprawdzaj, za ile dni podana jest cena i co dokładnie obejmuje.</p>

        <h2>Za co właściwie płacisz</h2>
        <p>Nocleg i wyżywienie to mniejsza część ceny. Najwięcej kosztują ludzie: zespół, który prowadzi terapię, jest z pacjentami przez całą dobę i pracuje nad ich leczeniem także wtedy, gdy nie siedzą na sesji.</p>
      `,
    },
    {
      kind: "cards",
      heading: "",
      cards: [
        {
          title: "Godziny terapii",
          description:
            "Zajęcia grupowe, psychoedukacja, warsztaty i sesje indywidualne. W Insieme od poniedziałku do soboty, w dwóch blokach: 9:00–12:00 i 15:00–18:00. Razem ok. 156 godzin w ciągu 28 dni.",
        },
        {
          title: "Terapeuta prowadzący",
          description:
            "Jedna osoba odpowiada za cały proces pacjenta: zbiera obserwacje zespołu, wyznacza cele, sprawdza postępy i zmienia plan, gdy trzeba. Ta praca trwa także między sesjami.",
        },
        {
          title: "Terapeuci także poza zajęciami",
          description:
            "Zespół jest z pacjentami przy posiłkach, w czasie wolnym i wieczorem. To, jak ktoś radzi sobie w zwykłych sytuacjach, często mówi o nim więcej niż sama sesja.",
        },
        {
          title: "Kwalifikacje i lekarz psychiatra",
          description:
            "Terapię prowadzą specjaliści psychoterapii uzależnień: z certyfikatem albo w trakcie szkolenia pod superwizją. Lekarz psychiatra kwalifikuje do leczenia i decyduje o lekach, jeśli są potrzebne.",
        },
        {
          title: "Superwizja i praca zespołu",
          description:
            "Zespół regularnie omawia każdego pacjenta, a zewnętrzny superwizor sprawdza, czy terapia idzie we właściwym kierunku. Pacjent tego nie widzi, ale od tego zależy jakość terapii.",
        },
        {
          title: "Kameralna grupa",
          description:
            "W małej grupie każdy pacjent dostaje więcej uwagi. Koszt pracy zespołu rozkłada się wtedy jednak na mniej osób, co widać w cenie.",
        },
      ],
    },
    {
      kind: "text",
      html: `
        <h2>Miesiąc w ośrodku a miesiąc terapii w gabinecie</h2>
        <p>Pomaga proste porównanie. W prywatnym gabinecie jedna sesja z psychoterapeutą uzależnień kosztuje zwykle 250–300 zł. Przy jednym spotkaniu w tygodniu to ok. 1–1,2 tys. zł miesięcznie za 4 godziny terapii.</p>
        <p>W Insieme w tym samym miesiącu pacjent ma ok. 156 godzin zajęć, a zespół terapeutyczny jest dostępny przez całą dobę. Przy cenie 18 000 zł godzina zajęć kosztuje ok. 115 zł, razem z noclegiem, wyżywieniem, konsultacjami psychiatry i pracą terapeuty prowadzącego między sesjami.</p>
        <p>To nie znaczy, że terapia w gabinecie jest gorsza. To inna intensywność, dobrana do innej sytuacji, a po pobycie w ośrodku zwykle następny krok.</p>

        <h2>Ile kosztuje leczenie na NFZ</h2>
        <p>Dla pacjenta nic. Terapia w poradniach i na oddziałach, które mają umowę z NFZ, jest bezpłatna. Nie znaczy to jednak, że jest tania: w 2024 r. NFZ zapłacił za stacjonarną terapię uzależnienia od alkoholu 234 mln zł za 17 372 pacjentów, czyli średnio ok. 13,5 tys. zł na osobę (${ext(MZ_KOSZTY, "Menedżer Zdrowia, dane NFZ")}).</p>
        <p>Różnice między leczeniem na NFZ a prywatnym dotyczą głównie czasu oczekiwania, długości pobytu i wielkości grupy. Stacjonarna terapia na NFZ trwa zwykle 6–8 tygodni, a na miejsce czeka się od kilku tygodni do kilku miesięcy. Jak zacząć i gdzie sprawdzić terminy, opisujemy w artykule <a href="/porady/odwyk-na-nfz">Odwyk na NFZ</a>.</p>

        <h2>Co zwykle nie jest wliczone w cenę</h2>
        <ul>
          <li><strong>Detoks.</strong> Jeśli ktoś pije lub bierze codziennie, przed terapią może być potrzebne odtrucie pod opieką lekarza. Część ośrodków prowadzi je sama, część współpracuje z innym oddziałem. Nie odstawiaj alkoholu nagle po długim, codziennym piciu bez porady lekarza. Więcej o tym, <a href="/detoks-i-kwalifikacja">kiedy potrzebny jest detoks</a>.</li>
          <li><strong>Terapia po pobycie.</strong> 28 dni to początek leczenia. Dalsza terapia trwa zwykle wiele miesięcy i jest płatna osobno.</li>
          <li><strong>Rozszerzone wsparcie dla rodziny</strong> poza konsultacjami, które są częścią programu.</li>
          <li><strong>Przedłużenie pobytu</strong>, jeśli terapeuta i pacjent uznają, że jest potrzebne.</li>
          <li><strong>Leki zalecone przez lekarza</strong>, które pacjent zwykle wykupuje sam.</li>
          <li><strong>Wizyty innych lekarzy, zwolnienie lekarskie i dojazd</strong>, w części ośrodków.</li>
        </ul>
        <p>Zapytaj o te pozycje przed przyjazdem i poproś o umowę, w której są wypisane.</p>

        <h2>O co zapytać, gdy cena jest wyraźnie niższa</h2>
        <p>Niższa cena nie musi oznaczać gorszej terapii, ale zawsze z czegoś wynika. Zanim wybierzesz ośrodek, zapytaj:</p>
        <ol>
          <li>Ile godzin zajęć ma pacjent w tygodniu i ile z nich to sesje indywidualne?</li>
          <li>Czy pacjent ma jednego terapeutę prowadzącego, który odpowiada za cały jego plan leczenia?</li>
          <li>Kto prowadzi terapię? Czy terapeuci mają certyfikat specjalisty psychoterapii uzależnień albo są w trakcie szkolenia pod superwizją?</li>
          <li>Czy terapeuci są w ośrodku tylko na zajęciach, czy także wieczorem i w weekendy? Kto jest z pacjentami w nocy?</li>
          <li>Jak liczna jest grupa i ilu pacjentów przypada na jednego terapeutę?</li>
          <li>Czy pacjenta konsultuje lekarz psychiatra?</li>
          <li>Czy zespół ma regularną superwizję?</li>
          <li>Co dzieje się po wyjeździe: czy jest program dalszej terapii i ile kosztuje?</li>
        </ol>
        <p>Ośrodkiem stacjonarnym leczącym uzależnienie od alkoholu musi kierować osoba z tytułem lub certyfikatem specjalisty psychoterapii uzależnień i co najmniej pięcioletnim stażem w leczeniu uzależnień (${ext(ROZP_2820, "rozporządzenie Ministra Zdrowia z 29 grudnia 2023 r., § 10")}). Dotyczy to podmiotów leczniczych, dlatego sprawdź też, czy ośrodek jest wpisany do ${ext(RPWDL, "Rejestru Podmiotów Wykonujących Działalność Leczniczą")}.</p>

        <h2>Ile kosztuje terapia w Insieme</h2>
        <p><strong>28-dniowy program terapii stacjonarnej w Insieme kosztuje 18 000 zł.</strong> W tej kwocie są:</p>
        <ul>
          <li>ok. 156 godzin terapii: grupa, psychoedukacja i warsztaty, od poniedziałku do soboty;</li>
          <li>terapeuta prowadzący i co najmniej jedna 50-minutowa sesja indywidualna w tygodniu;</li>
          <li>kwalifikacja i konsultacje lekarza psychiatry;</li>
          <li>całodobowa opieka zespołu terapeutycznego;</li>
          <li>zakwaterowanie przez 28 dni i pełne wyżywienie;</li>
          <li>konsultacja z terapeutą dla rodziny lub bliskich;</li>
          <li>zwolnienie lekarskie na czas pobytu, zaświadczenie o leczeniu i pisemne podsumowanie terapii z zaleceniami;</li>
          <li>sauna, siłownia, ogród i leśne otoczenie.</li>
        </ul>
        <p>Pokoje są najczęściej trzyosobowe. To świadomy wybór: wspólne mieszkanie jest częścią terapii, bo uczy współpracy i pokazuje, jak ktoś funkcjonuje z innymi. Cena wynika więc z programu, a nie ze standardu pokoju.</p>
        <p>Osobno płatne są:</p>
        <ul>
          <li>detoks, jeśli jest potrzebny. Pomagamy go zorganizować we współpracującej placówce, która ustala jego zakres i koszt. Zwykle to ok. 4 500 zł za 3 doby;</li>
          <li>leki zalecone przez psychiatrę, które pacjent wykupuje, i świadczenia medyczne spoza programu;</li>
          <li>rozszerzone wsparcie dla rodziny, pakiet Rodzina PLUS: 1 000 zł;</li>
          <li>program ambulatoryjny po pobycie.</li>
        </ul>
        <p>Miejsce rezerwuje zaliczka w wysokości połowy ceny, czyli 9 000 zł. Pozostałe 9 000 zł rozliczamy zgodnie z ustaleniami przed rozpoczęciem terapii.</p>
        <p>Nie potrzebujesz skierowania. Do leczenia kwalifikuje lekarz psychiatra po rozmowie kwalifikacyjnej. Przed rozpoczęciem terapii potrzebne jest kilka dni bez alkoholu lub innych substancji, a przy niektórych substancjach dłużej. Jeśli jest wolne miejsce, przyjęcie bywa możliwe nawet następnego dnia. Szczegóły w <a href="/cennik">cenniku</a> i w opisie <a href="/program">programu leczenia</a>.</p>

        <h2>Z praktyki ośrodka</h2>
        <blockquote>„W Insieme mówimy, że każda minuta w ośrodku jest terapią. Terapeuta nie kończy pracy razem z zajęciami. Widzi pacjenta przy posiłku, w rozmowach na korytarzu, w sytuacjach, które poza ośrodkiem wydawałyby się bez znaczenia. Te obserwacje często wnoszą do terapii więcej niż sama sesja i na ich podstawie terapeuta układa plan dla pacjenta. Nad całym procesem czuwa jeszcze zespół i zewnętrzny superwizor. Dlatego, jeśli miesiąc terapii kosztuje wyraźnie mniej niż 10 tys. zł, warto bardzo dokładnie dopytać, co ośrodek ograniczył.”</blockquote>
        <p>Dominika Walczak, kierowniczka ośrodka Insieme [DO AKCEPTACJI: tekst napisany na podstawie nagrania o cenie, Dominika zatwierdza brzmienie].</p>
      `,
    },
    {
      kind: "steps",
      heading: "Co możesz zrobić teraz",
      steps: [
        {
          title: "Policz cały koszt leczenia",
          description:
            "Zapytaj nie tylko o pobyt, ale też o detoks, terapię po wyjeździe i ewentualne przedłużenie. Poproś o umowę, w której te kwoty są wypisane.",
        },
        {
          title: "Porównaj z leczeniem na NFZ",
          description:
            "Sprawdź terminy na oddziałach stacjonarnych w swoim województwie w Informatorze o terminach leczenia NFZ albo pod numerem 800 190 590.",
        },
        {
          title: "Sprawdź, czy to już uzależnienie",
          description:
            "Krótki, anonimowy test przesiewowy pomoże uporządkować to, co się dzieje. Odpowiedzi nie są zapisywane.",
        },
        {
          title: "Zadzwoń i zapytaj o termin",
          description:
            "Pierwsza rozmowa z Insieme jest bezpłatna i nie zobowiązuje do przyjazdu. Opowiemy, jak wygląda program, i podamy najbliższy wolny termin.",
        },
      ],
    },
    {
      kind: "text",
      html: `
        <p>Przydatne: <a href="/porady/odwyk-na-nfz">jak zacząć leczenie na NFZ</a>, ${ext(TERMINY_NFZ, "Informator o terminach leczenia NFZ")}, <a href="/testy/czy-to-juz-problem">test „Czy to już problem?”</a> i <a href="/dla-rodziny">wsparcie dla rodziny</a>. Jeśli to Ty szukasz ośrodka dla bliskiej osoby, przeczytaj też, <a href="/porady/jak-przekonac-osobe-uzalezniona-do-leczenia">jak z nią rozmawiać o leczeniu</a>.</p>

        <h2>Pytania i odpowiedzi</h2>
        <h3>Czy NFZ zwraca koszty prywatnego odwyku?</h3>
        <p>Nie. NFZ finansuje leczenie w placówkach, które mają z nim umowę. Jeśli ośrodek prywatny takiej umowy nie ma, za pobyt płaci pacjent albo jego bliscy.</p>
        <h3>Czy na prywatny odwyk potrzebne jest skierowanie?</h3>
        <p>Nie. Do ośrodka prywatnego zgłaszasz się sam, a o przyjęciu decyduje kwalifikacja w ośrodku. Skierowania od lekarza wymaga zwykle oddział stacjonarny na NFZ.</p>
        <h3>Czy cena odwyku obejmuje detoks?</h3>
        <p>Zwykle nie. W wielu ośrodkach detoks jest osobną usługą albo odbywa się na współpracującym oddziale. Nie każdy go potrzebuje, decyduje o tym lekarz przy kwalifikacji. Więcej: <a href="/detoks-i-kwalifikacja">kiedy potrzebny jest detoks</a>.</p>
        <h3>Czy na czas odwyku dostanę zwolnienie lekarskie?</h3>
        <p>W Insieme zwolnienie lekarskie na czas pobytu jest w cenie. W części ośrodków to osobna opłata, więc zapytaj o nie przed przyjazdem.</p>
        <h3>Czy 28 dni wystarczy?</h3>
        <p>28 dni to pierwszy, najbardziej intensywny etap. Po nim potrzebna jest dalsza terapia: w poradni NFZ, w gabinecie albo w programie ambulatoryjnym ośrodka. W Insieme ten program trwa zwykle 10–12 miesięcy: spotkanie grupowe raz w tygodniu i co najmniej dwie sesje indywidualne w miesiącu.</p>
        <h3>Ile kosztuje jedna sesja terapii uzależnień prywatnie?</h3>
        <p>W prywatnych gabinetach zwykle 250–300 zł, czasem więcej. Terapia indywidualna to najczęściej jedno spotkanie w tygodniu.</p>
        <h3>Jak wygląda płatność za odwyk?</h3>
        <p>Zasady są różne, często termin rezerwuje zaliczka albo zadatek. W Insieme zaliczka to połowa ceny, czyli 9 000 zł, a pozostałą kwotę rozliczamy zgodnie z ustaleniami przed rozpoczęciem terapii.</p>
        <h3>Co z pieniędzmi, jeśli pobyt skończy się wcześniej?</h3>
        <p>To zależy od umowy. [DO UZUPEŁNIENIA PRZEZ OŚRODEK: czy zaliczka wraca przy rezygnacji i jak rozliczany jest pobyt zakończony przed czasem.] Zanim zapłacisz, sprawdź, czy umowa mówi o zaliczce czy o zadatku. Zadatek co do zasady przepada, jeśli zrezygnujesz z przyczyn leżących po Twojej stronie, a zaliczka podlega zwrotowi (art. 394 Kodeksu cywilnego).</p>
      `,
    },
    {
      kind: "cta",
      heading: "Zapytaj o wolny termin w Insieme",
      text: "Opowiemy, jak wygląda program i od czego zacząć. Rozmowa jest bezpłatna i nie zobowiązuje do przyjazdu.",
      buttonLabel: "Zadzwoń: 669 916 005",
      buttonHref: "tel:+48669916005",
    },
  ],
};
