# Phase B1 — Profile data layer (Track B · parallel)

**Priority:** High · **Status:** COMPLETED · Backend/logic for the profile page. Runs independently of Track A.

## Context
Builds on completed `260628-liveboard-implementation`. Reuse existing server queries; add only what's profile-specific. All queries use `app/lib/supabase/server-client.ts` (service_role, server-only) and `currentUserId()` from `app/lib/liveboard/user-queries.ts`.

## Key insights
- `getStats(userId)` already returns exactly the 5 numbers the stats panel needs (kudosReceived, kudosSent, heartsReceived, secretBoxOpened, secretBoxUnopened) — **reuse as-is**.
- `currentUserId()` already resolves the logged-in user (email → fallback `is_current_user`).
- Existing `getFeed()` filters by hashtag/department, NOT by sender/receiver — needs a new direction-aware query.
- `toKudos()` / `toSunner()` mappers already exist — reuse.

## Requirements
1. **`getProfileUser(userId)`** in `user-queries.ts` (or new `profile-queries.ts`): fetch the `sunners` row → map via `toSunner()` (gives name, avatar, department, tier badge from `star_count`/`title`).
2. **`getKudosByUser(userId, direction, page, pageSize)`** in new `app/lib/liveboard/profile-queries.ts`: paginated kudos where `receiver_id = userId` (direction `received`) or `sender_id = userId` (direction `sent`); order by `created_at desc`; map via `toKudos()` with current user's liked ids. Return `{ items, nextPage, total }`.
3. **`getKudosCounts(userId)`**: `{ received, sent }` totals for the dropdown labels (can reuse counts already in `getStats`).
4. **`getIconCollection(userId)`**: derive from secret boxes — `{ unlocked: <count of opened boxes>, total: <fixed N, e.g. 7 per design row> }`. No new table.

## Types (extend `app/lib/liveboard/types.ts`)
- `KudosDirection = "received" | "sent"`
- `ProfileData = { user: Sunner; stats: Stats; counts: { received: number; sent: number }; iconCollection: { unlocked: number; total: number } }`

## Delivered
- Created: `app/lib/liveboard/profile-queries.ts` (getProfileUser, getKudosByUser, getProfileData)
- Modified: `app/lib/liveboard/types.ts` (added KudosDirection, IconCollection, ProfileData)
- Modified: `app/lib/liveboard/user-queries.ts` (getStats accepts pre-resolved uid)
- Modified: `app/lib/liveboard/kudos-queries.ts` (exported KUDOS_SELECT + likedKudosIds)
- All files < 200 lines (split as needed).

## Implementation Complete
✓ Added `KudosDirection`, `ProfileData` to types.ts
✓ `getProfileUser(userId)` — fetches sunners row, maps via toSunner()
✓ `getKudosByUser(userId, direction, page, pageSize)` — paginated kudos, direction-aware
✓ `getProfileData(userId)` — combines user, stats, counts, icon collection
✓ Icon collection derived from secret_boxes: unlocked = count opened, total = 7
✓ 421 tests pass (+79 new); mappers validated

## Success criteria MET
Queries return correctly typed data against Supabase; sent/received paginate independently; icon unlocked count = opened secret boxes; all tests green.

## Security
Server-only (service_role never reaches client). Validate `direction` enum and pagination params. `currentUserId()` null → handled by caller (empty/login state).
