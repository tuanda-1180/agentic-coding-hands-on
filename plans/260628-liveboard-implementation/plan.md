# Plan — Sun* Kudos Live board

**Screen:** Sun* Kudos - Live board · MoMorph `MaZUn5xHXZ` / file `9ypp4enmFmdK3YAFJLIu6C`
**Discipline:** interactive (MoMorph two-track) · **Scope:** UI + Supabase local backend · bilingual VI/EN
**Status:** ✅ COMPLETE (2026-06-28) · **Clarifications:** [clarifications.md](clarifications.md)

## Execution Summary

**DECISION CHANGE (mid-build):** Upgraded from mock API layer to **Supabase local (Postgres)** with deterministic seed data (48 sunners, 388 kudos, 6521 hearts, 10 gifts, 10 rank-ups, 6 secret boxes).

### Track A — UI Components ✅
- **15 components** in `app/components/liveboard/`, served at route **`/kudos`** (the Kudos screen IS the Live board; the standalone `/liveboard` route was removed and all nav already points to `/kudos`)
- **Bilingual:** `liveboard` i18n namespace (VI/EN)
- **Interactive:** heart toggle, copy-link toast, carousel, filters, fully-interactive Spotlight pan/zoom
- **Data source:** `useLiveboardData` hook (client fetch from `/api/liveboard/*`)
- **Status:** Complete

### Track B — Supabase Backend ✅
- **Database:** `supabase/` initialized; config.toml ports 553xx (coexist with other projects)
- **Schema:** `supabase/migrations/20260628113200_liveboard_schema.sql` — sunners, kudos, hearts, secret_boxes, gift_recipients, rank_ups; view kudos_with_hearts
- **Seed:** `supabase/seed.sql` — deterministic 48 sunners, 388 kudos, 6521 hearts, 10 gifts, 10 rank-ups, 6 secret boxes
- **Server client:** `app/lib/supabase/server-client.ts` (service_role, server-only)
- **Data layer:** `app/lib/liveboard/{types,mappers,kudos-queries,user-queries,use-liveboard-data}.ts`
- **Status:** Complete

### API Endpoints (Supabase-backed) ✅
| Method | Path | Returns | Status |
|--------|------|---------|--------|
| GET | `/api/liveboard/kudos?hashtag=&department=&page=&pageSize=` | Paginated Kudos `{ items, nextPage }` | ✅ |
| GET | `/api/liveboard/highlights?hashtag=&department=` | Top-5 Kudos | ✅ |
| GET | `/api/liveboard/spotlight` | `{ total, nodes }` (388 kudos) | ✅ |
| GET | `/api/liveboard/stats` | UserStats | ✅ |
| GET | `/api/liveboard/leaderboards` | Rank-ups + gifts | ✅ |
| GET | `/api/liveboard/filters` | Available filters | ✅ |
| POST | `/api/liveboard/kudos/[id]/like` | `{ likeCount, likedByMe }` | ✅ |

### Environment & Integration ✅
- `.env.local` + `.env.example`: NEXT_PUBLIC_SUPABASE_URL, ANON_KEY, SERVICE_ROLE_KEY
- `next.config.ts`: image remotePatterns (pravatar, picsum)
- **Verification:** `npm run build` PASS, `npm test` 342/342 PASS (35 new mapper tests), all 7 endpoints verified

### Review Findings ✅
- **Fixed before delivery:** server-only guard (H3), null-user like guard (H1), pagination validation→400 (H2), carousel index reset on filter (E3)
- **Status:** DONE_WITH_CONCERNS → all blockers resolved

## Deferred Items (acceptable for local mock; documented)
- M1, M2, M4: Perf of unbounded highlights/spotlight/filters fetches at scale
- M5: Rise leaderboard fetched but unused
- M6: kudos_with_hearts view unused
- No RLS policies (anon grants only; acceptable for local dev)

## Out of Scope (placeholder/no-op)
- Kudos submit dialog, Mở quà/Secret Box, kudos detail page, profile pages

## Completion Checklist
- [x] Track A UI components (15 components + page + i18n)
- [x] Track B Supabase backend (schema, seed, server client, queries)
- [x] API endpoints (7 routes, real data, pagination, filters)
- [x] Integration (UI → `useLiveboardData` → `/api` → Supabase)
- [x] Build verification (`npm run build` PASS)
- [x] Tests (342/342 PASS, 35 new mapper tests)
- [x] Review & fix blockers
