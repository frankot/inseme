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
 * Dominika's WhatsApp answers and voice note (Nov 6, 2026):
 *  - the 9 000 zł is a zadatek, not a zaliczka (her e-mail template says
 *    zaliczka — to be fixed there): non-refundable when the patient doesn't
 *    start, per the reservation statement („wpłacone środki nie podlegają
 *    zwrotowi w przypadku rezygnacji z podjęcia terapii… stanowią
 *    zabezpieczenie terminu”); the point of it is the quick start date;
 *  - leaving early on one's own, against the team's advice: no refund;
 *    something outside the patient's control: case by case; trial period for
 *    doubtful qualifications, settled differently if the team refers the
 *    patient elsewhere; some breaches of the rules end in discharge without a
 *    refund; all of it is told before treatment starts;
 *  - besides the weekly sessions with the lead therapist there are
 *    introductory and, when needed, intervention sessions; the psychiatrist
 *    qualifies and re-consults as needed, informed by the team — but keep the
 *    psychiatrist brief: psychotherapists are responsible for the therapy;
 *  - voice note: the savings are made where the patient can't see them (the
 *    team's work behind the scenes), so offers look alike at different prices.
 *
 * Market ranges come from price lists published by private centres, checked on
 * Nov 6, 2026 (WANT, MyWay, Uzależniony.pl Tarnów, Twoja Przystań, Przy-Stań,
 * AlkoVip); the centre raised the 28-day range to 12–18 tys. zł (cheapest
 * ~8 tys.) in the panel on Nov 6. The article names none of them (plan: no
 * comparisons by name).
 * NFZ figure: Menedżer Zdrowia, 26.09.2025 — 234 096 806 zł / 17 372 patients
 * in 2024 for stationary alcohol therapy ≈ 13 476 zł per patient.
 *
 * Dominika's comments on the draft (Word doc, Nov 9, 2026):
 *  - accommodation and full board for a month are a real cost, not a small
 *    one; warn against choosing by hotel standard („terapia uzależnień to nie
 *    SPA”) — her figure of „kilkadziesiąt tysięcy” for luxury centres isn't
 *    in any public price list, so the text says only that they cost more;
 *  - some centres have no single rooms on purpose (therapeutic community);
 *    Insieme: spacious 3-bed rooms, a whole room can't be bought out;
 *  - the psychiatrist gets a card of their own (qualifying the patient),
 *    apart from the therapists' qualifications; her 350–500 zł per visit is
 *    above public figures (kb.pl 2026: ~336 zł Warsaw, ~299 zł Łódź), so
 *    „ponad 300 zł”; the official title is „instruktor terapii uzależnień”;
 *  - therapy on Sundays too, half as long (6 h × 6 days × 4 + 3 h × 4 = 156);
 *  - the sick note is free as a rule — no longer listed as a possible extra;
 *  - the questions list merges her checklist (Instagram, May 31, 2024);
 *  - the § 10 paragraph (Dz.U. 2023 poz. 2820: the facility „kieruje osoba”
 *    with the specialist title and 5 years) is gone: she asked to reword it,
 *    but a reworded regulation would misquote the law. Who formally heads
 *    the centre is a question for the centre's lawyer, not for this text;
 *  - „Czy 28 dni wystarczy?” is her rewrite; 10–12 months of the ambulatory
 *    programme confirmed.
 *
 * Before publishing (plan: T+P):
 *  - Dominika approves the quote again: the sentence on introductory and
 *    intervention sessions is new;
 *  - a lawyer reads it: prices and art. 14, and the zadatek / early-leave
 *    rules (a consumer contract: art. 385¹ KC);
 *  - a reviewer is set in /admin/articles.
 * The seed leaves it as a draft; a --reset keeps the reviewer and cover photo
 * chosen in the panel.
 */
import type { ArticleSeed } from "./article-seed";

