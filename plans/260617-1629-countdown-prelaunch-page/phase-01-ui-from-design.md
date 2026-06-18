# Phase 01 — UI from design (Track A)

**Status:** ✓ COMPLETED

**Goal:** Pixel-faithful presentational UI for the Countdown prelaunch screen, driven by props with design mock data (00/05/20).

**Owns:** `app/layout.tsx`, `app/globals.css`, `app/page.tsx`, `app/components/countdown/*`, `app/fonts/*`.

**Out of scope:** countdown tick logic, env config, real time (Track B).

**Integration contract:** export `CountdownDisplay` accepting `{ days: number; hours: number; minutes: number }`; render zero-padded two-digit LED units DAYS/HOURS/MINUTES.

**Completed artifacts:**
- `app/layout.tsx`: Montserrat + DSEG7 font loading (Google + local WOFF2)
- `app/globals.css`: Tailwind base + font declarations
- `app/page.tsx`: full-viewport layout (layered bg/overlay/content)
- `app/components/countdown/{led-digit,countdown-unit,countdown-display}.tsx`: pixel-faithful LED components
- `app/fonts/dseg7-classic-bold.woff2`: LED font asset
- `public/countdown-bg.png`: background artwork

See [plan.md](plan.md) for authoritative design values.
