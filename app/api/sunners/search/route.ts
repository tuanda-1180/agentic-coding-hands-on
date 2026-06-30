import { NextResponse } from "next/server";
import { searchSunners } from "@/app/lib/liveboard/user-queries";

export const dynamic = "force-dynamic";

/** GET /api/sunners/search?q=&limit= — recipient picker + @mention candidates. */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? "";
    const limitRaw = searchParams.get("limit");
    const limit = limitRaw ? Number(limitRaw) : 8;
    const items = await searchSunners(q, Number.isFinite(limit) ? limit : 8);
    return NextResponse.json({ items });
  } catch (err) {
    console.error("GET /api/sunners/search failed:", err);
    return NextResponse.json({ error: "Failed to search sunners" }, { status: 500 });
  }
}
