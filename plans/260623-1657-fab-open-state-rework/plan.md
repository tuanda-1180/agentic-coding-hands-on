---
status: completed
blockedBy: []
blocks: []
reuses: [260618-0942-homepage-saa]
created: 2026-06-23
completed: 2026-06-23
---

# Plan — FAB Open-State Rework

**Screens (MoMorph, fileKey `9ypp4enmFmdK3YAFJLIu6C`):**
- Closed pill: [Floating Action Button](https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/_hphd32jN2) (`_hphd32jN2`) · 3 specs
- Open state: [Floating Action Button 2](https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/Sv7DFwBw1h) (`Sv7DFwBw1h`) · 3 specs

**Decisions:** [clarifications.md](clarifications.md) · **Test cases:** none in MoMorph (rely on specs + design images)

The two screens are the **closed** and **open** states of the **one existing** FAB
component ([app/components/homepage/fab.tsx](../../app/components/homepage/fab.tsx)), built in the
completed homepage-saa plan. Its current open state is a **dark dropdown menu**, which does
**not** match the design. The design open state is **two stacked yellow action pills**
(⚡ Thể lệ, ✏ Viết KUDOS) above a **red circular × cancel button** (56×56) that replaces the
trigger pill. This plan reworks the open state to the design and fixes the Thể lệ target.

## Scope (confirmed)
**Visual rework only.** Match the design open state; keep route navigation. No modals, no
compose form, no rules content — `/kudos`, `/awards`, `/rules` stay stub routes.
- Viết KUDOS → `/kudos` (unchanged)
- Thể lệ → **new `/rules` stub** (was wrongly `/awards`)
- Cancel (×) → close the open panel
- Keep the existing `useDropdown` a11y (Esc / click-outside / keyboard).

## Out of scope
Kudos compose form, rules/awards page content, FAB animation polish, mobile-specific layout
beyond what the design shows.

## Two-track structure (MoMorph — parallel-runnable; integration joins at the end)
**Track A (UI)** = phase 01 (FAB closed + open states from design). **Track B (logic)** =
phase 02 (/rules stub + i18n + nav targets). No `blocks`/`blockedBy` between A and B.

| # | Phase | Track | blockedBy | Status |
|---|-------|-------|-----------|--------|
| 01 | [FAB states from design](phase-01-fab-ui.md) | A | — | ✓ completed |
| 02 | [/rules stub · i18n · nav wiring](phase-02-rules-i18n-nav.md) | B | — | ✓ completed |
| 03 | [Integration · a11y · verify](phase-03-integration.md) | A+B | 01,02 | ✓ completed |

## Cross-plan note
Refines the FAB delivered by the **completed** [homepage-saa plan](../260618-0942-homepage-saa/plan.md)
(phase-06). That plan is done → no blocking dependency; this reuses its `useDropdown` hook and
i18n setup.

## Key risks
1. **Closed pill must not regress** — only the open state changes; verify the closed pill still
   renders pencil + `/` + lightning per screen `_hphd32jN2`.
2. **a11y** — moving from a single dropdown menu to action pills + a cancel button must keep
   Esc / click-outside / focus-return working (reuse `useDropdown`).
3. **i18n** — `saaRules` label key reads "Thể lệ SAA"/"SAA Rules"; design label is just
   "Thể lệ"/"Rules". Confirm copy when wiring; add `nav.rules` + cancel aria-label keys.

## Execute
`/tkm:takumi plans/260623-1657-fab-open-state-rework/plan.md --parallel`
