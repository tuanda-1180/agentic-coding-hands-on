# Phase 01 — Language Dropdown UI Alignment (Track A)

**Status:** COMPLETED  
**Screen:** Dropdown-ngôn ngữ — https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/hUyaaugye2
**Clarifications:** ./clarifications.md

## Goal
Restyle the open dropdown in [header-lang-menu.tsx](../../app/components/homepage/header-lang-menu.tsx) to match the Figma frame.

## Steps
1. Add `public/saa/flag-uk.svg` (Union Jack), sized/styled like `flag-vn.svg` (~20px square viewBox).
2. In `header-lang-menu.tsx`, replace the menu-item list so each item is a 110×56 box:
   - flag icon + 2-letter code (`VN` / `EN`), white text.
   - selected locale → dark-grey bg + distinct style; other → black bg.
   - hover → highlight bg.
   - `aria-label` keeps full name ("Tiếng Việt" / "English").
3. Both items show their flag (VN flag for VN, new UK flag for EN).
4. Keep `useDropdown` wiring, `setLocale` + `router.refresh()`, and the trigger pill unchanged.

## Out of scope
- Trigger pill restyle, new locales, locale-persistence changes.

## Integration contract
- No backend/Track B dependency. Reuses existing `setLocale` server action and `useDropdown` hook as-is.

## Success criteria
- Matches design (stacked VN/EN, flags + codes, grey selected / black option, ~110×56).
- `next build` + `next lint` pass; keyboard a11y intact.

## Completion Summary (2026-06-28)

**All deliverables verified:**
- ✓ ESLint clean
- ✓ TypeScript clean (`tsc`)
- ✓ 200/200 vitest tests passing
- ✓ `next build` succeeds
- ✓ Code review DONE_WITH_CONCERNS (all concerns addressed)

**Files Created/Modified:**
- `public/saa/flag-uk.svg` — Union Jack SVG (20×15 viewBox, matches flag-vn.svg style)
- `app/components/homepage/header-lang-menu.tsx` — Restyled open dropdown:
  - Stacked 110×56 items (VN selected / EN option)
  - Flag icon + 2-letter code (VN/EN), white text
  - Grey background for selected, black for option
  - Hover highlight styling
  - Extracted `LangMenuItem` component + `LANG_OPTIONS` map
  - `aria-label` preserves full language names ("Tiếng Việt" / "English")
  - `aria-current` only set when selected
  - `aria-hidden={true}` on icons
- `app/components/ui/use-dropdown.ts` — Enhanced with ArrowUp/ArrowDown roving navigation (from review feedback; not in original plan but critical for keyboard a11y)
  - LOCALES derived from `Object.keys()` for proper typing

**Design Alignment:** Open dropdown fully matches Figma frame with all interactive and accessibility requirements met.
