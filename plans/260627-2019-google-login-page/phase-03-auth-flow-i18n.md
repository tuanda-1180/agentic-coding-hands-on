# Phase 03 — Auth Flow, Route Guard & i18n (Track B)

**Status: COMPLETED**

**Track B · Parallel-runnable · No blockers.** Server logic + strings; independent of UI.

## MoMorph refs
- Login: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/GzbNeVGJHz
- Clarifications: ./clarifications.md

## Overview
- Priority: High
- Provide the Google sign-in server action, the authenticated-user route guard, and
  all i18n strings the Login UI needs.

## Key insights
- No `middleware.ts` exists → guard the login route in the page itself via `auth()`.
- `app/login/page.tsx` is a server component → can `await auth()` and `redirect("/")`.
- i18n: next-intl, cookie `NEXT_LOCALE`, default `vi`, locales `["vi","en"]`. `auth` namespace
  exists in `messages/{en,vi}.json`. Reuse existing `setLocale` action + `HeaderLangMenu`.

## Related code files
- Modify: `app/lib/auth/actions.ts` — add `signInWithGoogleAction()` (`"use server"`,
  `await signIn("google", { redirectTo: "/" })`, re-throw `NEXT_REDIRECT`, map errors).
- Modify: `messages/en.json` & `messages/vi.json` — extend `auth` namespace with:
  `loginWithGoogle`, `loginFailed`, `heroTitle` ("ROOT FURTHER"), `heroSubtitle`
  ("Bắt đầu hành trình của bạn cùng SAA 2025."), `heroTagline` ("Đăng nhập để khám phá!"),
  `copyright` ("Bản quyền thuộc về Sun* © 2025"). (Or place hero copy under existing `rootFurther`/`footer` namespaces — pick by convention.)
- Reuse: `app/components/i18n/locale-switch.ts` (`setLocale`), `HeaderLangMenu` for the selector.

## Implementation steps
1. Add `signInWithGoogleAction` to `actions.ts` mirroring `signInAction` error/redirect handling.
2. On Google auth failure/cancel, surface `auth.loginFailed` to the page (query param or thrown→caught state).
3. Add the route guard: in `app/login/page.tsx` server component, `const session = await auth();
   if (session) redirect("/")`.
4. Add the i18n keys above to both locale files (VN + EN), VN as default.

## Todo
- [x] signInWithGoogleAction in actions.ts
- [x] Authenticated-user redirect guard in login page
- [x] Add login/hero/footer i18n keys to en.json + vi.json
- [x] Failure message wired to UI

## Success criteria
- [x] Authenticated user visiting /login is redirected to /.
- [x] Google action redirects to / on success; failure path exposes localized error.
- [x] All visible Login text resolves via next-intl in both VN and EN.

## Deliverables
- `app/lib/auth/actions.ts` — added `signInWithGoogleAction()`
- `app/login/page.tsx` — server-side auth guard + `redirect("/")`
- `messages/en.json` — added login namespace keys
- `messages/vi.json` — added login namespace keys (default locale)

## Security
- Reuse open-redirect-safe pattern from `signInAction` (only relative `redirectTo`).
