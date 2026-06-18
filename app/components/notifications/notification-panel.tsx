"use client";

import type { Notification } from "@/app/lib/notifications/store";

/**
 * NotificationPanel
 * Renders a list of notifications: title, body, relative time, read/unread styling.
 * Also renders empty state and a "mark all read" affordance.
 *
 * Dark theme consistent with the app (rgba(16,20,23,...) backgrounds, #2E3940 borders).
 *
 * Phase 07 wires this into the header bell dropdown by passing props from
 * useNotifications():
 *   <NotificationPanel
 *     notifications={notifications}
 *     loading={loading}
 *     onMarkRead={markRead}
 *     onMarkAllRead={markAllRead}
 *   />
 */

export interface NotificationPanelProps {
  notifications: Notification[];
  loading: boolean;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

/** Converts an ISO timestamp to a human-readable relative label. */
function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (isNaN(diff)) return "";

  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export function NotificationPanel({
  notifications,
  loading,
  onMarkRead,
  onMarkAllRead,
}: NotificationPanelProps) {
  const panelStyle: React.CSSProperties = {
    width: "360px",
    maxHeight: "480px",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "rgba(16,20,23,0.98)",
    border: "1px solid #2E3940",
    borderRadius: "8px",
    overflow: "hidden",
    fontFamily: "var(--font-montserrat, sans-serif)",
    color: "#FFFFFF",
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 16px 12px",
    borderBottom: "1px solid #2E3940",
    flexShrink: 0,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "15px",
    fontWeight: 700,
    color: "#FFFFFF",
    margin: 0,
  };

  const markAllBtnStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "12px",
    color: "#FFEA9E",
    fontFamily: "inherit",
    padding: "4px 0",
  };

  const listStyle: React.CSSProperties = {
    overflowY: "auto",
    flex: 1,
  };

  if (loading) {
    return (
      <div style={panelStyle}>
        <div
          style={{
            padding: "24px 16px",
            textAlign: "center",
            color: "#8A9BAE",
            fontSize: "14px",
          }}
        >
          Loading…
        </div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div style={panelStyle}>
        <div
          style={{
            padding: "32px 16px",
            textAlign: "center",
            color: "#8A9BAE",
            fontSize: "14px",
          }}
        >
          No notifications
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div style={panelStyle} role="region" aria-label="Notifications">
      {/* Header */}
      <div style={headerStyle}>
        <h2 style={titleStyle}>Notifications</h2>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            style={markAllBtnStyle}
            aria-label="Mark all notifications as read"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* List */}
      <ul style={{ ...listStyle, listStyle: "none", margin: 0, padding: 0 }}>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkRead={onMarkRead}
          />
        ))}
      </ul>
    </div>
  );
}

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
}

function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
  const { id, title, body, read, createdAt } = notification;

  const itemStyle: React.CSSProperties = {
    display: "flex",
    gap: "12px",
    padding: "12px 16px",
    borderBottom: "1px solid #1E2830",
    cursor: read ? "default" : "pointer",
    backgroundColor: read ? "transparent" : "rgba(255,234,158,0.04)",
    transition: "background-color 0.15s",
  };

  const dotStyle: React.CSSProperties = {
    flexShrink: 0,
    marginTop: "6px",
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: read ? "transparent" : "#D4271D",
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: read ? 400 : 600,
    color: read ? "#8A9BAE" : "#FFFFFF",
    marginBottom: "4px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const bodyStyle: React.CSSProperties = {
    fontSize: "13px",
    color: read ? "#6B7D8D" : "#B0BEC5",
    lineHeight: 1.4,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  };

  const timeStyle: React.CSSProperties = {
    fontSize: "11px",
    color: "#4A6070",
    marginTop: "4px",
  };

  function handleClick() {
    if (!read) {
      onMarkRead(id);
    }
  }

  return (
    <li
      style={itemStyle}
      onClick={handleClick}
      role={read ? undefined : "button"}
      aria-pressed={read ? undefined : false}
      tabIndex={read ? undefined : 0}
      onKeyDown={(e) => {
        if (!read && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onMarkRead(id);
        }
      }}
    >
      {/* Unread indicator dot */}
      <span aria-hidden="true" style={dotStyle} />

      {/* Content */}
      <div style={contentStyle}>
        <p style={titleStyle}>{title}</p>
        <p style={bodyStyle}>{body}</p>
        <p style={timeStyle}>{relativeTime(createdAt)}</p>
      </div>
    </li>
  );
}
