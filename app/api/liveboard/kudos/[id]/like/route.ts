import { NextResponse } from "next/server";
import { toggleLike } from "@/app/lib/liveboard/user-queries";

export const dynamic = "force-dynamic";

/**
 * POST /api/liveboard/kudos/[id]/like
 * Toggles the current user's like on a kudos. Enforces: sender cannot like own kudos.
 */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    return NextResponse.json(await toggleLike(id));
  } catch (err) {
    console.error("POST /api/liveboard/kudos/[id]/like failed:", err);
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
  }
}
