"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useDropdown } from "@/app/components/ui/use-dropdown";
import { useNotifications } from "@/app/components/notifications/use-notifications";
import { NotificationBadge } from "@/app/components/notifications/notification-badge";
import { NotificationPanel } from "@/app/components/notifications/notification-panel";

/**
 * Notification bell + panel dropdown.
 * Always rendered in the header (per design spec A1.6). For guests the
 * /api/notifications call returns 401, so the hook resolves to an empty list
 * and the badge stays hidden.
 */
export function HeaderNotifBell() {
  const tAuth = useTranslations("auth");
  const { isOpen, triggerRef, menuRef, triggerProps, menuProps } = useDropdown();
  const { notifications, unreadCount, loading, markRead, markAllRead } =
    useNotifications();

  return (
    <div style={{ position: "relative" }}>
      <button
        ref={triggerRef}
        aria-label={tAuth("notifications")}
        style={{
          position: "relative",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "4px",
          border: "none",
          backgroundColor: "transparent",
          cursor: "pointer",
        }}
        {...triggerProps}
      >
        <Image
          src="/saa/icon-notification.svg"
          alt=""
          aria-hidden={true}
          width={24}
          height={24}
        />
        <NotificationBadge unreadCount={unreadCount} />
      </button>
      {isOpen && (
        <div
          ref={menuRef as React.RefObject<HTMLDivElement>}
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            right: 0,
            zIndex: 100,
          }}
          {...menuProps}
        >
          <NotificationPanel
            notifications={notifications}
            loading={loading}
            onMarkRead={markRead}
            onMarkAllRead={markAllRead}
          />
        </div>
      )}
    </div>
  );
}
