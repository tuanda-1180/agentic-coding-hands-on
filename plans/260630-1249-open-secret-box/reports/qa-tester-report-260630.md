# QA Tester Report: Open Secret Box Feature
**Date:** 2026-06-30  
**Tester:** QA Lead  
**Build:** PASS  
**Tests:** 476 PASS (20 files)

---

## 1. Test Execution Results

### Typecheck
```
✓ PASS — npx tsc --noEmit (no errors)
```

### Unit Tests
```
✓ PASS — npm test
  Test Files: 20 passed
  Tests: 476 passed
  Duration: 577ms
```

### Production Build
```
✓ PASS — npm run build
  Compiled successfully in 2.5s
  TypeScript check: passed
  Static page generation: 12/12 ✓
```

---

## 2. Behavioral Test Results (vs MoMorph Specs)

All 8 core test cases verified against code:

| ID | Test Case | Result | Evidence |
|----|-----------|--------|----------|
| a | Modal title state (unopened → success) | PASS | `secret-box-modal.tsx:102` conditional render |
| b | Instruction hidden at count=0; box disabled | PASS | `secret-box-modal.tsx:111-113` render guard; line 79 disables |
| c | Click box: badge revealed, count decremented | PASS | `secret-box-provider.tsx:57-85` + `secret-box-write.ts:49` CAS |
| d | Badge/count server-side only (client can't manipulate) | PASS | `openSecretBox()` server-only; client trusts only ID |
| e | Invalid badge ID → fallback (no crash, no XSS) | PASS | `getBadge()` whitelist; `FALLBACK_BADGE_ASSET` fallback |
| f | Probabilities sum to 100, match spec | PASS | `badges.ts:20-27` = 30+25+20+10+10+5 = 100 |
| g | Double-open race handled safely | PASS | CAS guard `.eq("is_opened", false)` at line 51 |
| h | Unauthenticated user: GET→0, POST→401 | PASS | `currentUnopenedCount()` returns 0; `openSecretBox()` throws 401 |

---

## 3. Bugs Found

### BUG #1: Missing Runtime Type Check on API Response
**Severity:** MEDIUM  
**File:** `app/components/secret-box/secret-box-provider.tsx:63-67`  
**Issue:** 
```ts
const { badge, unopenedRemaining } = (await res.json()) as OpenResult;
const catalog = getBadge(badge.id);  // ← CRASH if badge is null/undefined
```

**Problem:** TypeScript assertion `as OpenResult` does NOT validate at runtime. If the server sends a malformed response like `{ badge: null, unopenedRemaining: 5 }`, accessing `badge.id` at line 67 throws:
```
TypeError: Cannot read property 'id' of null
```

**Reproduction:**
1. Mock server to return `{ "badge": null, "unopenedRemaining": 5 }`
2. User clicks box
3. Unhandled TypeError; modal stays in opening state

**Expected Behavior:** Handle null/undefined badge gracefully (fallback to default or show error)

**Impact:** If API bug or network corruption occurs, user sees a hard crash instead of graceful fallback.

---

### BUG #2: useCallback Dependency Inefficiency
**Severity:** LOW  
**File:** `app/components/secret-box/secret-box-provider.tsx:85`  
**Issue:**
```ts
}, [opening, t]);  // ← t changes every render
```

**Problem:** The `useTranslations()` hook (line 35) returns a new function reference on every render. Including `t` in the dependency array causes `handleOpenBox` to be recreated on every render, defeating the optimization.

**Reproduction:** Check DevTools → React DevTools → see `handleOpenBox` recreated constantly

**Expected Behavior:** Remove `t` from dependencies (or memoize translations separately). The `t` function is stable in semantics—a new reference doesn't affect correctness.

**Impact:** Minor performance regression. Each recreation is small, but repeated re-renders of `SecretBoxModal` will see a new `onOpenBox` reference, potentially triggering unnecessary re-renders downstream.

---

### BUG #3: Negative Count Display Not Validated
**Severity:** LOW  
**File:** `app/components/secret-box/secret-box-modal.tsx:89`  
**Issue:**
```ts
const countDisplay = String(unopenedCount).padStart(2, "0");
```

**Problem:** If `unopenedCount` is somehow negative (e.g., -1, -5), the display shows "-1", "-05", etc. The `padStart()` method doesn't validate or constrain the input—it only pads positive numbers.

**Reproduction:** (Theoretical; current code prevents negatives, but not defensive against future bugs)
```ts
String(-1).padStart(2, "0")  // "-1"
String(-5).padStart(2, "0")  // "-5"
```

**Expected Behavior:** Validate `unopenedRemaining >= 0` before rendering, or cap at 0.

**Impact:** Low, because `secret-box-write.ts:60` returns `unopenedRemaining = await countUnopened()`, which uses SQL `count` (always ≥ 0). But display code is not defensive.

---

## 4. Test Coverage Gaps

### High-Priority Gaps

1. **API Response Validation**
   - No test for malformed API responses (null badge, missing unopenedRemaining)
   - Suggestion: Add integration test mocking bad API response
   - File: `app/lib/secret-box/__tests__/` (new file)

2. **Error State Persistence**
   - No test for error recovery flow (user clicks, gets 5xx, clicks again)
   - Current code: 5xx errors leave state as-is, allowing retry. Good, but untested.
   - Suggestion: Test rapid retry after transient error

3. **Fallback Badge Asset Verification**
   - Catalog lookup tested (badges.test.ts)
   - But actual image fallback (Image onError) not covered
   - BadgeImage component (secret-box-modal.tsx:50-64) has logic, no test
   - Suggestion: Add component test or snapshot test for BadgeImage

4. **Client-Side Race Conditions**
   - `opening` flag prevents double-submit ✓ (verified in code)
   - But no test for rapid clicks while fetch in flight
   - Suggestion: Add unit test with fake timers

5. **Unopened Count Edge Cases**
   - Count = 0 → box disabled ✓ (verified)
   - Count = 1 → box enabled, after open → count = 0 ✓ (logic chain correct)
   - Count > 100 → display overflow? No test for display formatting
   - Suggestion: Add property-based test for count ∈ [0, ∞)

6. **Unauthenticated State Transitions**
   - GET returns 0, POST returns 401 ✓ (verified in code)
   - But no test for user logging in/out mid-interaction
   - Suggestion: Test session expiry during modal open

### Medium-Priority Gaps

7. **Migration & DB Constraints**
   - Migration (20260630125500_secret_box_index_and_constraint.sql) creates constraint
   - Constraint syntax correct (mirrors badges.ts IDs)
   - But no test for constraint violation (e.g., corrupt DB row)
   - Suggestion: Add SQL test to verify constraint rejects invalid prize

8. **Modal Close/Reopen Lifecycle**
   - Current code: close() sets prize=null, reopen loads fresh count
   - No test for: open → close → reopen → count changed in background
   - Suggestion: Test count refresh on reopen

---

## 5. Security Assessment

### XSS Prevention
✓ PASS — BadgeImage asset path is whitelist-enforced via `getBadge()`. Even if server sends malicious badge.id, catalog lookup prevents it.

### CSRF / Double-Submit
✓ PASS — `opening` flag prevents rapid-click exploits. Server-side CAS further guards.

### SQL Injection / Server Manipulation
✓ PASS — Server-only code (secret-box-write.ts) uses parameterized queries (Supabase SDK). DB constraint validates prize values.

### Type Safety
⚠ MEDIUM — API response validation missing (Bug #1 above).

---

## 6. Performance Notes

### Positive
- Badge selection (pickWeightedBadge) uses O(1) weighted random in consistent time
- Database index on (user_id, is_opened, created_at) optimizes both SELECT and COUNT queries
- Modal lazy-renders only when open (conditional return at line 77 of secret-box-modal.tsx)

### Negative
- useCallback recreated every render due to `t` dependency (Bug #2)
- fetch() called on every modal open (line 51) — not cached, but acceptable for fresh count

---

## 7. Recommendations (Priority Order)

### CRITICAL (Fix Before Merge)
- [ ] Add runtime validation for badge field in API response (secret-box-provider.tsx:63-67)
  - Pattern: `if (!badge?.id) { /* use fallback */ }`

### HIGH (Fix in Next Iteration)
- [ ] Remove `t` from useCallback dependencies (secret-box-provider.tsx:85)
  - Reason: Prevents unnecessary recreations
- [ ] Add integration test for malformed API responses
  - File: `app/lib/secret-box/__tests__/provider-integration.test.tsx` (new)

### MEDIUM (Nice-to-Have)
- [ ] Add defensive check for negative unopenedCount in display
- [ ] Add snapshot test for BadgeImage fallback behavior
- [ ] Add DB constraint verification test

### LOW (Observational)
- [ ] Consider memoizing `t` separately if performance becomes issue
- [ ] Document the double-open race prevention strategy in comments (already good, but could be more explicit)

---

## 8. Test Cases Written

Created: `app/lib/secret-box/__tests__/edge-cases.test.ts`
- 16 new tests covering:
  - pickWeightedBadge boundary conditions (0.0, 0.999999, near-boundaries)
  - getBadge defensive behavior (null, undefined, empty string, case sensitivity)
  - TOTAL_WEIGHT invariant
  - Count display edge cases (including negative detection)
  - Race scenario validation
  - Type safety concerns

All 16 tests PASS.

---

## Summary

**Overall Status:** GOOD — Core logic is sound, server-side protection is strong, but API response validation is missing.

**Blockers:** Bug #1 (Type validation) should be fixed before production. Bugs #2 & #3 are cosmetic/defensive and can be deferred.

**Confidence:** HIGH — All 8 behavioral specs verified. Only 1 medium-severity bug found (type safety). No security holes or data corruption risks identified.

---

## Files Analyzed
- ✓ app/lib/secret-box/badges.ts
- ✓ app/lib/secret-box/secret-box-write.ts
- ✓ app/api/secret-boxes/open/route.ts
- ✓ app/api/secret-boxes/route.ts
- ✓ app/components/secret-box/secret-box-modal.tsx
- ✓ app/components/secret-box/secret-box-modal.styles.ts
- ✓ app/components/secret-box/secret-box-provider.tsx
- ✓ app/components/liveboard/all-kudos-section.tsx
- ✓ app/components/profile/profile-screen.tsx
- ✓ supabase/migrations/20260630125500_secret_box_index_and_constraint.sql
