# Reviewer Report — Countdown Prelaunch Page

**Date:** 2026-06-17
**Verdict:** CHANGES-REQUESTED
**Score:** 7/10
**Issues:** 1 critical · 3 major · 4 minor

---

## Scope

| File | LOC | Status |
|------|-----|--------|
| `app/page.tsx` | 50 | reviewed |
| `app/layout.tsx` | 35 | reviewed |
| `app/globals.css` | 17 | reviewed |
| `app/components/countdown/countdown-display.tsx` | 53 | reviewed |
| `app/components/countdown/countdown-unit.tsx` | 43 | reviewed |
| `app/components/countdown/led-digit.tsx` | 60 | reviewed |
| `app/components/countdown/countdown-live.tsx` | 16 | reviewed |
| `app/lib/use-countdown.ts` | 60 | reviewed |
| `app/lib/countdown-config.ts` | 29 | reviewed |
| `app/lib/__tests__/countdown.test.ts` | 314 | reviewed |

Build: clean (`next build` exits 0, TypeScript passes, ESLint clean on `app/`)
Tests: 39/39 countdown tests pass

---

## Critical Issues

### C1 — Days display silently truncates when value ≥ 100
**File:** `app/components/countdown/countdown-unit.tsx:9`
**Severity:** Critical

```ts
const padded = String(value).padStart(2, "0");
const first = padded[0] ?? "0";
const second = padded[1] ?? "0";
```

`padStart(2)` does nothing when the string is already ≥ 2 chars. For `value=100`, `padded="100"`, `first="1"`, `second="0"` — the display shows `10` instead of `100`. For `value=365`, shows `36`.

**Impact is immediate**: the default launch date (`2026-12-31`) is **196 days** from today (2026-06-17). On first deploy, DAYS shows `19` instead of `196`. The page is visually broken from launch.

Neither `computeCountdown` (which correctly computes large days) nor any test covers the display layer. The fix must clamp, overflow-display, or split into more digit boxes. Two options:

Option A — cap display at 99 (same 2-box layout):
```ts
const clamped = Math.min(value, 99);
const padded = String(clamped).padStart(2, "0");
// shows "99" when >= 100, consistent with spec "display shows 00–99"
```

Option B — render 3 digit boxes when value >= 100 (layout change). Only viable if design accommodates it.

The spec does not state a max-days display cap, so clarification with the team is needed, but Option A is the safe short-term fix.

---

## High Priority

### H1 — `useCountdown` in SSR: initial render shows 00:00:00 then snaps to real value (visible flash)
**File:** `app/lib/use-countdown.ts:50`
**Severity:** High (UX)

The `useState(ZERO)` initializes at zero on SSR and on the first client render. After hydration, `useEffect` fires and sets the real value. On a fast connection this is imperceptible, but on slow networks or with SSR caching the user sees `00 00 00` flash to e.g. `196 14 30`. The comment in the code acknowledges this is intentional for hydration safety — that is correct — but the snap can be jarring.

Mitigation option: use `suppressHydrationWarning` on the root container and initialize via `useState(() => computeCountdown(targetMs, Date.now()))` only on the client, or accept the flash as a documented trade-off. Either way, the current approach is safe (no hydration mismatch) but the flash should be a conscious product decision.

### H2 — `countdown-unit.tsx`: `alignItems: "flex-start"` misaligns label under digits
**File:** `app/components/countdown/countdown-unit.tsx:18`
**Severity:** High (design fidelity)

```tsx
<div style={{ display: "flex", flexDirection: "column", gap: "21px", alignItems: "flex-start" }}>
```

The unit column is left-aligned. The label (`MINUTES`, `HOURS`, `DAYS`) renders at full text width below the digit pair. `MINUTES` at Montserrat 700 36px is wider (~205px) than two digit boxes + gap (76.8×2 + 21 = 174.6px). The label will overflow left-aligned while the digit pair stays at its own width. The design shows labels centered beneath their digit pair — `alignItems: "center"` is needed.

```tsx
// fix
<div style={{ display: "flex", flexDirection: "column", gap: "21px", alignItems: "center" }}>
```

### H3 — `Montserrat` loaded with `weight: "700"` only (string, not array)
**File:** `app/layout.tsx:6`
**Severity:** High (design fidelity / font rendering fallback)

```ts
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "vietnamese"],
  weight: "700",
});
```

