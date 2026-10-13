# Instrukcja panelu Insieme

Panel służy do zarządzania treścią strony (teksty, zdjęcia, zespół, FAQ, artykuły, testy) i do obsługi zgłoszeń z formularzy. Dokument opisuje każdą sekcję panelu w kolejności menu.

---

## Dostęp

| Element | Opis |
|---|---|
| Adres | `/admin` (np. `www.osrodek-insieme.pl/admin`) |
| Logowanie | e-mail i hasło |
| Wylogowanie | **Wyloguj** na dole menu albo inicjały w prawym górnym rogu › **Wyloguj się** |
| Hasło, nowe konto | niedostępne w panelu — zmienia je osoba, która prowadzi stronę |

### Układ panelu

- **Menu** (po lewej) — wszystkie sekcje. Przycisk nad menu zwija je do ikon; w edytorze CMS zwija się automatycznie. Na telefonie: przycisk ☰ w lewym górnym rogu.
- **Pulpit** — liczba nowych wiadomości i adresów e-mail oraz szkiców i opublikowanych pozycji w Artykułach, Zespole i FAQ.
- **Instrukcja** (górny pasek) — ten dokument.

---

## Zasady ogólne

### Statusy

| Status | Na stronie |
|---|---|
| **Szkic** | niewidoczne |
| **Opublikowane** | widoczne |

Dotyczy: osób z zespołu, pytań FAQ, artykułów, testów, zdjęć w galerii.

### Zapisywanie formularzy

| Przycisk | Działanie |
|---|---|
| **Zapisz szkic** | zapisuje, pozycja niewidoczna; przy pozycji opublikowanej najpierw pyta, czy ją ukryć |
| **Zapisz i opublikuj** | zapisuje i publikuje |

Treści medyczne publikować po akceptacji osoby merytorycznie odpowiedzialnej.

