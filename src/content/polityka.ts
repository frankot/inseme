/**
 * /polityka-prywatnosci.
 *
 * Built from the old site's policy (osrodek-insieme.pl/polityka-prywatnosci,
 * fetched Oct 2, 2026) — but only the parts that still hold: the contact
 * address for data requests, how to ask for access or deletion, and the
 * changes clause. The rest of the old text was a generic website-builder
 * template (passwords, payment details, "promotional messages") that describes
 * neither the old site nor this one, so it is replaced by what this site
 * actually collects — see the forms, `src/db/schema/leads.ts`,
 * `screening-tests.ts`, the rate limiter and the consent banner.
 *
 * ⚖️ Draft until the client's lawyer / IOD has read it. In particular they
 * must confirm the legal bases, the processors and the retention period, and
 * supply `controller.legalName` and `controller.dpo`.
 */

export type PolicySection = {
  id: string;
  title: string;
  /** Paragraphs; a string array inside is rendered as a bulleted list. */
  body: (string | string[])[];
};

export type PolicyContent = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  lead: string;
  /** Shown under the title. Update whenever the text changes. */
  effectiveDate: string;
  controller: {
    /** The company's registered name (KRS/CEIDG). Empty → the brand alone. */
    legalName: string;
    address: string;
    email: string;
    /** Inspektor Ochrony Danych, if one has been appointed. Empty → omitted. */
    dpo: string;
  };
  sections: (retentionMonths: number) => PolicySection[];
};

const EMAIL = "kontakt@osrodek-insieme.pl";

