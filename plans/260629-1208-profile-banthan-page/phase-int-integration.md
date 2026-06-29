# Phase INT — Integration: route, wiring, i18n, validation

**Priority:** High · **Status:** COMPLETED · Runs after Track A screens and Track B logic are available (incremental — wire each piece as it lands; no hard merge barrier).

## Context
Connect the static profile UI (A1/A2) to real data (B1/B2), expose the route, translate, and validate against the Figma design.

## Requirements
1. **Route:** `app/profile/page.tsx` → renders `ProfileScreen`. Gets Header/Footer automatically via `site-chrome` (not in the `/login|/countdown|/admin` exclusion list). Confirm/add nav entry from the account dropdown (`260628-0939-dropdown-profile-redesign`) to `/profile` if expected.
2. **Wire data:** replace A1 mock props with `useProfileData()` output — user header, stats panel, icon collection (lit = unlocked, total slots gray), feed.
3. **Filter dropdown (A2) → feed:** bind dropdown `value`/`onChange` to hook `filter`/`setFilter`; labels show `counts.received` / `counts.sent`; default "Đã gửi".
4. **"Mở Secret Box" button:** placeholder — wire `onOpenGift` to a "coming soon" toast/no-op (clarifications). Do not implement opening logic.
5. **Like + load-more:** wire to hook `toggleLike` / pagination.
6. **i18n:** add `profile` namespace keys to `messages/en.json` AND `messages/vi.json` (pageTitle, statisticsLabel, kudosReceived/Sent/heartsReceived/secretBoxOpened/secretBoxUnopened — reuse liveboard keys where identical, openSecretBox, iconCollectionTitle, filterReceived, filterSent, comingSoon, emptyFeed). Use `useTranslations("profile")`.
7. **States:** loading skeleton, empty feed ("chưa có kudos"), not-logged-in fallback.

## Delivered
- Created: `app/profile/page.tsx` (route, mounts ProfileScreen with useProfileData hook)
- Modified: `app/components/profile/*` (wired mock → useProfileData output)
- Modified: `messages/en.json`, `messages/vi.json` (`profile` namespace: pageTitle, statisticsLabel, kudosReceived/Sent/heartsReceived/secretBoxOpened/secretBoxUnopened, openSecretBox, iconCollectionTitle, filterReceived, filterSent, comingSoon, emptyFeed)
- Modified: `app/components/header/header-user-menu.tsx` (nav link to /profile already present)

## Implementation Complete
✓ `/profile` route live, renders ProfileScreen with real data from useProfileData hook
✓ useProfileData wired into ProfileScreen (user header, stats panel, icon collection, feed)
✓ Filter dropdown bound to feed direction (value/onChange → filter state)
✓ Secret Box button → coming-soon toast (no-op, out-of-scope)
✓ i18n VI/EN keys added, useTranslations("profile") active
✓ Loading / empty / no-user fallback states handled
✓ Nav link from header-user-menu already linked to /profile
✓ Visual validation vs Figma complete; tsc clean, eslint clean (profile files)
✓ next build green: /profile, /api/profile, /api/profile/kudos routes generated
✓ 421 tests pass (+79 new); existing liveboard tests still green

## Success criteria MET
`/profile` renders logged-in user's real profile; dropdown switches sent/received correctly; stats/icons accurate; bilingual; matches Figma; tsc + eslint + build pass; all tests green.

## Security
No service_role in client; profile shows only current user's data; validate all params server-side.
