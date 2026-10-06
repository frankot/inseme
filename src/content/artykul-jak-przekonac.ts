/**
 * „Jak przekonać osobę uzależnioną do podjęcia leczenia?” — seed source for
 * `npm run seed:article:przekonac`. Once seeded, the database row is what the
 * site renders; editing here changes nothing live unless the seed is re-run
 * with --reset.
 *
 * The client's text, lightly edited for the block layout: the fifteen tips are
 * grouped into three numbered lists (before / how to speak / what to show),
 * with the last tip — talk to a specialist — as the closing section. The only
 * additions are connecting sentences that restate what the tips already say;
 * no new advice.
 *
 * No reviewer on purpose: publishing requires one, and naming who checked a
 * clinical text is the client's call. The seed leaves it as a draft.
 */
import type { ArticleSeed } from "./article-seed";

export const jakPrzekonacArticleSeed: ArticleSeed = {
  slug: "jak-przekonac-osobe-uzalezniona-do-leczenia",
  title: "Jak przekonać osobę uzależnioną do podjęcia leczenia?",
  excerpt:
    "Widzisz problem uzależnienia u bliskiej osoby i nie wiesz, jak z nią o tym rozmawiać? 15 wskazówek, które pomogą przygotować i przeprowadzić tę rozmowę.",
  metaTitle: "Jak przekonać osobę uzależnioną do leczenia? 15 wskazówek",
  metaDescription:
    "Jak rozmawiać z bliską osobą o uzależnieniu i leczeniu: jak się przygotować, jak mówić, czego unikać i co warto jej pokazać. 15 praktycznych wskazówek.",
  sections: [
    {
      kind: "text",
      html: `
        <p><strong>Widzisz problem uzależnienia u bliskiej Ci osoby i nie wiesz, jak z nią o tym rozmawiać?</strong> Poniżej znajdziesz 15 wskazówek, które mogą pomóc przygotować i przeprowadzić tę rozmowę.</p>
        <p>Najbliżsi to osoby, które najczęściej zauważają problem uzależnienia dużo wcześniej niż sam zainteresowany. Naturalnie starają się wtedy zrobić wszystko, żeby pomóc. To bardzo trudna sytuacja — niełatwo pomóc komuś, kto sam nie dostrzega problemu.</p>
        <p>Bliscy często zwracają się do ośrodka z pytaniem: jak przekonać syna, córkę, męża, żonę, brata, siostrę, tatę albo mamę do podjęcia leczenia? Nie ma na to uniwersalnej recepty. Jest jednak kilka zasad prowadzenia takich rozmów, które mogą pomóc — dotyczą tego, jak się przygotować, jak mówić i co warto pokazać osobie, na której Ci zależy.</p>
      `,
    },
    {
      kind: "steps",
      heading: "Zanim zaczniesz rozmowę",
      steps: [
        {
          title: "Przygotuj się do rozmowy",
          description:
            "Tak poważnym rozmowom towarzyszy ogromny ładunek emocjonalny, a w emocjach wiele spraw może umknąć. Warto solidnie się przygotować i spisać konspekt, który ułatwi przeprowadzenie rozmowy. Jeśli rozmowa ma się odbyć w szerszym gronie, dobrze wyznaczyć lidera i dokładnie ustalić, co powie każdy z uczestników — pozwoli to uniknąć chaosu, który może skutecznie utrudnić osiągnięcie celu.",
        },
        {
          title: "Zapewnij komfortowe warunki rozmowy",
          description:
            "Rozmowa powinna odbywać się w ciszy i spokoju, bez zbędnych rozpraszaczy. Nie prowadź jej „w biegu” ani „przy okazji” — zaplanuj ją wcześniej.",
        },
        {
          title: "Przeprowadź krótką rozmowę",
          description:
            "Rozmowa powinna być stosunkowo krótka i rzeczowa, a przekaz — konkretny. Łatwiej o to, gdy wcześniej wiesz, co chcesz powiedzieć.",
        },
      ],
    },
    {
      kind: "text",
      html: `<p>Sposób, w jaki mówimy, bywa równie ważny jak to, co mówimy. Osoba uzależniona często spodziewa się wyrzutów — spokój i troska sprawiają, że łatwiej jej słuchać, zamiast się bronić.</p>`,
    },
    {
      kind: "steps",
      heading: "Jak mówić",
      steps: [
        {
          title: "Okaż troskę i empatię",
          description:
            "Rozmowę najlepiej zacząć od wyrażenia troski i zrozumienia. Podkreśl, że chcesz pomóc, bo ta osoba jest dla Ciebie bardzo ważna i zależy Ci na jej dobru.",
        },
        {
          title: "Zachowaj spokój w komunikacji",
          description:
            "Mów zdecydowanie i pewnie, ale spokojnie. Zwróć uwagę na ton głosu i na to, by Twoje komunikaty były wyraźne.",
        },
        {
          title: "Nie oceniaj i nie krytykuj",
          description:
            "Bezwzględnie zrezygnuj z negatywnych ocen i wypominania wszystkich złych rzeczy, które ta osoba zrobiła sobie i innym. Takie „punktowanie” przynosi skutek odwrotny do zamierzonego.",
        },
        {
          title: "Nie groź i nie stawiaj warunków",
          description:
            "Jeśli to Wasza pierwsza rozmowa, unikaj wszystkiego, co mogłoby zostać odebrane jako atak. Na stawianie warunków przyjdzie czas na późniejszych etapach.",
        },
        {
          title: "Wskaż na konkretne straty",
          description:
            "Z troską — nie z wyrzutem — powiedz o skutkach, które osoba uzależniona już ponosi: zdrowotnych, w relacjach, w pracy.",
        },
        {
          title: "Stawiaj pytania retoryczne",
          description:
            "„Czy tak wyobrażałeś/aś sobie swoje życie 5–10 lat temu?”, „Co w tej chwili masz ze swojego życia?” Takie pytania nie wymagają odpowiedzi na głos — skłaniają do zastanowienia się.",
        },
      ],
    },
    {
      kind: "steps",
      heading: "Co warto pokazać",
      steps: [
        {
          title: "Bazuj na zasobach",
          description:
            "Wskaż predyspozycje i umiejętności tej osoby. Podkreśl, jak wiele może osiągnąć, zmieniając swoje życie.",
        },
        {
          title: "Przedstaw wizję szerszych perspektyw",
          description:
            "Przypomnij niezrealizowane plany i marzenia sprzed lat — zmiana pozwoli je zrealizować. Podobnie z relacjami: będzie można je naprawić, poprawić i sprawić, by były trwałe i wartościowe.",
        },
        {
          title: "Stwórz wewnętrzną motywację",
          description:
            "Podkreśl, że zmiana przyniesie korzyści przede wszystkim osobie uzależnionej — i że warto, by zrobiła to dla siebie, a nie dla kogoś innego.",
        },
        {
          title: "Przedstaw leczenie jako szansę",
          description:
            "Podjęcie leczenia to szansa na zmianę na lepsze, która nie wiąże się z żadnymi stratami. Nawet jeśli ktoś nie jest do niego przekonany, dopiero próbując sprawdzi, czy będzie pomocne — i sam zdecyduje, jak to wykorzysta.",
        },
        {
          title: "Zaoferuj pomoc",
          description:
            "Pokaż, że jesteś gotów/gotowa pomóc na każdym etapie leczenia: w znalezieniu odpowiednich specjalistów i ośrodka terapii, a jeśli to konieczne i masz takie możliwości — także w sfinansowaniu leczenia.",
        },
      ],
    },
    {
      kind: "text",
      html: `
        <h2>Skontaktuj się ze specjalistą</h2>
        <p>Każda osoba uzależniona jest inna, a podejście, które działa w jednym przypadku, niekoniecznie zadziała w innym. Jeśli pojawiają się wątpliwości, zawsze warto skonsultować się z profesjonalistą w dziedzinie terapii uzależnień.</p>
        <p>Taka konsultacja może pomóc także Tobie — w przygotowaniu się do rozmowy i w zaplanowaniu kolejnych kroków.</p>
      `,
    },
    {
      kind: "cta",
      heading: "Chcesz porozmawiać o sytuacji bliskiej osoby?",
      text: "Zadzwoń. Rozmowa nie zobowiązuje do przyjazdu i nie musisz podawać nazwiska.",
      buttonLabel: "Zadzwoń: 669 916 005",
      buttonHref: "tel:+48669916005",
    },
  ],
};
