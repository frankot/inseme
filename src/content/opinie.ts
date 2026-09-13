/**
 * Reviews, quoted from the ośrodek's Google Business profile.
 *
 * ⚠️ THE REVIEWS BELOW ARE PLACEHOLDERS, written to the right shape and length
 * so the section can be built. None of them is real. Before launch: replace
 * them with genuine quotes from the Google profile, set `profileUrl` to that
 * profile, and fill in `rating` / `count` from it.
 *
 * Why Google rather than testimonials collected by the ośrodek: a quote anyone
 * can go and verify on a third-party profile is worth more than one only this
 * site has seen, and it avoids soliciting and storing patients' written consent
 * for marketing copy.
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

export type Review = {
  /** First name and initial, as Google shows it. */
  author: string;
  /** ISO date of the review. */
  date: string;
  rating: number;
  body: string;
};

export type OpinieContent = {
  index: string;
  eyebrow: string;
  title: string;
  lead: string;
  /** Link to the Google profile. Empty string renders no link. */
  profileUrl: string;
  linkLabel: string;
  /** Aggregate score, or null while unknown. */
  rating: number | null;
  count: number | null;
  /** Rendered under the quotes — says where these came from. */
  sourceNote: string;
  reviews: Review[];
};

export const opinieDefaults: OpinieContent = {
  index: "06",
  eyebrow: "Opinie",
  title: "Co piszą ludzie, którzy tu byli.",
  lead: "Cytujemy opinie z profilu Google — tam są wszystkie, także te mniej pochlebne, i można je sprawdzić bez naszego pośrednictwa.",
  profileUrl: "",
  linkLabel: "Zobacz wszystkie opinie w Google",
  rating: null,
  count: null,
  sourceNote: "Opinie pochodzą z profilu Google i nie były przez nas redagowane.",
  reviews: [
    {
      author: "Marcin K.",
      date: "2026-07-18",
      rating: 5,
      body: "Dzwoniłem w sobotę wieczorem, spodziewałem się sekretarki. Odebrał terapeuta i rozmawialiśmy czterdzieści minut. Nie namawiał, nie wciskał, powiedział wprost ile to kosztuje i kiedy jest miejsce.",
    },
    {
      author: "Anna W.",
      date: "2026-06-02",
      rating: 5,
      body: "Dzwoniłam w sprawie męża, który wtedy nie chciał o niczym słyszeć. Dostałam konkretne wskazówki, jak z nim rozmawiać. Przyjechał trzy miesiące później, ale przyjechał.",
    },
    {
      author: "Tomasz R.",
      date: "2026-04-25",
      rating: 4,
      body: "Miejsce małe i kameralne, bez szpitalnej atmosfery. Ten sam terapeuta przez cały pobyt, co dla mnie było najważniejsze. Jedzenie mogłoby być lepsze.",
    },
  ],
};