const MZ_KOSZTY =
  "https://www.termedia.pl/mz/Ile-kosztuje-problem-alkoholowy-,64183.html";
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
    "28 dni terapii w prywatnym ośrodku kosztuje zwykle 12–18 tys. zł. Za co płacisz, co jest płatne osobno i o co zapytać. Stan na listopad 2026.",
  sources: [
    {
      title: "Menedżer Zdrowia: Ile kosztuje problem alkoholowy? Dane NFZ za 2024 r., 26 września 2025 r.",
      url: MZ_KOSZTY,
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
        <p><strong>Za 28 dni terapii w prywatnym ośrodku stacjonarnym trzeba dziś zapłacić zwykle od 12 do 18 tys. zł, a za programy z większą liczbą godzin terapii i opieki do ok. 20 tys. zł.</strong> Krótsze pobyty i terapia dzienna bez noclegu kosztują mniej, dłuższe programy więcej. W profesjonalnym ośrodku najwięcej o cenie mówi jednak to, ile terapii faktycznie dostajesz: ile godzin zajęć, kto je prowadzi i czy zespół pracuje z pacjentem także poza nimi. W placówkach z umową z NFZ leczenie jest bezpłatne.</p>
        <p><strong>W skrócie:</strong></p>
        <ul>
          <li>Według cenników prywatnych ośrodków 28 dni terapii stacjonarnej kosztuje zwykle 12–18 tys. zł, 6 tygodni 16–23 tys. zł, a 28 dni terapii dziennej 5–8 tys. zł.</li>
          <li>Na cenę składa się miesiąc pobytu z pełnym wyżywieniem i praca zespołu terapeutycznego. To ta druga część, czyli liczba godzin terapii, terapeuta prowadzący, kwalifikacje terapeutów i superwizja, najbardziej odróżnia od siebie ośrodki.</li>
          <li>Hotelowy standard podnosi cenę, ale nie mówi nic o jakości terapii.</li>
          <li>Detoks, terapia po wyjeździe i dodatkowe wsparcie dla rodziny są zwykle płatne osobno.</li>
          <li>28 dni w Insieme kosztuje 18 000 zł. Co obejmuje ta kwota, piszemy niżej i w <a href="/cennik">cenniku</a>.</li>
        </ul>
        <p>Stan na 6 listopada 2026 r.</p>

        <h2>Ile kosztuje odwyk w prywatnym ośrodku</h2>
        <p>Sprawdziliśmy cenniki prywatnych ośrodków, które publikują ceny w internecie. Kwoty dotyczą całego pobytu z noclegiem, wyżywieniem i programem terapii:</p>
        <ul>
          <li><strong>14–21 dni:</strong> ok. 4–14 tys. zł, zależnie od długości i pokoju. Tak krótkie pobyty to zwykle programy dla osób po nawrocie albo pierwszy etap leczenia.</li>
          <li><strong>28 dni:</strong> zwykle 12–18 tys. zł. Najtańsze oferty zaczynają się od ok. 8 tys. zł, programy z większą liczbą godzin terapii kosztują do ok. 20 tys. zł. To najczęstsza długość programu w ośrodkach prywatnych.</li>
          <li><strong>6 tygodni:</strong> ok. 16–23 tys. zł.</li>
          <li><strong>8 tygodni:</strong> ok. 21–28 tys. zł.</li>
          <li><strong>Terapia dzienna bez noclegu, 28 dni:</strong> ok. 5–8 tys. zł.</li>
          <li><strong>Detoks alkoholowy, 3–5 dni:</strong> ok. 3–5 tys. zł. Odtrucie od narkotyków lub leków trwa zwykle dłużej i kosztuje więcej.</li>
        </ul>
        <p>Pokój jednoosobowy podnosi cenę, w sprawdzonych cennikach o ok. 3 tys. zł za 28 dni. Część ośrodków celowo go nie oferuje: wspólne mieszkanie jest elementem terapii w społeczności terapeutycznej, a przy kameralnej grupie i przestronnym domu pokój wieloosobowy nie wyklucza prywatności. Niższe kwoty to często promocje z terminem ważności. Porównując oferty, zawsze sprawdzaj, za ile dni podana jest cena i co dokładnie obejmuje.</p>

        <h2>Za co właściwie płacisz</h2>
        <p>Część ceny to sam pobyt. Miesiąc zakwaterowania z pełnym wyżywieniem to spory koszt, o czym wie każdy, kto płacił za dłuższy urlop w pensjonacie. Tym, co najbardziej odróżnia od siebie ośrodki, są jednak ludzie: zespół, który prowadzi terapię, jest z pacjentami przez całą dobę i pracuje nad ich leczeniem także wtedy, gdy nie siedzą na sesji.</p>
      `,
    },
    {
      kind: "cards",
      heading: "",
      cards: [
        {
          title: "Godziny terapii",
          description:
            "Zajęcia grupowe, psychoedukacja, warsztaty i sesje indywidualne. W Insieme od poniedziałku do soboty w dwóch blokach, 9:00–12:00 i 15:00–18:00, a w niedzielę o połowę krócej, bo odpoczynek też jest potrzebny. Razem ok. 156 godzin w ciągu 28 dni.",
        },
        {
          title: "Terapeuta prowadzący",
          description:
            "Jedna osoba odpowiada za cały proces pacjenta: zbiera obserwacje zespołu, wyznacza cele, sprawdza postępy i zmienia plan, gdy trzeba. Ta praca trwa także między sesjami.",
        },
        {
          title: "Terapeuci także poza zajęciami",
          description:
            "Zespół terapeutyczny jest w ośrodku przez całą dobę: przy posiłkach, w czasie wolnym i wieczorem. To, jak ktoś radzi sobie w zwykłych sytuacjach, często mówi o nim więcej niż sama sesja. A gdy dzieje się coś trudnego, terapeuta może od razu zareagować i wesprzeć pacjenta, bez czekania na kolejne zajęcia.",
        },
        {
          title: "Kwalifikacje terapeutów",
          description:
            "Za terapię odpowiadają terapeuci uzależnień: specjaliści psychoterapii uzależnień i instruktorzy terapii uzależnień z certyfikatem albo osoby w trakcie szkolenia pod stałą superwizją.",
        },
        {
          title: "Kwalifikacja pacjenta i lekarz psychiatra",
          description:
            "Na początku lekarz psychiatra ocenia, czy stan psychiczny pacjenta i jego szczególne trudności pozwolą mu skorzystać z programu. Jeśli pacjent wymaga monitorowania, lekarz jest obecny także na dalszych etapach terapii. To również część ceny: prywatna wizyta u psychiatry kosztuje zwykle ponad 300 zł.",
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
        <p>W Insieme w tym samym miesiącu pacjent ma ok. 156 godzin zajęć, a zespół terapeutyczny jest dostępny przez całą dobę. Przy cenie 18 000 zł godzina zajęć kosztuje ok. 115 zł, razem z noclegiem, wyżywieniem, pracą terapeuty prowadzącego między sesjami i konsultacjami lekarza, gdy są potrzebne.</p>
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
          <li><strong>Wizyty lekarzy innych specjalności i dojazd</strong>, w części ośrodków.</li>
        </ul>
        <p>Zapytaj o te pozycje przed przyjazdem i poproś o umowę, w której są wypisane.</p>

        <h2>Dlaczego podobne oferty kosztują tak różnie</h2>
        <p>Na stronach ośrodków oferty często wyglądają niemal tak samo: 28 dni, terapia grupowa, sesje indywidualne, konsultacja lekarza. Ceny różnią się przy tym o kilka, a nawet o kilkanaście tysięcy złotych. Ta różnica zwykle nie wynika z tego, co widać w opisie programu, tylko z tego, czego na pierwszy rzut oka nie widać: ile czasu zespół poświęca pacjentowi poza zajęciami, jak często omawia jego terapię, czy pracuje pod superwizją i ilu pacjentów przypada na jednego terapeutę.</p>
        <p>Na tym najłatwiej zaoszczędzić, bo pacjent zwykle nie widzi tego nawet w trakcie pobytu. Różnicę widać dopiero w tym, jak prowadzona jest jego terapia i co udaje mu się w niej osiągnąć.</p>

        <h2>Hotelowy standard to jeszcze nie terapia</h2>
        <p>Bywa też odwrotnie: część ośrodków przyciąga pacjentów hotelowym standardem i dodatkowymi atrakcjami, a ich ceny są wyraźnie wyższe od typowych. Warunki pobytu mają znaczenie, bo przez miesiąc ośrodek jest Twoim domem. Wygodny pokój łatwiej jednak zapewnić niż dobrze prowadzoną terapię, która stawia ośrodkowi wiele wymagań: wykwalifikowany zespół, program leczenia, superwizję.</p>
        <p>Terapia uzależnienia to nie pobyt w SPA. Gdyby wypoczynek leczył uzależnienie, nie byłyby potrzebne specjalistyczne ośrodki. Dlatego standard pokoju nie powinien być głównym kryterium wyboru. Ważniejsze jest to, kto i jak prowadzi terapię.</p>

        <h2>O co zapytać, zanim wybierzesz ośrodek</h2>
        <p>Ani niższa, ani wyższa cena sama w sobie nie mówi, jaka jest terapia, ale zawsze z czegoś wynika. Warto więc sprawdzić:</p>
        <ol>
          <li>Czy ośrodek działa legalnie jako podmiot leczniczy? Sprawdzisz to w ${ext(RPWDL, "Rejestrze Podmiotów Wykonujących Działalność Leczniczą")}. Wpis oznacza, że placówka musi spełniać określone wymagania.</li>
          <li>Jakie kwalifikacje i doświadczenie mają terapeuci? Czy mają certyfikat specjalisty psychoterapii uzależnień albo instruktora terapii uzależnień, czy są w trakcie szkolenia pod superwizją?</li>
          <li>Ilu terapeutów prowadzi zajęcia w ciągu tygodnia i ilu pacjentów przypada na jednego terapeutę? Jedna osoba nie poprowadzi dobrze terapii przez cały tydzień.</li>
          <li>Czy ośrodek ma spisany program leczenia i na jakiej podstawie ocenia postępy pacjenta?</li>
          <li>Ile godzin terapii, a nie tylko zajęć w ogóle, przewiduje program? Ile z nich to sesje indywidualne i czy w trudnym momencie można dostać dodatkową sesję?</li>
          <li>Czy pacjent ma jednego terapeutę prowadzącego, który odpowiada za cały jego plan leczenia?</li>
          <li>Czy terapeuci są w ośrodku tylko na zajęciach, czy także wieczorem i w weekendy? Kto jest z pacjentami w nocy?</li>
          <li>Jak ośrodek kwalifikuje pacjentów do leczenia? Żadna placówka nie pomoże każdemu i czasem dla dobra pacjenta trzeba go skierować w inne miejsce.</li>
          <li>Czy i na jakiej zasadzie ośrodek współpracuje z lekarzem psychiatrą?</li>
          <li>Czy praca zespołu jest pod stałą superwizją? Superwizja to bieżąca ocena programu leczenia, stosowanych metod i terapii poszczególnych pacjentów. Bez niej trudno mówić o prawidłowo prowadzonym leczeniu.</li>
          <li>Co dzieje się po wyjeździe: czy jest program dalszej terapii i ile kosztuje?</li>
        </ol>
        <p>Jeśli nie znajdziesz odpowiedzi na stronie ośrodka, zapytaj przez telefon. To ważna decyzja i warto podjąć ją bez pośpiechu.</p>

        <h2>Ile kosztuje terapia w Insieme</h2>
        <p><strong>28-dniowy program terapii stacjonarnej w Insieme kosztuje 18 000 zł.</strong> W tej kwocie są:</p>
        <ul>
          <li>ok. 156 godzin terapii: grupa, psychoedukacja i warsztaty, od poniedziałku do soboty, a w niedzielę w mniejszym wymiarze;</li>
          <li>terapeuta prowadzący i co najmniej jedna 50-minutowa sesja indywidualna w tygodniu, a poza nimi sesje wprowadzające i, w razie potrzeby, interwencyjne;</li>
          <li>konsultacja kwalifikacyjna u lekarza psychiatry i kolejne konsultacje, gdy są potrzebne;</li>
          <li>całodobowa opieka zespołu terapeutycznego;</li>
          <li>zakwaterowanie przez 28 dni i pełne wyżywienie;</li>
          <li>konsultacja z terapeutą dla rodziny lub bliskich;</li>
          <li>zwolnienie lekarskie na czas pobytu, zaświadczenie o leczeniu i pisemne podsumowanie terapii z zaleceniami;</li>
          <li>sauna, siłownia, ogród i leśne otoczenie.</li>
        </ul>
        <p>Pokoje są najczęściej trzyosobowe i przestronne. To świadomy wybór: wspólne mieszkanie jest częścią terapii, bo uczy współpracy i pokazuje, jak ktoś funkcjonuje z innymi. Daje też uczestnikom wzajemne wsparcie, które jest ważną częścią zdrowienia. Dlatego nie można wykupić całego pokoju za wyższą cenę. Cena wynika z programu, a nie ze standardu pokoju.</p>
        <p>Osobno płatne są:</p>
        <ul>
          <li>detoks, jeśli jest potrzebny. Pomagamy go zorganizować we współpracującej placówce, która ustala jego zakres i koszt. Zwykle to ok. 4 500 zł za 3 doby;</li>
          <li>leki zalecone przez psychiatrę, które pacjent wykupuje, i świadczenia medyczne spoza programu;</li>
          <li>rozszerzone wsparcie dla rodziny, pakiet Rodzina PLUS: 1 000 zł;</li>
          <li>program ambulatoryjny po pobycie.</li>
        </ul>
        <p>Termin rezerwuje zadatek w wysokości połowy ceny, czyli 9 000 zł. Pozostałe 9 000 zł rozliczamy zgodnie z ustaleniami przed rozpoczęciem terapii. W ośrodku prywatnym szybki termin przyjęcia jest często najważniejszą różnicą wobec kilkutygodniowego czekania na NFZ, a zadatek zabezpiecza ten termin dla konkretnego pacjenta. Dlatego przy rezerwacji osoba wpłacająca przyjmuje do wiadomości, że zadatek nie podlega zwrotowi, jeśli pacjent zrezygnuje z podjęcia terapii. Gdy terapia się zaczyna, zadatek jest po prostu częścią ceny.</p>
        <p><strong>Gdy pobyt kończy się wcześniej</strong>, rozliczenie zależy od powodu:</p>
        <ul>
          <li>jeśli pacjent sam decyduje się wyjechać, choć nic nie stoi na przeszkodzie, żeby kontynuował terapię, a zespół zaleca dalszy pobyt, opłata nie jest zwracana;</li>
          <li>jeśli dalszy udział w terapii uniemożliwi coś, co nie zależy od pacjenta, rozpatrujemy sytuację indywidualnie;</li>
          <li>gdy przy kwalifikacji pojawiają się wątpliwości, pobyt zaczyna się od okresu próbnego. Jeśli po nim zespół uzna, że pacjent potrzebuje innej formy pomocy, rozliczenie odpowiednio się zmienia;</li>
          <li>niektóre naruszenia regulaminu kończą się wypisem bez zwrotu opłaty.</li>
        </ul>
        <p>O wszystkich tych zasadach pacjent dowiaduje się przed rozpoczęciem leczenia i decyduje się na terapię, znając je.</p>
        <p>Nie potrzebujesz skierowania. Do leczenia kwalifikuje lekarz psychiatra po rozmowie kwalifikacyjnej. Przed rozpoczęciem terapii potrzebne jest kilka dni bez alkoholu lub innych substancji, a przy niektórych substancjach dłużej. Jeśli jest wolne miejsce, przyjęcie bywa możliwe nawet następnego dnia. Szczegóły w <a href="/cennik">cenniku</a> i w opisie <a href="/program">programu leczenia</a>.</p>

        <h2>Z praktyki ośrodka</h2>
        <blockquote>„W Insieme mówimy, że każda minuta w ośrodku jest terapią. Terapeuta nie kończy pracy razem z zajęciami. Widzi pacjenta przy posiłku, w rozmowach na korytarzu, w sytuacjach, które poza ośrodkiem wydawałyby się bez znaczenia. Te obserwacje często wnoszą do terapii więcej niż sama sesja i na ich podstawie terapeuta układa plan dla pacjenta. Poza stałymi sesjami z terapeutą prowadzącym są też sesje wprowadzające, a w razie potrzeby interwencyjne. Nad całym procesem czuwa jeszcze zespół i zewnętrzny superwizor. Dlatego, jeśli miesiąc terapii kosztuje wyraźnie mniej niż 10 tys. zł, warto bardzo dokładnie dopytać, co ośrodek ograniczył.”</blockquote>
        <p>Dominika Walczak, kierowniczka ośrodka Insieme</p>
      `,
    },
    {
      kind: "steps",
      heading: "Co możesz zrobić teraz",
      steps: [
        {
          title: "Policz cały koszt leczenia",
          description:
            "Zapytaj nie tylko o pobyt, ale też o detoks, terapię po wyjeździe i ewentualne przedłużenie. Poproś o umowę albo regulamin, w których są wypisane te kwoty i zasady zwrotu.",
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
        <p>Tak. W Insieme zwolnienie lekarskie na czas pobytu wystawia lekarz, bez dodatkowej opłaty. Jeśli wybierasz inny ośrodek, zapytaj przed przyjazdem, kto je wystawi.</p>
        <h3>Czy 28 dni wystarczy?</h3>
        <p>28 dni to intensywny etap terapii, który pozwala zrozumieć mechanizmy uzależnienia, rozpoznać własne trudności i rozpocząć proces zmiany. To jednak dopiero początek zdrowienia, które wymaga dalszej pracy i utrwalania nowych sposobów funkcjonowania. Dlatego kolejnym etapem jest kontynuacja leczenia w formie ambulatoryjnej. W Insieme taki program trwa zwykle 10–12 miesięcy i obejmuje cotygodniową terapię grupową oraz co najmniej dwie sesje indywidualne w miesiącu. Dalsze leczenie można też prowadzić w wybranym gabinecie prywatnym albo w poradni NFZ. Najważniejsze, żeby proces nie zakończył się na pobycie w ośrodku.</p>
        <h3>Ile kosztuje jedna sesja terapii uzależnień prywatnie?</h3>
        <p>W prywatnych gabinetach zwykle 250–300 zł, czasem więcej. Terapia indywidualna to najczęściej jedno spotkanie w tygodniu.</p>
        <h3>Jak wygląda płatność za odwyk?</h3>
        <p>Zasady są różne, często termin rezerwuje zaliczka albo zadatek. W Insieme jest to zadatek w wysokości połowy ceny, czyli 9 000 zł, a pozostałą kwotę rozliczamy zgodnie z ustaleniami przed rozpoczęciem terapii.</p>
        <h3>Co z pieniędzmi, jeśli zrezygnuję albo pobyt skończy się wcześniej?</h3>
        <p>To zależy od umowy i regulaminu ośrodka, dlatego przeczytaj je przed wpłatą. Sprawdź przede wszystkim, czy wpłata rezerwacyjna podlega zwrotowi, jeśli zrezygnujesz. Może być nazwana zaliczką albo zadatkiem, a zasady zwrotu są wtedy różne. Zapytaj też, co się dzieje, gdy pacjent wyjedzie przed czasem na własne życzenie, gdy terapię przerwie coś od niego niezależnego i gdy zostanie wypisany za złamanie regulaminu. Zasady obowiązujące w Insieme opisujemy wyżej, w części o cenie terapii w Insieme.</p>
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
