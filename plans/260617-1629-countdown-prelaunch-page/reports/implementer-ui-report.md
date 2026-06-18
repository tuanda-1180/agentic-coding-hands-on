# Implementer UI Report — Countdown Prelaunch Page

## Files Created / Modified

| File | Action | Lines |
|------|--------|-------|
| `app/layout.tsx` | Modified | 34 |
| `app/globals.css` | Modified | 16 |
| `app/page.tsx` | Modified | 57 |
| `app/components/countdown/led-digit.tsx` | Created | 43 |
| `app/components/countdown/countdown-unit.tsx` | Created | 44 |
| `app/components/countdown/countdown-display.tsx` | Created | 50 |

## Prop Interfaces

### CountdownDisplay (integration seam)
```ts
interface CountdownDisplayProps {
  days: number;
  hours: number;
  minutes: number;
}
```
**Exactly matches spec.** Backend replaces mock values in `app/page.tsx` with a single-line change (one prop per unit swap).

### CountdownUnit
```ts
interface CountdownUnitProps {
  value: number;
  label: string;
}
```

### LedDigit
```ts
interface LedDigitProps {
  char: string;
}
```

## Font Wiring

- **Montserrat 700** loaded via `next/font/google` with `subsets: ["latin", "vietnamese"]`, exposed as CSS var `--font-montserrat`. Applied on `<html>` via `className` (variable class). Body CSS inherits via `font-family: var(--font-montserrat, sans-serif)` in `globals.css`.
- **DSEG7** loaded via `next/font/local` from `app/fonts/dseg7-classic-bold.woff2`, exposed as CSS var `--font-led`. Applied only inside `LedDigit` spans via inline style `fontFamily: "var(--font-led)"`.

## Background / Overlay Layering

In `app/page.tsx`:
1. **Root div**: `position: relative; width: 100%; height: 100vh; background-color: #00101A; overflow: hidden` — solid fallback color.
2. **Layer 1 — Background image**: `<Image src="/countdown-bg.png" fill style={{ objectFit: "cover" }} priority />` with no explicit `zIndex` (defaults to auto/0, sits behind positioned children).
3. **Layer 2 — Gradient overlay**: `position: absolute; inset: 0; zIndex: 1; background: linear-gradient(18deg, #00101A 15.48%, rgba(0,18,29,0.46) 52.13%, rgba(0,19,32,0.00) 63.41%)`.
4. **Layer 3 — Content**: `position: absolute; inset: 0; zIndex: 2; display: flex; alignItems: center; justifyContent: center` containing `<CountdownDisplay>`.

## Design Values Applied

All authoritative values from the spec were applied exactly:
- Frame background: `#00101A`
- Overlay gradient: 18deg, exact color stops
- Content gap (title → units row): `24px`
- Units row gap: `60px`
- Unit internal gap: `21px`
- Digit pair gap: `21px`
- LED box: 76.8×122.88px, border-radius 12px, border 0.75px solid `#FFEA9E`, gradient bg, opacity 0.5, backdropFilter blur(24.96px), -webkit prefix included
- Digit font: DSEG7, 73.7px, white, centered
- Title & label: Montserrat 700, 36px/48px, white
- Label: UPPERCASE
- Mock values: days=0 → "00", hours=5 → "05", minutes=20 → "20"

## Values Not Applied / Notes

- No values were impossible to apply. All spec values are encoded.
- `WebkitBackdropFilter` is not in React's `CSSProperties` type; extended the type locally in `led-digit.tsx` with a cast — this is correct and browser-compatible.
- `padded[0]` and `padded[1]` use nullish coalescing (`?? "0"`) to satisfy strict TypeScript (string indexing returns `string | undefined`).

## Build / Compile Result

Build could not be run due to shell permission restriction on the Bash tool at completion time. TypeScript correctness was verified by static code review:
- All props are typed; no `any` escapes
- `next/font/google` and `next/font/local` used per current docs pattern
- `next/image` with `fill` + `objectFit: "cover"` is the documented approach for full-coverage images
- All imports are relative within the `app/` directory
- No `useEffect`, no `useState`, no `'use client'` directive needed — all server components
