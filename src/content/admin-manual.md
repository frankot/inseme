# Instrukcja panelu Insieme

Ten panel służy do zmieniania treści strony ośrodka — tekstów, zdjęć, zespołu, pytań, artykułów i testów — oraz do odbierania wiadomości wysłanych przez formularze. Nie trzeba niczego programować: wszystko robi się tu, w przeglądarce.

Instrukcja jest ułożona tak jak menu po lewej stronie. Na początku są zasady wspólne dla całego panelu — warto przeczytać je raz, bo dalej się do nich odwołujemy.

---

## Pierwsze kroki

### Logowanie i wylogowanie

- Panel jest pod adresem **/admin** (np. `www.osrodek-insieme.pl/admin`). Logujesz się adresem e-mail i hasłem.
- Aby się wylogować, kliknij swoje inicjały w prawym górnym rogu i wybierz **Wyloguj się**.
- Panel nie ma przycisku „Nie pamiętam hasła” ani zakładania nowych kont. Jeśli trzeba zmienić hasło albo dodać konto dla kolejnej osoby, napisz do osoby, która prowadzi stronę.

### Jak zbudowany jest panel

- **Menu po lewej** prowadzi do wszystkich sekcji. Przyciskiem nad menu możesz je zwinąć do samych ikon, żeby zrobić więcej miejsca. W edytorze stron (CMS) zwija się samo.
- **Pulpit** to strona startowa: liczba nowych wiadomości, zebranych adresów e-mail oraz szkiców i opublikowanych pozycji w Artykułach, Zespole i FAQ. Kafelki są klikalne.
- **Instrukcja** — link w górnym pasku — otwiera ten dokument.
- Na telefonie menu otwiera się przyciskiem z trzema kreskami w lewym górnym rogu.

---

## Najważniejsze zasady

### Szkic i publikacja

Każda pozycja w panelu — osoba z zespołu, pytanie, artykuł, test, zdjęcie w galerii — ma jeden z dwóch stanów:

- **Szkic** — zapisany w panelu, ale **niewidoczny** na stronie.
- **Opublikowane** — widoczne dla wszystkich odwiedzających.

Na dole każdego formularza są dwa przyciski:

- **Zapisz szkic** — zapisuje zmiany i zostawia pozycję niewidoczną. Dobre, gdy tekst jest niegotowy albo czeka na sprawdzenie.
- **Zapisz i opublikuj** — zapisuje i od razu pokazuje na stronie.

Jeśli pozycja jest już opublikowana, a klikniesz **Zapisz szkic**, panel zapyta, czy ją ukryć — bo zapisanie jako szkic zdejmuje ją ze strony, dopóki znów nie klikniesz **Zapisz i opublikuj**.

> Treści medyczne powinna przed publikacją przeczytać osoba merytorycznie odpowiedzialna. Zapisuj je jako szkic, a publikuj po akceptacji.

### Menu wiersza (⋯)

Na listach (Zespół, FAQ, Artykuły, Testy) każdy wiersz ma po prawej przycisk z trzema kropkami. Znajdziesz w nim:

- **Edytuj** — otwiera formularz.
- **Zobacz na stronie** — otwiera opublikowaną pozycję w nowej karcie.
- **Na stronie głównej** (gwiazdka) — dodaje pozycję do strony głównej albo ją stamtąd zdejmuje. Jeśli limit jest wyczerpany, opcja jest wyszarzona — najpierw odznacz inną pozycję.
- **Opublikuj** albo **Zmień na szkic (ukryj)** — bez otwierania formularza.
- **Usuń** — zawsze z pytaniem o potwierdzenie.

### Usuwanie jest ostateczne

Usuniętej pozycji nie da się przywrócić. Jeśli nie masz pewności, zamiast usuwać — **zmień na szkic**. Zniknie ze strony, a w panelu zostanie.

### Niezapisane zmiany

- Gdy w formularzu coś zmienisz i spróbujesz zamknąć kartę lub przejść gdzie indziej, przeglądarka zapyta, czy na pewno.
- Jeśli mimo to zamkniesz kartę (albo wyłączy się komputer), przy następnym otwarciu tego samego formularza zobaczysz żółty pasek: **Masz niezapisane zmiany z …**. Kliknij **Przywróć**, żeby je odzyskać, albo **Odrzuć**. Ta kopia jest tylko w Twojej przeglądarce — na innym komputerze jej nie będzie.

