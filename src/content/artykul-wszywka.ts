/**
 * „Wszywka alkoholowa (Esperal) niedostępna — co zamiast niej?” — seed source
 * for `npm run seed:article:wszywka` (article A1 in plans/INSIEME_PLAN_TRESCI_v2.md).
 * Once seeded, the database row is what the site renders; editing here changes
 * nothing live unless the seed is re-run with --reset. The cover photo is set
 * in the panel and a re-run leaves it alone.
 *
 * Facts as of Nov 2, 2026, each from a primary source in `sources`: the
 * Ministry of Health replies to interpellations 18953 (Aug 21, 2026) and 19628
 * (Oct 7, 2026), the Anticol SmPC (May 18, 2026), the EMA page for Selincro,
 * mp.pl drug pages, KCPU and a PARPA text on mp.pl. No doses on purpose.
 *
 * Before publishing: a doctor reads it (plan: T+L), the „Z praktyki ośrodka”
 * placeholder is replaced by the therapist's own words, and a reviewer is set
 * in /admin/articles. The seed leaves it as a draft without a reviewer.
 */
import type { ArticleSeed } from "./article-seed";

const MZ_19628 =
  "https://api.sejm.gov.pl/sejm/term10/interpellations/attachment/ATTDYPJFN/i19628-o1.pdf";
const MZ_18953 =
  "https://api.sejm.gov.pl/sejm/term10/interpellations/attachment/ATTDXCHPB/i18953-o1.pdf";
const CHPL_ANTICOL = "https://polpharma.pl/wp-content/uploads/2026/05/272349_.pdf";
const EMA_SELINCRO = "https://www.ema.europa.eu/en/medicines/human/EPAR/selincro";
const MP_ADEPEND = "https://www.mp.pl/pacjent/leki/lek/75560,Adepend-tabletki-powlekane";
const MP_AKAMPROZAT = "https://www.mp.pl/pacjent/leki/subst.html?id=934";
const PARPA_MP = "https://www.mp.pl/pacjent/psychiatria/uzaleznienia/69539";
const SKINNER_2014 = "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0087366";
const KCPU = "https://kcpu.gov.pl/";
const KCPU_MAPA = "https://kcpu.gov.pl/mapa/";

/** An external link that opens in a new tab, like the NFZ article's. */
const ext = (href: string, label: string) => `<a href="${href}" target="_blank">${label}</a>`;

