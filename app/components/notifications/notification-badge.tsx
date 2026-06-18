"use client";

/**
 * NotificationBadge
 * Renders a small red dot (#D4271D) when unreadCount > 0.
 * Positioned absolutely — place inside a `position: relative` container.
 *
 * Usage (Phase 07 bell button):
 *   <div style={{ position: "relative" }}>
 *     <BellIcon />
 *     <NotificationBadge unreadCount={unreadCount} />
 *   </div>
 */
export interface NotificationBadgeProps {
  unreadCount: number;
}

export function NotificationBadge({ unreadCount }: NotificationBadgeProps) {
  if (unreadCount <= 0) return null;

  return (
    <span
      aria-label={`${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`}
      style={{
        position: "absolute",
        top: "2px",
        right: "2px",
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        backgroundColor: "#D4271D",
        pointerEvents: "none",
      }}
    />
  );
}
