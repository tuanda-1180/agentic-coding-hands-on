# Plan — Profile người khác (/profile/[id])

**Status:** complete · **Discipline:** code (reuse existing profile screen)
**Scope:** Public profile page for any sunner, reached from the avatar hover card.
Reuses the "Profile bản thân" components; hides personal-only parts (secret box + icon collection).

## Key insight
Target frame `w4WUvsJ9KI` has no MoMorph data. Reuse done frame `3FoIx6ALVb`
("Profile bản thân", already implemented) as the authoritative layout. Only delta:
hide secret-box stat rows, "Mở quà" button, and the icon-collection row.

## Phases (parallel-runnable: Track A UI / Track B backend)

### Track B — Backend / data
1. `profile-queries.ts`: `getKudosByUser({ userId?, ... })` — accept arbitrary user (fallback currentUserId).
2. `profile-queries.ts`: add `getPublicProfile(userId)` → ProfileData from sunner row (no session override).
3. New `GET /api/users/[id]/profile` — UUID-validated, returns ProfileData.
4. New `GET /api/users/[id]/kudos?direction&page&pageSize` — UUID + pagination validated.

### Track A — UI
5. `use-profile-data.ts`: `useProfileData({ userId? })` picks public endpoints when userId set.
6. `stats-panel.tsx`: `publicView?` hides secret-box rows + gift button (onOpenGift optional).
7. `profile-header.tsx`: `showCollection?` (default true) hides icon collection when false.
8. `profile-screen.tsx`: `userId?` prop → public view; wires publicView + show={!publicView}.
9. `app/profile/[id]/page.tsx`: renders `<ProfileScreen userId={id} />`.
10. `user-avatar-card.tsx`: add "Xem profile" link → `/profile/[id]` (entry point).
11. i18n: `profile.notFound`, `profile.publicLoading?`, `liveboard.avatarViewProfile`.

### Integration / verify
12. Tests: extend route-param validation (UUID) + pagination (pure logic only).
13. `npm run lint` + `npm run test` + `next build` typecheck.

## Completion Summary

All phases complete and verified:

**Track B — Backend / data**
- [x] `profile-queries.ts`: `getKudosByUser({ userId?, ... })` — accepts arbitrary user
- [x] `profile-queries.ts`: `getPublicProfile(userId)` — zeroes secret-box stats
- [x] `GET /api/users/[id]/profile` — UUID-validated
- [x] `GET /api/users/[id]/kudos?direction&page&pageSize` — UUID + pagination validated

**Track A — UI**
- [x] `use-profile-data.ts`: `useProfileData({ userId? })` picks public endpoints
- [x] `stats-panel.tsx`: `publicView?` hides secret-box rows + gift button
- [x] `profile-header.tsx`: `showCollection?` hides icon collection
- [x] `profile-screen.tsx`: `userId?` prop wires publicView
- [x] `app/profile/[id]/page.tsx`: 404 for invalid UUID/unknown user
- [x] `user-avatar-card.tsx`: "Xem hồ sơ" link → `/profile/[id]`
- [x] i18n: `profile.notFound`, `profile.loadErrorOther`, `liveboard.avatarViewProfile`

**Integration & Verification**
- [x] Shared guard: `app/api/users/validation.ts` (UUID_RE, isValidUserId, parseIntParam)
- [x] Tests: `app/api/users/__tests__/user-route-params.test.ts` (real validation imports)
- [x] Type check: `tsc --noEmit` clean
- [x] Tests: `npm run test` 433 pass
- [x] Linting: `eslint` clean on changed files
- [x] Code review: DONE_WITH_CONCERNS (all findings fixed)

## Out of scope
- Màn Sửa bài viết - edit mode (deferred per clarification).
- Editing/secret-box actions on other users.