export const wszywkaArticleSeed: ArticleSeed = {
  slug: "wszywka-alkoholowa-esperal",
  title: "Wszywka alkoholowa (Esperal) niedostępna — co zamiast niej?",
  excerpt:
    "Wszywki z disulfiramem, potocznie Esperalu, nie ma już w Polsce w obrocie. Wyjaśniamy, dlaczego zniknęła, czy wróci i jakie są inne możliwości leczenia.",
  metaTitle: "Wszywka alkoholowa (Esperal) niedostępna — co zamiast?",
  metaDescription:
    "Implantu z disulfiramem (Esperalu) nie ma w obrocie. Dlaczego zniknął, czy wróci i co zamiast niego: tabletki, inne leki i terapia. Stan na listopad 2026.",
  sources: [
    { title: "Odpowiedź Ministra Zdrowia na interpelację nr 19628, 7 października 2026 r.", url: MZ_19628 },
    { title: "Odpowiedź Ministra Zdrowia na interpelację nr 18953, 21 sierpnia 2026 r.", url: MZ_18953 },
    { title: "Charakterystyka produktu leczniczego Anticol 500 mg, 18 maja 2026 r.", url: CHPL_ANTICOL },
    { title: "Europejska Agencja Leków: Selincro (nalmefen)", url: EMA_SELINCRO },
    { title: "Medycyna Praktyczna: Adepend (naltrekson)", url: MP_ADEPEND },
    { title: "Medycyna Praktyczna: akamprozat", url: MP_AKAMPROZAT },
    { title: "J. Fudała (PARPA): Leczenie uzależnienia od alkoholu", url: PARPA_MP },
    {
      title: "M.D. Skinner i in.: Disulfiram Efficacy in the Treatment of Alcohol Dependence: A Meta-Analysis, PLOS ONE 2014",
      url: SKINNER_2014,
    },
    { title: "Krajowe Centrum Przeciwdziałania Uzależnieniom: Telefon Zaufania Uzależnienia", url: KCPU },
    { title: "Ustawa z 6 listopada 2008 r. o prawach pacjenta i Rzeczniku Praw Pacjenta, art. 16", url: "" },
  ],
  sections: [
    {
      kind: "text",
      html: `
        <p><strong>Wszywki alkoholowej, czyli implantu z disulfiramem (potocznie „Esperalu”), nie da się dziś kupić w Polsce.</strong> Według Ministerstwa Zdrowia jedyny taki produkt nie jest już dostępny w obrocie, a sprowadzenie go z zagranicy jest co do zasady niemożliwe. Dostępne pozostają tabletki z disulfiramem i inne leki, ale żaden z nich nie zastępuje <a href="/leczenie-alkoholizmu">leczenia uzależnienia od alkoholu</a>.</p>
        <p><strong>W skrócie:</strong></p>
        <ul>
          <li>Implant zniknął z rynku po tym, jak 23 sierpnia 2026 r. Urząd Rejestracji Produktów Leczniczych odrzucił zmiany w jego produkcji.</li>
          <li>Polska jest jedynym krajem Unii Europejskiej, w którym implant z disulfiramem ma pozwolenie na dopuszczenie do obrotu, więc nie ma skąd go sprowadzić.</li>
          <li>Disulfiram w tabletkach (Anticol) jest dostępny na receptę. Można go stosować wyłącznie za świadomą zgodą osoby, która go przyjmuje.</li>
          <li>Lekarz może też rozważyć naltrekson, akamprozat albo nalmefen. Podstawą leczenia pozostaje psychoterapia uzależnień.</li>
        </ul>
        <p>Stan na 2 listopada 2026 r. Jeśli sytuacja się zmieni, zaktualizujemy ten tekst.</p>

        <h2>Dlaczego wszywki nie ma w aptekach</h2>
        <p>„Esperal” to dziś nazwa potoczna. Lek o tej nazwie utracił pozwolenie na dopuszczenie do obrotu 30 czerwca 2004 r. Od tamtej pory wszczepiano jego odpowiednik: Disulfiram WZF, tabletki do implantacji 100 mg, produkowane przez Zakłady Farmaceutyczne Polpharma (${ext(MZ_18953, "odpowiedź Ministra Zdrowia na interpelację nr 18953")}).</p>
        <p>Producent wystąpił o zmiany w sposobie wytwarzania leku i w metodzie sterylizacji substancji czynnej. Urząd oceniał, czy można nadal sterylizować ją tlenkiem etylenu. To związek uznany za rakotwórczy, a wytyczne Europejskiej Agencji Leków, obowiązujące od 1 października 2019 r., dopuszczają go tylko wyjątkowo, gdy innej metody nie da się zastosować.</p>
        <p>23 sierpnia 2026 r. Prezes Urzędu Rejestracji odrzucił zgłoszone zmiany. Według Ministerstwa Zdrowia producent nie przedstawił aktualnych badań, które potwierdzałyby, że innej metody sterylizacji nie da się użyć. W odpowiedzi z 7 października 2026 r. ministerstwo potwierdziło, że według systemu monitorowania obrotu lekami (ZSMOPL) Disulfiram WZF „nie jest już dostępny” (${ext(MZ_19628, "odpowiedź Ministra Zdrowia na interpelację nr 19628")}).</p>

        <h2>Czy wszywka wróci?</h2>
        <p>Na początku listopada 2026 r. nic na to nie wskazuje. Według ministerstwa przed Urzędem Rejestracji nie toczy się żadne inne postępowanie dotyczące tego leku, a decyzje o zmianach w produkcji i o wstrzymaniu sprzedaży należą do producenta.</p>
        <p>Nie ma też możliwości importu. W krajach Unii Europejskiej i Europejskiego Obszaru Gospodarczego nie ma dopuszczonych leków z disulfiramem w postaci innej niż doustna, dlatego ministerstwo uznaje import docelowy lub interwencyjny za co do zasady niemożliwy.</p>

        <h2>Czy wszywka w ogóle działała?</h2>
        <p>Disulfiram nie leczy uzależnienia i nie zmniejsza głodu alkoholowego. Blokuje rozkład alkoholu w organizmie, przez co po wypiciu gromadzi się aldehyd octowy i pojawia się bardzo przykra, czasem groźna reakcja. Ministerstwo Zdrowia opisuje jego działanie jako motywowanie do abstynencji przez obawę przed tą reakcją, a nie oddziaływanie na mechanizmy uzależnienia.</p>
        <p>Postać wszczepiana od ponad 30 lat nie jest standardową metodą w placówkach leczenia uzależnień, a zabiegi wykonywano głównie w prywatnych gabinetach, poza systemem leczenia uzależnień. Ministerstwo przywołuje materiały Krajowego Centrum Przeciwdziałania Uzależnieniom, według których implant nie jest skuteczny w podtrzymywaniu abstynencji i nie jest metodą o potwierdzonej skuteczności.</p>
        <p>Inaczej wygląda to przy tabletkach. Przegląd badań z 2014 r. wskazuje, że disulfiram doustny może pomagać, zwłaszcza gdy jego przyjmowanie jest nadzorowane, np. przez bliską osobę lub personel (${ext(SKINNER_2014, "Skinner i in., PLOS ONE 2014")}).</p>

        <h2>Co zamiast wszywki</h2>
        <p>Według Ministerstwa Zdrowia w Polsce są dopuszczone do obrotu leki, które mogą wspomagać leczenie uzależnienia od alkoholu. O wyborze zawsze decyduje lekarz, najczęściej psychiatra albo lekarz w poradni leczenia uzależnień. Żaden z tych leków nie działa jak wyłącznik picia, a ich dostępność w aptekach warto sprawdzić przed wizytą.</p>
      `,
    },
    {
      kind: "cards",
      heading: "",
      cards: [
        {
          title: "Disulfiram w tabletkach (Anticol)",
          description:
            "Ta sama substancja co we wszywce, przyjmowana doustnie. Według ministerstwa lek jest w obrocie, wydaje się go na receptę. Pomaga, gdy ktoś przyjmuje go regularnie, najlepiej pod nadzorem bliskiej osoby lub personelu.",
        },
        {
          title: "Naltrekson",
          description:
            "Zmniejsza ochotę na picie i ryzyko nawrotu w ramach programu leczenia. Wydawany na receptę. Nie mogą go przyjmować osoby uzależnione od opioidów ani te, które biorą opioidowe leki przeciwbólowe lub metadon.",
        },
        {
          title: "Akamprozat",
          description:
            "Pomaga podtrzymać abstynencję u osób uzależnionych od alkoholu, zawsze razem z psychoterapią. Nie stosuje się go w czasie odtrucia.",
        },
        {
          title: "Nalmefen",
          description:
            "Pomaga ograniczyć ilość wypijanego alkoholu, a nie utrzymać pełną abstynencję. Dla dorosłych z wysokim poziomem ryzyka picia, bez objawów odstawienia. Przepisuje się go tylko razem ze stałym wsparciem psychospołecznym.",
        },
      ],
    },
    {
      kind: "text",
      html: `
        <h3>Disulfiram w tabletkach: o czym pamiętać</h3>
        <p>Z ${ext(CHPL_ANTICOL, "charakterystyki produktu leczniczego")} wynika, że:</p>
        <ul>
          <li>leczenie można zacząć najwcześniej po 24 godzinach bez alkoholu, a wcześniej lekarz ocenia m.in. pracę wątroby i nerek;</li>
          <li>alkoholu nie wolno pić w trakcie leczenia i przez 14 dni po jego zakończeniu;</li>
          <li>reakcję mogą wywołać też produkty z alkoholem: płyny do płukania ust, syropy na kaszel, sosy, ocet, płyny po goleniu i perfumy, a nawet piwo i wino bezalkoholowe;</li>
          <li>lek ma przeciwwskazania, m.in. choroby serca, nadciśnienie, przebyty udar, cukrzycę, ciężką niewydolność wątroby, niewydolność nerek, psychozy, próby samobójcze w przeszłości i ciążę;</li>
          <li>leczenia nie prowadzi się dłużej niż 6 miesięcy bez ponownej oceny przez lekarza.</li>
        </ul>
        <p><strong>Nigdy bez wiedzy tej osoby.</strong> Disulfiramu nie wolno podawać nikomu potajemnie, np. w jedzeniu. Charakterystyka leku mówi wprost, że nie stosuje się go bez świadomej zgody pacjenta, bo reakcja z alkoholem może zagrażać życiu. Prawo do wyrażenia zgody na leczenie albo do odmowy daje też każdemu pacjentowi art. 16 ustawy o prawach pacjenta i Rzeczniku Praw Pacjenta.</p>

        <h3>Psychoterapia uzależnień</h3>
        <p>To podstawa leczenia, zarówno w poradniach NFZ, jak i w ośrodkach prywatnych. Leki mogą ją wspierać, ale według materiału PARPA naltrekson i akamprozat mają małą skuteczność u osób, które nie uczestniczą w psychoterapii (${ext(PARPA_MP, "mp.pl, PARPA")}). Terapia zajmuje się tym, czego żaden lek nie zmieni: przyczynami picia, głodem alkoholowym, radzeniem sobie bez alkoholu i zapobieganiem nawrotom.</p>

        <h2>Kiedy natychmiast szukać pomocy</h2>
        <p>Jeśli osoba z wszywką albo w trakcie leczenia disulfiramem wypiła alkohol i ma duszność, ból w klatce piersiowej, kołatanie serca, silne zawroty głowy, drgawki albo traci przytomność, dzwoń pod <a href="tel:112">112</a>. Reakcja zwykle zaczyna się w ciągu 15 minut od wypicia i może zagrażać życiu.</p>
        <p>Pilnej pomocy lekarza wymaga też nagłe odstawienie alkoholu po długim, codziennym piciu. Mogą wtedy wystąpić drgawki albo majaczenie alkoholowe. Więcej o tym, <a href="/detoks-i-kwalifikacja">kiedy potrzebny jest detoks</a>.</p>

        <h2>Z praktyki ośrodka</h2>
        <p>[DO UZUPEŁNIENIA PRZEZ TERAPEUTĘ PRZED PUBLIKACJĄ: 3–5 zdań własnymi słowami. Z czym przychodzą osoby i rodziny, które pytają o wszywkę, i co w praktyce pomaga zamiast niej.]</p>
      `,
    },
    {
      kind: "steps",
      heading: "Co możesz zrobić teraz",
      steps: [
        {
          title: "Porozmawiaj z lekarzem",
          description:
            "Jeśli planowana była wszywka albo kończy się działanie poprzedniej, umów wizytę u psychiatry lub w poradni leczenia uzależnień. Lekarz oceni, czy tabletki z disulfiramem albo inny lek będą bezpieczne.",
        },
        {
          title: "Zgłoś się do poradni bez skierowania",
          description:
            "Do poradni leczenia uzależnień w ramach NFZ można się zgłosić bez skierowania od lekarza rodzinnego. Mogą z niej korzystać także bliscy.",
        },
        {
          title: "Sprawdź, czy to już uzależnienie",
          description:
            "Krótki, anonimowy test przesiewowy pomoże uporządkować to, co się dzieje. Odpowiedzi nie są zapisywane.",
        },
        {
          title: "Zadzwoń na bezpłatną infolinię",
          description:
            "Ogólnopolski Telefon Zaufania Uzależnienia prowadzony przez KCPU: 800 199 990, codziennie od 16:00 do 21:00.",
        },
      ],
    },
    {
      kind: "text",
      html: `
        <p>Przydatne: <a href="/porady/odwyk-na-nfz">jak zacząć leczenie na NFZ</a>, <a href="/testy/czy-to-juz-problem">test „Czy to już problem?”</a>, ${ext(KCPU_MAPA, "mapa placówek leczenia uzależnień KCPU")} i <a href="/dla-rodziny">wsparcie dla rodziny</a>.</p>

        <h2>Pytania i odpowiedzi</h2>
        <h3>Czy Esperal i wszywka to to samo?</h3>
        <p>Potocznie tak. Lek o nazwie Esperal stracił pozwolenie w 2004 r., a od tamtej pory wszczepiano Disulfiram WZF. Dziś nie jest dostępny żaden z nich.</p>
        <h3>Czy można kupić wszywkę za granicą?</h3>
        <p>W krajach Unii Europejskiej i Europejskiego Obszaru Gospodarczego nie ma dopuszczonego implantu z disulfiramem, a import jest według ministerstwa co do zasady niemożliwy. Nie kupuj leków z niepewnych źródeł.</p>
        <h3>Mam wszytą wszywkę. Czy jest niebezpieczna?</h3>
        <p>Decyzja urzędu dotyczyła zmian w produkcji leku. Od 1 stycznia 2021 r. do 7 czerwca 2026 r. zgłoszono 6 działań niepożądanych po Disulfiramie WZF, wszystkie w miejscu podania i ocenione jako nieciężkie. Urząd nie otrzymał też z Unii zalecenia wycofania leku (${ext(MZ_18953, "MZ, 21.08.2026")}). Nie pij alkoholu, a z pytaniami zgłoś się do lekarza, który wykonał zabieg.</p>
        <h3>Czy można podać komuś tabletki z disulfiramem bez jego wiedzy?</h3>
        <p>Nie. Lek stosuje się wyłącznie za świadomą zgodą pacjenta, który wie o ryzyku. Reakcja po alkoholu może zagrażać życiu. Jeśli bliska osoba nie chce się leczyć, przeczytaj, <a href="/porady/jak-przekonac-osobe-uzalezniona-do-leczenia">jak z nią rozmawiać</a>.</p>
        <h3>Czy tabletki działają tak samo jak wszywka?</h3>
        <p>To ta sama substancja, ale przyjmowana regularnie, więc efekt zależy od tego, czy ktoś bierze lek. Dlatego pomaga, gdy przyjmowanie jest nadzorowane. Reakcja na alkohol jest możliwa jeszcze przez 14 dni po ostatniej tabletce.</p>
      `,
    },
    {
      kind: "cta",
      heading: "Szukasz leczenia zamiast wszywki?",
      text: "Zadzwoń. Opowiemy, jak wygląda leczenie w Insieme. Rozmowa nie zobowiązuje do przyjazdu i nie musisz podawać nazwiska.",
      buttonLabel: "Zadzwoń: 669 916 005",
      buttonHref: "tel:+48669916005",
    },
  ],
};
