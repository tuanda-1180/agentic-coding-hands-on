import { NextResponse } from "next/server";
import { getUserKudosCounts } from "@/app/lib/liveboard/user-queries";
import { isValidUserId } from "../../validation";

export const dynamic = "force-dynamic";

/** GET /api/users/[id]/summary — kudos received/sent counts for the hover info card. */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!isValidUserId(id)) {
      return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
    }
    return NextResponse.json(await getUserKudosCounts(id));
  } catch (err) {
    console.error("GET /api/users/[id]/summary failed:", err);
    return NextResponse.json({ error: "Failed to load user summary" }, { status: 500 });
  }
}
