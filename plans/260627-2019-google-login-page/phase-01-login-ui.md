# Phase 01 — Login Screen UI (Track A)

**Status: COMPLETED**

**Track A · Parallel-runnable · No blockers.** Handled at `tkm:takumi` time by
`momorph-implement-design` (one screen). Use Figma content as mock data; do NOT invent data.

## MoMorph refs
- Login: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/GzbNeVGJHz
- Clarifications: ./clarifications.md

## Goal
Build the pixel-faithful Login UI at `app/login/page.tsx` (+ sub-components under
`app/components/login/`): minimal header (logo left, language selector right),
full-bleed hero wave artwork, intro block ("ROOT FURTHER" + subtitle + tagline),
yellow "LOGIN With Google" button with Google icon, centered copyright footer.

## Out of scope
- OAuth wiring, redirect logic, route guard (Track B / phase-04).
- Language-switch server action and i18n string sourcing (Track B / phase-04).
- Real auth state — render presentational button with `onClick`/`disabled` props only.

## Integration contract (props expected from Track B)
- `isLoading: boolean`, `errorMessage?: string`.
- Header language selector reuses existing `HeaderLangMenu` pattern.
- Export hero artwork asset from Figma into `public/saa/`.

## Deliverables
- `app/login/page.tsx` — main login server component with auth guard
- `app/components/login/login-header.tsx` — minimal header (logo + lang selector)
- `app/components/login/login-hero.tsx` — hero section with artwork + copy
- `app/components/login/login-button.tsx` — Google OAuth button component
- `app/components/login/login-footer.tsx` — copyright footer
- `app/components/login/google-login-form.tsx` — form wrapper for action binding
- `public/saa/google-icon.svg` — Google icon asset
- Reused: `public/saa/keyvisual-bg.png`, `root-further-logo.png`, `logo-header.png`
