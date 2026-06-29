import { NextResponse } from "next/server";
import { getLeaderboards } from "@/app/lib/liveboard/user-queries";

export const dynamic = "force-dynamic";

/** GET /api/liveboard/leaderboards — rank-up + gift-recipient leaderboards. */
export async function GET() {
  try {
    return NextResponse.json(await getLeaderboards());
  } catch (err) {
    console.error("GET /api/liveboard/leaderboards failed:", err);
    return NextResponse.json({ error: "Failed to load leaderboards" }, { status: 500 });
  }
}
