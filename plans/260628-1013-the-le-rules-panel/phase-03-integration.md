# Phase 03 — Integration · a11y · Verify (Track A + B)

**Track:** A+B · **blockedBy:** phase 01, phase 02 · **Priority:** High · **Status:** ✓ completed (2026-06-28)
**Clarifications:** [clarifications.md](clarifications.md)
**Screens:** b1Filzi9i6 + _hphd32jN2 + Sv7DFwBw1h — fileKey `9ypp4enmFmdK3YAFJLIu6C`

## Overview
Join Track A (panel UI) with Track B (i18n + state + FAB rewire). Replace the panel's static copy
with `useTranslations("rules")`, wire `open` / `onClose` / `onWriteKudos` to the FAB-driven state,
finalize a11y, and verify against all three design screens.

## Integration steps
1. Mount the panel as a sibling of the FAB inside the `fab-with-rules.tsx` client wrapper
   (homepage-screen stays a Server Component); drive `open` from the shared state from phase 02.
2. Replace phase-01 mock strings with the `rules` i18n keys (VI + EN).
3. Wire footer: Đóng → `onClose`; Viết KUDOS → close + `router.push("/kudos")`.
4. FAB "Thể lệ" → set `open=true`; confirm closed/open pill visuals + Viết KUDOS + red × cancel
   still match screens `_hphd32jN2` / `Sv7DFwBw1h` (no regression).

## a11y / behaviour
> The panel is a **dialog/drawer**, not a menu — implement its a11y directly. Do NOT route it
> through `useDropdown.menuProps` (that stamps `role="menu"`). `useDropdown` stays on the FAB only.
- [ ] `role="dialog"` + `aria-modal="true"` + `aria-labelledby` the title; focus moves into panel on open
- [ ] Esc closes panel; focus returns to the FAB trigger
- [ ] Click-outside / backdrop closes panel
- [ ] Focus-trap inside panel while open (Tab cycles within)
- [ ] Panel scrolls internally when content exceeds viewport height (footer stays reachable)
- [ ] Responsive: full-width on small screens, ~520px anchored right on desktop

## Success criteria
- Panel matches screen `b1Filzi9i6` (sections, badges, 6 icons, footer) in VI and EN.
- FAB screens `_hphd32jN2` / `Sv7DFwBw1h` unchanged; Thể lệ opens panel, no route navigation.
- All a11y items pass; `npm run build` clean; visual validation loop against the 3 design images.

## Risk / mitigation
- Scroll-lock vs page scroll conflict → lock body scroll only while panel open.
- Focus-trap vs existing FAB focus-return → verify both flows independently (panel dialog trap
  vs FAB menu focus-return); they are separate mechanisms, do not share `useDropdown`.

## Next steps
Run tests (`tester`), review (`reviewer`), then commit on `feat/the-le-rules-panel`.
