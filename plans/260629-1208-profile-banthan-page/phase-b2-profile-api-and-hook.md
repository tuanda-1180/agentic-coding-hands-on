# Phase B2 — Profile API routes + client hook (Track B · parallel)

**Priority:** High · **Status:** COMPLETED · Depends on phase-b1 queries (same track, chained). No dependency on Track A.

## Context
Mirror the existing `app/api/liveboard/*` route + `use-liveboard-data.ts` hook pattern (client fetch, `force-dynamic`). Reuse the existing like endpoint `/api/liveboard/kudos/[id]/like` — do NOT duplicate.

## Requirements
1. **`GET /api/profile`** → `ProfileData` (user + stats + counts + iconCollection) via phase-b1 queries + `getStats()`. Returns 401-ish/empty shape when `currentUserId()` is null.
2. **`GET /api/profile/kudos?direction=received|sent&page=&pageSize=`** → `{ items, nextPage, total }` via `getKudosByUser`. Default `direction=sent` (matches dropdown default), `pageSize` consistent with liveboard.
3. **`useProfileData()`** hook in `app/lib/liveboard/use-profile-data.ts`:
   - On mount: fetch `/api/profile`.
   - Holds `filter` state (default `"sent"`); fetch `/api/profile/kudos?direction=<filter>&page=...` on filter change / load-more.
   - Exposes: `loading`, `error`, `user`, `stats`, `counts`, `iconCollection`, `feed`, `filter`, `setFilter`, pagination (`loadMore`/`nextPage`), `toggleLike` (reuse liveboard like POST + optimistic update logic).

## Delivered
- Created: `app/api/profile/route.ts` (GET /api/profile → ProfileData)
- Created: `app/api/profile/kudos/route.ts` (GET /api/profile/kudos?direction=sent|received&page=&pageSize=)
- Created: `app/lib/liveboard/use-profile-data.ts` (hook: filter state default "sent", real data fetch, like toggle, pagination)
- Reference: `app/api/liveboard/kudos/route.ts`, `app/api/liveboard/stats/route.ts`, `app/lib/liveboard/use-liveboard-data.ts`
- All files < 200 lines.

## Implementation Complete
✓ `GET /api/profile` — returns ProfileData (user + stats + counts + iconCollection), validates currentUserId()
✓ `GET /api/profile/kudos` — direction + pagination, default direction=sent, reuses like endpoint
✓ `useProfileData` hook — filter state, feed pagination, like toggle optimistic update, error handling
✓ Null-user / empty-feed fallback states handled

## Success criteria MET
Hook drives screen end-to-end: filter switch refetches correct direction; load-more paginates; like toggle persists; "can't like own kudos" enforced.

## Security
All Supabase access server-side. Validate `direction`/`page`/`pageSize`. No service_role key in client bundle.
