---
status: completed
blockedBy: []
blocks: []
reuses: [260617-1629-countdown-prelaunch-page]
completed: 2026-06-18
---

# Plan — Homepage SAA

**Screen:** Homepage SAA · [MoMorph](https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/i87tDx10uM) (screenId `i87tDx10uM`, fileKey `9ypp4enmFmdK3YAFJLIu6C`)
**Decisions:** [clarifications.md](clarifications.md) · **Specs:** 46 items · **Test cases:** 62

The SAA 2025 marketing landing page at `/`: sticky header, "ROOT FURTHER" hero with
event countdown, Root-Further content, awards grid (6 cards), Sun\* Kudos promo, footer,
floating action button. Adapts to auth state (public / logged-in / admin) and language (VN/EN).

## Scope (confirmed)
Real **auth** (login, session, roles regular+admin), real **i18n** (VN default + EN),
full **notifications** (data + panel + badge), full **FAB** quick-actions, awards-card
hash navigation. `/` = Homepage; standalone countdown stays at `/countdown`; Awards
Information / Sun\* Kudos are **stub routes** (separate plans); "About SAA" = scroll anchor.

## Tech stack (proposed — confirm at forge)
- Next.js 16 App Router · React 19 · Tailwind v4 · TS (existing).
- **i18n:** `next-intl` (App Router). VN default. *Risk: verify Next 16 compat first.*
- **Auth:** Auth.js v5 (NextAuth) Credentials provider, JWT session, role claim. *Risk: verify Next 16 compat.*
- **Data:** mock data layer (seed users + notifications) via Route Handlers; **no DB** (swappable to Postgres/Prisma later).
- **Countdown:** REUSE `app/lib/use-countdown.ts` + `app/components/countdown/*` from the
  completed [countdown-prelaunch plan](../260617-1629-countdown-prelaunch-page/plan.md);
  extend to configurable units (hero = DAYS/HOURS/MINUTES per spec, no seconds) + hide
  "Coming soon" on completion.

## Cross-plan note
Builds on the **completed** countdown-prelaunch-page plan. Reuses its countdown component
and **reassigns the home route**: `/` becomes Homepage SAA; the prelaunch countdown moves
to `/countdown` (route already created). No blocking dependency (that plan is done).

## Two-track structure (MoMorph — parallel-runnable; integration joins at the end)
**Track A (UI)** = phase 01 (presentational homepage from design, mock data).
**Track B (logic)** = phases 02→06 (chained). No `blocks`/`blockedBy` between A and B.

| # | Phase | Track | blockedBy | Status |
|---|-------|-------|-----------|--------|
| 01 | [Homepage UI from design](phase-01-homepage-ui.md) | A | — | ✓ completed |
| 02 | [App shell · routing · i18n](phase-02-shell-routing-i18n.md) | B | — | ✓ completed |
| 03 | [Authentication + roles](phase-03-auth.md) | B | 02 | ✓ completed |
| 04 | [Countdown integration (reuse)](phase-04-countdown-integration.md) | B | 02 | ✓ completed |
| 05 | [Notifications](phase-05-notifications.md) | B | 03 | ✓ completed |
| 06 | [FAB + awards-card navigation](phase-06-fab-and-award-nav.md) | B | 02 | ✓ completed |
| 07 | [Integration · temper · deliver](phase-07-integration.md) | A+B | 01,04,05,06 | ✓ completed |

## Key risks
1. **Next 16 compatibility** of `next-intl` and Auth.js v5 — verify against `node_modules/next/dist/docs` + library docs before building (phases 02/03 step 1).
2. **Scope size** — auth + i18n + notifications are each substantial; consider extracting to sub-plans if forge reveals depth. Mock-data approach contains this.
3. **Linked pages** (Awards Information, Sun\* Kudos) are stubs only — full screens are separate plans; award hash-anchors target `/awards#slug` which won't scroll until that page exists.

## Execute
`/tkm:takumi plans/260618-0942-homepage-saa/plan.md --parallel`
