# Countdown Prelaunch Page: MoMorph Two-Track + Environmental Friction

**Date**: 2026-06-17 16:29
**Severity**: Medium (completed successfully, but architectural friction exposed)
**Component**: Homepage countdown display, MoMorph/Figma → React pipeline
**Status**: Resolved

## What Happened

Implemented the "Countdown - Prelaunch page" screen (MoMorph screenId 8PJQswPZmU, fileKey 9ypp4enmFmdK3YAFJLIu6C) using the two-track orchestration model: Track A (background `implementer` subagent for presentational UI) ran in parallel with Track B (main thread countdown logic, clarifications, backend planning). Integration point was a single seam at `<CountdownDisplay days={} hours={} minutes={} />`.

Build clean, 39 passing vitest unit tests. Committed to feat/countdown-prelaunch-page (2231e3b, conventional message). Created public repo and pushed.

## The Brutal Truth

The two-track model **works**, but background subagents hit a hard wall with MCP tools — they can't surface permission prompts. When the first implementer tried to call `get_frame()` or `download_media()`, the MCP request went silent because there's no interactive channel to approve it. This forced a pivot mid-execution: I had to pull all design data fetching back to the main thread, manually transform the authoritative MoMorph node tree into concrete prop values (colors as hex, fonts by name, spacing in tailwind scale), pre-download assets, and re-dispatch the subagent with everything baked in.

That's a kludge. It works, but it defeats the point of decoupling Track A. Future MoMorph workflows need a synchronous design-data layer that the orchestrator populates upfront, or MCP tooling needs to support async approval queues for subagents.

The Node version gotcha is maddening because it's **not visible in failure mode**. The shell defaults to v12.22.9 (via system node), which silently fails Next 16 checks but doesn't error clearly — builds hang on weird transpile issues. Only once you force nvm v22.20.0 into PATH does everything work. This will bite every new developer who clones the repo. We need either a .nvmrc at root (current setup has nvm v22.20.0 only in subagent prompts) or CI that enforces it, or better: Docker for consistency.

## Technical Details

**MoMorph design data pulled:**
- Node tree: 12 frames (background container, 3x countdown-unit, labels, LED digit boxes)
- Styles: #0a0a0a bg, #00ff00 LED fill (RGB 0,255,0), `--countdown-font-size: 2.5rem` computed from Figma
- Media: background gradient asset (PNG, 1920×1080)
- Font: DSEG7 (Digital Numbers) not on Google Fonts — downloaded DSEG7-Classic Bold (SIL OFL) locally as authoritative match

**Clarifications locked down:**
- Launch date: env var `NEXT_PUBLIC_LAUNCH_DATE` (ISO string), fallback to 99 days from now
- Route: `/` (home)
- Freeze behavior: countdown hits 00:00:00 and freezes (no "launch!" transition, design shows static zero state)
- Auth: fully public, no guards

**Reviewer finding (CRITICAL):**
- Bug: `padStart(2, '0')` on days value silently truncates days ≥ 100 to last two digits (e.g., 196 days → "19")
- Root cause: design has exactly two LED boxes per unit (three digits total: DD:HH:MM). The spec didn't state a max-day constraint, so default fallback (196 days ≈ 6.5 months) exposed the truncation
- Fix: clamped display to [0,99], moved default date to 45 days out (well within spec), added explicit test case `it('clamps days to 99 for display')` to vitest suite
- Rejected reviewer suggestion: left-align labels (flex-start) not center, per authoritative Figma frame — Figma is the source of truth; reviewer was reading a rendered screenshot, not the design spec

**Environment friction:**
- Shell node v12.22.9 (system default) fails Next 16 builds with cryptic errors
- nvm v22.20.0 (in subagent env) required for clean build
- No .nvmrc at project root → future clones will hit this blind

## What We Tried

