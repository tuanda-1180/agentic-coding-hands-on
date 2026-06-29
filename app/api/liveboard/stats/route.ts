import { NextResponse } from "next/server";
import { getStats } from "@/app/lib/liveboard/user-queries";

export const dynamic = "force-dynamic";

/** GET /api/liveboard/stats — current user's sidebar statistics. */
export async function GET() {
  try {
    return NextResponse.json(await getStats());
  } catch (err) {
    console.error("GET /api/liveboard/stats failed:", err);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
