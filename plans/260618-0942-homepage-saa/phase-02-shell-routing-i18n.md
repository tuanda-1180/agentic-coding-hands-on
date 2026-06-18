# Phase 02 — App shell · routing · i18n (Track B)

**Track:** B (logic) · **blockedBy:** none (first B phase) · **Status:** ✓ completed (2026-06-18)

**Goal:** Establish the app shell, route map, and real VN/EN i18n — the foundation the other Track B phases build on.

## Step 1 — Compatibility (RESOLVED — see research/researcher-compat-report.md)
- **`next-intl@4.13.0`** (v3.x is INCOMPATIBLE with Next 16).
- ⚠️ **Next 16 renamed `middleware.ts` → `proxy.ts`** — the next-intl middleware MUST be exported from `proxy.ts`, not `middleware.ts` (silent failure otherwise).
- Files: `i18n/routing.ts` (`defineRouting({ locales:['vi','en'], defaultLocale:'vi', localePrefix:'as-needed' })`), `i18n/request.ts` (`getRequestConfig`), `proxy.ts` (`createMiddleware(routing)`), `next.config.ts` wrapped with `createNextIntlPlugin('./i18n/request.ts')`.
- `localePrefix: 'as-needed'` → `/` for default `vi`, `/en/...` for English (keeps `/` clean).
- `NextIntlClientProvider` + `setRequestLocale` in the root layout; existing `/` (countdown) and `/countdown` must still build under i18n.

## Routing
- `/` → Homepage SAA (replaces current countdown home — see Phase 07 integration).
- `/countdown` → existing standalone prelaunch countdown (keep).
- Stub routes (placeholder "coming soon" pages so links don't 404): `/awards` (Awards Information), `/kudos` (Sun\* Kudos). Footer "Tiêu chuẩn chung" → stub or anchor.
- "About SAA 2025" header/footer link → scroll-to-top / `#about` anchor on `/`.
- Logo (header & footer) → `/` + scroll to top.

## i18n
- `next-intl` setup: VN (default) + EN message catalogs (`messages/vi.json`, `messages/en.json`).
- Extract homepage strings to catalogs (VN content from design; EN translations).
- Locale persistence (cookie) + language switcher logic exposed to the header (Phase 07 wires UI).
- Test cases: ID-24/25/26/58 — VN/EN only, switch changes interface language.

## Requirements
- Functional: route map resolves; no broken links (ID-59); switching locale re-renders content.
- Non-functional: keep files ≤200 lines; locale routing must not break SSR/static for `/`.

## Success criteria
All routes resolve (no 404 on nav links); language switch toggles VN↔EN content; build clean.

## Out of scope
Auth, countdown, notifications, FAB (later phases). Full Awards/Kudos page content (separate plans).
