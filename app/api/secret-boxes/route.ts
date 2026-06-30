import { NextResponse } from "next/server";
import { currentUnopenedCount } from "@/app/lib/secret-box/secret-box-write";

export const dynamic = "force-dynamic";

/** GET /api/secret-boxes — unopened box count for the signed-in user. */
export async function GET() {
  try {
    const unopenedRemaining = await currentUnopenedCount();
    return NextResponse.json({ unopenedRemaining }, { status: 200 });
  } catch (err) {
    console.error("GET /api/secret-boxes failed:", err);
    return NextResponse.json({ error: "Failed to load secret boxes" }, { status: 500 });
  }
}
