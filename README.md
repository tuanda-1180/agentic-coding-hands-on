# Takumi — Sun* Asterisk Awards Homepage

Prelaunch homepage for Sun* Asterisk Awards (SAA): a hero section with a live countdown,
navigation, awards/kudos sections, notifications, a public award system page, the Sun* Kudos
live board, and user profiles. Built with Next.js 16 + Turbopack, React 19, TypeScript,
next-intl, NextAuth v5, and Supabase. Styling is plain CSS — inline `style` objects plus a small
set of custom classes and a base reset in `app/globals.css` (no CSS framework).

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
NEXT_PUBLIC_SITE_URL="http://localhost:3000"           # public origin (no trailing slash) — metadata, robots, sitemap
NEXT_PUBLIC_LAUNCH_DATE="2026-12-31T00:00:00+07:00"    # ISO 8601, any timezone offset
AUTH_SECRET=                                            # generate: openssl rand -base64 32
AUTH_GOOGLE_ID=                                         # Google OAuth client ID
AUTH_GOOGLE_SECRET=                                     # Google OAuth client secret
NEXT_PUBLIC_SUPABASE_URL=                               # Supabase API URL (from `supabase start`)
NEXT_PUBLIC_SUPABASE_ANON_KEY=                          # Supabase anon key
SUPABASE_SERVICE_ROLE_KEY=                              # server-only — bypasses RLS, never expose to the client
```

`NEXT_PUBLIC_SITE_URL` — used for `metadataBase`, canonical/OpenGraph URLs, `robots.txt`, and
`sitemap.xml`. Set it to the real deployment origin in production.

`NEXT_PUBLIC_LAUNCH_DATE` — if unset or unparseable, the countdown falls back to a short relative
duration from page load (`COUNTDOWN_DURATION_SECONDS`, default 7s) so it visibly ticks during demos.

Supabase: start the local stack with `supabase start` (ports shifted to 553xx in
`supabase/config.toml`); it prints the API URL and keys to copy here. Demo seed credentials are
documented in `.env.example`. Do not put real credentials in docs or env files.

## Routes

| Path | Description |
|------|-------------|
| `/` | Homepage SAA (header, hero+countdown, root-further, awards, kudos, footer, FAB) |
| `/countdown` | Standalone full-viewport countdown page |
| `/login` | Google OAuth sign-in (NextAuth v5); credentials provider available in dev only |
| `/admin` | Admin stub — requires authenticated session with `role: admin` (redirects to `/login` otherwise) |
| `/awards` | Award System page (SAA 2025) — keyvisual hero, scroll-spy category nav, 6 award sections, Sun* Kudos promo |
| `/kudos` | **Sun* Kudos Live Board** — banner, highlight carousel, spotlight word-cloud, all-kudos feed, sidebar stats + leaderboard |
| `/rules` | 308 `permanentRedirect` → `/`; Rules content is an overlay panel on the homepage opened via the FAB |
| `/profile` | Profile page — personal view of the signed-in user's kudos (received/sent filter, icon collection, stats) |
| `/profile/[id]` | Public profile page — view any user's profile (reached from avatar hover card); hides secret-box stats and personal-only actions |
| `/robots.txt` | Generated from `app/robots.ts` |
| `/sitemap.xml` | Generated from `app/sitemap.ts` |
| `/api/notifications` | GET (list), PATCH bulk mark-as-read |
| `/api/notifications/[id]` | PATCH mark single notification as read |
| `/api/liveboard/*` | GET endpoints: filters, highlights, kudos, leaderboards, spotlight, stats |
| `/api/liveboard/kudos/[id]/like` | POST — toggle like on a kudos |
| `/api/kudos` | POST (create), and `/api/kudos/[id]` PATCH (edit own); `/api/kudos/upload` image upload |
| `/api/secret-boxes` | GET (list), `/api/secret-boxes/open` POST — open a secret box (auth required) |
| `/api/profile` | GET — profile user data for the signed-in user |
| `/api/profile/kudos` | GET `?direction=received\|sent&page=&pageSize=` — paginated kudos feed |
| `/api/sunners/search` | GET — recipient search for the kudos composer |
| `/api/users/[id]/profile` | GET — public profile header + stats + icon collection for any user (secret-box counts zeroed); 400 invalid UUID, 404 unknown user |
| `/api/users/[id]/kudos` | GET `?direction=received\|sent&page=&pageSize=` — paginated kudos for any user |
| `/api/users/[id]/summary` | GET — kudos received/sent counts for the avatar hover card |

> The Sun* Kudos Live Board is served at **`/kudos`** (`app/kudos/page.tsx` renders
> `LiveboardScreen`). There is no `/liveboard` page route; the `/api/liveboard/*` handlers are the
> live board's data API.

## Auth

NextAuth v5 (beta), JWT sessions. Role claim (`regular` \| `admin`) is stored in the JWT and
forwarded to the session. The `proxy.ts` file (Next.js 16 renamed `middleware.ts`) guards
`/admin/*` — unauthenticated or non-admin requests redirect to `/login?callbackUrl=…`.

**Primary sign-in: Google OAuth.** Configure `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` (see
`.env.example`). OAuth users receive `role: regular` and their Google avatar
(`lh3.googleusercontent.com`). An authenticated user visiting `/login` is redirected to `/`.

**Credentials provider (dev only):** mock user store at `app/lib/auth/users.ts` — no database.
Replace `verifyCredentials` with a real DB query (e.g. Prisma) when ready. Demo seed credentials
are documented in `.env.example`.

## i18n

next-intl 4.x in "without routing" mode — locale is stored in the `NEXT_LOCALE` cookie, not the URL.
Default locale: `vi`. Supported: `vi`, `en`. Message files: `messages/{vi,en}.json`.

No locale-prefix rewrites are applied in `proxy.ts` (adding next-intl middleware would rewrite every
request to a locale path and 404 the whole app in this mode).

## SEO & metadata

- **Base metadata** (`app/layout.tsx`): title template (`%s · Sun* Asterisk Awards`), description,
  `metadataBase`, OpenGraph, and Twitter card. Shared identity lives in `app/lib/site-config.ts`
  (`SITE_URL`, `SITE_NAME`, `SITE_DESCRIPTION`).
- **Dynamic metadata** (`app/profile/[id]/page.tsx`): `generateMetadata` sets a per-user title,
  description, and OG image (the user's avatar). The profile fetch is deduped with React `cache()`
  so metadata and the page share one query.
- **`app/robots.ts`** → `/robots.txt`: allows public pages, disallows `/admin`, `/api/`, `/profile`.
- **`app/sitemap.ts`** → `/sitemap.xml`: lists the public static pages (`/`, `/awards`,
  `/countdown`). Per-user profiles are intentionally excluded.

## Error & loading UI (App Router special files)

| File | Purpose |
|------|---------|
| `app/loading.tsx` | Suspense fallback shown during navigation/streaming |
| `app/error.tsx` | Segment error boundary (Client Component; uses Next 16 `unstable_retry`) |
| `app/global-error.tsx` | Last-resort boundary that replaces the root layout |
| `app/not-found.tsx` | Custom 404, localized, returned for `notFound()` and unmatched routes |

Copy for these lives under the `errors` namespace in `messages/{vi,en}.json`.

## Security headers

`next.config.ts` sets response headers on every path:

- **Content-Security-Policy** — `default-src 'self'`; allows inline styles/scripts, the configured
  image hosts (pravatar/picsum/`*.googleusercontent.com`/Supabase), Supabase + Google for
  `connect-src`, and Google for OAuth `frame-src`/`form-action`; `frame-ancestors 'none'`.
  `'unsafe-eval'` is added to `script-src` **only in development** (React dev mode requires it);
  production stays eval-free.
- **X-Frame-Options** `DENY`, **X-Content-Type-Options** `nosniff`,
  **Referrer-Policy** `strict-origin-when-cross-origin`, **Permissions-Policy** (camera/mic/geo off),
  **Strict-Transport-Security**.

> Changes to `next.config.ts` require restarting the dev server to take effect.

## Shared UI Hooks

Reusable hooks live in `app/components/ui/`:

| Hook | Purpose |
|------|---------|
| `use-dialog.ts` | Accessible modal/overlay state — open/close, Esc key, backdrop click, focus trap |
| `use-dropdown.ts` | Dropdown open/close with outside-click and keyboard dismiss |
| `use-portal-dropdown.ts` | Dropdown rendered through a portal (escapes overflow/stacking contexts) |
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
npm run lint     # eslint (app code; .claude/ tooling and .venv are ignored)
npm test         # vitest (scoped to app/**)
```
