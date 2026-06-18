# Phase 01 — Homepage UI from design (Track A)

**Track:** A (UI) · **blockedBy:** none · **Status:** ✓ completed (2026-06-18)

**Goal:** Pixel-faithful presentational UI for Homepage SAA from the Figma design, driven by props with design mock data. Runs in parallel with all Track B phases.

**Screen:** Homepage SAA — https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/i87tDx10uM

**Sections (presentational components, mock data from design):**
header · hero "ROOT FURTHER" (title, "Coming soon", countdown slot, event info, CTA) · Root-Further content · awards grid (6 cards) · Sun\* Kudos promo · footer · floating action button.

**Out of scope (Track B wires these):** auth state, i18n strings, live countdown values, notification data, FAB actions, real navigation.

**Integration contracts (props/slots Track B fills):**
- Header: `authState` (guest/user/admin), `locale`, slots for notification + account menu + language switcher.
- Hero: renders the reused `CountdownDisplay`; `showComingSoon` prop.
- Award cards: array of `{ title, description, image, slug }`.

`momorph-implement-design` handles exact values at runtime. Keep components ≤200 lines, kebab-case. Mock data from Figma only — do not invent.