### Kiedy zmiana pojawi się na stronie

Po publikacji strona zwykle odświeża się w ciągu kilku sekund. W rzadkich przypadkach trwa to do **5 minut**. Jeśli nie widzisz zmiany, odczekaj chwilę i odśwież stronę w przeglądarce.

---

## CMS — teksty i zdjęcia stron

**CMS** to edytor stałych stron serwisu: **Strona główna, Program, Ośrodek, Leczenie alkoholizmu, Leczenie narkomanii, Dla rodziny, Detoks i kwalifikacja**. Zmieniasz tu ich treść — teksty, zdjęcia, listy. Kolejność sekcji na stronie jest stała i się jej tu nie zmienia.

Po kliknięciu **CMS** w menu zobaczysz listę stron. Napis **Szkic ma nieopublikowane zmiany** oznacza, że ktoś coś zmienił, ale jeszcze nie opublikował. Kliknij stronę, żeby otworzyć edytor.

### Edytor strony — trzy kolumny

1. **Konspekt** (po lewej) — lista sekcji strony od góry do dołu, a nad nimi **SEO**. Kliknij sekcję, żeby ją edytować.
2. **Formularz** (środek) — pola wybranej sekcji.
3. **Podgląd** (po prawej) — tak będzie wyglądała strona. Odświeża się po każdym zapisie i przewija do edytowanej sekcji.

Przycisk **Podgląd** w górnym pasku otwiera ten podgląd w nowej karcie, na całym ekranie.

### Zapisywanie i publikacja w CMS

CMS działa trochę inaczej niż reszta panelu:

- **Każda zmiana zapisuje się sama** do szkicu, chwilę po tym, jak przestaniesz pisać. Nie ma przycisku „Zapisz”. Stan widać obok tytułu strony („Szkic zapisany 14:02”).
- Szkic **nie jest** widoczny na stronie. Aby pokazać zmiany odwiedzającym, kliknij **Opublikuj** (prawy górny róg) i potwierdź.
- **Odrzuć szkic** kasuje wszystkie nieopublikowane zmiany i wraca do wersji, która jest teraz na stronie.
- Jeśli przy sekcji w konspekcie pojawi się czerwony trójkąt, sekcja ma błąd (np. puste wymagane pole). Dopóki go nie poprawisz, **Opublikuj** jest nieaktywne.
- Komunikat **Ktoś inny zmienił tę stronę** znaczy, że w międzyczasie ktoś edytował tę samą stronę. Odśwież przeglądarkę, żeby zobaczyć jego zmiany, zanim zaczniesz dalej pisać.

### Co zostało zmienione — pomarańczowe oznaczenia

Gdy szkic różni się od opublikowanej strony, panel to pokazuje:

- **pomarańczowa kropka** przy sekcji w konspekcie — w tej sekcji są zmiany,
- **pomarańczowa linia** przy zmienionym polu, a pod nim napis **Zmienione od publikacji** z dwoma linkami:
  - **pokaż opublikowaną** — co jest teraz na stronie,
  - **przywróć** — cofa zmianę tylko w tym jednym polu,
- przy elementach listy: kropka (zmieniony) albo napis **NOWA** (dodany),
- **Przywróć całą sekcję** — u góry formularza — cofa wszystkie zmiany w sekcji.

Po kliknięciu **Opublikuj** oznaczenia znikają.

### Pokazywanie i ukrywanie sekcji

Większość sekcji można ukryć, nie usuwając jej treści: kliknij **ikonę oka** przy sekcji w konspekcie albo wyłącz przełącznik **Widoczna na stronie** w formularzu. Ukryta sekcja ma przekreślone oko i szary napis. Kłódka oznacza sekcję, której nie da się ukryć.

### Pola, listy i zdjęcia

- Przy polach z limitem znaków pojawia się licznik — robi się czerwony po przekroczeniu.
- **Listy** (np. kroki, karty, punkty): **Dodaj** dodaje element, strzałki zmieniają kolejność, **×** usuwa. Elementy z tytułem rozwijasz kliknięciem.
- **Zdjęcia**: kliknij miejsce na zdjęcie, wybierz plik z biblioteki albo prześlij nowy. Pod spodem jest **Opis zdjęcia (alt)** — po wybraniu zdjęcia wstawia się opis z biblioteki, a tu możesz go zmienić tylko dla tej strony. Przy niektórych zdjęciach jest też **Podpis**.
- **Wybór osób, pytań, testu, artykułu** (np. kto z zespołu jest na stronie głównej): wybierasz z listy pozycje, które już są w panelu. „Automatycznie” oznacza, że strona sama weźmie pierwsze/najnowsze. Pozycja w szkicu jest oznaczona i nie wyświetli się, dopóki jej nie opublikujesz.

