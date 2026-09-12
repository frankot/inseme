# Panel Insieme — instrukcja dla redaktora

Panel jest pod adresem **/admin**. Logujesz się adresem e-mail i hasłem, które
dostałeś od administratora. Nie ma zakładania kont — nowe konto tworzy administrator
poleceniem `npm run admin:create`.

---

## Zasada, która obowiązuje wszędzie: szkic → publikacja

Każda treść ma dwa stany:

- **Szkic** — zapisany, ale niewidoczny na stronie. „Zapisz” **nigdy** nie publikuje.
- **Opublikowane** — widoczne dla wszystkich.

Publikacja to osobny przycisk. Jest tak zrobione celowo: treści medyczne ma przed
publikacją przeczytać osoba merytorycznie odpowiedzialna. Zapisuj śmiało — nic nie
wyjdzie na stronę, dopóki nie klikniesz „Opublikuj”.

Cofnięcie publikacji od razu zdejmuje treść ze strony; sam wpis zostaje.

---

## Zespół

**Zespół → Dodaj osobę.**

| Pole | Do czego |
|---|---|
| Imię i nazwisko | Nagłówek wizytówki |
| Adres (slug) | Adres strony: `/zespol/anna-kowalska`. Podpowiada się z imienia. |
| Rola | Podpis nad nazwiskiem, np. „terapeutka uzależnień” |
| Kwalifikacje | Jedna linijka: certyfikaty, lata praktyki |
| Kolejność | Niższa liczba = wyżej. **Pierwsze trzy osoby trafiają na stronę główną.** |
| Krótki opis | Zdanie–dwa, widoczne na liście |
| Pełny biogram | Tekst na stronie osoby; obsługuje nagłówki, listy i pogrubienia |
| Zdjęcie | Z biblioteki mediów. Bez zdjęcia pokazują się inicjały. |

> **Uwaga na slug.** Zmiana adresu zrywa wszystkie istniejące linki do tej osoby.
> Jeśli poprawiasz literówkę w nazwisku, slug możesz zostawić stary.

## FAQ, Artykuły, Strony

Ta sama logika: lista → wpis → zapis → publikacja. Przy artykułach pole
**„Autor / osoba weryfikująca”** wypełnij przed publikacją — to ślad po tym, kto
zatwierdził treść medyczną.

## Media

**Media → Wgraj.** Pliki idą prosto do magazynu, z pominięciem serwera strony.
Do każdego zdjęcia dopisz **tekst alternatywny** — jedno zdanie o tym, co widać.
Czytają go osoby niewidome i wyszukiwarki.

---

## Testy przesiewowe

Najbardziej rozbudowany moduł. Test składa się z trzech rzeczy:

1. **Test** — tytuł, adres, tekst wstępny i **zastrzeżenie** (że test nie jest diagnozą).
2. **Pytania** — każde z własnymi odpowiedziami; każda odpowiedź ma liczbę punktów.
3. **Przedziały wyniku** — od ilu do ilu punktów, i jaki tekst wtedy pokazać.

### Jak zbudować test

1. **Testy przesiewowe → Dodaj test**, wypełnij tytuł i zastrzeżenie, zapisz.
2. Na dole strony dopisz pierwsze pytanie i kliknij **Dodaj**.
3. Pod pytaniem dodaj odpowiedzi (**+ Odpowiedź**) i wpisz punkty — zwykle
   `Nigdy = 0`, `Rzadko = 1`, `Czasem = 2`, `Często = 3`.
4. Dodaj resztę pytań, a potem przy pierwszym kliknij **„Użyj tej skali wszędzie”** —
   skopiuje te same odpowiedzi do wszystkich pytań. To oszczędza najwięcej czasu.
5. Zjedź do **Przedziałów wyniku**. Panel pokazuje maksymalny wynik testu i ostrzega
   o lukach, np. „Wyniki 0–4 pkt nie mają przypisanego przedziału”.
6. **Opublikuj.**

Zmiany zapisują się **po wyjściu z pola** (kliknij obok albo Tab) — nie ma osobnego
przycisku przy każdym pytaniu.

### Czego panel nie pozwoli opublikować

Test bez pytań, pytanie bez odpowiedzi, test bez przedziałów. Powie który problem.

### Który test jest na stronie głównej

Ten o adresie `test-przesiewowy-alkohol`. Zmiana wymaga jednej linijki w kodzie
(`src/content/screening.ts`) — poproś programistę.

### Zgłoszenia

**Testy → Zgłoszenia.** Widzisz adres e-mail, wynik i przedział.

> **Nie zapisujemy pojedynczych odpowiedzi.** Strona obiecuje to odwiedzającym,
> a w bazie po prostu nie ma na nie miejsca. Widzisz „9/15”, nigdy „na pytanie 3
> odpowiedział Często”.

---

## Wiadomości

Formularz kontaktowy ze strony. Każda wiadomość jest **nowa**, dopóki nie klikniesz
**„Oznacz jako załatwione”** — to jedyne, co odróżnia obsłużone od nieobsłużonych.
Ramka wyróżnia nowe.

Odpowiadasz normalnie, telefonem albo e-mailem — panel nie wysyła odpowiedzi.

## Adresy

Wszystkie zebrane e-maile w jednym miejscu: zapisy przez widget i prośby o wynik
testu. **„Pobierz .xlsx”** daje plik do Excela.

Adres z testu usuwa się razem ze zgłoszeniem (na stronie testu), nie tutaj — żeby
te dwa miejsca nigdy nie pokazywały czegoś innego.

---

## Dane osobowe i RODO

- **Automatyczne kasowanie.** Wiadomości, zgłoszenia z testów i zapisane adresy
  starsze niż ustalony okres (domyślnie 24 miesiące) znikają same, raz na dobę.
- **Kasowanie na żądanie.** Jeśli ktoś prosi o usunięcie danych, znajdź wpis i użyj
  kosza. Działa od razu, niezależnie od automatu.
- Usunięcie jest nieodwracalne z poziomu panelu.

## Coś nie działa

| Objaw | Najczęstsza przyczyna |
|---|---|
| „Ten adres (slug) jest już zajęty” | Inna osoba/test ma ten sam adres — zmień na unikalny |
| Zmiana nie widać na stronie | Sprawdź, czy wpis jest **opublikowany**, a nie tylko zapisany |
| Wyniki testów nie przychodzą e-mailem | Nie skonfigurowano wysyłki (`RESEND_*`) — zgłoszenia i tak są w panelu |
| „Sesja wygasła” | Zaloguj się ponownie |
| Nie da się opublikować testu | Brakuje pytań, odpowiedzi albo przedziałów — komunikat mówi czego |