Next.js `next/font/google` accepts `weight` as a string or array. A single `"700"` string works correctly for loading Bold only — this is intentional and matches the design (only bold is used). No bug here but note that if any element falls back to Montserrat without explicit `font-weight: 700`, it will render with no matching glyph (the only loaded weight is 700). All usages in the codebase explicitly set `fontWeight: 700`, so this is safe as-is.

**Reclassified to Minor** on closer review — no actual defect.

---

## Medium Priority

### M1 — `use-countdown.ts` has redundant `"use client"` directive
**File:** `app/lib/use-countdown.ts:1`

The file uses `useEffect` and `useState` — it must be client-only. The directive is correct and not harmful. But it is a library utility, not a component, and the convention in Next.js App Router is that `"use client"` belongs on components that are entry points into the client bundle, not on utility hook files. The hook's client-only nature is already enforced by React (calling `useEffect` on the server throws at runtime). The directive here is redundant but prevents accidental SSR import of the hooks — acceptable either way.

### M2 — `countdown-live.tsx` `useMemo` wraps a pure function with no reactive deps
**File:** `app/components/countdown/countdown-live.tsx:13`

```ts
const target = useMemo(() => getLaunchDate(), []);
```

`getLaunchDate()` reads `process.env.NEXT_PUBLIC_LAUNCH_DATE` which is inlined at build time — it is a constant. A single `const target = getLaunchDate()` at module or component level is equivalent. `useMemo` with `[]` adds allocator overhead with no benefit. Low-impact.

### M3 — Ghost glyph `"8"` is hardcoded without aria-label
**File:** `app/components/countdown/led-digit.tsx:53`

```tsx
<span style={{ ...glyphBase, opacity: 0.18 }} aria-hidden>
  8
</span>
```

`aria-hidden` (without `={true}`) is treated as the string `"aria-hidden"` in HTML, which evaluates to truthy but is technically the wrong form. Should be `aria-hidden="true"` or `aria-hidden={true}` in JSX. With React 19, JSX boolean shorthand `aria-hidden` is coerced to `true` by the JSX transform for `aria-*` attributes — so it works, but the explicit `={true}` form is clearer.

---

## Minor Issues

### m1 — No defensive display cap on `hours` and `minutes` in `CountdownUnit`
**File:** `app/components/countdown/countdown-unit.tsx`

`computeCountdown` guarantees hours ∈ 0–23 and minutes ∈ 0–59, so overflow cannot occur via the normal hook path. However, `CountdownUnit` accepts `value: number` with no type narrowing — if it were ever called with an out-of-range value directly (e.g., in Storybook, test harness), the truncation bug from C1 would silently apply. A comment documenting the invariant expectation would help.

### m2 — `countdown-config.ts`: no ISO 8601 format validation beyond `Date` parse
**File:** `app/lib/countdown-config.ts:26`

`new Date(raw)` accepts many non-ISO formats (e.g., `"December 31, 2026"`, relative locale strings). The clarification specifies ISO 8601, but the parser doesn't enforce that. In practice this is low-risk since the env var is operator-controlled, not user-supplied.

### m3 — Background image `alt=""` is correct (decorative)
**File:** `app/page.tsx:20`

Positive note: `alt=""` is the correct accessibility pattern for decorative images. No issue.

### m4 — `next.config.ts` is empty
**File:** `next.config.ts`

No `images.domains`, no headers, no rewrites configured. For a page that uses only local images (`/countdown-bg.png`) and no external image sources, this is correct and no config is needed.

---

## Edge Cases Found

| Case | Status | Notes |
|------|--------|-------|
| Past launch date (countdown complete) | Correct | Clamped to ZERO, freezes at 00:00:00 |
| Invalid/missing env var | Correct | Falls back to DEFAULT_LAUNCH_DATE |
| NaN/Infinity from `new Date(invalid)` | Correct | `computeCountdown` guards on `Number.isFinite` |
| Days >= 100 (display layer) | **Bug (C1)** | `padStart(2)` truncates to 2 chars, shows wrong value |
| Hours > 23 or minutes > 59 (display layer) | Protected | `computeCountdown` output is always in range |
| Interval cleanup on unmount | Correct | `clearInterval` in `useEffect` return |
| Hydration mismatch | Correct (with flash) | `useState(ZERO)` on SSR, real value after mount |
| XSS via env var | Safe | Value flows to `new Date()`, never rendered as HTML |

---

## Design Fidelity vs plan.md

