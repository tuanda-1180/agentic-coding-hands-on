# Phase 05 — Notifications · Report

**Date:** 2026-06-18
**Status:** DONE

---

## Files Created

| File | Lines |
|------|-------|
| `app/lib/notifications/store.ts` | 105 |
| `app/api/notifications/route.ts` | 43 |
| `app/api/notifications/[id]/route.ts` | 38 |
| `app/components/notifications/use-notifications.ts` | 81 |
| `app/components/notifications/notification-badge.tsx` | 37 |
| `app/components/notifications/notification-panel.tsx` | 196 |
| `app/lib/__tests__/notifications-store.test.ts` | 109 |

All files are under 200 lines. No existing files were modified.

---

## Store API (`app/lib/notifications/store.ts`)

```ts
export interface Notification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string; // ISO 8601
}

getNotifications(userEmail: string): Notification[]
getUnreadCount(userEmail: string): number
markAsRead(userEmail: string, id: string): void
markAllAsRead(userEmail: string): void
resetStore(): void   // test isolation only — not for app code
```

- Seed data: 3 notifications per seed user (`user@sun.example`, `admin@sun.example`). Each user has 2 unread + 1 read in the default seed.
- Email matching is case-insensitive.
- Unknown user → empty list / count 0 / no-op mutations.
- `resetStore()` deep-clones seed back to module-level store — exported only for test isolation.
- All timestamps are fixed ISO strings (deterministic, no `Date.now()` at module load).

---

## API Routes (scoped to authenticated user via `auth()`)

### `GET /api/notifications`
Returns `{ notifications: Notification[], unreadCount: number }` for the session user.
Returns `401 { error: "Unauthorized" }` if no session.

### `PATCH /api/notifications`
Marks **all** notifications as read for the session user.
Returns `{ unreadCount: number }`.
Returns `401` if no session.

### `PATCH /api/notifications/[id]`
Marks a **single** notification as read.
Returns `{ id: string, unreadCount: number }`.
Returns `401` if no session, `400` if id is missing.

Session user email is taken from `session.user.email` (Auth.js v5 `auth()` call — same pattern as Phase 03).

---

## Hook Interface (`app/components/notifications/use-notifications.ts`)

```ts
export interface UseNotificationsResult {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
}

export function useNotifications(): UseNotificationsResult
```

- Fetches from `/api/notifications` on mount.
- 401 response → empty state (unauthenticated guest; no error thrown).
- Network errors are caught silently (badge corrects on next mount/fetch).
- `markRead(id)` calls `PATCH /api/notifications/[id]`; optimistically updates local state.
- `markAllRead()` calls `PATCH /api/notifications`; optimistically updates local state.

---

## Badge Interface (`app/components/notifications/notification-badge.tsx`)

```ts
export interface NotificationBadgeProps {
  unreadCount: number;
}
export function NotificationBadge({ unreadCount }: NotificationBadgeProps): JSX.Element | null
```

- Returns `null` when `unreadCount <= 0` (no badge for zero unread — spec ID-29).
- Red dot `#D4271D`, 8×8px, `position: absolute` top-right — drop into `position: relative` container.
- `aria-label` includes the count for screen readers.

---

## Panel Interface (`app/components/notifications/notification-panel.tsx`)

```ts
export interface NotificationPanelProps {
  notifications: Notification[];
  loading: boolean;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}
export function NotificationPanel(props: NotificationPanelProps): JSX.Element
```

- Dark theme: `rgba(16,20,23,0.98)` background, `#2E3940` border/dividers — consistent with existing header style.
- Loading state: "Loading…" message.
- Empty state: "No notifications" message (spec ID-29 analog).
- Each item: title (bold/dimmed by read state), body (2-line clamp), relative time, red dot for unread.
- "Mark all as read" button visible only when `unreadCount > 0`.
- Unread items are clickable (keyboard: Enter/Space) and call `onMarkRead`.

---

## Phase 07 Integration Guide (header bell)

```tsx
// In site-header.tsx (Phase 07) — client component
import { useNotifications } from "@/app/components/notifications/use-notifications";
import { NotificationBadge } from "@/app/components/notifications/notification-badge";
import { NotificationPanel } from "@/app/components/notifications/notification-panel";

const { notifications, unreadCount, loading, markRead, markAllRead } = useNotifications();

// Bell button wrapper (already 40×40, position: relative):
<div style={{ position: "relative" }}>
  <button onClick={() => setNotifOpen(v => !v)}>
    <Image src="/saa/icon-notification.svg" ... />
    <NotificationBadge unreadCount={unreadCount} />
  </button>
  {notifOpen && (
    <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 100 }}>
      <NotificationPanel
        notifications={notifications}
        loading={loading}
        onMarkRead={markRead}
        onMarkAllRead={markAllRead}
      />
    </div>
  )}
</div>
```

The existing `hasUnreadNotification` prop and inline badge span in `site-header.tsx` should be replaced with `NotificationBadge` + live `unreadCount` from the hook. The `{notifOpen && <div>No notifications</div>}` shell becomes `<NotificationPanel .../>`.

---

## Build & Test Results

### TypeScript (`tsc --noEmit`)
```
(no output — clean)
```

### Vitest (`npm test`)
```
Test Files  3 passed (3)
     Tests  77 passed (77)   (62 original + 15 new notification store tests)
  Duration  426ms
```

### Production Build (`npm run build`)
```
Route (app)
┌ ƒ /api/notifications
├ ƒ /api/notifications/[id]
... (all previous routes present)
ƒ Proxy (Middleware)
```
Build clean. Both notification endpoints present. No errors.

---

## Deviations from Plan

None. All spec deliverables implemented as described. The `[id]/route.ts` was added as a separate file for clean separation of the single-notification PATCH from the collection-level GET+PATCH.
