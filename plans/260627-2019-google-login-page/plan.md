---
title: Google Login Page (SAA 2025)
status: completed
created: 2026-06-27
completed: 2026-06-27
screen: Login (MoMorph GzbNeVGJHz)
fileKey: 9ypp4enmFmdK3YAFJLIu6C
blockedBy: []
blocks: []
---

# Google Login Page — SAA 2025

Replace the existing credentials `/login` with the MoMorph "ROOT FURTHER" Login
screen: a Google OAuth sign-in with a minimal login-only header (logo + language
selector), abstract hero artwork, intro copy, and a copyright footer.

## MoMorph refs
- Login: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/GzbNeVGJHz
- Clarifications: ./clarifications.md

## Key decisions (see clarifications.md)
- Google OAuth added to existing NextAuth v5 (all Google accounts) — replaces credentials login UI.
- Successful login → redirect to `/` (homepage). `/todo` out of scope.
- `/login` stays a bare route; build login-specific minimal header + footer in-page.
- Hero artwork exported from Figma/MoMorph into `public/`.

## Two-track execution
Track A (UI) and Track B (backend/logic) run in parallel — no cross-blocking.
Integration (phase-04) wires them together and is the only convergence point.

## Phases
| Phase | Track | Title | Status | Depends on |
|-------|-------|-------|--------|------------|
| 01 | A (UI) | Login screen UI from Figma | completed | — |
| 02 | B (logic) | Google OAuth provider + env | completed | — |
| 03 | B (logic) | Auth flow, route guard & i18n strings | completed | — |
| 04 | Integration | Wire UI ↔ OAuth, states, footer/header | completed | 01, 02, 03 |

## Acceptance (from test cases)
- Unauthenticated user sees Login; authenticated user hitting /login → redirected to /.
- "LOGIN With Google" starts Google OAuth; button shows loading + disabled while processing.
- Success → user info in session, redirect to /; failure/cancel → error "Đăng nhập không thành công. Vui lòng thử lại."
- Header: logo top-left, language selector (VN default, VN/EN) top-right; footer copyright centered.
- Language switch updates UI (NEXT_LOCALE cookie), VN default.

## Out of scope
- `/todo` route, post-login app pages, account allowlist/domain restriction, sign-out UI changes.

## Implementation notes

**Redirect target:** Successful login redirects to `/` (homepage), not `/todo`. The `signInWithGoogleAction` 
safely handles `callbackUrl` and defaults to `/` if not provided.

**Review findings:**
- Removed dead `onLogin` prop from integration contract (no longer used in final implementation).
- `callbackUrl` handling now strict: only safe relative paths accepted, absolute redirects default to `/`.

**Pre-existing issues flagged (out of scope for this plan):**
- `proxy.ts` middleware guard for `/admin` is not loaded as `middleware.ts`; admin routes currently unprotected.
- `AdminContent` hook used in `app/admin/page.tsx` but not re-exported from component library — potential bundle issue.
