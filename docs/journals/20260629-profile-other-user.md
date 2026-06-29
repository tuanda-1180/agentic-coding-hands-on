# Profile người khác: Public User Profile Page

**Date**: 2026-06-29
**Severity**: Medium (scope-narrowing decision + API design for public data isolation)
**Component**: `/profile/[id]` route, `app/components/profile/` (reused), `app/lib/liveboard/profile-queries.ts`, `/api/users/[id]/profile` endpoint
**Status**: Resolved

## What Happened

Implemented the "Profile người khác" (Other User's Profile) page at `/profile/[id]` — a public profile view reachable from the avatar hover card. The feature reuses the existing "Profile bản thân" component tree with feature flags (`publicView`, `showCollection`, `userId`) rather than duplicating the UI.

## Why This Mattered

MoMorph design data ingestion was incomplete. The two requested screens (w4WUvsJ9KI "Profile người khác", 419VXmMy6I "Sửa bài viết") had no node trees, styles, or specs. Rather than halt, we made a scoping decision: reuse the already-coded sibling frame "Profile bản thân" (3FoIx6ALVb) as the layout authority, hide personal-only UI elements (secret-box stats, "Mở quà" button, icon collection), and defer the edit-post screen (which would require a new "Viết Kudo" data layer + rich-text editor).

This taught us an important lesson: **MoMorph data completeness is not guaranteed; fallback heuristics must exist**.

## The Brutal Truth

We discovered a critical data leak during code review. The initial `/api/users/[id]/profile` endpoint was returning raw stats including secret-box counts—data that must never be visible to unauthorized viewers. Signing off on the PR would have shipped an H1-severity information disclosure. The code review process (adversarial review mode) caught this before merge, but it exposed a gap in our mental model: **public APIs must actively suppress sensitive data, not passively include it**.

## Technical Details

### Design Gaps & Decisions

| Issue | Resolution |
|-------|-----------|
| No MoMorph data for "Profile người khác" | Reuse "Profile bản thân" layout; hide personal-only UI with feature flags |
| No design for "Sửa bài viết" (edit post) | Deferred; requires new backend layer for mutation + rich-text editor |
| Public vs. private stats visibility | Created `getPublicProfile` API endpoint that zeroes secret-box stats before serialization |

### API Design

**New endpoint:** `/api/users/[id]/profile` (GET)
- Returns `PublicProfileData` with secret-box counts zeroed (always `opened: 0, total: 0`)
- Unauthenticated users can call this; it surfaces only non-sensitive data
- Resolves user existence via Postgres query—unknown users get 404, not 200 with empty data

**Modified:** `app/lib/liveboard/profile-queries.ts`
- `getKudosByUser` now accepts optional `userId` param; if omitted, uses authenticated session
- `getPublicProfile` returns sanitized profile (secret-box stats suppressed)
- Extracted validation logic into shared `app/api/users/validation.ts` to prevent copy-paste drift

### Components

**Modified:** `app/components/profile/` (all existing components)
- Added `publicView: boolean` prop to control visibility of personal-only UI
- `profile-header.tsx`: hides secret-box stats when `publicView=true`
- `icon-collection.tsx`: skipped entirely when `publicView=true`
- "Mở quà" (Open Secret Box) button hidden for public view

**No new components created.** Conditional rendering via props kept the tree single-sourced.

## What We Tried & Why It Failed

1. **First pass: return raw stats from public API** → Code review caught the data leak. Reverted and created `getPublicProfile` to explicitly sanitize.

2. **Attempted to reuse `/api/profile` for both personal & public views** → Rejected because it would require session logic in an unauthenticated endpoint. Cleaner to have two separate endpoints.

3. **Stale-data flash on profile→profile navigation** → SWR was re-fetching unnecessarily when user navigated between profiles. Fixed by keying the hook on `[userId, direction]` so cache misses only on actual user/direction changes.

## Root Cause Analysis

**Why the data leak almost shipped:**

The design spec for "Profile người khác" was absent. We defaulted to reusing the personal profile's data-layer contract, which includes secret-box counts. No one questioned whether those fields should exist in a public API—the assumption was "if the component displays it, the API should return it."

The real mistake: **we treated the public profile as a read-only variant of the personal profile, when it should have been a separate contract.** A deliberate API design pass would have asked: "What data is safe to expose?" before querying the database.

**Why the stale-data flash occurred:**

The SWR hook was keyed only on the route param `id`, not on the full set of query variables (`direction`, `pageSize`). Switching from `/profile/123?direction=received` to `/profile/456?direction=sent` would reuse the old page's cache until the fetch completed.

**Why the error messages were wrong:**

The error page copy said "Profile bản thân không có quá" (your profile has no...), hard-coded. Should have been parameterized: "Profile của {username} không có quá".

**Why unknown users returned 200:**

Initial implementation fell back to an empty `ProfileData` object when the user lookup failed. Correct behavior: 404 + error response.

## Lessons Learned

1. **Public APIs require explicit data sanitization.** Don't assume "what you display is what you expose." Create a separate contract for public data, then write code to enforce that contract (e.g., `getPublicProfile` zeros sensitive fields before returning).

2. **MoMorph data completeness is not guaranteed.** When design specs are missing, have a fallback: reuse an existing frame, ask the designer for clarification, or document the gap. Don't ship without a decision.

3. **Feature flags are better than code duplication.** Rather than duplicating the profile component tree with `profile-personal.tsx` and `profile-public.tsx`, controlled props (`publicView`, `showCollection`) let us keep one authoritative implementation. Less drift, easier to maintain.

4. **Validation logic should be extracted early.** We extracted `app/api/users/validation.ts` during code review to prevent future endpoints from reimplementing user-lookup or existence checks. A shared validation module scales better than copy-paste.

5. **SWR cache keys must be comprehensive.** Keying only on the primary route param (userId) caused stale data. The cache key should include all variables that change the result: `[userId, direction, pageSize]`.

6. **Process lesson: branch from main at task start.** The local main was stale; the profile base had already merged to origin/main (PR #8). We stashed work, checked out to main, pulled, and created the new branch. Future: always `git newfeat` from the latest main before starting.

## Code Review Findings (Fixed)

| Finding | Severity | Fix |
|---------|----------|-----|
| Secret-box data leak via public API | H1 | Created `getPublicProfile` to sanitize stats; added comment explaining why |
| Stale-data flash on profile→profile nav | M1 | Keyed SWR hook on `[userId, direction, pageSize]` |
| "Your profile" copy on others' error page | M2 | Parameterized error message with username |
| Unknown user returns 200 with empty data | M3 | Changed to 404 + error response |
| Validation duplication across endpoints | L1 | Extracted `app/api/users/validation.ts` |

## Next Steps

1. **Deferred: "Sửa bài viết" (Edit Post) screen.** Depends on:
   - Viết Kudo data layer (`app/lib/liveboard/kudo-queries.ts` mutations)
   - Rich-text editor component
   - Backend mutation endpoint `/api/kudos/[id]` (PUT)

2. **Optional: RLS for public profile queries.** Currently, `/api/users/[id]/profile` runs under `service_role` with application-level filtering. If the DB grows, add RLS policies to enforce per-user visibility at the query level.

3. **Monitor: secret-box data exposure.** In future features, audit any query that includes `secret_boxes.*` to ensure it's never exposed to unauthorized viewers. Add a test that verifies public endpoints don't leak stats.

---

**Files created:**
- `app/profile/[id]/page.tsx`
- `app/api/users/[id]/profile/route.ts`
- `app/api/users/validation.ts`

**Files modified:**
- `app/lib/liveboard/profile-queries.ts` (added `getPublicProfile`, `userId` param to `getKudosByUser`)
- `app/lib/liveboard/use-profile-data.ts` (added `userId` hook variant for public profiles; fixed SWR cache key)
- `app/components/profile/profile-header.tsx` (added `publicView`, `showCollection` props)
- `app/components/profile/icon-collection.tsx` (skipped when `publicView=true`)
- `app/components/profile/profile-screen.tsx` (passed `publicView` prop to children)

**Commit:** 700c2b5
**PR:** #9 → main
**Test result:** 433 passing, tsc clean, eslint clean on changed files
