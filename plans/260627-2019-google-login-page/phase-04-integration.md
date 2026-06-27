# Phase 04 — Integration

**Status: COMPLETED**

**Convergence point.** blockedBy: phase-01, phase-02, phase-03.
Wires the Track A UI to the Track B auth flow + i18n. No new feature work.

## MoMorph refs
- Login: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/GzbNeVGJHz
- Clarifications: ./clarifications.md

## Overview
- Priority: High
- Replace mock props in the Login UI with real auth/i18n; verify all test cases pass.

## Implementation steps
1. Make the Login button trigger `signInWithGoogleAction` (form action or client handler);
   bind `isLoading`/`disabled` to the pending state (`useFormStatus` or transition) per
   test cases (button disabled + loader while authenticating).
2. Replace hardcoded UI strings with next-intl `useTranslations`/`getTranslations` keys from phase-03.
3. Wire language selector to `setLocale` + `router.refresh()` (reuse `HeaderLangMenu` behavior).
4. Render localized `auth.loginFailed` error when Google auth fails/cancels.
5. Confirm `/login` remains in `BARE_ROUTES` (site-chrome.tsx) — login uses its own minimal header/footer.
6. Confirm hero artwork asset is present in `public/saa/` and referenced via `next/image`.

## Todo
- [x] Login button → Google OAuth action + loading/disabled state
- [x] UI strings replaced with i18n keys (VN/EN)
- [x] Language selector wired (cookie + refresh)
- [x] Error message rendered on failure
- [x] Authenticated-user redirect verified
- [x] Hero asset wired
- [x] Run lint + tests (nvm v22.20.0 for Next 16); delegate to tester agent

## Success criteria
- [x] All 149 test cases pass (suite expansion from initial 17 test case spec):
  layout (header/footer/hero/button), language default+dropdown, OAuth start, loading state, 
  success→/, failure error, auth-user redirect.

## Test Results
- **149/149 passing** — all test suites green
- No lint errors or type issues
- Code review completed; no blocking concerns

## Deliverables
- Integration complete: UI wired to `signInWithGoogleAction`
- Error messaging: `auth.loginFailed` localized on failure
- Language selector: `setLocale` + router refresh functional in both VN/EN
- Route guard: authenticated users redirected from `/login` to `/`
- Hero artwork: `keyvisual-bg.png` + `root-further-logo.png` + `logo-header.png` assets in use
