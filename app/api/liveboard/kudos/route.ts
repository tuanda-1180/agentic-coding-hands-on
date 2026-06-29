import { NextResponse, type NextRequest } from "next/server";
import { getFeed } from "@/app/lib/liveboard/kudos-queries";

export const dynamic = "force-dynamic";

/** Parse a non-negative integer query param; returns the default when absent, null when invalid. */
function parseIntParam(raw: string | null, fallback: number): number | null {
  if (raw === null || raw === "") return fallback;
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 ? n : null;
}

/**
 * GET /api/liveboard/kudos?hashtag=&department=&page=&pageSize=
 * Paginated ALL KUDOS feed.
 */
export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const page = parseIntParam(sp.get("page"), 0);
    const pageSize = parseIntParam(sp.get("pageSize"), 10);
    if (page === null || pageSize === null) {
      return NextResponse.json({ error: "Invalid pagination params" }, { status: 400 });
    }
    const data = await getFeed({
      hashtag: sp.get("hashtag") || undefined,
      department: sp.get("department") || undefined,
      page,
      pageSize,
    });
    return NextResponse.json(data);
  } catch (err) {
    console.error("GET /api/liveboard/kudos failed:", err);
    return NextResponse.json({ error: "Failed to load kudos feed" }, { status: 500 });
  }
}
