import { NextResponse } from "next/server";
import { getProfileData } from "@/app/lib/liveboard/profile-queries";

export const dynamic = "force-dynamic";

/** GET /api/profile — current user's profile header (user + stats + icon collection). */
export async function GET() {
  try {
    return NextResponse.json(await getProfileData());
  } catch (err) {
    console.error("GET /api/profile failed:", err);
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}
