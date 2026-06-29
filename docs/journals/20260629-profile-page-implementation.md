# Profile Page: Personal Kudos View for Signed-In User

**Date**: 2026-06-29
**Severity**: Low (shipped cleanly; documented for data-layer significance)
**Component**: `/profile` route, `app/components/profile/`, `app/lib/liveboard/profile-queries.ts`, `/api/profile` + `/api/profile/kudos`
**Status**: Resolved

## What Happened

Implemented the "Profile bản thân" (My Profile) page. The route renders a personal-scoped variant of the Live board for the signed-in user: profile header with avatar and stats, an icon collection derived from opened secret boxes, and a direction-aware kudos feed toggled between received and sent kudos.

## Why This Is Architecturally Significant

The Live board introduced the Supabase data layer. The Profile page is the first feature to write **user-scoped queries** on top of that layer — accessing data that is filtered by the authenticated session's `currentUserId()`. This is different from the Live board's public/aggregate read pattern and is the first precedent for per-user data isolation.

Key decisions made during implementation:

- **Icon collection derivation:** icons are computed from opened secret boxes, capped at 7 slots (`min(opened, 7) / 7` fill ratio). Logic lives in `profile-queries.ts`; the "Open Secret Box" button is a placeholder — no backend action yet.
- **Direction-aware kudos feed:** `getKudosByUser` accepts a `direction` parameter (`received | sent`). Default is `sent`. The toggle is a client-side filter (`received-sent-filter.tsx`), not a separate route.
- **`getStats` now accepts a pre-resolved uid:** `user-queries.ts` was modified to accept an optional `uid` argument so `profile-queries.ts` can avoid a second session lookup when building `getProfileData`.
- **`KUDOS_SELECT` exported from `kudos-queries.ts`:** the shared select fragment is now exported so `profile-queries.ts` can reuse it without duplicating column lists.
- **Feed filter default:** the profile feed defaults to "sent" (not "received") to surface the user's own giving history first.

## Data Layer Changes

| File | Change |
|------|--------|
| `app/lib/liveboard/types.ts` | Added `KudosDirection`, `IconCollection`, `ProfileData` types |
| `app/lib/liveboard/kudos-queries.ts` | Exported `KUDOS_SELECT` and `likedKudosIds` helper |
| `app/lib/liveboard/user-queries.ts` | `getStats` accepts optional pre-resolved `uid` param |
| `app/lib/liveboard/profile-queries.ts` | New — `getProfileUser`, `getKudosByUser`, `getProfileData` |
| `app/lib/liveboard/use-profile-data.ts` | New — SWR hook wrapping the profile API routes |

## API Surface

| Route | Method | Notes |
|-------|--------|-------|
| `/api/profile` | GET | Returns `ProfileData` for the session user via `currentUserId()` |
| `/api/profile/kudos` | GET | `?direction=received\|sent&page=&pageSize=` — paginated, direction-aware |

Both routes require an authenticated session. Unauthenticated requests are rejected at the API layer.

## Components

All under `app/components/profile/`:

- `profile-screen.tsx` — top-level layout
- `profile-header.tsx` — avatar, display name, stats bar
- `icon-collection.tsx` — rendered from `IconCollection` data; "Open Secret Box" button is placeholder
- `awards-feed-header.tsx` — section heading for the kudos feed
- `received-sent-filter.tsx` — toggle between received and sent views
- `profile-screen.styles.ts` — co-located style tokens

## i18n

New `profile` namespace added to `messages/{vi,en}.json`.

## Concerns for Future Sessions

1. **"Open Secret Box" is a placeholder.** The button renders but has no action. A future PR must wire up the box-opening flow before the icon collection is interactive.

2. **No RLS on profile queries.** Like the Live board, profile queries run under the `service_role` key with `currentUserId()` used for filtering at the query level. If per-user access control moves to the DB layer, RLS policies must be added.

3. **`getStats` uid parameter is optional, not required.** The backward-compatible signature (optional uid) means callers can still omit it and trigger a session lookup internally. If session lookups become expensive, make uid required across all callers.

## Lessons Learned

1. **Exporting shared fragments (`KUDOS_SELECT`) from the start pays off.** Reusing the select fragment from `kudos-queries.ts` in `profile-queries.ts` avoided column-list drift — the profile feed matches the live board feed exactly.

2. **Pre-resolving uid at the data-composition layer reduces latency.** `getProfileData` resolves `currentUserId()` once and fans it out to `getProfileUser`, `getStats`, and `getKudosByUser` in parallel, rather than each query doing its own session lookup.

3. **Default filter state belongs in the data contract, not the component.** Defaulting to `sent` in `getKudosByUser` (and reflecting that in the hook) means the component doesn't need to encode business defaults — it just renders what the hook provides.

## Next Steps

- Implement the Secret Box opening flow (backend action + optimistic UI update for icon collection)
- Add RLS policies if per-user data isolation is needed at the DB layer
- Consider making `getStats` uid parameter required to prevent redundant session lookups

---

**Files created:**
- `app/profile/page.tsx`
- `app/components/profile/profile-screen.tsx`
- `app/components/profile/profile-header.tsx`
- `app/components/profile/icon-collection.tsx`
- `app/components/profile/awards-feed-header.tsx`
- `app/components/profile/received-sent-filter.tsx`
- `app/components/profile/profile-screen.styles.ts`
- `app/lib/liveboard/profile-queries.ts`
- `app/lib/liveboard/use-profile-data.ts`
- `app/api/profile/route.ts`
- `app/api/profile/kudos/route.ts`
- `messages/{vi,en}.json` (new `profile` namespace)

**Files modified:**
- `app/lib/liveboard/types.ts` (added `KudosDirection`, `IconCollection`, `ProfileData`)
- `app/lib/liveboard/kudos-queries.ts` (exported `KUDOS_SELECT`, `likedKudosIds`)
- `app/lib/liveboard/user-queries.ts` (`getStats` accepts optional pre-resolved uid)
