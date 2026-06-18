# Phase 06 — FAB + awards-card navigation (Track B)

**Track:** B (logic) · **blockedBy:** 02 · **Status:** ✓ completed (2026-06-18)

**Goal:** Floating action button quick-actions, awards-card hash navigation, and shared dropdown a11y.

## FAB quick actions (spec item 6, ID-54)
- Fixed bottom-right pill (105×64), pencil + SAA icons.
- Click → quick-action menu with available options (define concrete actions; e.g. create kudos / shortcuts). Confirm action list at forge.

## Awards cards data + navigation (C2, ID-47..52, 62)
- Data for 6 categories: `{ title, description, image, slug }` — Top Talent, Top Project, Top Project Leader, Best Manager, Signature 2025-Creator, MVP.
- Click image / title / "Chi tiết" → navigate to `/awards#<slug>` (Awards Information stub from Phase 02). Missing slug → `/awards` without scroll (ID-62).
- Hover lift/glow is a Track A visual concern; the link targets/handlers are here.

## Shared dropdown a11y (ID-30..35)
- Reusable dropdown/menu behavior used by FAB, account menu, language, notifications:
  open/close toggle, **Enter/Space** to open, **Esc** to close, **click-outside** to close, focus management.

## Success criteria
FAB opens its menu; each award card routes to `/awards#slug`; all menus support keyboard + click-outside; build clean.

## Out of scope
Awards Information page content (separate plan). Visual styling of cards/FAB (Track A).
