/**
 * Mock notification store for development/demo.
 * No database — seed data lives here, keyed by user email.
 * Swap this module for a real DB query (e.g. Prisma) when ready.
 *
 * Store is in-memory at module level. resetStore() is exported for test isolation.
 */

export interface Notification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string; // ISO 8601
}

/** Seed notifications per user email — fixed ISO timestamps for determinism. */
const SEED: Record<string, Notification[]> = {
  "user@sun.example": [
    {
      id: "notif-u-1",
      title: "SAA 2025 nominations open",
      body: "The nomination window for Sun* Asterisk Awards 2025 is now open. Submit your nominees before the deadline.",
      read: false,
      createdAt: "2026-06-10T08:00:00.000Z",
    },
    {
      id: "notif-u-2",
      title: "Your nomination was received",
      body: "We received your nomination for the Excellence in Engineering category. Results will be announced on Award Night.",
      read: false,
      createdAt: "2026-06-12T10:30:00.000Z",
    },
    {
      id: "notif-u-3",
      title: "Award Night countdown begins",
      body: "Only 30 days until Award Night! Check the countdown page for live updates.",
      read: true,
      createdAt: "2026-06-15T09:00:00.000Z",
    },
  ],
  "admin@sun.example": [
    {
      id: "notif-a-1",
      title: "New nominations to review",
      body: "15 new nominations are awaiting admin review. Please log in to the admin panel to proceed.",
      read: false,
      createdAt: "2026-06-10T08:05:00.000Z",
    },
    {
      id: "notif-a-2",
      title: "Nomination period closing soon",
      body: "The nomination window closes in 48 hours. Remind eligible employees to submit their entries.",
      read: false,
      createdAt: "2026-06-16T07:00:00.000Z",
    },
    {
      id: "notif-a-3",
      title: "System maintenance scheduled",
      body: "A scheduled maintenance window is planned for 2026-06-20 00:00–02:00 UTC. Services may be briefly unavailable.",
      read: true,
      createdAt: "2026-06-17T06:00:00.000Z",
    },
  ],
};

/** Deep-clone seed data to produce a fresh mutable store. */
function buildStore(): Record<string, Notification[]> {
  const out: Record<string, Notification[]> = {};
  for (const [email, notifications] of Object.entries(SEED)) {
    out[email] = notifications.map((n) => ({ ...n }));
  }
  return out;
}

/** Module-level mutable store — one instance per process. */
let store: Record<string, Notification[]> = buildStore();

/**
 * Reset store to seed data.
 * Exported for test isolation — do NOT call in application code.
 */
export function resetStore(): void {
  store = buildStore();
}

/** Returns a shallow copy of the user's notification list. Unknown users → []. */
export function getNotifications(userEmail: string): Notification[] {
  const list = store[userEmail.toLowerCase()];
  if (!list) return [];
  return list.map((n) => ({ ...n }));
}

/** Counts unread notifications for a user. Unknown users → 0. */
export function getUnreadCount(userEmail: string): number {
  const list = store[userEmail.toLowerCase()];
  if (!list) return 0;
  return list.filter((n) => !n.read).length;
}

/**
 * Marks a single notification as read.
 * Silently no-ops for unknown user or unknown notification id.
 */
export function markAsRead(userEmail: string, id: string): void {
  const list = store[userEmail.toLowerCase()];
  if (!list) return;
  const notification = list.find((n) => n.id === id);
  if (notification) {
    notification.read = true;
  }
}

/**
 * Marks all notifications as read for the given user.
 * Silently no-ops for unknown user.
 */
export function markAllAsRead(userEmail: string): void {
  const list = store[userEmail.toLowerCase()];
  if (!list) return;
  for (const notification of list) {
    notification.read = true;
  }
}
