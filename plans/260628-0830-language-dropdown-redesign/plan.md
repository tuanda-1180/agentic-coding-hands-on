---
title: Language Dropdown Redesign (VN/EN)
status: completed
created: 2026-06-28
mode: fast
screen: hUyaaugye2
fileKey: 9ypp4enmFmdK3YAFJLIu6C
blockedBy: []
blocks: []
---

# Language Dropdown Redesign (VN/EN)

Align the existing header language switcher's **open dropdown** to the MoMorph
`Dropdown-ngôn ngữ` design: two stacked 110×56 items with flag + 2-letter code
(VN selected / EN option), grey-vs-black item backgrounds.

## MoMorph refs
- Dropdown-ngôn ngữ: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/hUyaaugye2
- Clarifications: ./clarifications.md

## Context

The switcher already works end-to-end — no backend/logic work needed:
- UI: [header-lang-menu.tsx](../../app/components/homepage/header-lang-menu.tsx) (trigger pill + dropdown)
- a11y hook: [use-dropdown.ts](../../app/components/ui/use-dropdown.ts)
- locale persistence: [locale-switch.ts](../../app/components/i18n/locale-switch.ts) (cookie `NEXT_LOCALE`)
- mounted in [site-header.tsx](../../app/components/homepage/site-header.tsx) + [login-header.tsx](../../app/components/login/login-header.tsx)

This is a **pure UI-alignment** task. The only logic touched is presentational.
There is no Track B (backend) — only Track A (UI) + one new asset.

## Decisions (see clarifications.md)
- Add new `public/saa/flag-uk.svg` for English.
- Restyle **open menu items only**; keep the existing trigger pill unchanged.
- Items use flag + 2-letter code (VN / EN); full language name kept in `aria-label`.

## Design spec (from MoMorph specs)
- Item A.1 (VN, selected): top, dark-grey bg, VN flag + "VN".
- Item A.2 (EN, option): bottom, black bg, UK flag + "EN", 110×56px.
- Item interactions: hover highlight; selected item visually distinct.
- Click an item → set locale, close menu, refresh (already wired).

## Phases

| # | Phase | Status |
|---|-------|--------|
| 01 | [Language dropdown UI alignment](./phase-01-language-dropdown-ui.md) | completed |

## Out of scope
- Closed-state trigger pill redesign (frame doesn't depict it).
- Adding new locales beyond vi/en.
- Changing the cookie/locale persistence mechanism.

## Success criteria
- Open dropdown matches design: stacked VN/EN items, flag + code, grey selected / black option, ~110×56.
- New `flag-uk.svg` renders for the EN item.
- Keyboard a11y (Esc/click-outside/focus) still works via `useDropdown`.
- `next build` + `next lint` pass; existing tests unaffected.
