# Phase 02 — i18n · Panel State · FAB Rewire (Track B)

**Track:** B (logic) · **blockedBy:** none · **Priority:** High · **Status:** ✓ completed (2026-06-28)
**Screens:** b1Filzi9i6 (content) + _hphd32jN2 / Sv7DFwBw1h (FAB) — fileKey `9ypp4enmFmdK3YAFJLIu6C`
**Clarifications:** [clarifications.md](clarifications.md)

## Overview
Provide the data + behaviour layer the panel UI (phase 01) plugs into: bilingual copy, the
open/close state, and the FAB trigger change. Runs in parallel with Track A; no shared files.

## Key insights
- FAB already built ([fab.tsx](../../app/components/homepage/fab.tsx)); only the "Thể lệ" action
  changes from `router.push("/rules")` to opening the panel. Viết KUDOS / cancel untouched.
- **`homepage-screen.tsx` is a Server Component** (no `"use client"`) — it CANNOT hold the
  panel open/close state. Introduce a small client wrapper (e.g. `fab-with-rules.tsx`) that hosts
  the shared state and renders `<Fab onOpenRules={…} />` + `<RulesPanel open onClose … />` as
  siblings. homepage-screen swaps `<Fab />` for `<FabWithRules />`.
- **`useDropdown` is menu-semantics, NOT dialog.** It stamps `role="menu"` (menuProps) and
  `aria-haspopup="menu"` (triggerProps) ([use-dropdown.ts](../../app/components/ui/use-dropdown.ts)).
  Reuse it ONLY for the FAB (correct — it is a menu). The panel is a **dialog/drawer**: give it
  its own `role="dialog"` + `aria-modal` + Esc + click-outside + focus-trap (do NOT route the
  panel through `useDropdown.menuProps`).
- FAB integration: `<Fab>` gains an `onOpenRules` callback prop. The "Thể lệ" menuitem calls
  `close()` (its own menu) then `onOpenRules()`. It no longer navigates.
- i18n lives in [messages/vi.json](../../messages/vi.json) + [messages/en.json](../../messages/en.json);
  there is already a `fab` namespace and `nav.rules`. Add a new `rules` namespace.

## Requirements
1. **i18n `rules` namespace (VI + EN)** — title, two section headings + bodies, 4 Hero tiers
   (label + count line + description), 6 icon labels, Kudos Quốc Dân heading + body, footer
   buttons (`close`, `writeKudos`). VI verbatim from design; EN = faithful translation.
2. **Panel open/close state** — host in a **new client wrapper** (`fab-with-rules.tsx`) that
   renders FAB + panel as siblings (homepage-screen stays a Server Component). Esc / click-outside
   / Đóng close it; focus returns to the FAB trigger.
3. **FAB rewire** — add `onOpenRules` prop; "Thể lệ" menuitem calls `close()` then `onOpenRules()`
   instead of navigating; Viết KUDOS still → `/kudos`; cancel still closes the FAB menu.
4. **/rules route** — keep as stub or redirect to `/` (panel is the real surface). Document choice.

## Related code files
- Modify: `app/components/homepage/fab.tsx` (add `onOpenRules` prop),
  `app/components/homepage/homepage-screen.tsx` (swap `<Fab/>` → `<FabWithRules/>`),
  `messages/vi.json`, `messages/en.json`, `app/rules/page.tsx`
- Create: `app/components/homepage/fab-with-rules.tsx` (client wrapper, hosts panel state)

## Todo
- [ ] Add `rules` namespace to vi.json + en.json (all copy from design)
- [ ] Add panel open/close state + a11y hook usage
- [ ] Rewire FAB "Thể lệ" trigger to open panel
- [ ] Decide + implement /rules stub vs redirect
- [ ] Footer Viết KUDOS → close + `/kudos`

## Success criteria
- Both locales render full rules copy; FAB "Thể lệ" opens the panel (no navigation); Viết KUDOS
  and cancel behave as before; `/rules` no longer dead-ends. `npm run build` clean.

## Security
- Static copy only; no user input, no new data sources. No new attack surface.
