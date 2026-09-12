# QA — lista kontrolna przed startem

Przechodzi się ją na **środowisku produkcyjnym po wdrożeniu**, z prawdziwymi
zmiennymi. Część rzeczy (wysyłka e-maili, limity, cron) po prostu nie działa
na localhoście, bo nie ma tam kluczy.

## 1. Dostęp i bezpieczeństwo

- [ ] `/admin` bez zalogowania przekierowuje na `/admin/login`
- [ ] Logowanie poprawnym hasłem działa; błędne odrzucone
- [ ] `/admin/leads/export` bez sesji → przekierowanie, **nie** plik
- [ ] Wylogowanie kończy sesję (powrót na `/admin` prosi o login)
- [ ] `/api/cron/retention` bez nagłówka → **401** (albo 503, jeśli brak `CRON_SECRET`)
- [ ] `/api/cron/retention` z błędnym sekretem → **401**

## 2. Treści (dla każdego typu: Strony, Zespół, FAQ, Artykuły)

- [ ] Utworzenie zapisuje jako **szkic** i szkic **nie jest** widoczny na stronie
- [ ] „Opublikuj” pokazuje treść publicznie w ciągu kilku sekund
- [ ] „Cofnij publikację” zdejmuje ją ze strony
- [ ] Edycja opublikowanej treści widoczna po zapisie
- [ ] Usunięcie znika z listy i ze strony
- [ ] Duplikat sluga daje czytelny komunikat, nie błąd serwera

## 3. Zespół

- [ ] Trzy pierwsze osoby (wg „Kolejność”) są na stronie głównej
- [ ] `/zespol` pokazuje wszystkie opublikowane
- [ ] `/zespol/<slug>` pokazuje biogram z formatowaniem
- [ ] Osoba bez zdjęcia pokazuje inicjały, nie pustą ramkę
- [ ] `/zespol/nie-istnieje` → strona 404 w stylu serwisu, **status 404**
- [ ] Osoba w wersji roboczej **nie** jest dostępna pod swoim adresem

## 4. Media

- [ ] Wgranie JPG/PNG kończy się sukcesem
- [ ] Plik ponad limit odrzucony z komunikatem
- [ ] Zdjęcie w treści ładuje się z domeny mediów i jest przeskalowane
- [ ] Tekst alternatywny zapisuje się i trafia do `alt`

## 5. Test przesiewowy — pełna ścieżka

- [ ] Test bez pytań **nie** daje się opublikować (komunikat mówi czego brak)
- [ ] Pytanie bez odpowiedzi blokuje publikację
- [ ] „Użyj tej skali wszędzie” kopiuje odpowiedzi do pozostałych pytań
- [ ] Ostrzeżenia o lukach w przedziałach pojawiają się i znikają po poprawieniu
- [ ] Na `/testy` widać opublikowane testy
- [ ] Przejście testu do końca pokazuje wynik i właściwy przedział
- [ ] Wynik skrajny (same najwyższe odpowiedzi) trafia w ostatni przedział
- [ ] Prośba o wynik na e-mail: **wiadomość przychodzi**, z załącznikiem PDF
- [ ] **PDF otwiera się i polskie znaki są poprawne** (ą, ć, ę, ł, ń, ó, ś, ź, ż)
- [ ] Zgłoszenie widoczne w „Zgłoszenia” z wynikiem i statusem wysyłki
- [ ] Zgłoszenie **nie zawiera** pojedynczych odpowiedzi
- [ ] Wysłanie bez zaznaczonej zgody jest odrzucone

## 6. Formularz kontaktowy

- [ ] Wysyłka z telefonem kończy się podziękowaniem
- [ ] Wysyłka bez telefonu **i** bez e-maila odrzucona z komunikatem
- [ ] Wybór „kontakt e-mailem” bez adresu odrzucony
- [ ] Bez zgody odrzucone
- [ ] Wiadomość jest w `/admin/contact` jako **nowa**
- [ ] Powiadomienie e-mail dotarło na adres ośrodka
- [ ] Odpowiedź na powiadomienie idzie do nadawcy (reply-to), nie do skrzynki systemowej
- [ ] „Oznacz jako załatwione” zmienia status
- [ ] Wysłanie kilkunastu wiadomości pod rząd zostaje **zablokowane** (limit)

## 7. Adresy

- [ ] Zapis przez widget dodaje adres i wysyła potwierdzenie
- [ ] Adres z testu widnieje ze źródłem „test przesiewowy”
- [ ] Licznik unikalnych nie liczy dwa razy tego samego adresu z obu źródeł
- [ ] `.xlsx` otwiera się w Excelu, daty są datami, polskie znaki poprawne
- [ ] Usunięcie adresu zdejmuje go też z eksportu

## 8. Retencja i RODO

- [ ] `/api/cron/retention` z poprawnym sekretem zwraca JSON z podsumowaniem
- [ ] Wpis starszy niż okres retencji znika z panelu po uruchomieniu zadania
- [ ] Cron widoczny w Vercel → Settings → Cron Jobs i wykonał się co najmniej raz
- [ ] Ręczne usunięcie działa natychmiast, niezależnie od automatu

## 9. Strona publiczna

- [ ] Nawigacja: Zespół, Testy, Kontakt prowadzą do właściwych stron
- [ ] Kotwice ze strony głównej (Ośrodek, Program) **przewijają**, nie przeładowują
- [ ] Te same linki z podstrony wracają na stronę główną we właściwe miejsce
- [ ] Menu mobilne (<960 px) otwiera się i zamyka po kliknięciu w link
- [ ] Nagłówek na podstronach jest widoczny od razu (bez przewijania)
- [ ] Numeracja sekcji na stronie głównej idzie 01–08 bez powtórek
- [ ] Sprawdzone na telefonie, tablecie i desktopie

## 10. Przekierowania (przy przełączeniu domeny)

- [ ] `redirect-map.json` ma wypełnione `to` we wszystkich istotnych wpisach
- [ ] Kilka starych adresów faktycznie przekierowuje (status **308**)
- [ ] Stary adres bez wpisu daje 404, a nie pętlę przekierowań
- [ ] `/sitemap.xml` i `robots.txt` wskazują nową domenę

## 11. Wydajność i odporność

- [ ] Strona główna ładuje się poniżej 3 s na 4G
- [ ] Brak błędów w konsoli przeglądarki
- [ ] Wyłączenie `RESEND_API_KEY` nie wywala formularzy — zgłoszenia nadal się zapisują
- [ ] Neon: point-in-time restore włączony, gałęzie `main` i `dev` rozdzielone
