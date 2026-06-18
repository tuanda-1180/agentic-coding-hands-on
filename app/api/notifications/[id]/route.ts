import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { markAsRead, getUnreadCount } from "@/app/lib/notifications/store";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/notifications/[id]
 * Marks a single notification as read for the current user.
 * 401 if not authenticated.
 */
export async function PATCH(request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: "Missing notification id" }, { status: 400 });
  }

  markAsRead(session.user.email, id);
  const unreadCount = getUnreadCount(session.user.email);

  return NextResponse.json({ id, unreadCount });
}
