# Zmienne środowiskowe

Ustawiane lokalnie w `.env.local`, a na produkcji w **Vercel → Project → Settings →
Environment Variables**. Walidacja jest w `src/lib/env.ts` — brak wymaganej zmiennej
zatrzymuje aplikację przy starcie, celowo, zamiast psuć się później.

## Wymagane

| Zmienna | Co to jest | Skąd wziąć |
|---|---|---|
| `DATABASE_URL` | Connection string Postgresa | Neon → Project → Connection string (pooled) |
| `AUTH_SECRET` | Klucz podpisujący sesje panelu (min. 32 znaki) | `openssl rand -base64 32` |

> **Osobna baza dla dev i prod.** Neon → Branches: `main` dla produkcji, `dev` do pracy.
> Nigdy nie wskazuj lokalnego `.env.local` na bazę produkcyjną — skrypty seedujące piszą.

## Opcjonalne — każda wyłącza tylko swój fragment

| Zmienna | Bez niej | Skąd wziąć |
|---|---|---|
| `R2_ACCOUNT_ID` | Biblioteka mediów zgłasza brak konfiguracji zamiast błędu | Cloudflare → R2 → Overview |
| `R2_ACCESS_KEY_ID` | jw. | Cloudflare → R2 → Manage API tokens |
| `R2_SECRET_ACCESS_KEY` | jw. | jw. (pokazywany raz) |
| `R2_BUCKET` | jw. | nazwa bucketa |
| `R2_PUBLIC_URL` | jw. | domena publiczna bucketa, np. `https://media.osrodek-insieme.pl` |
| `RESEND_API_KEY` | Wyniki testów i powiadomienia **nie są wysyłane**; wszystko inne działa, zgłoszenia lądują w panelu | Resend → API Keys |
| `RESEND_FROM` | jw. | np. `Insieme <kontakt@osrodek-insieme.pl>` — domena musi być zweryfikowana w Resend |
| `NOTIFY_EMAIL` | Powiadomienia z formularza idą na adres z Ustawień | dowolna skrzynka ośrodka |
| `UPSTASH_REDIS_REST_URL` | **Brak limitowania — zostaje tylko honeypot.** Na produkcji ustaw. | Upstash → Redis → REST API |
| `UPSTASH_REDIS_REST_TOKEN` | jw. | jw. |
| `CRON_SECRET` | Endpoint retencji zwraca 503 i **nie usuwa niczego** | `openssl rand -hex 32` |
| `DATA_RETENTION_MONTHS` | Domyślnie `24` | decyzja ośrodka / IOD |
| `NEXT_PUBLIC_SITE_URL` | Domyślnie `https://osrodek-insieme.pl` | docelowa domena |

## Minimum, żeby uruchomić lokalnie

```bash
DATABASE_URL="postgres://..."
AUTH_SECRET="$(openssl rand -base64 32)"
```

Reszta jest opcjonalna — aplikacja wystartuje, a moduły bez konfiguracji powiedzą
o tym wprost zamiast wywracać się.

## Minimum na produkcję

Wszystkie wymagane **plus**: komplet `R2_*` (media), `RESEND_API_KEY` + `RESEND_FROM`
(wysyłka wyników i powiadomień), `UPSTASH_*` (ochrona formularzy) i `CRON_SECRET`
(retencja danych — bez niej dane osobowe nie są kasowane, co jest problemem RODO,
nie tylko techniczną niedoróbką).