| Property | Spec | Code | Match |
|---|---|---|---|
| Background color | `#00101A` | `#00101A` | ✓ |
| Overlay gradient | `linear-gradient(18deg, #00101A 15.48%, rgba(0,18,29,.46) 52.13%, rgba(0,19,32,0) 63.41%)` | Exact match | ✓ |
| Title font | Montserrat 700 36px/48px white center | Exact match | ✓ |
| Title text | "Sự kiện sẽ bắt đầu sau" | Exact match | ✓ |
| Column gap (title→row) | 24px | `gap: "24px"` | ✓ |
| Row gap (units) | 60px | `gap: "60px"` | ✓ |
| Unit column gap (digits→label) | 21px | `gap: "21px"` | ✓ |
| Digit-pair gap | 21px | `gap: "21px"` | ✓ |
| Box dims | 76.8 × 122.88px | Exact match | ✓ |
| Box radius | 12px | `borderRadius: "12px"` | ✓ |
| Box border | 0.75px `#FFEA9E` | `border: "0.75px solid #FFEA9E"` | ✓ |
| Box gradient | `linear-gradient(180deg, #FFF, rgba(255,255,255,.1))` | Exact match | ✓ |
| Box opacity | 0.5 (on box, not digit) | `opacity: 0.5` on `boxStyle` absolute layer, glyph is sibling | ✓ |
| Backdrop blur | 24.96px | `blur(24.96px)` + `-webkit-` prefix | ✓ |
| Digit font | DSEG7-Classic Bold | `var(--font-led)` → `dseg7-classic-bold.woff2` | ✓ |
| Digit font size | ~73.7px | `"73.7px"` | ✓ |
| Label font | Montserrat 700 36px uppercase | Exact match | ✓ |
| Unit column align | — (inferred center from design) | `flex-start` | **?** (H2) |
| Layering z-index | bg → overlay → content | z:auto → z:1 → z:2 | ✓ |

---

## Architecture / Standards

| Check | Result |
|---|---|
| Kebab-case file names | ✓ |
| Files < 200 lines | ✓ (max 60 lines) |
| Presentational vs logic separation | ✓ clean seam at `countdown-live.tsx` |
| DRY/KISS/YAGNI | ✓ — no over-engineering |
| Auth (none needed per spec) | ✓ |
| No secrets in source | ✓ `.env*` in `.gitignore`, `.env.example` is safe |
| NEXT_PUBLIC_ env usage | ✓ build-time inlined, no runtime secret leakage |
| N+1 / DB queries | N/A — no backend |
| TypeScript strict mode | ✓ `"strict": true` in tsconfig |

---

## Positive Observations

- `computeCountdown` is exported as a pure function and has excellent unit test coverage (39 tests, all passing)
- `Number.isFinite` guard on both inputs is thorough
- Hydration safety is correctly handled (SSR → ZERO, then client tick)
- `"use client"` boundary at `countdown-live.tsx` is clean — all server components above it are pure RSC
- `WebkitBackdropFilter` polyfill included for Safari compatibility
- `aria-hidden` on ghost glyph prevents screen reader noise
- `.env.example` documents the env var without exposing secrets
- `clearInterval` cleanup in `useEffect` is correct
- Overlay `rgba(0,19,32,0.00)` transparent stop precisely matches design

---

## Recommended Actions (prioritized)

1. **[Critical — fix before deploy]** `countdown-unit.tsx:9` — Handle days ≥ 100. With default launch date 196 days out, this bug is visible immediately. Minimum fix: `Math.min(value, 99)` with a comment. Better: clarify with product whether to show 3 digits or cap at 99.

2. **[High — fix before deploy]** `countdown-unit.tsx:18` — Change `alignItems: "flex-start"` to `alignItems: "center"` so labels center beneath their digit pair (MINUTES is wider than 2 digit boxes).

3. **[Medium — post-deploy]** `countdown-live.tsx:13` — Replace `useMemo(() => getLaunchDate(), [])` with a simple `const target = getLaunchDate()` outside the component body (module-level constant), since it's a build-time constant.

4. **[Low — optional]** `led-digit.tsx:53` — Change `aria-hidden` to `aria-hidden={true}` for JSX explicitness.

---

## Metrics

- Type coverage: 100% (strict mode, no `any` usage)
- Test coverage (logic layer): high — 39 tests for `computeCountdown`, `parseLaunchDate`, `getLaunchDate`
- Test coverage (display layer): 0 — `CountdownUnit`, `LedDigit`, `CountdownDisplay` have no tests
- ESLint issues (app/): 0
- Build: passing
- Linting issues (unrelated .cjs hook tests): pre-existing, out of scope
