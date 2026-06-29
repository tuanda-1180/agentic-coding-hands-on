import { NextResponse } from "next/server";
import { getPublicProfile } from "@/app/lib/liveboard/profile-queries";
import { isValidUserId } from "../../validation";

export const dynamic = "force-dynamic";

/** GET /api/users/[id]/profile — header (user + public stats + icon collection) for any user. */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!isValidUserId(id)) {
      return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
    }
    const data = await getPublicProfile(id);
    if (!data.user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error("GET /api/users/[id]/profile failed:", err);
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}
