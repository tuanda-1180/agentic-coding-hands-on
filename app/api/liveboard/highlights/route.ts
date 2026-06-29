import { NextResponse, type NextRequest } from "next/server";
import { getHighlights } from "@/app/lib/liveboard/kudos-queries";

export const dynamic = "force-dynamic";

/** GET /api/liveboard/highlights?hashtag=&department= — top 5 kudos by hearts. */
export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const items = await getHighlights({
      hashtag: sp.get("hashtag") || undefined,
      department: sp.get("department") || undefined,
    });
    return NextResponse.json({ items });
  } catch (err) {
    console.error("GET /api/liveboard/highlights failed:", err);
    return NextResponse.json({ error: "Failed to load highlights" }, { status: 500 });
  }
}
