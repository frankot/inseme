import { NFZ_ARTICLE_HREF } from "@/content/artykul-nfz";

import type { IntentPageContent } from "./types";

/**
 * /dla-rodziny — for the people around someone who drinks or uses. Intent:
 * "jak pomóc osobie uzależnionej", "czy mogę zadzwonić w czyimś imieniu",
 * "co zrobić, gdy nie chce się leczyć", "przymusowe leczenie alkoholowe".
 *
 * Written to the family member, about the person — the homepage's family path
 * and /program#rodzina say what Insieme offers; this page is about what the
 * family can do themselves, the legal route, and help for them.
 *
 * ⚠️ Placeholder copy. Needs a therapist's read and the lawyer's (art. 14 and
 * the court-ordered treatment cards) before launch. Photos are the site's
 * placeholders.
 */
export const dlaRodzinyDefaults: IntentPageContent = {
  path: "/dla-rodziny",
  metaTitle: "Wsparcie dla rodziny osoby uzależnionej — co robić | Insieme",
  metaDescription:
    "Co zrobić, gdy bliska osoba pije lub bierze i nie chce się leczyć: jak rozmawiać, gdzie są granice pomocy, kiedy możliwy jest sądowy obowiązek leczenia.",
  breadcrumbHome: "Strona główna",
  breadcrumbLabel: "Dla rodziny",

  intro: {
    title: "Gdy uzależniona jest bliska osoba",
    lead: [
      "Uzależnienie jednej osoby zmienia życie całej rodziny. Pojawia się lęk, wstyd, złość i poczucie, że trzeba wszystkiego pilnować — a mimo starań sytuacja się nie poprawia.",
      "Ta strona jest dla partnerów, rodziców, dorosłych dzieci i przyjaciół. Możesz działać, nawet jeśli bliska osoba nie jest jeszcze gotowa na leczenie.",
    ],
    summaryTitle: "W skrócie",
    summary: [
      "Możesz do nas zadzwonić bez wiedzy i zgody bliskiej osoby — także wtedy, gdy nie chce słyszeć o leczeniu.",
      "Nie da się nikogo wyleczyć za niego. Można zmienić to, jak reagujesz, i to często zmienia sytuację.",
      "Wsparcie należy się także Tobie, niezależnie od tego, co zdecyduje osoba uzależniona.",
    ],
    image: {
      src: "/placeholder/bliska-osoba.webp",
      alt: "Mężczyzna ze szklanką alkoholu siedzi na kanapie, za nim stoi zmartwiona partnerka",
    },
  },

  explain: {
    id: "mechanizm",
    meta: "Mechanizm",
    title: "Dlaczego dotychczasowe sposoby nie działają",
    intro: [
      "Prośby, kłótnie, wylewanie alkoholu, tłumaczenie nieobecności w pracy, spłacanie długów — większość rodzin próbuje wszystkiego. To naturalne reakcje na zagrożenie, ale często, wbrew intencjom, chronią osobę uzależnioną przed skutkami picia lub brania.",
      "W terapii nazywa się to współuzależnieniem. To nie zarzut ani diagnoza — to opis wzorca, w który łatwo wpaść, gdy przez długi czas żyje się w stresie.",
    ],
    pointsTitle: "Typowe sygnały",
    points: [
      { body: "Twoje samopoczucie zależy od tego, czy bliska osoba dziś piła." },
      { body: "Ukrywasz problem przed rodziną, znajomymi albo pracodawcą." },
      { body: "Bierzesz na siebie coraz więcej jej obowiązków i konsekwencji." },
      { body: "Kontrolujesz: sprawdzasz, liczysz, szukasz butelek, czytasz wiadomości." },
      { body: "Rezygnujesz z własnych planów, spotkań i odpoczynku." },
    ],
    closing: [
      "Rozpoznanie tych zachowań nie jest powodem do wstydu. To punkt, od którego można zacząć działać inaczej.",
    ],
  },

  steps: {
    id: "rozmowa",
    label: "Rozmowa",
    title: "Jak rozmawiać o leczeniu",
    lead: [
      "Nie ma zdania, które sprawi, że ktoś od razu zgodzi się na terapię. Są jednak sposoby rozmowy, które zwiększają szansę, że zostanie usłyszana — i takie, które niemal zawsze kończą się kłótnią.",
    ],
    steps: [
      {
        title: "Wybierz chwilę trzeźwości",
        body: "Nie rozmawiaj, gdy bliska osoba jest pod wpływem ani tuż po awanturze. Wybierz spokojny moment, kiedy oboje możecie mówić bez pośpiechu.",
      },
      {
        title: "Mów o faktach, nie o etykietach",
        body: "Opisz konkretne sytuacje i ich skutki. Słowo „alkoholik” zwykle kończy rozmowę, zanim się zacznie.",
      },
      {
        title: "Mów o sobie",
        body: "„Boję się, kiedy wracasz w nocy” trafia inaczej niż „znowu się upiłeś”. Mów o swoich uczuciach i potrzebach.",
      },
      {
        title: "Przyjdź z propozycją",
        body: "Miej przygotowany konkretny krok: numer telefonu, termin konsultacji, informację o ośrodku. Łatwiej się zgodzić, gdy wiadomo, co dalej.",
      },
      {
        title: "Nie groź tym, czego nie zrobisz",
        body: "Granice działają tylko wtedy, gdy są realne i konsekwentne. Lepiej zapowiedzieć mniej i dotrzymać słowa.",
      },
    ],
    note: "Jeśli rozmowa się nie uda, nie znaczy to, że wszystko stracone. Decyzja o leczeniu często dojrzewa po kilku takich rozmowach.",
  },

  statement: {
    id: "granice",
    label: "Granice",
    statement:
      "Wspieranie osoby uzależnionej nie oznacza przejmowania odpowiedzialności za jej picie.",
    body: [
      "Granice nie są karą. Chronią Ciebie i sprawiają, że skutki uzależnienia trafiają tam, gdzie powinny — do osoby, która może coś z nimi zrobić.",
    ],
    points: [
      {
        title: "Nie usprawiedliwiaj",
        body: "Nie dzwoń do pracy z wymówką i nie tłumacz nieobecności przed rodziną. Ukrywanie problemu pomaga go utrzymać.",
      },
      {
        title: "Nie finansuj",
        body: "Pieniądze przekazane „na rachunki” często trafiają gdzie indziej. Jeśli chcesz pomóc, opłać konkretną rzecz bezpośrednio.",
      },
      {
        title: "Zadbaj o siebie",
        body: "Długotrwały stres odbija się na zdrowiu. Szukanie pomocy dla siebie nie jest egoizmem.",
      },
    ],
    closing:
      "Jeśli dochodzi do przemocy lub gróźb, Twoje bezpieczeństwo i bezpieczeństwo dzieci jest najważniejsze. W zagrożeniu dzwoń pod 112. Możesz też skorzystać z procedury „Niebieska Karta” — przez policję lub ośrodek pomocy społecznej.",
  },

  cards: {
    id: "obowiazek-leczenia",
    label: "Gdy odmawia leczenia",
    title: "Czy można kogoś zmusić do leczenia?",
    lead: "W prywatnym ośrodku — nie: leczenie jest dobrowolne. Prawo przewiduje jednak sądowy obowiązek leczenia dla osób uzależnionych od alkoholu, które w związku z piciem rozbijają życie rodzinne, demoralizują małoletnich, uchylają się od pracy albo systematycznie zakłócają spokój lub porządek publiczny.",
    numbered: true,
    cards: [
      {
        title: "Zgłoszenie do gminnej komisji",
        body: "Wniosek składa się do gminnej (miejskiej) komisji rozwiązywania problemów alkoholowych w miejscu zamieszkania osoby pijącej. Może to zrobić członek rodziny, a także np. policja lub ośrodek pomocy społecznej.",
      },
      {
        title: "Rozmowa i opinia biegłych",
        body: "Komisja wzywa osobę na rozmowę i kieruje ją na badanie przez biegłych — psychologa i psychiatrę — którzy oceniają, czy występuje uzależnienie.",
      },
      {
        title: "Postępowanie w sądzie",
        body: "Jeśli są podstawy, komisja kieruje wniosek do sądu rejonowego. Sąd może zobowiązać do leczenia stacjonarnego lub ambulatoryjnego w placówce publicznej.",
      },
    ],
    note: "Procedura zwykle trwa kilka miesięcy, a sam obowiązek nie gwarantuje zmiany. Bywa jednak momentem, w którym ktoś po raz pierwszy poważnie mierzy się z problemem.",
  },

  feature: {
    id: "w-insieme",
    label: "Wsparcie w Insieme",
    title: "Co możemy zrobić dla Ciebie",
    body: [
      "Z rodzinami pracujemy na każdym etapie — także wtedy, gdy bliska osoba jeszcze nie zdecydowała się na leczenie.",
    ],
    image: {
      src: "/placeholder/rozmowa.webp",
      alt: "Rozmowa z terapeutą w gabinecie ośrodka",
    },
    points: [
      {
        title: "Rozmowa telefoniczna",
        body: "Bez wiedzy bliskiej osoby. Pomożemy uporządkować sytuację i ustalić, co możesz zrobić najpierw.",
      },
      {
        title: "Spotkanie z terapeutą",
        body: "Wspólnie przygotujemy plan rozmowy o leczeniu: co powiedzieć, jakie granice postawić, jaką pomoc zaproponować.",
      },
      {
        title: "W trakcie pobytu i po nim",
        body: "Konsultacje dla rodziny, niedzielne odwiedziny i przygotowanie do powrotu bliskiej osoby do domu.",
      },
    ],
    note: "Bezpłatną pomoc znajdziesz też poza ośrodkiem: w grupach Al-Anon (Alateen dla nastolatków), w poradni leczenia uzależnień — w ramach NFZ i bez skierowania — oraz w grupach DDA.",
    link: { label: "Wsparcie dla bliskich w programie", href: "/program#rodzina" },
  },

  faq: {
    label: "Pytania",
    title: "Pytania, które zadają rodziny",
    lead: "Jeśli nie ma tu Twojego pytania — zadzwoń. Możesz to zrobić bez wiedzy bliskiej osoby.",
    category: "rodzina",
  },
  related: {
    label: "Czytaj dalej",
    title: "Powiązane tematy",
    linkLabel: "Czytaj",
    links: [
      {
        title: "Leczenie alkoholizmu",
        body: "Jak rozpoznać uzależnienie i z czego składa się leczenie.",
        href: "/leczenie-alkoholizmu",
      },
      {
        title: "Detoks i kwalifikacja",
        body: "Kiedy przed terapią potrzebny jest detoks i dlaczego nie warto odstawiać na własną rękę.",
        href: "/detoks-i-kwalifikacja",
      },
      {
        title: "Odwyk na NFZ",
        body: "Jak wygląda bezpłatne leczenie, także dla rodziny.",
        href: NFZ_ARTICLE_HREF,
      },
    ],
  },
  call: {
    title: "Porozmawiaj z nami o tym, co się dzieje",
    body: "Możesz zadzwonić bez wiedzy bliskiej osoby. Rozmowa jest bezpłatna i do niczego nie zobowiązuje.",
    ctaLabel: "Zadzwoń",
  },
};