Wyjątki: **CMS** zapisuje szkic automatycznie (patrz [CMS](#cms)), **Ustawienia** zapisują się bez szkicu.

### Listy: status i menu wiersza

Kolumna **Status** na listach Zespół, FAQ, Artykuły, Testy:

- **Plakietka statusu** — kliknięcie przełącza status (Szkic → publikacja, Opublikowane → ukrycie). Potwierdzenie na dole ekranu ma przycisk **Cofnij**. Pozycje, których nie można ukryć, mają nieklikalną plakietkę.
- **Przycisk ⋯** — menu wiersza:

| Opcja | Działanie |
|---|---|
| **Edytuj** | otwiera formularz |
| **Zobacz na stronie** | otwiera opublikowaną pozycję w nowej karcie |
| **Na stronie głównej** ★ | dodaje do strony głównej / zdejmuje; wyszarzone po osiągnięciu limitu |
| **Opublikuj** / **Zmień na szkic (ukryj)** | zmiana statusu |
| **Usuń** | usunięcie, po potwierdzeniu |

### Usuwanie

Nieodwracalne. Alternatywa: **Zmień na szkic** — pozycja znika ze strony, zostaje w panelu.

### Niezapisane zmiany

- Zamknięcie karty lub przejście dalej z niezapisanymi zmianami wymaga potwierdzenia.
- Po zamknięciu karty z niezapisanymi zmianami formularz przy następnym otwarciu pokazuje pasek **Masz niezapisane zmiany z …** z przyciskami **Przywróć** / **Odrzuć**. Kopia jest przechowywana tylko w tej przeglądarce.

### Pola opisów zdjęć

Pola opisu i alt przy zdjęciach (Galeria, Biblioteka mediów, wybór zdjęcia, CMS) w spoczynku mają jedną linię. Po kliknięciu rozwijają się do pełnej długości tekstu. **Enter** kończy edycję — opisy są jednowierszowe.

### Czas pojawienia się zmian

Zwykle kilka sekund po publikacji, maksymalnie **5 minut**.

---

## CMS

Edytor stałych stron: **Strona główna, Program, Ośrodek, Leczenie alkoholizmu, Leczenie narkomanii, Dla rodziny, Detoks i kwalifikacja**. Edytowalna jest treść (teksty, zdjęcia, listy); kolejność sekcji jest stała.

Lista stron oznacza napisem **Szkic ma nieopublikowane zmiany** strony z niepublikowanymi zmianami.

### Edytor

| Kolumna | Zawartość |
|---|---|
| Konspekt (lewa) | **SEO** i sekcje strony w kolejności |
| Formularz (środek) | pola wybranej sekcji |
| Podgląd (prawa) | strona po zmianach; odświeża się po zapisie |

**Podgląd** w górnym pasku — podgląd w nowej karcie.

### Zapis i publikacja

| Element | Działanie |
|---|---|
| Autozapis | każda zmiana zapisuje się w szkicu po chwili; stan obok tytułu („Szkic zapisany 14:02”) |
| **Opublikuj** | szkic staje się wersją na stronie (z potwierdzeniem) |
| **Odrzuć szkic** | usuwa niepublikowane zmiany, przywraca wersję ze strony |
| Czerwony trójkąt w konspekcie | błąd w sekcji (np. puste wymagane pole); blokuje publikację |
| **Ktoś inny zmienił tę stronę** | stronę edytowano równolegle — odświeżyć przeglądarkę przed dalszą edycją |

### Oznaczenia zmian

Gdy szkic różni się od wersji opublikowanej:

| Oznaczenie | Znaczenie |
|---|---|
| pomarańczowa kropka przy sekcji | sekcja ma zmiany |
| pomarańczowa linia przy polu + **Zmienione od publikacji** | pole zmienione; **pokaż opublikowaną** — wartość na stronie, **przywróć** — cofa zmianę pola |
| kropka / **NOWA** przy elemencie listy | element zmieniony / dodany |
| **Przywróć całą sekcję** | cofa wszystkie zmiany w sekcji |

Oznaczenia znikają po publikacji.

### Widoczność sekcji

Ikona oka w konspekcie albo przełącznik **Widoczna na stronie**. Przekreślone oko — sekcja ukryta (treść zachowana). Kłódka — sekcji nie można ukryć.

### Pola

- **Licznik znaków** — przy polach z limitem; czerwony po przekroczeniu.
- **Listy** — **Dodaj**, strzałki (kolejność), **×** (usunięcie); elementy z tytułem rozwija kliknięcie.
- **Zdjęcia** — wybór z biblioteki lub przesłanie nowego. **Opis zdjęcia (alt)** dotyczy tylko tej strony; po wyborze zdjęcia wypełnia się opisem z biblioteki. Niektóre zdjęcia mają też **Podpis**.
- **Wybór pozycji** (osoby, pytania, test, artykuł) — z listy pozycji w panelu. **Automatycznie** — strona bierze pierwsze/najnowsze. Pozycje w szkicu są oznaczone i nie wyświetlają się do czasu publikacji.

### SEO strony

Pozycja **SEO** w konspekcie: **Tytuł strony** i **Opis** — wyświetlane w wynikach Google. Patrz [SEO](#seo).

### Sekcje sterowane z innych miejsc

| Sekcja | Źródło |
|---|---|
| Strona główna › Ośrodek (4 zdjęcia) | zdjęcia z gwiazdką w [Galerii](#galeria) |
| Strona główna › Opinie | cytaty z Google i osrodkiterapii.pl — nieedytowalne w panelu (kłódka) |
| Strony tematyczne › Pytania | pytania FAQ z kategorią wybraną w sekcji (Alkohol, Narkotyki, Rodzina, Detoks, NFZ); bez opublikowanych pytań sekcja się nie wyświetla |

---

## Zespół

Osoby na stronie **/zespol**; każda ma podstronę `/zespol/<adres>`.

| Pole | Opis |
|---|---|
| **Imię i nazwisko** | |
| **Rola** | np. „terapeutka uzależnień” |
| **Adres (slug)** | końcówka adresu podstrony; tworzony z imienia; nie zmieniać po publikacji |
| **Zdjęcie** | portret, najlepiej pionowy |
| **Krótki opis** | 2–3 zdania na karcie |
| **Pełny biogram** | tekst podstrony (pogrubienie, nagłówki, listy, linki) |
| **Kwalifikacje** | wykształcenie, specjalizacje |
| **Licencje i certyfikaty** | **Nazwa** + opcjonalnie **Numer**; widoczne na podstronie |
| **Kolejność** | niższa liczba = wyżej |

Strona główna: maks. **4 osoby** — ★ w menu wiersza albo CMS › Strona główna › Zespół.

---

## FAQ

Wszystkie opublikowane pytania są na **/faq**.

| Pole | Opis |
|---|---|
| **Pytanie** | |
| **Odpowiedź** | pogrubienia, listy, linki |
| **Kategoria** | lista wyboru — patrz tabela niżej |
| **Kolejność** | niższa liczba = wyżej |

| Kategoria | Gdzie jeszcze, oprócz /faq |
|---|---|
| **Ogólne** | tylko /faq — pytania o przyjęcie, pobyt, koszty |
| **Alkohol** | Leczenie alkoholizmu |
| **Narkotyki** | Leczenie narkomanii |
| **Rodzina** | Dla rodziny |
| **Detoks** | Detoks i kwalifikacja |
| **NFZ** | artykuł „Odwyk na NFZ” |

Strona główna: maks. **6 pytań** dowolnej kategorii — ★ w menu wiersza albo CMS › Strona główna › Pytania.

---

## Artykuły

Artykuły na stronie **/porady**.

| Pole | Opis |
|---|---|
| **Tytuł** | |
| **Adres (slug)** | `/porady/<adres>`; nie zmieniać po publikacji |
| **Wstęp (zajawka)** | kilka zdań pod tytułem, przed treścią; także na karcie artykułu, w sekcji „Z poradnika” na stronie głównej i w Google, gdy **Opis meta** jest pusty; do 400 znaków |
| **Osoba weryfikująca z zespołu** | **wymagana do publikacji** (albo pole niżej); artykuł pokazuje jej zdjęcie, funkcję i link do biogramu |
| **Osoba spoza zespołu** | imię, nazwisko, funkcja — gdy weryfikował ktoś spoza zespołu |
| **Zdjęcie główne** | na górze artykułu i przy udostępnianiu linku |
| **Tytuł meta**, **Opis meta** | dla Google |

### Bloki treści

| Blok | Zawartość |
|---|---|
| **Tekst** | pogrubienie, kursywa, nagłówek 2 i 3, listy, cytat, link |
| **Zdjęcie + tekst** | zdjęcie **Po lewej** / **Po prawej** od tekstu |
| **Wezwanie do działania** | ramka z przyciskiem; **Adres przycisku** np. `/kontakt` lub `tel:+48669916005` |
| **Lista kroków** | numerowane kroki: tytuł + opis |
| **Sekcja FAQ** | pytania z kategorii wybranej z listy (**Wszystkie pytania** albo jedna z kategorii FAQ) |

Kolejność: **Przenieś wyżej / niżej**. Usunięcie: **Usuń sekcję**.

### Uwagi

- **Stały artykuł** (oznaczenie na liście) — podlinkowany z innych stron; nie można go ukryć ani zmienić adresu. Treść edytowalna.
- **Z poradnika** na stronie głównej: wybrany artykuł, a bez wyboru — najnowszy opublikowany.

---

## Galeria i media

Dwie zakładki: **Galeria** i **Biblioteka mediów**.

### Galeria

Zdjęcia na stronie **/galeria**.

| Element | Działanie |
|---|---|
| Dodawanie | przeciągnięcie plików na ramkę lub **Dodaj zdjęcia**; wiele naraz; automatyczne zmniejszenie w przeglądarce |
| Status | nowe zdjęcia to **szkice**; **Opublikuj** / **Ukryj** na karcie; **Opublikuj wszystkie robocze** |
| **Opis pod zdjęciem** | widoczny pod zdjęciem i w powiększeniu; zapis po wyjściu z pola |
| **Opis alternatywny (alt)** | patrz [Opisy zdjęć (alt)](#opisy-zdjęć-alt); zapis po wyjściu z pola |
| Kolejność | przeciąganie kart lub strzałki; pierwsze 6 opublikowanych także na stronie **Ośrodek** |
| ★ | zdjęcie w sekcji Ośrodek na stronie głównej; dokładnie 4, w kolejności galerii; znaczek **Strona główna**; szkic z ★ pokaże się po publikacji |
| Kosz | usunięcie zdjęcia |

### Biblioteka mediów

Wszystko, co jest w magazynie plików. Jedna karta = jeden plik (mniejsze kopie zdjęcia i miniatura galerii liczą się razem z nim). Pliki dodane w formularzach trafiają do tej samej biblioteki.

| Element | Działanie |
|---|---|
| Dodawanie | przeciągnięcie na ramkę lub **Dodaj pliki**; JPG, PNG, WebP, AVIF, HEIC, SVG, PDF; zdjęcia powyżej 3000 px zmniejszane przed wysyłką (poza PNG z przezroczystością); mniejsze kopie tworzone automatycznie |
| **Opis alternatywny (alt)** | zapis po wyjściu z pola; brak opisu — znaczek **Brak opisu** (liczba w linii nad listą) |
| **Otwórz plik** | oryginał w nowej karcie |
| **Użyte w** | lista miejsc z linkami do edycji (strony CMS, artykuły, zespół, ustawienia); dopisek **szkic** — miejsce nieopublikowane lub tylko w wersji roboczej |
| Kosz | usunięcie; okno potwierdzenia wymienia miejsca użycia, które zostaną bez zdjęcia |
| Filtry | **Wszystko**, **Biblioteka**, **Nieużywane** (pliki biblioteki nigdzie nieużyte), **Galeria**, **Poza bazą** (tylko gdy są takie pliki) |

| Rodzaj karty | Znaczki | Edycja |
|---|---|---|
| Plik biblioteki | typ (JPG, PNG…), **Brak opisu**, **Nieużywany** | tutaj |
| Zdjęcie galerii | **Galeria**, **Szkic** / **Opublikowane**, **Strona główna** | **Edytuj w Galerii**; kosz usuwa zdjęcie z galerii |
| **Poza bazą** | **Nieużywany** | plik w magazynie bez wpisu w bazie (np. po przerwanym przesyłaniu); nigdzie się nie wyświetla — tylko podgląd i usunięcie |

---

## Testy przesiewowe

Testy na stronie **/testy** — wynik na ekranie i opcjonalnie e-mailem (PDF). Cały test (podstawy, pytania, wyniki) edytowany na jednej stronie i zapisywany razem.

### Sekcje edytora

| Sekcja | Zawartość |
|---|---|
| **1. Podstawy** | **Tytuł testu**, **Krótki opis** (lista testów), **Wstęp** (nad pierwszym pytaniem), **Zastrzeżenie** (przy wyniku i w PDF; wymaga akceptacji osoby merytorycznie odpowiedzialnej) |
| **2. Pytania** | treść pytania, odpowiedzi z **punktami**; licznik pytań i maksymalnego wyniku |
| **3. Wyniki** | zakresy **Od … do … pkt** z **tytułem** i **treścią** wyniku |
| **4. Adres i SEO** | zwinięte: **Adres (slug)** (`/testy/<adres>`), **Tytuł meta**, **Opis meta**, **Kolejność** |

### Pytania

- Nowy test zawiera jedno pytanie z odpowiedziami **Nie** (0 pkt) / **Tak** (1 pkt).
- **Dodaj pytanie** — nowe pytanie z odpowiedziami skopiowanymi z poprzedniego.
- **Dodaj odpowiedź** / **×** — dodanie / usunięcie odpowiedzi.
- **Użyj tych odpowiedzi we wszystkich pytaniach** — kopiuje odpowiedzi do pozostałych pytań (z potwierdzeniem).
- Strzałki — kolejność pytań; kosz — usunięcie.

### Wyniki

Wynik = suma punktów. **Dodaj wynik** tworzy zakres zaczynający się za poprzednim. Luki i nakładanie się zakresów — żółte ostrzeżenie nad listą.

### Zapis i publikacja

- Puste pytania i wyniki są przy zapisie pomijane.
- Szkic: zapis możliwy w każdym stanie.
- Publikacja wymaga: min. 1 pytania, odpowiedzi w każdym pytaniu, min. 1 wyniku. Brak — komunikat z przyczyną.

### Pozostałe

- Strona główna: ★ w menu wiersza albo CMS › Strona główna › Test przesiewowy.
- **Zgłoszenia** (strona testu, kolumna na liście) — osoby, które zamówiły wynik e-mailem: adres, wynik, przedział, status wysyłki (**wysłano** / **nie wysłano**). Zgłoszenie można usunąć.

---

## Zgłoszenia

Dwie zakładki: **Wiadomości** i **Adresy e-mail**.

### Wiadomości

Formularz kontaktowy. Liczba przy zakładce — nowe wiadomości.

| Element | Działanie |
|---|---|
| Treść | imię (opcjonalne), telefon, e-mail, preferowany kontakt, wiadomość; telefon i e-mail klikalne |
| **Oznacz jako załatwione** / **Cofnij do nowych** | status obsługi |
| Kosz | usunięcie wiadomości |
| Powiadomienie | kopia każdej wiadomości e-mailem — na adres z [Ustawień](#ustawienia) (o ile nie ustalono innego) |

### Adresy e-mail

Adresy ze źródeł: **zapis na stronie**, **test przesiewowy**, **formularz kontaktowy**.

| Element | Działanie |
|---|---|
| Liczniki | unikalne adresy i liczba z każdego źródła |
| **Pobierz .xlsx** | eksport z datą zgody |
| Usuwanie | zapis — tutaj (kosz); test — w zgłoszeniach testu; formularz — w Wiadomościach (link **w wiadomościach**) |

Adresy z formularza kontaktowego służą tylko do odpowiedzi — nie do ofert ani newslettera.

Dane starsze niż **24 miesiące** są usuwane automatycznie.

---

## Ustawienia

Dane wspólne dla całej strony. Zapis: **Zapisz ustawienia** — bez szkicu, obowiązuje od razu.

| Grupa | Pola |
|---|---|
| **Kontakt** | **Telefon** (nagłówek, stopka, przyciski „Zadzwoń”), **Telefon dodatkowy**, **E-mail** (na stronie; zwykle też adres powiadomień), **Adres** (ulica / kod i miejscowość), **Godziny pracy** (puste — niewyświetlane) |
| **Social media** | Facebook, Instagram, YouTube, LinkedIn, WhatsApp — pełny adres `https://…`, tylko oficjalne profile; puste — ikona niewyświetlana |
| **Prywatność i zgody** | **Nota o przetwarzaniu danych** (przy zgodzie pod formularzem; link do polityki prywatności dodawany automatycznie), **Treść banera zgód** (zgoda na statystyki Google) |
| **Domyślny obraz Open Graph** | obraz przy udostępnianiu linku (Facebook, WhatsApp), gdy strona nie ma własnego; 1200 × 630 px |

---

## Wytyczne

### Opisy zdjęć (alt)

- Opisać, co widać: „Jasny salon z fotelami ustawionymi w krąg i kominkiem”.
- Portret: imię, nazwisko, funkcja.
- Bez „Zdjęcie…” na początku i bez nazw plików („IMG_0042”).

### SEO

| Element | Zasada |
|---|---|
| Tytuł (SEO / meta) | do ~**60 znaków**; najważniejsze słowa na początku, nazwa ośrodka na końcu |
| Opis | do ~**160 znaków**; co znajduje się na stronie |
| Unikalność | własny tytuł i opis dla każdej strony i artykułu |
| Słowa kluczowe | naturalnie, językiem szukających („odwyk”, „leczenie alkoholizmu”, „pod Warszawą”); bez upychania |
| Adresy (slug) | nie zmieniać po publikacji — stare linki przestają działać |

### Treści medyczne (art. 14 ustawy o działalności leczniczej)

Dozwolone informowanie, niedozwolona reklama świadczeń:

- bez określeń „najlepszy”, „najskuteczniejszy”, „gwarantujemy”, „100%”;
- bez obietnic efektów i danych o skuteczności;
- opinie pacjentów — dosłownie, bez selekcji pod obietnicę wyleczenia;
- artykuły, odpowiedzi FAQ, wyniki testów, zastrzeżenia — przed publikacją sprawdza osoba merytorycznie odpowiedzialna.

W razie wątpliwości — konsultacja z prawnikiem ośrodka przed publikacją.

### Dane osobowe (RODO)

Wiadomości, adresy e-mail i wyniki testów to dane osobowe, często dotyczące zdrowia.

- Dostęp tylko dla osób, które je obsługują; eksportu .xlsx nie przechowywać na wspólnych dyskach ani w e-mailach.
- Żądanie usunięcia danych — usunąć wiadomość, adres lub zgłoszenie testu w panelu.
- Adresy z formularza kontaktowego — bez wysyłki ofert.
- Automatyczne usuwanie po 24 miesiącach.
