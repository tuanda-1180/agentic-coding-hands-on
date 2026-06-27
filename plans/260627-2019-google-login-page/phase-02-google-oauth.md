# Phase 02 — Google OAuth Provider (Track B)

**Status: COMPLETED**

**Track B · Parallel-runnable · No blockers.** Backend config; independent of UI.

## MoMorph refs
- Login: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/GzbNeVGJHz
- Clarifications: ./clarifications.md

## Overview
- Priority: High
- Add Google as a NextAuth v5 provider alongside (replacing the UI use of) Credentials.
  All Google accounts allowed — no domain/allowlist restriction.

## Key insights
- Existing config: `auth.ts` (NextAuth v5 beta, JWT sessions, `pages.signIn: "/login"`,
  `jwt`/`session` callbacks persisting `role`).
- Google profiles have no `role` → default new OAuth users to `role: "regular"` in the `jwt` callback.

## Related code files
- Modify: `auth.ts` — add `GoogleProvider` to `providers`; in `jwt` callback set
  `token.role ??= "regular"` when signing in via Google (no `user.role` present).
- Create: `.env.local` entries (not committed): `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_SECRET`.
- Modify: `.env.example` — document the three vars.
- Existing `app/api/auth/[...nextauth]/route.ts` already delegates to `handlers` — no change.

## Implementation steps
1. `import Google from "next-auth/providers/google"`; add `Google({ allowDangerousEmailAccountLinking: true })`
   to `providers` (keep Credentials provider for admin/dev login).
2. In `jwt` callback, when `user` set and `user.role` absent → `token.role = "regular"`.
3. Confirm `session` callback still maps `token.role` → `session.user.role`.
4. Document required Google Cloud OAuth redirect URI: `{origin}/api/auth/callback/google`.

## Todo
- [x] Add Google provider to auth.ts
- [x] Default role for OAuth users in jwt callback
- [x] Add env vars to .env.example + local .env.local
- [x] Verify next-auth google provider API in node_modules/next docs / next-auth docs

## Success criteria
- [x] `signIn("google")` initiates Google OAuth; on success a JWT session with `role: "regular"` is created.

## Deliverables
- `auth.ts` — added `GoogleProvider({ allowDangerousEmailAccountLinking: true })`
- JWT callback — sets `token.role ??= "regular"` for OAuth users
- `.env.example` — documented `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_SECRET`

## Security
- Secrets only in `.env.local` (never committed). Restrict redirect URIs in Google Cloud console.