1. **First attempt**: dispatched implementer with just MoMorph URL + screenId, expecting it to fetch design via MCP tools in background
   - Result: BLOCKED — MCP permission prompt hung because no interactive approver on subagent channel
   
2. **Pivot**: orchestrator (main thread) fetched all design data upfront via momorph MCP (which works with main thread approvals), transformed to concrete values, embedded assets as data URIs and local font files, re-dispatched implementer with everything specified
   - Result: DONE — implementer built presentational tree in 45 min, no MCP dependency

3. **Node version**: initially built with system node v12.22.9, got hang on Next transpile step
   - Diagnosis: ran `nvm use 22.20.0` (from subagent env config)
   - Result: DONE — clean build, all tests pass

4. **Review iteration**: reviewer flagged days truncation bug, suggested label centering
   - Days bug: fixed with clamp logic + moved default date
   - Label alignment: rejected (Figma shows left-aligned, not centered) — stood by spec, reviewer agreed

## Root Cause Analysis

**MCP subagent bottleneck:** Background subagents can't participate in interactive MCP approval flows because there's no parent thread to delegate the prompt to. The orchestration model assumes Track A is independent, but MCP tooling is fundamentally interactive (user approval required). This is a model-tool impedance mismatch, not a task design failure.

**Node version friction:** Project doesn't pin Node version at root (no .nvmrc, no Dockerfile, no scripts/check-node.sh). System node is too old, but the error is opaque (transpile hang, not a clear "unsupported version" message). Developers unfamiliar with the subagent setup won't know to activate nvm.

**Design-to-code gap:** Figma spec was complete, but the reviewer didn't have the authoritative frame data (only screenshots). This caused a false suggestion (label centering) that contradicted the source. Process lesson: always validate visual decisions against MoMorph node tree, not screenshots.

## Lessons Learned

1. **MoMorph two-track needs a data-layer gate:** Before spawning UI subagents, orchestrator must own all design-data fetching (MCP-expensive, needs approvals). Transform design → prop specs, embed assets, then dispatch implementer with zero MCP dependency. Subagent can be truly independent then.

2. **Node version needs explicit enforcement:** Add `.nvmrc` at project root (content: `22.20.0`), or add a preinstall script that checks `node --version` and errors if < 20.9. This catches the gotcha on `npm install`, not hidden in build logs.

3. **Figma is the source of truth, screenshots are not:** Reviewer feedback on visual alignment should always be cross-checked against the MoMorph node tree (exact flex properties, padding values). Design frames contain information screenshots don't show. Make this explicit in review guidance.

4. **LED truncation is a boundary case worth documenting:** Days ≥ 100 are possible (e.g., prelaunch 6+ months out), but the design's two-digit LED box can't represent them. The fix (clamp + move default) works, but future countdown uses should document the constraint upfront. Add a comment in `countdown-config.ts`: `// Design constraint: max 99 days displayable`

5. **Clarifications doc is gold:** Writing decisions to `clarifications.md` (Q → A format, one line per decision) meant no ambiguity during implementation. Freeze behavior, route, auth — all locked upfront. Zero mid-build surprises.

## Next Steps

1. **Pin Node version** (BLOCKING for onboarding): Add `.nvmrc` with `22.20.0` and document in README → `nvm install && nvm use`
2. **MCP subagent pattern** (for future MoMorph tasks): Orchestrator fetches all design data first, subagent builds UI from concrete props — document this in `.claude/rules/momorph-development.md` as a procedural requirement
3. **Review checklist** (process improvement): Add "validate visual suggestions against MoMorph node tree, not screenshot" to reviewer guidelines
4. **Days clamping comment** (code maintainability): Already added, but verify it appears in `countdown-config.ts` when code review resumes

---

**Status:** DONE

**Summary:** Countdown prelaunch page delivered via two-track MoMorph model. Exposed architectural friction (MCP+subagents mismatch) and Node version environment issue; both have actionable fixes. Code passes tests, build clean, repo created and pushed.
