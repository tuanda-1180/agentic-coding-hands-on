import { NextResponse, type NextRequest } from "next/server";
import { getKudosByUser } from "@/app/lib/liveboard/profile-queries";
import type { KudosDirection } from "@/app/lib/liveboard/types";
import { isValidUserId, parseIntParam } from "../../validation";

export const dynamic = "force-dynamic";

// Upper bounds make the contract explicit (the query layer also clamps pageSize).
const MAX_PAGE_SIZE = 50;
const MAX_PAGE = 10000;

/**
 * GET /api/users/[id]/kudos?direction=received|sent&page=&pageSize=
 * Paginated kudos for a specific user. Defaults to "sent" (matches the dropdown default).
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!isValidUserId(id)) {
      return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
    }
    const sp = req.nextUrl.searchParams;
    const direction: KudosDirection =
      sp.get("direction") === "received" ? "received" : "sent";
    const page = parseIntParam(sp.get("page"), 0);
    const pageSize = parseIntParam(sp.get("pageSize"), 8);
    // page may be 0 (first page); pageSize must be 1..MAX_PAGE_SIZE.
    if (
      page === null ||
      pageSize === null ||
      pageSize < 1 ||
      pageSize > MAX_PAGE_SIZE ||
      page > MAX_PAGE
    ) {
      return NextResponse.json({ error: "Invalid pagination params" }, { status: 400 });
    }
    const data = await getKudosByUser({ userId: id, direction, page, pageSize });
    return NextResponse.json(data);
  } catch (err) {
    console.error("GET /api/users/[id]/kudos failed:", err);
    return NextResponse.json({ error: "Failed to load user kudos" }, { status: 500 });
  }
}
