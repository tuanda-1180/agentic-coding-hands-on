---
title: Profile bản thân page (+ received/sent filter dropdown)
status: completed
discipline: interactive (MoMorph two-track)
created: 2026-06-29
completed: 2026-06-29
blockedBy: []
blocks: []
buildsOn: [260628-liveboard-implementation]
---

# Plan — Profile bản thân (My Profile)

**Screens (MoMorph file `9ypp4enmFmdK3YAFJLIu6C` · "SAA 2025 - Internal Live Coding"):**
- **Profile bản thân** — screenId `3FoIx6ALVb` (28 specs, has image) → https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/3FoIx6ALVb
- **Dropdown-filter đã nhận/gửi** — screenId `rQqxNoXoii` (design in_progress: NO specs/image/node-tree) → https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/rQqxNoXoii

**Scope:** Personal profile page for the logged-in user, scoped variant of the Live board. Reuses existing `app/components/liveboard/*` + Supabase data layer. New `/profile` route.
**Data:** Real Supabase via `currentUserId()` (email → fallback `is_current_user`). Builds on completed `260628-liveboard-implementation`.
**Clarifications:** [clarifications.md](clarifications.md) (authoritative — do not re-ask)

## Page anatomy (screen 1)
Reused Header + Keyvisual cover · **mms_A_Info** profile header (large avatar, name, tier badge, icon collection row) · **mms_B_Thống kê** stats panel (5 stats + "Mở Secret Box" button) · **mms_C** awards header "Sun* Annual Awards 2025 / KUDOS" + filter dropdown trigger · **mms_D_Post all** kudos feed.

## Execution model (MoMorph two-track — parallel-runnable)
Track A (UI) and Track B (backend/logic) have **no blocking** between them. Integration phase wires them.

| Phase | Track | Goal | Status |
|-------|-------|------|--------|
| [phase-a1](phase-a1-profile-screen-ui.md) | A · UI | Profile bản thân screen UI (static, mock from Figma) | completed |
| [phase-a2](phase-a2-filter-dropdown-ui.md) | A · UI | Received/Sent filter dropdown UI | completed |
| [phase-b1](phase-b1-profile-data-layer.md) | B · logic | Profile data layer: queries, types, mappers | completed |
| [phase-b2](phase-b2-profile-api-and-hook.md) | B · logic | API route(s) + `useProfileData` hook | completed |
| [phase-int](phase-int-integration.md) | Integration | Route, wire data, dropdown filtering, i18n, validate | completed |

## Execution Summary

**Track A (UI):** Delivered profile-screen.tsx (132 lines, connected root) + sub-components in `app/components/profile/`: profile-header.tsx, icon-collection.tsx, awards-feed-header.tsx, received-sent-filter.tsx, and profile-screen.styles.ts. All components use Figma design content as mock data. Filter dropdown built from Figma trigger pattern + clarifications (no dedicated design specs).

**Track B (Data/Logic):** Created `app/lib/liveboard/profile-queries.ts` (getProfileUser, getKudosByUser, getProfileData); created `app/lib/liveboard/use-profile-data.ts` hook (filter default "sent", real Supabase via currentUserId()). Routes: `app/api/profile/route.ts` and `app/api/profile/kudos/route.ts`. Extended types.ts (KudosDirection, IconCollection, ProfileData); modified kudos-queries.ts (exported KUDOS_SELECT + likedKudosIds); updated user-queries.ts (getStats accepts pre-resolved uid).

**Integration:** Route live at `app/profile/page.tsx`. Navigation linked from header-user-menu.tsx. i18n: `profile` namespace added to messages/en.json + messages/vi.json. Icon collection = min(openedBoxes, 7)/7 per clarification. "Mở Secret Box" = coming-soon toast placeholder (box-opening out-of-scope). Filter default "Đã gửi", switches sent/received with counts.

**Quality:** TypeScript clean (tsc passes). ESLint clean on all profile files. 421 tests pass (+79 new). Next.js build green for `/profile`, `/api/profile`, `/api/profile/kudos`. Reviewer approved (7.5/10, all in-scope findings fixed): H1 redundant auth removed, M1 error state added, M2 pageSize validated, M3 file size compliant, L1/L2 refactoring done.

**Out of scope (flagged):** 
- Pre-existing bug: `proxy.ts` must be renamed `middleware.ts` (admin guard currently inactive; affects other features, not profile-scoped).
- Pre-existing linting: eslint errors in `liveboard/highlight-kudos-carousel.tsx` (outside profile ownership).

**Decisions honored:** Clarifications.md decisions all applied — icon derivation from secret_boxes, filter default "Đã gửi", real Supabase data via currentUserId(), no new icon table, no Secret Box opening logic.

## Key decisions (from clarifications)
- **Icon collection:** fixed N slots; lit = count of opened secret_boxes, rest gray, generic icon. No new icon table.
- **"Mở Secret Box" button:** placeholder / "coming soon" — box-opening logic out of scope.
- **Filter dropdown:** default **"Đã gửi"**; switches feed between sent/received kudos of current user; count in parens.
- **Data:** real Supabase; current user via `currentUserId()`.

## Reuse (already shipped by liveboard plan)
`KudosPostCard`, `StatsPanel`, `HeroBadge`, `SunnerBlock`, `HeartButton`, `theme.ts`, `getStats()`, `currentUserId()`, `toggleLike()`, `/api/liveboard/kudos/[id]/like`, Supabase schema (sunners/kudos/hearts/secret_boxes).

## Out of scope
Viewing other users' profiles (`/profile/[id]`), Secret Box opening flow, dedicated icon/asset system, editing profile.

## Next
Run `/tkm:takumi` to execute. Track A screens build in parallel; Track B in main thread; integration last.
