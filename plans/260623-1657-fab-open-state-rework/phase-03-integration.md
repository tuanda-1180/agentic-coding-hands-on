# Phase 03 — Integration · a11y · verify (Track A+B)

**Track:** A+B · **blockedBy:** 01, 02 · **Status:** ✓ completed (2026-06-23)

**Goal:** Wire the design open-state UI (phase 01) to the nav targets + cancel (phase 02),
preserving a11y, then verify against both screens.

## Steps
1. **Wire handlers** — in [fab.tsx](../../app/components/homepage/fab.tsx): Thể lệ pill →
   `router.push("/rules")`, Viết KUDOS pill → `router.push("/kudos")`, × cancel → `close()`.
2. **a11y (reuse `useDropdown`)** — open/close toggle, **Enter/Space** to open, **Esc** to
   close + return focus to trigger, **click-outside** to close. Each action pill + the cancel
   button is keyboard-focusable with a clear aria-label. (FAB UX note from homepage plan:
   call `close()` before `push()` so the panel isn't left open on the next route.)
3. **Verify** — closed pill matches `_hphd32jN2`; open state (2 pills + red × cancel) matches
   `Sv7DFwBw1h`; both VN/EN labels correct; `tsc --noEmit` clean; `npm run build` succeeds;
   existing FAB tests still pass.

## Success criteria
Pill opens → two yellow action pills + red × cancel; each pill routes correctly; × closes;
keyboard + click-outside work; VN/EN copy correct; build + tests clean.

## Out of scope
New tests for routing beyond existing coverage (add only if trivial); page content.