### SEO strony

Pozycja **SEO** na górze konspektu: **Tytuł strony** i **Opis** — to, co pokazuje Google w wynikach wyszukiwania. Liczniki podpowiadają zalecaną długość. Więcej w [Dobre praktyki › SEO](#seo--jak-pisać-pod-google).

### Uwagi o poszczególnych stronach

- **Strona główna › Ośrodek** — cztery zdjęcia w tej sekcji to zdjęcia z **Galerii** oznaczone gwiazdką (patrz [Galeria](#galeria)). Nie wybiera się ich w CMS.
- **Strona główna › Opinie** — opinie to dosłowne cytaty z Google i portalu osrodkiterapii.pl. Na razie nie edytuje się ich w panelu (sekcja ma kłódkę). Zmianę zgłoś osobie, która prowadzi stronę.
- **Strony tematyczne** (Leczenie alkoholizmu, Leczenie narkomanii, Dla rodziny, Detoks) — sekcja **Pytania** pokazuje pytania z **FAQ** z wybraną kategorią (np. „alkohol”). Gdy w tej kategorii nie ma żadnego opublikowanego pytania, sekcja znika sama.

---

## Zespół

Lista osób z zespołu. Na stronie są w zakładce **Zespół**, a każda osoba ma własną podstronę.

### Dodawanie i edycja osoby

**Dodaj osobę** (albo **Edytuj** w menu wiersza) otwiera formularz:

- **Imię i nazwisko**, **Rola** (np. „terapeutka uzależnień”).
- **Adres (slug)** — końcówka adresu podstrony, np. `/zespol/anna-kowalska`. Tworzy się sam z imienia. **Nie zmieniaj go po publikacji** — stare linki przestaną działać.
- **Zdjęcie** — portret. Najlepiej pionowy, twarz w górnej części kadru.
- **Krótki opis** — 2–3 zdania na kartę na liście.
- **Pełny biogram** — tekst na podstronie osoby (z prostym formatowaniem: pogrubienie, nagłówki, listy, linki).
- **Kwalifikacje** — wykształcenie, specjalizacje.
- **Licencje i certyfikaty** — **Nazwa** i opcjonalnie **Numer** (np. certyfikat specjalisty psychoterapii uzależnień). Pokazują się na podstronie osoby. **Usuń licencję** usuwa wiersz.
- **Kolejność** — niższa liczba = wyżej na liście.

Zapisz przyciskiem **Zapisz szkic** albo **Zapisz i opublikuj**.

### Na stronie głównej

Na stronie głównej mieszczą się **najwyżej 4 osoby**. Wybierasz je gwiazdką w menu wiersza (⋯ › **Na stronie głównej**) albo w CMS › Strona główna › Zespół.

---

## FAQ

Najczęściej zadawane pytania. Wszystkie opublikowane są na stronie **/faq**.

- **Pytanie** i **Odpowiedź** (odpowiedź może mieć pogrubienia, listy i linki).
- **Kategoria** — wybierasz z listy. **Ogólne** to pytania o przyjęcie, pobyt i koszty — są na /faq (i na stronie głównej, jeśli je tam wybierzesz). Kategorie tematyczne pokazują pytanie także na swojej stronie: **Alkohol** → Leczenie alkoholizmu, **Narkotyki** → Leczenie narkomanii, **Rodzina** → Dla rodziny, **Detoks** → Detoks i kwalifikacja, **NFZ** → artykuł o odwyku na NFZ. Gdy w kategorii nie ma żadnego opublikowanego pytania, sekcja na tej stronie się nie pokazuje.
- **Kolejność** — niższa liczba = wyżej.
- **Na stronie głównej** — najwyżej **6 pytań**, wybierasz gwiazdką w menu wiersza albo w CMS › Strona główna › Pytania.

---

## Artykuły

Poradnik — artykuły na stronie **/porady**.

### Pola artykułu

- **Podstawy**: **Tytuł**, **Adres (slug)** (np. `/porady/odwyk-na-nfz` — nie zmieniaj po publikacji), **Wstęp (zajawka)** — kilka zdań wprowadzenia, które pokazują się pod tytułem artykułu, przed treścią. Ten sam tekst jest też na karcie artykułu na liście /porady, w sekcji „Z poradnika” na stronie głównej i — jeśli pole **Opis meta** jest puste — w wynikach Google. Do 400 znaków.
- **Osoba weryfikująca** — **wymagana przed publikacją**. Wybierz osobę z zespołu (artykuł pokaże jej zdjęcie, funkcję i link do biogramu) albo, gdy sprawdzał ktoś spoza zespołu, wpisz go w polu **Osoba spoza zespołu** (imię, nazwisko i funkcja).
- **Zdjęcie główne i SEO**: zdjęcie na górze artykułu i przy udostępnianiu linku, **Tytuł meta** i **Opis meta** dla Google.

### Treść — bloki

Treść artykułu składa się z bloków, które dodajesz po kolei:

- **Tekst** — zwykły tekst z paskiem narzędzi: pogrubienie, kursywa, nagłówek 2 i 3, lista punktowana i numerowana, cytat, link.
- **Zdjęcie + tekst** — zdjęcie z tekstem obok; wybierasz, czy zdjęcie jest **Po lewej** czy **Po prawej**.
- **Wezwanie do działania** — wyróżniona ramka z przyciskiem, np. „Zadzwoń”. **Adres przycisku** to np. `/kontakt` albo `tel:+48669916005`.
- **Lista kroków** — ponumerowane kroki z tytułem i opisem.
- **Sekcja FAQ** — pytania z FAQ z wybranej kategorii (puste = wszystkie opublikowane).

Bloki przesuwasz strzałkami **Przenieś wyżej / niżej** i usuwasz przyciskiem **Usuń sekcję**.

### Stałe artykuły i strona główna

- Artykuł oznaczony na liście jako **stały artykuł** jest podlinkowany z innych miejsc strony, dlatego nie da się go ukryć ani zmienić jego adresu. Treść możesz edytować normalnie.
- W sekcji **Z poradnika** na stronę główną trafia wybrany artykuł albo — jeśli nikogo nie wybrano — najnowszy opublikowany.

---

## Galeria i media

Jedna pozycja w menu, dwie zakładki u góry: **Galeria** i **Biblioteka mediów**.

### Galeria

Zdjęcia ośrodka na stronie **/galeria**.

- **Dodawanie**: przeciągnij zdjęcia z komputera na ramkę albo kliknij **Dodaj zdjęcia**. Możesz dodać wiele naraz. Każde zdjęcie jest w przeglądarce automatycznie zmniejszane — nie musisz niczego przygotowywać.
- Nowe zdjęcia trafiają jako **szkice**. Opublikuj każde przyciskiem **Opublikuj** na karcie albo wszystkie naraz przyciskiem **Opublikuj wszystkie robocze**. **Ukryj** zdejmuje zdjęcie ze strony.
- Każda karta ma dwa pola, zapisywane automatycznie po wyjściu z pola:
  - **Opis pod zdjęciem** — widoczny pod zdjęciem i w powiększeniu,
  - **Opis alternatywny (alt)** — patrz [Opisy zdjęć](#opisy-zdjęć-alt).
- **Kolejność**: przeciągnij kartę w inne miejsce albo użyj strzałek. Pierwsze sześć opublikowanych zdjęć pokazuje się też na stronie **Ośrodek**.
- **Gwiazdka ★** — wybiera zdjęcie do sekcji **Ośrodek na stronie głównej** (dokładnie 4 miejsca, w kolejności z galerii). Wybrane zdjęcia mają znaczek **Strona główna**. Zdjęcie w szkicu z gwiazdką pojawi się dopiero po opublikowaniu.
- **Usuwanie** (ikona kosza) kasuje zdjęcie na stałe.

### Biblioteka mediów

Wszystkie pozostałe pliki strony: zdjęcia do artykułów, portrety zespołu, zdjęcia w CMS, obraz do udostępniania.

- **Dodawanie**: przeciągnij pliki na ramkę albo **Dodaj pliki**. Obsługiwane: zdjęcia (JPG, PNG, WebP, AVIF), SVG i PDF. Do każdego zdjęcia panel sam tworzy mniejsze wersje, żeby telefony pobierały tylko tyle, ile potrzebują.
- Pliki dodane w formularzach (np. zdjęcie osoby) też trafiają tutaj — to ta sama biblioteka.
- **Opis alternatywny (alt)** zapisuje się po wyjściu z pola. Zdjęcia bez opisu mają znaczek **Brak opisu**, a liczba takich zdjęć jest w linijce nad listą.
- **Otwórz plik** pokazuje oryginał.
- **Usuń** — uwaga: miejsca na stronie, w których plik był użyty, zostaną bez zdjęcia. Przed usunięciem upewnij się, że nigdzie go nie potrzebujesz.

---

## Testy przesiewowe

Testy, które odwiedzający mogą wypełnić anonimowo na stronie **/testy**, z wynikiem na ekranie i opcjonalnie w e-mailu (z PDF).

### Pola testu

- **Tytuł**, **Adres (slug)** (`/testy/…`), **Krótki opis** (na liście testów), **Tekst wprowadzający** (przed pierwszym pytaniem).
- **Zastrzeżenie** — pokazywane przy teście, przy wyniku i w PDF (np. „Test nie jest diagnozą”). Treść musi zaakceptować osoba merytorycznie odpowiedzialna.
- **Meta tytuł** i **Meta opis** — dla Google.
- **Kolejność** — niższa liczba = wyżej na liście.

### Pytania i odpowiedzi

- Dodaj pytanie, wpisując treść w polu **Treść nowego pytania**.
- Każde pytanie ma odpowiedzi z **Punktami**. **Nowa odpowiedź** dodaje kolejną.
- Gdy wszystkie pytania mają takie same odpowiedzi (np. „Nigdy / Czasem / Często”), ułóż je w jednym pytaniu i kliknij **Użyj tej skali wszędzie** — panel zapyta o potwierdzenie, bo nadpisze odpowiedzi w pozostałych pytaniach.
- Strzałki **W górę / W dół** zmieniają kolejność, kosz usuwa pytanie razem z odpowiedziami.

### Przedziały wyniku

Wynik to suma punktów. **Przedziały wyniku** mówią, co odwiedzający zobaczy przy danej sumie: **Od (punkty)**, **Do (punkty)**, **Tytuł wyniku** i **Treść wyniku**. Przedziały powinny pokrywać wszystkie możliwe sumy, bez dziur i nakładania się.

Testu **nie da się opublikować**, dopóki nie ma pytań, odpowiedzi i przedziałów.

### Strona główna i zgłoszenia

- Test na stronie głównej wybierasz gwiazdką w menu wiersza albo w CMS › Strona główna › Test przesiewowy.
- Kolumna **Zgłoszenia** na liście testów prowadzi do wyników osób, które poprosiły o wynik e-mailem: adres, wynik, przedział i to, czy e-mail **wysłano**. Zgłoszenie można usunąć.

---

## Zgłoszenia

Wszystko, co odwiedzający wysłali przez stronę. Dwie zakładki u góry: **Wiadomości** i **Adresy e-mail**.

### Wiadomości

Wiadomości z formularza kontaktowego. Liczba przy zakładce to nowe, nieobsłużone wiadomości.

- Każda wiadomość pokazuje imię (jeśli podano), telefon, e-mail, jak dana osoba woli kontakt i treść. Telefon i e-mail są klikalne.
- Po obsłużeniu kliknij **Oznacz jako załatwione**. **Cofnij do nowych** przywraca status.
- Kopia każdej wiadomości przychodzi też e-mailem — na adres z [Ustawień](#ustawienia) (o ile nie ustalono innego).
- Wiadomość można usunąć (kosz) — np. gdy ktoś prosi o usunięcie swoich danych.

### Adresy e-mail

Wszystkie adresy zostawione na stronie, z trzech źródeł: **zapis na stronie**, **test przesiewowy** i **formularz kontaktowy**.

- Na górze są liczby: unikalne adresy i ile pochodzi z każdego źródła.
- **Pobierz .xlsx** — eksport do Excela (z datą zgody).
- Adres usuwa się tam, gdzie „mieszka”: zapis — tutaj (kosz), test — na stronie zgłoszeń testu, formularz — w zakładce Wiadomości (link **w wiadomościach**).
- **Adresy z formularza kontaktowego** zostały podane po to, żeby odpowiedzieć na wiadomość — **nie wysyłaj na nie ofert ani newslettera**.

> Dane starsze niż 24 miesiące panel usuwa automatycznie.

---

## Ustawienia

Dane używane w wielu miejscach strony naraz — zmieniasz je raz, a zmieniają się wszędzie.

- **Kontakt**: **Telefon** (w nagłówku, stopce, przyciskach „Zadzwoń”), **Telefon dodatkowy**, **E-mail** (na stronie; zwykle także adres, na który przychodzą powiadomienia o wiadomościach), **Adres** (ulica w pierwszej linii, kod i miejscowość w drugiej) i **Godziny pracy** (puste pole = godziny się nie pokazują).
- **Social media**: linki do profili (Facebook, Instagram, YouTube, LinkedIn, WhatsApp). Wpisuj pełny adres zaczynający się od `https://`, i tylko oficjalne profile ośrodka. Puste pole = ikona się nie pokazuje.
- **Prywatność i zgody**: **Nota o przetwarzaniu danych** (zdanie przy zgodzie pod formularzem — link do polityki prywatności dodaje się sam) i **Treść banera zgód** (okienko z pytaniem o zgodę na statystyki Google).
- **Domyślny obraz Open Graph** — obrazek pokazywany, gdy ktoś udostępni link do strony (np. na Facebooku czy WhatsAppie), jeśli strona nie ma własnego. Najlepiej 1200 × 630 px, z logo i zdjęciem ośrodka.

Zmiany zapisuje przycisk **Zapisz ustawienia** na dole formularza. Ustawienia nie mają szkicu — po zapisaniu od razu obowiązują na stronie.

---

## Dobre praktyki

### Opisy zdjęć (alt)

Opis alternatywny czyta osobom niewidomym ich czytnik ekranu, a Google dzięki niemu rozumie, co jest na zdjęciu. Opisz krótko i konkretnie, **co widać**: „Jasny salon z fotelami ustawionymi w krąg i kominkiem”. Przy portrecie: imię, nazwisko i funkcja. Nie zaczynaj od „Zdjęcie…” i nie zostawiaj nazwy pliku (np. „IMG_0042”).

### SEO — jak pisać pod Google

- **Tytuł** (SEO / meta): do ok. **60 znaków**, najważniejsze słowa na początku, nazwa ośrodka na końcu, np. „Odwyk alkoholowy pod Warszawą — leczenie alkoholizmu | Insieme”.
- **Opis**: do ok. **160 znaków**, jedno-dwa zdania zachęcające do kliknięcia, mówiące, co ktoś znajdzie na stronie.
- Każda strona i artykuł powinny mieć **własny** tytuł i opis — nie kopiuj ich między stronami.
- Pisz naturalnie, tak jak mówią ludzie szukający pomocy („odwyk”, „leczenie alkoholizmu”, „ośrodek pod Warszawą”). Nie upychaj słów kluczowych.
- **Nie zmieniaj adresów (slug)** opublikowanych stron, artykułów i osób. Google i inne strony linkują do starego adresu — po zmianie trafią na błąd.
- Uzupełniaj opisy zdjęć (alt).

### Prawo — treści medyczne (art. 14 ustawy o działalności leczniczej)

Placówka lecznicza może **informować**, ale nie może **reklamować** swoich świadczeń. W praktyce:

- Opisuj, **co** robicie i **jak** — bez zachwalania. Unikaj słów „najlepszy”, „najskuteczniejszy”, „gwarantujemy”, „100%”.
- **Nie obiecuj efektów** leczenia ani skuteczności, nie podawaj „procentu wyleczeń”.
- Opinie pacjentów cytuj **dosłownie**, bez poprawiania, i nie wybieraj tylko tych, które brzmią jak obietnica wyleczenia.
- Teksty medyczne (artykuły, odpowiedzi w FAQ, wyniki testów, zastrzeżenia) przed publikacją powinna sprawdzić osoba merytorycznie odpowiedzialna — dlatego artykuł wymaga wskazania osoby weryfikującej.

W razie wątpliwości co do konkretnego zdania — zapytaj prawnika ośrodka, zanim je opublikujesz.

### Dane osobowe (RODO)

Wiadomości, adresy e-mail i wyniki testów to **dane osobowe**, często dotyczące zdrowia — czyli szczególnie chronione.

- Nie przesyłaj ich dalej poza osoby, które muszą się nimi zająć, i nie zostawiaj eksportu .xlsx na wspólnych dyskach ani w e-mailach.
- Gdy ktoś prosi o usunięcie swoich danych, usuń jego wiadomość, adres lub zgłoszenie testu w panelu.
- Adresów z formularza kontaktowego nie używaj do wysyłki ofert.
- Panel sam usuwa dane starsze niż 24 miesiące.
