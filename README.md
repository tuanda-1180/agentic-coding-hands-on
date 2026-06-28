# Takumi — Sun* Asterisk Awards Homepage

Prelaunch homepage for Sun* Asterisk Awards (SAA). Includes a hero section with a live countdown, navigation, awards/kudos sections, notifications, and a standalone `/countdown` route. Built with Next.js 16 + Turbopack, React 19, Tailwind v4, TypeScript.

## Requirements

- Node 20.9+ (Next.js 16 requires it — default shell may be older, use nvm)

```bash
nvm use 22
```

## Configuration

Copy `.env.example` and fill in the values:

```bash
cp .env.example .env.local
```

Key variables:

```
NEXT_PUBLIC_LAUNCH_DATE="2026-12-31T00:00:00+07:00"  # ISO 8601, any timezone offset
AUTH_SECRET=                                            # generate: openssl rand -base64 32
AUTH_GOOGLE_ID=                                         # Google OAuth client ID
AUTH_GOOGLE_SECRET=                                     # Google OAuth client secret
```

`NEXT_PUBLIC_LAUNCH_DATE` — if unset or unparseable, the countdown falls back to a short relative
duration from page load (`COUNTDOWN_DURATION_SECONDS`, default 7s) so it visibly ticks during demos.

Demo seed credentials are documented in `.env.example`. Do not put real credentials in docs or env files.

## Routes

| Path | Description |
|------|-------------|
| `/` | Homepage SAA (header, hero+countdown, root-further, awards, kudos, footer, FAB) |
| `/countdown` | Standalone full-viewport countdown page |
| `/login` | Google OAuth sign-in (NextAuth v5); credentials provider available in dev only |
| `/admin` | Admin stub — requires authenticated session with `role: admin` |
| `/awards` | Award System page (SAA 2025) — keyvisual hero, scroll-spy category nav, 6 award sections, Sun* Kudos promo |
| `/kudos` | Kudos stub |
| `/rules` | 308 permanentRedirect → `/`; Rules content is an overlay panel on the homepage opened via the FAB |
| `/api/notifications` | GET (list), PATCH bulk mark-as-read |
| `/api/notifications/[id]` | PATCH mark single notification as read |

## Auth

NextAuth v5 (beta), JWT sessions. Role claim (`regular` \| `admin`) is stored in the JWT and
forwarded to the session. The `proxy.ts` file (Next.js 16 renamed `middleware.ts`) guards
`/admin/*` — unauthenticated or non-admin requests redirect to `/login?callbackUrl=…`.

**Primary sign-in: Google OAuth.** Configure `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` (see
`.env.example`). OAuth users receive `role: regular`. An authenticated user visiting `/login` is
redirected to `/`.

**Credentials provider (dev only):** mock user store at `app/lib/auth/users.ts` — no database.
Replace `verifyCredentials` with a real DB query (e.g. Prisma) when ready. Demo seed credentials
are documented in `.env.example`.

## i18n

next-intl 4.x in "without routing" mode — locale is stored in the `NEXT_LOCALE` cookie, not the URL.
Default locale: `vi`. Supported: `vi`, `en`. Message files: `messages/{vi,en}.json`.

No locale-prefix rewrites are applied in `proxy.ts` (adding next-intl middleware would rewrite every
request to a locale path and 404 the whole app in this mode).

## Shared UI Hooks

Reusable hooks live in `app/components/ui/`:

| Hook | Purpose |
|------|---------|
| `use-dialog.ts` | Accessible modal/overlay state — open/close, Esc key, backdrop click, focus trap |
| `use-dropdown.ts` | Dropdown open/close with outside-click and keyboard dismiss |
| `use-scroll-spy.ts` | Active section tracking for scroll-linked nav |

## Notifications

In-memory store keyed by user email (`app/lib/notifications/store.ts`). API routes require an
authenticated session and serve only the current user's notifications. `resetStore()` is exported for
test isolation only.

## Countdown display constraint

The LED digit boxes support a maximum of two digits per unit. Days are clamped to `[0, 99]`.
Default fallback date is set to 45 days from the hardcoded seed date to stay within the two-digit
range. See `app/lib/countdown-config.ts`.

## Development

```bash
npm install
npm run dev      # http://localhost:3000  (Turbopack)
npm run build    # production build
npm run start    # serve production build
npm run lint     # eslint
npm test         # vitest (scoped to app/**)
```
