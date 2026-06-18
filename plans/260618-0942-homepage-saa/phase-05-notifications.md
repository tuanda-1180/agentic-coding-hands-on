# Phase 05 — Notifications (Track B)

**Track:** B (logic) · **blockedBy:** 03 (notifications are per-authenticated-user) · **Status:** ✓ completed (2026-06-18)

**Goal:** Full notification feature for authenticated users: data, unread badge, panel.

## Architecture
- Notification data model: `{ id, title, body, read, createdAt }` per user.
- Mock data layer (seed notifications) behind Route Handlers (`GET /api/notifications`, `PATCH` mark-read) — no DB; same data-access pattern as Phase 03.
- Client hook to fetch + track unread count; mark-as-read on open/click.

## Behavior (test cases)
- ID-11/28: unread count > 0 → red badge on the 40×40 bell.
- ID-29: no unread → no badge.
- ID-27: click bell → notification panel opens (list of notifications).
- Guest users: bell hidden/disabled (per auth state from Phase 03).

## Deliverables
- API route(s) + mock seed, notifications hook, panel component (Track A provides the visual shell; logic + data here), badge logic.

## Success criteria
Authenticated user sees seeded notifications; badge reflects unread count; opening panel + marking read updates badge; build clean; tests for unread-count + mark-read logic.

## Out of scope
Real push/websocket delivery, notification preferences (future). Bell/panel pixel layout (Track A).
