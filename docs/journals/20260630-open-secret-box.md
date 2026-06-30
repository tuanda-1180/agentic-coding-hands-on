# Open Secret Box: FAB Modal with Badge Lottery

**Date**: 2026-06-30 12:49  
**Severity**: Medium  
**Component**: Secret Box Feature (FAB Action + Modal + Backend)  
**Status**: Resolved (Awaiting user commit)

## What Happened

Built a complete "Open Secret Box" feature — a FAB-launched modal that reveals a randomly-selected badge prize. Two visual states: unopened (closed box, call-to-action) → click → opened (success screen with revealed badge). The feature is server-authoritative on badge selection and uses weighted randomization (6 badges with weights summing to 100). Implemented across UI components, backend API, business logic layer, and database constraints in a single dev session using the Takumi two-track protocol (UI background agent + backend main thread).

## The Brutal Truth

This feature felt deceptively straightforward from the MoMorph spec — one simple modal frame, two states. But the real pain came from **incomplete design assets** and a subtle **client-trust vulnerability** caught late in review.

The Figma export plan failed entirely: the "opened" and "badge" frames had no viewport renders, and the MCP image API returned 500 errors. Crop-from-full-frame workaround didn't help — node bounds came back empty. This meant the background UI implementer agent was trying to reverse-engineer a success state from nearly nothing, and I ended up implementing badge image fallbacks and placeholder handling that weren't even in the original spec. Frustrating, but it forced the right architecture.

The security leak was worse: the original modal code trusted the badge object directly from the API response (reading `badge.nameKey` and `badge.asset` from the wire, passing them straight into `t()` and `<Image src>`). This is a supply-chain risk — if the API is ever compromised or a developer mis-codes the endpoint, untrusted strings land in translation keys and image URLs. The reviewer caught it, and the fix (resolve all badge metadata from the local catalog using only the badge ID from the wire) felt obvious *after* being pointed out, but I shipped it without that check. That stings.

## Technical Details

**Architecture:**
- `app/lib/secret-box/badges.ts`: Pure catalog + `pickWeightedBadge(rng?)` with injectable randomness for deterministic tests. 6 badges: Stay Gold (30%), Flow to Horizon (25%), Touch of Light (20%), Beyond the Boundary (10%), Revival (10%), Root Further (5%). Weights validated in tests.
- `app/lib/secret-box/secret-box-write.ts`: Server-only `openSecretBox(userId, rng?)` with race-safe compare-and-swap on the `is_opened` boolean. Returns the picked badge or throws 409 if already opened.
- `app/api/secret-boxes/open`: POST endpoint, enforces auth, wraps the write function, returns 200/401/409.
- `app/api/secret-boxes`: GET endpoint for unopened count (mirrors the test case requirement).
- `app/components/secret-box/secret-box-modal.tsx`: Two-state React component. Unopened: closed box + instruction text (hidden if count=0). Opened: success banner + badge reveal. Badge images have `onError` fallback to placeholder. State managed via a global provider (mirrors kudo-compose-provider pattern).
- FAB integration: added "Mở Secret Box" as third action in `fab.tsx` and `fab-with-rules.tsx`. Provider mounted in `app/layout.tsx`.
- Database: reused existing `secret_boxes(id, user_id, is_opened, prize, created_at)` table. Added composite index `(user_id, is_opened)` for count queries and a CHECK constraint `prize ~ '^[a-z_]+$'` to validate badge IDs.

**Test Coverage:**
- `app/lib/secret-box/__tests__/badges.test.ts`: 12 tests covering catalog integrity, weighted distribution across 10k samples (validates each badge hits expected ±2% bounds), edge cases (empty RNG, single badge).
- All 476 tests in the repo pass. TypeScript clean.

**Database Migration:**
- `supabase/migrations/20260630125500_secret_box_index_and_constraint.sql`: Index + constraint added safely. No data loss.

## What We Tried

1. **MoMorph asset recovery**: Attempted crop-from-full-frame workaround after Figma export API 500'd. Result: node bounds were empty, uncroppable. Abandoned after 30 minutes. Lesson: when APIs fail, just build with placeholders and document the gap.

2. **Badge image URLs**: Originally planned to extract from Figma assets. When that failed, pivoted to a badge catalog with placeholder URLs and a local image mapping. Fallback `onError` handler to a static PNG. Pragmatic, testable, shipping-safe.

3. **Client-side badge resolution**: First draft passed `badge` object from API into modal. Reviewer flagged it. Refactored to pass only badge ID, resolve name + asset from local catalog via `getBadge(badge.id)`. Wire now carries zero trust-requiring strings.

4. **Atomic remaining-count read**: Considered locking or transactions. Decided against it — the test case doesn't require atomicity, and a non-atomic read is documented in a comment. Trade-off: simpler code, acceptable risk given the use case (UX shows a hint, not a hard gate).

## Root Cause Analysis

**Why the asset blocker mattered:**
The MoMorph spec only included the unopened state frame (J3-4YFIpMM). The "opened" and badge reveal states were mentioned in the clarification but not fully designed in Figma. This left the UI implementer agent guessing, which actually led to cleaner component boundaries (modal handles state, provider manages logic, images have fallbacks). But it added friction and uncertainty.

**Why the security leak happened:**
I trusted the test cases to validate endpoint correctness and didn't apply the implicit security principle: "never trust external data paths in frontend code." The API response is *your* code's output, but in a complex system, that output can be poisoned by bugs upstream. The local catalog acts as the source of truth, and that's where the validation should happen. Lesson: always resolve foreign keys locally, even if it feels redundant.

## Lessons Learned

1. **Incomplete design specs are okay** — treat missing frames as "implement with fallbacks" not "block until Figma is perfect." You ship faster and often learn the right structure by building defensively.

2. **Client-side security is still security** — API responses aren't "trusted" just because your backend wrote them. Always re-validate or resolve critical data (IDs, URLs, keys) against a local source of truth before using in `t()`, `<Image>`, or DOM.

3. **Weighted randomization needs deterministic tests** — injectable RNG makes unit tests fast and reproducible. Random samples are fine for QA but useless in CI. (Learned this the hard way in previous features.)

4. **Composite indexes on foreign key + boolean pairs are cheap** — query coverage for `(user_id, is_opened)` and explicit CHECK constraints cost microseconds and catch bugs at the database layer. Worth it.

5. **Provider pattern scales** — copying the kudo-compose-provider structure for secret-box-provider was the right call. Consistent, predictable, easy to test.

## Next Steps

1. **User review & commit**: Branch `feat/open-secret-box` is ready. All tests pass, no lint errors, security fix applied. Awaiting user approval.
2. **Badge image assets**: Once real PNG files are ready, drop them in `public/assets/badges/` and update `badges.ts` asset URLs. Fallback will seamlessly switch to real images.
3. **Monitor the index**: After merge, verify the composite index is actually used by Postgres. Run `EXPLAIN` on the count query in staging if needed.
4. **Accessibility follow-up**: Modal text and badge alt-text are wired, but should be tested with a screen reader in a future pass.

---

**Status**: DONE  
**File**: /Users/do.anh.tuanb/Documents/work/takumi/takumi/docs/journals/20260630-open-secret-box.md
