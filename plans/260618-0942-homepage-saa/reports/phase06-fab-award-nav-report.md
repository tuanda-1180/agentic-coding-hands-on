# Phase 06 — FAB quick-actions + award hash-navigation + shared dropdown a11y

**Status:** DONE  
**Date:** 2026-06-18

---

## Files Created

| File | Lines | Purpose |
|------|-------|---------|
| `app/lib/awards/award-href.ts` | 9 | Pure helper: `awardHref(slug?) → string` |
| `app/lib/__tests__/award-href.test.ts` | 46 | Unit tests for award-href (7 tests) |
| `app/components/ui/use-dropdown.ts` | 151 | Shared dropdown a11y hook |

## Files Modified

| File | Change |
|------|--------|
| `app/components/homepage/fab.tsx` | Replaced placeholder menu with real quick-action menu wired to `useDropdown` + `useRouter` |
| `app/components/homepage/award-card.tsx` | Import `awardHref`, changed `slug` prop to optional, replaced raw template literals with `awardHref(slug)` |

---

## Shared Dropdown Hook API (`app/components/ui/use-dropdown.ts`)

**Phase 07 (header menus) can reuse this directly.**

```ts
import { useDropdown } from "@/app/components/ui/use-dropdown";

const { isOpen, triggerRef, menuRef, toggle, close, triggerProps, menuProps } =
  useDropdown({ onOpen?, onClose? });
```

| Return | Type | Purpose |
|--------|------|---------|
| `isOpen` | `boolean` | Current open/close state |
| `triggerRef` | `RefObject<HTMLButtonElement>` | Attach to trigger element |
| `menuRef` | `RefObject<HTMLElement>` | Attach to menu container |
| `toggle()` | `() => void` | Toggle open/close |
| `close()` | `() => void` | Explicitly close |
| `triggerProps` | object | Spread onto `<button>` trigger: `aria-haspopup="menu"`, `aria-expanded`, `onClick`, `onKeyDown` |
| `menuProps` | object | Spread onto menu container: `role="menu"`, `onKeyDown` |

**Keyboard behaviour:**
- **Enter / Space** on trigger → open, focus first focusable item
- **Escape** inside menu → close, return focus to trigger
- **Click outside** → close

---

## FAB quick-actions

Trigger button: pill (106×64), bottom-right fixed, `#FFEA9E` background.  
Menu: dark (`rgba(16,20,23,0.95)`) anchored to `bottom: calc(100% + 8px) right: 0`.

| Action | Icon | Navigation |
|--------|------|-----------|
| Viết Kudos | `/saa/fab-pen.svg` | `router.push("/kudos")` |
| Thể lệ SAA | `/saa/fab-kudos.svg` | `router.push("/awards")` |

---

## Award href behaviour

`awardHref(slug?)`:
- `"top-talent"` → `/awards#top-talent`
- `undefined` or `""` → `/awards`

Both image link and "Chi tiết" link in `AwardCard` use `awardHref(slug)`.  
`slug` prop on `AwardCardProps` widened to `slug?: string` (was `string`).  
`awards-section.tsx` unchanged — all 6 cards already have slugs defined.

---

## Test Results

```
Test Files  4 passed (4)
     Tests  84 passed (84)   (+7 new)
```

## TypeScript + Build

```
tsc --noEmit   → clean (no output)
npm run build  → ✓ Compiled successfully (11 pages, including /preview-homepage)
```
