# Phase 01 — FAB states from design (Track A · UI)

**Track:** A · **blockedBy:** — · **Status:** ✓ completed (2026-06-23)

**Goal:** Make [fab.tsx](../../app/components/homepage/fab.tsx) match both design states exactly.

## Screen refs
- Closed pill: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/_hphd32jN2 (`_hphd32jN2`)
- Open state: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/Sv7DFwBw1h (`Sv7DFwBw1h`)
- Clarifications: [clarifications.md](clarifications.md)

## What changes
- **Closed (unchanged target):** yellow pill, pencil + `/` + lightning. Verify against `_hphd32jN2`; do not regress.
- **Open (rework):** replace the dark dropdown with **two stacked yellow action pills** —
  top **⚡ Thể lệ** (icon left), below **✏ Viết KUDOS** (icon left) — anchored bottom-right,
  above a **red circular × cancel button (56×56, white ×, soft shadow)** that sits where the
  trigger pill was (pill is hidden while open).
- Pull exact colors/sizes/spacing/icons from MoMorph design data — do **not** invent values.

## Out of scope
Navigation targets, /rules route, i18n keys (Track B / phase 03). Animation polish.

## Integration contract (for phase 03)
Open state renders the two action pills + cancel button. Action click handlers and the
cancel handler are passed in / wired in phase 03; keep `useDropdown` for open/close + a11y.
