# Phase 07 Fix-Pass Report

Date: 2026-06-18

## Fixes Applied

### Fix 1 — Internal links → next/link (ESLint no-html-link-for-pages)

**Files touched:**
- `app/components/homepage/site-header.tsx` — Added `Link` import; replaced bare `<a href="/">` (logo) and `<a href="/awards">`, `<a href="/kudos">` with `<Link>`. Hash anchor `#about` kept as `<a>` (scroll target, not a route).
- `app/components/homepage/site-footer.tsx` — Added `Link` import; replaced logo `<a href="/">` with `<Link>`; updated nav links render logic to use `<Link>` for pure `/awards` and `/kudos` routes, `<a>` for hash/anchor hrefs (`#about`, `/awards#criteria`).

Result: All 3 `no-html-link-for-pages` ESLint errors gone.

### Fix 2 — Post-login redirect honors callbackUrl

**Files touched:**
- `app/lib/auth/actions.ts` — `signInAction` reads `callbackUrl` from FormData; validates it must start with `/` and not `//` (open-redirect guard); passes as `redirectTo` to `signIn()`, defaulting to `/`.
- `app/login/page.tsx` — Page is now async server component; reads `callbackUrl` from `searchParams`; passes it to `LoginForm` which renders a hidden `<input name="callbackUrl">` so the server action receives it.

### Fix 3 — Notification bell a11y (menuProps spread)

**File touched:**
- `app/components/homepage/header-notif-bell.tsx` — Destructured `menuProps` from `useDropdown()` return; spread `{...menuProps}` onto the panel container `<div>`. This gives the panel `role="menu"` and the Escape-to-close `onKeyDown` handler, matching the pattern in `header-lang-menu.tsx` and `header-user-menu.tsx`.

### Fix 4 — #about anchor target

**File touched:**
- `app/components/homepage/hero-section.tsx` — Added `id="about"` to the root `<section>` element. The header nav item already linked to `#about`; now has a valid scroll target.

### Fix 5 — Remove stray setRequestLocale

**Files touched:**
- `app/admin/page.tsx` — Removed `setRequestLocale(locale)` call, `getLocale()` call, and their imports (`next-intl/server` import reduced to nothing needed from server).
- `app/awards/page.tsx` — Removed `setRequestLocale(locale)`, `getLocale()`, and `next-intl/server` import entirely.
- `app/kudos/page.tsx` — Removed `setRequestLocale(locale)`, `getLocale()`, and `next-intl/server` import entirely.

### proxy.ts status

Untouched — confirmed by `git diff --name-only | grep proxy` returning no output.

## Verification Results

| Check | Result |
|-------|--------|
| `npm run lint` (app/ only) | PASS — 0 errors in app/ (3 link errors gone; use-notifications.ts error is pre-existing, out of scope) |
| `tsc --noEmit` | PASS — no output (clean) |
| `npm test` | PASS — 84/84 tests |
| `npm run build` | PASS — compiled successfully, all 10 routes generated |
| Smoke `/` | 200 |
| Smoke `/admin` (no redirect follow) | 307 |
| `proxy.ts` untouched | confirmed |

## Notes

- The `use-notifications.ts` lint error (`setState synchronously in effect`) is pre-existing and out of scope per task instructions ("don't touch notifications store").
- The `.claude/hooks/*.cjs` lint errors are pre-existing CommonJS files not part of the app/ scope.
- The smoke test `UntrustedHost` log is expected — Auth.js requires `NEXTAUTH_URL` to match the host; this is a local dev environment artifact, not a regression.