export const policyDefaults: PolicyContent = {
  metaTitle: "Polityka prywatności — Insieme, ośrodek terapii uzależnień",
  metaDescription:
    "Jakie dane zbiera strona ośrodka Insieme, w jakim celu, jak długo je przechowujemy i jakie masz prawa.",
  eyebrow: "Polityka prywatności",
  title: "Polityka prywatności",
  lead: "Co zapisujemy, kiedy korzystasz z tej strony, po co i jak długo — oraz jak to zmienić. Do rozmowy telefonicznej nie potrzebujemy nawet Twojego nazwiska.",
  effectiveDate: "2 października 2026",
  controller: {
    legalName: "",
    address: "ul. Świerkowa 13, 05-506 Magdalenka",
    email: EMAIL,
    dpo: "",
  },
  sections: (months) => [
    {
      id: "administrator",
      title: "Kto odpowiada za Twoje dane",
      body: [
        "Administratorem danych osobowych zbieranych przez tę stronę jest podmiot prowadzący ośrodek Insieme (dane w ramce „Administrator danych”). We wszystkich sprawach dotyczących danych możesz napisać na adres kontakt@osrodek-insieme.pl.",
        "Ta polityka dotyczy strony internetowej. Dane przekazywane w trakcie leczenia — dokumentacja medyczna, dane pacjenta — przetwarzamy na zasadach, o których informujemy osobno przy przyjęciu do ośrodka.",
      ],
    },
    {
      id: "jakie-dane",
      title: "Jakie dane zbieramy i po co",
      body: [
        "Strona zbiera tylko to, co sam(a) do nas wyślesz, oraz — jeśli się zgodzisz — statystyki odwiedzin, które nie zawierają Twojego imienia ani adresu. Nie prowadzimy kont użytkowników, nie przyjmujemy płatności przez stronę i nie wysyłamy reklam.",
        [
          "Formularz kontaktowy: treść wiadomości oraz — jeśli je podasz — imię, numer telefonu i adres e-mail. Używamy ich wyłącznie, żeby odpowiedzieć na Twoją wiadomość w sposób, który wybierzesz.",
          "Test przesiewowy: odpowiedzi nie są zapisywane. Jeśli poprosisz o wynik na e-mail, zapisujemy adres e-mail, liczbę punktów i przedział wyniku — tylko po to, żeby wysłać Ci jeden raz wynik w PDF.",
          "Zapis na kontakt (pole „Zostaw adres”): adres e-mail i miejsce na stronie, z którego go podano. Piszemy tylko wtedy, gdy mamy coś konkretnego; nie wysyłamy newslettera.",
          "Statystyki (Google Analytics): wyłącznie po kliknięciu „Zgadzam się” w okienku o plikach cookies — szczegóły niżej.",
          "Dane techniczne: adres IP i informacje o przeglądarce, które serwer otrzymuje przy każdym wejściu na stronę. Służą do jej działania i ochrony przed nadużyciami (np. masowym wysyłaniem formularzy).",
        ],
        "Podanie danych jest dobrowolne. Bez adresu e-mail nie wyślemy wyniku testu; bez telefonu lub e-maila nie odpowiemy na wiadomość z formularza.",
      ],
    },
    {
      id: "podstawy",
      title: "Na jakiej podstawie",
      body: [
        [
          "Formularz kontaktowy i zapis na kontakt — Twoja zgoda (art. 6 ust. 1 lit. a RODO), wyrażona zaznaczeniem pola pod formularzem.",
          "Wynik testu przesiewowego i wiadomości, w których opisujesz swoje zdrowie — wyraźna zgoda na przetwarzanie danych o zdrowiu (art. 9 ust. 2 lit. a RODO).",
          "Statystyki Google Analytics — Twoja zgoda (art. 6 ust. 1 lit. a RODO) wyrażona w okienku o plikach cookies.",
          "Dane techniczne i ochrona przed nadużyciami — nasz prawnie uzasadniony interes, czyli bezpieczeństwo strony (art. 6 ust. 1 lit. f RODO).",
        ],
        "Zgodę możesz wycofać w każdej chwili — pisząc na kontakt@osrodek-insieme.pl albo, w przypadku statystyk, przez link „Ustawienia cookies” w stopce. Wycofanie zgody nie zmienia zgodności z prawem tego, co zrobiliśmy wcześniej.",
      ],
    },
    {
      id: "jak-dlugo",
      title: "Jak długo przechowujemy dane",
      body: [
        [
          `Wiadomości z formularza, adresy z zapisu na kontakt i dane z testów przesiewowych — do czasu załatwienia sprawy, nie dłużej niż ${months} miesięcy od wysłania. Po tym czasie usuwamy je automatycznie.`,
          "Adres IP używany do ochrony formularzy — około 10 minut.",
          "Dane w Google Analytics — 2 miesiące (ustawienie usługi).",
        ],
        "Jeśli wcześniej wycofasz zgodę albo poprosisz o usunięcie danych, usuniemy je wcześniej.",
      ],
    },
    {
      id: "odbiorcy",
      title: "Komu przekazujemy dane",
      body: [
        "Nie sprzedajemy danych i nie przekazujemy ich nikomu w celach marketingowych. Dostęp do nich mają wyłącznie upoważnione osoby z zespołu ośrodka oraz firmy, które na nasze zlecenie świadczą usługi techniczne:",
        [
          "hosting strony (Vercel),",
          "baza danych, w której zapisywane są formularze (Neon, serwery w Unii Europejskiej),",
          "wysyłka wiadomości e-mail z wynikiem testu i potwierdzeniami (Resend),",
          "ochrona formularzy przed nadużyciami (Upstash),",
          "przechowywanie zdjęć publikowanych na stronie (Cloudflare),",
          "statystyki odwiedzin — tylko po wyrażeniu zgody (Google Ireland Limited).",
        ],
        "Każda z tych firm przetwarza dane wyłącznie na nasze polecenie, na podstawie umowy powierzenia. Część z nich ma siedzibę lub serwery poza Europejskim Obszarem Gospodarczym; wtedy przekazanie danych odbywa się na podstawie mechanizmów przewidzianych w rozdziale V RODO — decyzji Komisji Europejskiej stwierdzającej odpowiedni stopień ochrony (EU-US Data Privacy Framework) lub standardowych klauzul umownych.",
      ],
    },
    {
      id: "cookies",
      title: "Pliki cookies i statystyki",
      body: [
        "Strona działa bez plików cookies. Jedyna informacja zapisywana w Twojej przeglądarce bez pytania to Twój wybór z okienka o plikach cookies — żeby nie pytać Cię przy każdej wizycie.",
        "Jeśli klikniesz „Zgadzam się”, strona wczyta Google Analytics, które zapisuje pliki cookies _ga i _ga_<identyfikator> (domyślnie na 2 lata) i liczy, które strony są czytane oraz czy ktoś kliknął numer telefonu, adres e-mail lub formularz. Nie przekazujemy do Google treści wiadomości, odpowiedzi z testów ani żadnych danych do celów reklamowych; sygnały reklamowe i Google Signals są wyłączone.",
        "Jeśli klikniesz „Nie zgadzam się”, Google Analytics nie jest wczytywane w ogóle. Swój wybór możesz zmienić w dowolnej chwili przez link „Ustawienia cookies” w stopce; wycofanie zgody usuwa pliki cookies Google Analytics.",
      ],
    },
    {
      id: "prawa",
      title: "Twoje prawa",
      body: [
        "W każdej chwili możesz zażądać:",
        [
          "dostępu do swoich danych i otrzymania ich kopii,",
          "ich sprostowania, jeśli są nieprawidłowe,",
          "ich usunięcia,",
          "ograniczenia przetwarzania,",
          "przeniesienia danych, które nam przekazałeś(-aś) na podstawie zgody,",
          "a także wnieść sprzeciw wobec przetwarzania opartego na naszym prawnie uzasadnionym interesie.",
        ],
        "Jeśli chcesz uzyskać dostęp do swoich danych, poprawić je, zmienić lub usunąć — napisz na kontakt@osrodek-insieme.pl. Odpowiemy bez zbędnej zwłoki, najpóźniej w ciągu miesiąca.",
        "Masz też prawo wnieść skargę do Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa, uodo.gov.pl), jeśli uznasz, że przetwarzamy Twoje dane niezgodnie z prawem.",
        "Nie podejmujemy wobec nikogo decyzji opartych wyłącznie na automatycznym przetwarzaniu danych i nie profilujemy. Wynik testu przesiewowego jest liczony automatycznie, ale jest tylko informacją dla Ciebie — nie decyduje o niczym.",
      ],
    },
    {
      id: "bezpieczenstwo",
      title: "Bezpieczeństwo",
      body: [
        "Strona działa wyłącznie przez szyfrowane połączenie (HTTPS). Dane z formularzy trafiają do zabezpieczonej bazy danych, do której dostęp mają tylko upoważnione osoby z zespołu ośrodka, logujące się do panelu administracyjnego.",
      ],
    },
    {
      id: "zmiany",
      title: "Zmiany tej polityki",
      body: [
        "Możemy zmieniać tę politykę, gdy zmienia się strona albo przepisy. Zmiany wchodzą w życie z chwilą opublikowania na tej stronie, a data na górze pokazuje, kiedy tekst był ostatnio aktualizowany. Jeśli zmiana będzie istotna — na przykład dotyczyć nowego celu przetwarzania — poinformujemy o niej tutaj w widoczny sposób.",
      ],
    },
  ],
};
