/**
 * „Jak pomóc osobie uzależnionej?” — seed source for
 * `npm run seed:article:pomoc`. Once seeded, the database row is what the site
 * renders; editing here changes nothing live unless the seed is re-run with
 * --reset.
 *
 * Ported from the old site's post (`/jak-pomoc-uzaleznionemu/`, which now
 * 308s here — docs/SEO_LAUNCH_PLAN.md §4.2). The client's argument is kept and
 * re-laid out for scanning: the "help that harms" sentence is split into a
 * step list, the closing advice into another. Additions are limited to
 * connecting sentences, links onward, and one safety line about violence —
 * ⚠️ that line is new, so the therapist's read should confirm it.
 *
 * No reviewer on purpose: publishing requires one, and naming who checked a
 * clinical text is the client's call. The seed leaves it as a draft.
 */
import type { ArticleSeed } from "./article-seed";

export const jakPomocArticleSeed: ArticleSeed = {
  slug: "jak-pomoc-osobie-uzaleznionej",
  title: "Jak pomóc osobie uzależnionej — i dlaczego niektóre formy pomocy szkodzą",
  excerpt:
    "Prosisz, tłumaczysz, ratujesz — a bliska osoba dalej pije lub bierze? Dlaczego część pomocy oddala decyzję o leczeniu i co możesz zrobić zamiast tego.",
  metaTitle: "Jak pomóc alkoholikowi lub osobie uzależnionej? Poradnik",
  metaDescription:
    "Jak pomóc alkoholikowi, narkomanowi lub osobie uzależnionej od leków, która nie chce się leczyć. Czego unikać, jak stawiać granice i gdzie szukać wsparcia.",
  sections: [
    {
      kind: "text",
      html: `
        <p><strong>Prosisz, tłumaczysz, ratujesz z kolejnych kłopotów — a bliska osoba dalej pije lub bierze?</strong> Ten tekst jest dla Ciebie.</p>
        <p>Do ośrodka bardzo często dzwonią najbliżsi osób uzależnionych. Pytają, jak pomóc alkoholikowi, jak z nim postępować, co jeszcze zrobić. Słyszymy: <em>„jesteśmy, wspieramy, pomagamy, jak możemy, ale nie potrafimy namówić syna, córki, męża, żony, brata, siostry, taty czy mamy do leczenia. Prosimy, błagamy — i nic”</em>.</p>
        <p>Dotyczy to nie tylko alkoholu, ale też narkotyków, leków nasennych, benzodiazepin i innych substancji.</p>
      `,
    },
    {
      kind: "text",
      html: `
        <h2>Dlaczego prośby nie wystarczają</h2>
        <p>W większości przypadków osoba uzależniona nie podejmie leczenia, dopóki skutki choroby nie staną się na tyle dotkliwe, że przeważą nad przymusem trwania w nałogu.</p>
        <p>Każdy ma przy tym swój <strong>próg bólu</strong> i inaczej waży straty. Dla jednej osoby wystarczającym powodem, by się zatrzymać, będą psujące się relacje, kłopoty w pracy czy pogarszający się stan psychiczny. Dla innej — dopiero utrata wszystkiego: rodziny, majątku, zdrowia.</p>
        <p>Najbliżsi zwykle widzą problem dużo wcześniej niż sam zainteresowany i naturalnie robią wszystko, żeby pomóc. Niestety niektóre formy pomocy paradoksalnie bardziej szkodzą, niż pomagają — oddalają decyzję o leczeniu.</p>
      `,
    },
    {
      kind: "steps",
      heading: "Pomoc, która oddala od leczenia",
      steps: [
        {
          title: "Tłumaczenie i usprawiedliwianie",
          description:
            "Wyjaśnianie nieobecności w pracy, kłamstwa „dla świętego spokoju”, przekonywanie innych, że to tylko gorszy okres.",
        },
        {
          title: "Opiekowanie się i sprzątanie skutków",
          description:
            "Dbanie o osobę po każdym epizodzie, sprzątanie, przejmowanie jej obowiązków — tak, żeby nie odczuła, co się stało.",
        },
        {
          title: "Sponsorowanie i spłacanie długów",
          description:
            "Pieniądze „na życie”, spłacone pożyczki i zaległości. Każda z tych rzeczy sprawia, że nałóg nadal jest możliwy.",
        },
        {
          title: "Ratowanie z każdej opresji",
          description:
            "Wyciąganie z kłopotów, które są bezpośrednim skutkiem picia lub brania — zanim osoba uzależniona zdąży je poczuć.",
        },
        {
          title: "Prośby, groźby i szantaże bez pokrycia",
          description:
            "Jeśli po zapowiedzi nic się nie zmienia, osoba uzależniona szybko uczy się, że słowa nie mają znaczenia.",
        },
      ],
    },
    {
      kind: "text",
      html: `
        <h2>Mechanizm „komfortu używania”</h2>
        <p>Dlaczego tak się dzieje? Tak działa uzależnienie: trwa się w nim tak długo, jak to możliwe — tak długo, jak jest „komfort” picia, brania czy grania. To przymus, a nie kwestia dobrej czy złej woli.</p>
        <blockquote><p>Im dłużej najbliżsi odsuwają osobę uzależnioną od jej progu bólu, zapewniając jej „komfort używania”, tym dłużej trwa jej destrukcja.</p></blockquote>
        <p>Patrzenie, jak ktoś bliski coraz głębiej pogrąża się w nałogu, jest piekielnie trudne. Bezradność to jedna z najbardziej rozdzierających emocji, jakich wtedy doświadczamy, a przestać ratować jest bardzo ciężko. Jeśli jednak osoba wielokrotnie proszona i zachęcana do leczenia notorycznie odmawia, często <strong>dopiero pozostawienie jej z konsekwencjami nałogu okazuje się jedyną skuteczną formą pomocy</strong>.</p>
      `,
    },
    {
      kind: "steps",
      heading: "Co możesz zrobić zamiast tego",
      steps: [
        {
          title: "Postaw jasne warunki",
          description:
            "Jesteś obok i wspierasz z całych sił — ale tylko wtedy, gdy bliska osoba zdecyduje się na leczenie. Jeśli nie, Twoje wsparcie w dotychczasowej formie się kończy.",
        },
        {
          title: "Bądź konsekwentny lub konsekwentna",
          description:
            "Jeśli coś zapowiadasz, trzymaj się tego: nie spłacasz długów, nie podnosisz z upadków, nie ratujesz z opresji jak dotąd. Warunki bez pokrycia działają tak samo jak wcześniejsze prośby — czyli wcale.",
        },
        {
          title: "Pozwól odczuć konsekwencje",
          description:
            "Odebranie „komfortu używania” bywa kluczowym argumentem w rozmowie o leczeniu. To nie kara, tylko przestanie zasłaniania tego, co nałóg naprawdę kosztuje.",
        },
        {
          title: "Zadbaj o siebie",
          description:
            "Poszukaj wsparcia dla siebie — u terapeuty pracującego z osobami współuzależnionymi albo w grupie Al-Anon. Nie musisz przechodzić przez to sam lub sama.",
        },
      ],
    },
    {
      kind: "text",
      html: `
        <h2>To nie jest proste</h2>
        <p>To jest wręcz <strong>niewyobrażalnie trudne</strong>. Łatwo opisać mechanizmy, które działają w takich sytuacjach — zastosować je w praktyce to zupełnie co innego. Dlatego warto robić to z pomocą specjalisty, który pomoże Ci odnaleźć się w tych trudnych momentach.</p>
        <p>Jeśli bliska osoba jest agresywna albo czujesz się zagrożony lub zagrożona — Twoje bezpieczeństwo jest pierwsze. Dzwoń pod <a href="tel:112">112</a> albo do Niebieskiej Linii: <a href="tel:800120002">800 120 002</a>.</p>
        <p>Gdy przyjdzie moment na rozmowę o leczeniu, przeczytaj, <a href="/porady/jak-przekonac-osobe-uzalezniona-do-leczenia">jak przekonać osobę uzależnioną do podjęcia leczenia</a>. Więcej o tym, co możesz zrobić jako bliski, znajdziesz na stronie <a href="/dla-rodziny">dla rodziny</a>, a o samym leczeniu — na stronach o <a href="/leczenie-alkoholizmu">leczeniu alkoholizmu</a> i <a href="/leczenie-narkomanii">leczeniu narkomanii</a>.</p>
      `,
    },
    {
      kind: "cta",
      heading: "Chcesz porozmawiać o sytuacji bliskiej osoby?",
      text: "Zadzwoń. Rozmowa nie zobowiązuje do przyjazdu i nie musisz podawać nazwiska.",
      buttonLabel: "Zadzwoń: 669 916 005",
      buttonHref: "tel:+48669916005",
    },
    {
      kind: "faq",
      heading: "Pytania bliskich",
      category: "rodzina",
    },
  ],
};
