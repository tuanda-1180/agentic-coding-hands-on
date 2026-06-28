# Thể lệ (Rules) Panel: Asset Export Failure & Dialog Architecture

**Date**: 2026-06-28
**Severity**: Medium (recovered via workaround; no feature loss)
**Component**: Homepage Rules Panel, FAB integration
**Status**: Resolved

## What Happened

Implemented the Thể lệ (Rules) overlay panel replacing the stub `/rules` route. The panel displays hero tier badges, collectible icons, Kudos Quốc Dân info, and a footer—opened via FAB from the homepage. Build passed (307/307 tests, +59 new), code shipped as `c9cda60`.

## The Brutal Truth

Two hours wasted on asset export APIs that don't work. The MoMorph `get_figma_image`, `get_media_file`, and `get_media_files` endpoints were all down or broken (500 errors, 401s, null returns). First instinct: CSS-approximate the colors and ship it. User rejected it immediately—"vẫn không đúng" (still not right). They were correct. The rules explicitly forbid guessing visual values. That hurt because the workaround felt plausible until validation.

Worse, the plan review caught two architecture mistakes that could have shipped:
1. Using `useDropdown` for a dialog/drawer (wrong ARIA semantics, role="menu" doesn't fit)
2. Forgetting that homepage-screen is a Server Component, so state had to move to a wrapper

Both issues were caught *before* code, not after. That's the system working. But it means the initial design assumption was sloppy.

## Technical Details

**The asset problem:**
- `get_figma_image(screenId)` → 500
- `get_media_file(fileKey, nodeId)` → 401 / null
- `get_media_files(fileKey, [...nodeIds])` → all null

Initial hack: CSS linear-gradients approximating badge colors. User test revealed colors were off. No way to proceed without real pixels.

**The recovery:**
- Called `get_frame_image(screenId)` to grab full frame render (1440×1796 PNG, 1:1)
- Pulled absolute node bounds from `get_node()` API for each asset (4 badges 126×22, 6 icons 64×64)
- Cropped assets using ImageMagick directly from the frame image via coordinates
- Recovered pixel-accurate artwork without touching the broken export APIs

Result: 10 assets, all correct, no visual debt.

## What We Tried

1. **Direct export APIs**: all failed (500 / 401 / null)
2. **CSS approximation**: user rejected—violates "no guessing visual values" rule
3. **Frame render + ImageMagick crop**: worked, pixel-perfect

## Root Cause Analysis

The MoMorph asset export stack appears to be partially down or unreliable. Rather than wait for recovery or escalate, the ImageMagick workaround was faster and more reliable. However, **the initial design skipped validation**—we should have tested asset export before committing to the architecture. The plan review caught two deeper issues: ARIA semantics (dialog vs. menu role) and Server Component state management. Both were corrected before implementation.

## Lessons Learned

1. **Validate external APIs early.** If MoMorph image export is broken, find it during planning, not in the middle of implementation. This saves 2+ hours of iteration.

2. **Dialog vs. Menu is not interchangeable.** A drawer/overlay that's not a dropdown menu must have its own ARIA semantics (role="dialog"). Reusing `useDropdown` would have shipped broken accessibility. The plan review caught this—trust that gate.

3. **Server Components require state boundaries.** Homepage-screen is a Server Component, so any interactive state (panel open/close) must live in a client child. The wrapper pattern (fab-with-rules.tsx) is the right approach here. Planning caught this too.

4. **Frame render + coordinate cropping is a valid fallback.** When Figma export APIs fail, you can still extract pixel-perfect assets by rendering the full frame and cropping at known node bounds. ImageMagick makes this trivial.

5. **The user-facing validation caught the CSS hack immediately.** Trust that signal. "Still not right" is the green light to throw away the shortcut.

## Next Steps

- Monitor MoMorph asset export API stability—if this is a pattern, escalate to platform team
- Document the ImageMagick frame-crop pattern for future use (recovery procedure for broken export APIs)
- Plan review process prevented two architecture mistakes from shipping—this is working as designed; don't skip it

---

**Files created/modified:**
- `app/components/homepage/rules-panel.tsx` (new)
- `app/components/homepage/rules-hero-tier.tsx` (new)
- `app/components/homepage/rules-collectible-icon.tsx` (new)
- `app/components/homepage/fab-with-rules.tsx` (new, client wrapper)
- `app/components/ui/use-dialog.ts` (new, reusable a11y hook)
- `app/lib/__tests__/rules-panel.test.ts` (new, +59 tests)
- `app/components/homepage/fab.tsx` (modified: onOpenRules callback)
- `app/components/homepage/homepage-screen.tsx` (modified: renders FabWithRules)
- `app/rules/page.tsx` (modified: permanentRedirect → "/")
- `messages/{vi,en}.json` (new `rules` namespace)
- `README.md` (route table + Shared UI Hooks)
- `public/saa/` (10 cropped PNGs: hero-* + icon-*)

**Commit:** `c9cda60`

