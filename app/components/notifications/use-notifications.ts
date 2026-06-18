"use client";

import { useState, useEffect, useCallback } from "react";
import type { Notification } from "@/app/lib/notifications/store";

export interface UseNotificationsResult {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
}

/**
 * Client hook that fetches and manages the current user's notifications.
 * Calls /api/notifications for list + unreadCount.
 * Calls /api/notifications/[id] (PATCH) to mark one read.
 * Calls /api/notifications (PATCH) to mark all read.
 *
 * Returns empty state (loading=false, unreadCount=0) when unauthenticated
 * — the API returns 401 and the hook treats it as an empty list.
 */
export function useNotifications(): UseNotificationsResult {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) {
        // 401 unauthenticated or other error — reset to empty state
        setNotifications([]);
        setUnreadCount(0);
        return;
      }
      const data = (await res.json()) as {
        notifications: Notification[];
        unreadCount: number;
      };
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch {
      // Network error — leave state as-is, do not crash
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // fetchNotifications is async: every setState runs in a microtask AFTER the
    // awaited fetch resolves, never synchronously within the effect body — so the
    // cascading-render concern this rule guards against does not apply here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchNotifications();
  }, [fetchNotifications]);

  const markRead = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: "PATCH" });
      if (!res.ok) return;
      const data = (await res.json()) as { id: string; unreadCount: number };
      setUnreadCount(data.unreadCount);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {
      // Silently ignore — badge will be corrected on next fetch
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications", { method: "PATCH" });
      if (!res.ok) return;
      const data = (await res.json()) as { unreadCount: number };
      setUnreadCount(data.unreadCount);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // Silently ignore
    }
  }, []);

  return { notifications, unreadCount, loading, markRead, markAllRead };
}
