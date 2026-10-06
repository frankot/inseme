/**
 * Reviews quoted from the ośrodek's Google Business profile and its listing on
 * osrodkiterapii.pl, copied verbatim. Long bodies are clamped in the card; the
 * full text stays on the source page the card links to.
 *
 * ⚖️ Art. 14 ustawy o działalności leczniczej separates informing from
 * advertising, and specifically bars claims about effectiveness or treatment
 * time. Quoting reviews is defensible; selecting only superlatives, or quoting
 * anything that reads as a promise of results, is not. Have the final selection
 * read by the client's lawyer before launch.
 *
 * An empty `reviews` array removes the whole section, the way Zespół and
 * Artykuły do — so shipping with nothing here is safe.
 */

export type ReviewSourceId = "google" | "osrodkiterapii";

export type ReviewSource = {
  id: ReviewSourceId;
  /** Shown on the card badge and as the header link. */
  name: string;
  url: string;
};

export type Review = {
  author: string;
  /**
   * ISO date. Both sources show only "N miesięcy temu", so this is the month
   * worked back from when the review was copied.
   */
  date: string;
  rating: number;
  body: string;
  source: ReviewSourceId;
};

export type OpinieContent = {
  index: string;
  eyebrow: string;
  title: string;
  /** One entry per paragraph. */
  lead: string[];
  sources: ReviewSource[];
  /** Google aggregate score, or null while unknown. */
  rating: number | null;
  count: number | null;
  /** Rendered under the quotes — says where these came from. */
  sourceNote: string;
  reviews: Review[];
};

export const opinieDefaults: OpinieContent = {
  index: "06",
  eyebrow: "Opinie",
  title: "Co mówią osoby, które były w Insieme.",
  lead: [
    "Najlepiej o pobycie, atmosferze i pracy naszego zespołu opowiadają osoby, które same przeszły przez terapię w Insieme.",
    "Poniżej publikujemy wybrane opinie z naszego profilu Google oraz największego w Polsce rankingu ośrodków terapii.",
  ],
  sources: [
    {
      id: "google",
      name: "Google",
      url: "https://maps.app.goo.gl/Bv8u8d31G39Vf56P8",
    },
    {
      id: "osrodkiterapii",
      name: "osrodkiterapii.pl",
      url: "https://osrodkiterapii.pl/ranking/insieme-prywatny-osrodek-terapii-uzaleznien/",
    },
  ],
  rating: 5,
  count: 25,
  sourceNote:
    "Opinie pochodzą z portali zewnętrznych i zostały przytoczone bez zmiany ich treści.",
  reviews: [
    {
      author: "Sebastian C.",
      date: "2025-10-01",
      rating: 5,
      source: "google",
      body: "Spędziłem w Insieme pełne 28 dni. Terapia profejonalna, super obsługa zarówno terapeutyczna jak i właścicielska opieka nad pacjentami. Super przyjazne warunki zarówno terenowe jak i lokalowe. Sauna tenis stołowy, ogród i przestronne pokoje dają super komfort i bezpieczeństwo. Czysto, ciepło i nic więcej oprócz skupienia na samym sobie tam nie potrzeba. Bardzo dobra organizacja pracy. Jeśli szukasz miejsca gdzie chcesz sobie pomóc to z pewnością jest to miejsce do polecenia. 100%",
    },
    {
      author: "Wanda W.",
      date: "2021-10-01",
      rating: 5,
      source: "google",
      body: "Jestem szczęśliwa, że mogłam uczestniczyć w terapii w ośrodku Insieme. W miłej domowej atmosferze , otoczona kadrą terapeutów przekazujących nam swoją wiedzę, uczących nas jak żyć w trzeźwości ze swoją chorobą. Wspaniały zespół ludzi którzy mają zawsze czas, cierpliwość, spokój a przede wszystkim otwarte serce. Podczas terapii poznałam mechanizm mojego uzależnienia i poznałam samą siebie.",
    },
    {
      author: "Jasiek",
      date: "2026-05-01",
      rating: 5,
      source: "osrodkiterapii",
      body: "Największą wartością byli dla mnie ludzie – zarówno terapeuci, jak i inni uczestnicy terapii. Wspólne rozmowy i dzielenie się doświadczeniem uświadomiły mi, że nie jestem sam. To było bardzo budujące.",
    },
  ],
};
