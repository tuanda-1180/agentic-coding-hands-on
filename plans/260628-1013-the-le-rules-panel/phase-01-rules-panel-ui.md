# Phase 01 — Thể lệ Panel UI (Track A)

**Status:** ✓ completed (2026-06-28)

**Screen:** Thể lệ UPDATE — https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/b1Filzi9i6
**fileKey:** `9ypp4enmFmdK3YAFJLIu6C` · **screenId:** `b1Filzi9i6`
**Clarifications:** [clarifications.md](clarifications.md)

**Goal:** Build the dark right-anchored Thể lệ overlay panel pixel-perfect from design as a
presentational component (`app/components/homepage/rules-panel.tsx`).

**Use `momorph-implement-design` skill.** Use Figma design content as mock data — do NOT invent
data. Export the 4 Hero badge images (New/Rising/Super/Legend) + 6 collectible icons (Revival,
Touch of Light, Stay Gold, Flow to Horizon, Beyond the Boundary, Root Further) from the design
into `public/saa/`.

**Out of scope:** open/close state, i18n wiring, FAB integration (Track B / phase 03). Render with
static copy from design; expose props so phase 03 can inject i18n strings + `onClose`/`onWriteKudos`.

**Integration contract (props expected):** `{ open?: boolean; onClose: () => void; onWriteKudos:
() => void }` — panel content (titles, badge tiers, icon labels, body copy) consumed via
`useTranslations("rules")` keys added in phase 02; footer buttons call the two callbacks.
