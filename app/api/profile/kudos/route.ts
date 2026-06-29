import { NextResponse, type NextRequest } from "next/server";
import { getKudosByUser } from "@/app/lib/liveboard/profile-queries";
import type { KudosDirection } from "@/app/lib/liveboard/types";

export const dynamic = "force-dynamic";

/** Parse a non-negative integer query param; default when absent, null when invalid. */
function parseIntParam(raw: string | null, fallback: number): number | null {
  if (raw === null || raw === "") return fallback;
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 ? n : null;
}

/**
 * GET /api/profile/kudos?direction=received|sent&page=&pageSize=
 * Paginated kudos for the current user. Defaults to "sent" (matches the dropdown default).
 */
export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const direction: KudosDirection =
      sp.get("direction") === "received" ? "received" : "sent";
    const page = parseIntParam(sp.get("page"), 0);
    const pageSize = parseIntParam(sp.get("pageSize"), 8);
    // page may be 0 (first page); pageSize must be at least 1 (0 yields an empty range).
    if (page === null || pageSize === null || pageSize < 1) {
      return NextResponse.json({ error: "Invalid pagination params" }, { status: 400 });
    }
    const data = await getKudosByUser({ direction, page, pageSize });
    return NextResponse.json(data);
  } catch (err) {
    console.error("GET /api/profile/kudos failed:", err);
    return NextResponse.json({ error: "Failed to load profile kudos" }, { status: 500 });
  }
}
