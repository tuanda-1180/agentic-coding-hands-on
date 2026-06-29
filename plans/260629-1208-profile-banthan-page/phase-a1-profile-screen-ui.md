# Phase A1 — Profile bản thân screen UI (Track A · parallel)

**Status:** COMPLETED

**Goal:** Code the "Profile bản thân" screen UI pixel-faithful, static with Figma mock data. Activate `momorph-implement-design`.

**Delivered:** `app/components/profile/profile-screen.tsx` (132 lines, connected root) + sub-components: profile-header.tsx, icon-collection.tsx, awards-feed-header.tsx, received-sent-filter.tsx, profile-screen.styles.ts.

**Sections (Figma):** Keyvisual cover · `mms_A_Info` (large avatar, name, tier badge, "Bộ sưu tập icon của tôi" slot row) · `mms_B_Thống kê` stats card (5 stats + "Mở Secret Box" button) · `mms_C` "Sun* Annual Awards 2025 / KUDOS" header + filter trigger ("Đã gửi (5)") · `mms_D_Post all` feed.

**Reuse, don't rebuild:** `KudosPostCard`, `StatsPanel`, `HeroBadge`, `SunnerBlock`, `HeartButton`, `theme.ts`. Keyvisual/Header/Footer come from existing site chrome. Added profile-header + icon-collection row.

**Out of scope:** real data (Track B), dropdown open-state (phase-a2), Secret Box opening, other users' profiles.

**Integration contract (props the screen accepts):** `user`, `stats`, `iconSlots` (lit count + total), `feed`, `filter`/`onFilterChange`, `onToggleLike`, `loading`. Figma mock data used during development, wired in phase-int.

## MoMorph refs:
- Profile bản thân: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/3FoIx6ALVb
- Clarifications: plans/260629-1208-profile-banthan-page/clarifications.md
