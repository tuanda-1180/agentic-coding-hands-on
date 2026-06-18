import { describe, it, expect, beforeEach } from "vitest";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  resetStore,
} from "../notifications/store";

// Reset in-memory store before each test for isolation.
beforeEach(() => {
  resetStore();
});

describe("getNotifications", () => {
  it("returns seeded notifications for the regular user", () => {
    const items = getNotifications("user@sun.example");
    expect(items.length).toBeGreaterThan(0);
  });

  it("returns seeded notifications for the admin user", () => {
    const items = getNotifications("admin@sun.example");
    expect(items.length).toBeGreaterThan(0);
  });

  it("returns empty array for unknown user", () => {
    const items = getNotifications("nobody@example.com");
    expect(items).toEqual([]);
  });

  it("each notification has required shape fields", () => {
    const items = getNotifications("user@sun.example");
    for (const n of items) {
      expect(n).toHaveProperty("id");
      expect(n).toHaveProperty("title");
      expect(n).toHaveProperty("body");
      expect(n).toHaveProperty("read");
      expect(n).toHaveProperty("createdAt");
      expect(typeof n.read).toBe("boolean");
    }
  });

  it("returns a new array on each call (no mutation of internal state)", () => {
    const a = getNotifications("user@sun.example");
    const b = getNotifications("user@sun.example");
    expect(a).not.toBe(b);
  });
});

describe("getUnreadCount", () => {
  it("returns the correct unread count for the regular user", () => {
    const items = getNotifications("user@sun.example");
    const expected = items.filter((n) => !n.read).length;
    expect(getUnreadCount("user@sun.example")).toBe(expected);
  });

  it("returns 0 for unknown user", () => {
    expect(getUnreadCount("nobody@example.com")).toBe(0);
  });
});

describe("markAsRead", () => {
  it("marks a specific notification as read and decrements unread count", () => {
    const items = getNotifications("user@sun.example");
    const unread = items.find((n) => !n.read);
    if (!unread) throw new Error("test requires at least one unread notification in seed");

    const before = getUnreadCount("user@sun.example");
    markAsRead("user@sun.example", unread.id);
    expect(getUnreadCount("user@sun.example")).toBe(before - 1);

    const after = getNotifications("user@sun.example");
    const updated = after.find((n) => n.id === unread.id);
    expect(updated?.read).toBe(true);
  });

  it("is idempotent — marking already-read item does not decrement again", () => {
    const items = getNotifications("user@sun.example");
    const unread = items.find((n) => !n.read);
    if (!unread) throw new Error("test requires at least one unread notification");

    markAsRead("user@sun.example", unread.id);
    const countAfterFirst = getUnreadCount("user@sun.example");
    markAsRead("user@sun.example", unread.id);
    expect(getUnreadCount("user@sun.example")).toBe(countAfterFirst);
  });

  it("does nothing for unknown user", () => {
    expect(() => markAsRead("nobody@example.com", "any-id")).not.toThrow();
  });

  it("does nothing for unknown notification id", () => {
    const before = getUnreadCount("user@sun.example");
    markAsRead("user@sun.example", "non-existent-id");
    expect(getUnreadCount("user@sun.example")).toBe(before);
  });
});

describe("markAllAsRead", () => {
  it("sets unread count to 0 for the given user", () => {
    markAllAsRead("user@sun.example");
    expect(getUnreadCount("user@sun.example")).toBe(0);
  });

  it("all notifications are read after markAllAsRead", () => {
    markAllAsRead("admin@sun.example");
    const items = getNotifications("admin@sun.example");
    expect(items.every((n) => n.read)).toBe(true);
  });

  it("does not affect other users", () => {
    const adminBefore = getUnreadCount("admin@sun.example");
    markAllAsRead("user@sun.example");
    // admin count unchanged
    expect(getUnreadCount("admin@sun.example")).toBe(adminBefore);
  });

  it("does nothing for unknown user", () => {
    expect(() => markAllAsRead("nobody@example.com")).not.toThrow();
  });
});
