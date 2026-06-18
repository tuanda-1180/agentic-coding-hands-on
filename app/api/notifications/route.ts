import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getNotifications,
  getUnreadCount,
  markAllAsRead,
} from "@/app/lib/notifications/store";

/**
 * GET /api/notifications
 * Returns the current user's notifications and unread count.
 * 401 if not authenticated.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = session.user.email;
  const notifications = getNotifications(email);
  const unreadCount = getUnreadCount(email);

  return NextResponse.json({ notifications, unreadCount });
}

/**
 * PATCH /api/notifications
 * Marks all notifications as read for the current user.
 * 401 if not authenticated.
 */
export async function PATCH() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  markAllAsRead(session.user.email);
  const unreadCount = getUnreadCount(session.user.email);

  return NextResponse.json({ unreadCount });
}
