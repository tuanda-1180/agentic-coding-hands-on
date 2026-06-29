import { NextResponse } from "next/server";
import { getFilters } from "@/app/lib/liveboard/kudos-queries";

export const dynamic = "force-dynamic";

/** GET /api/liveboard/filters — hashtag + department filter options. */
export async function GET() {
  try {
    return NextResponse.json(await getFilters());
  } catch (err) {
    console.error("GET /api/liveboard/filters failed:", err);
    return NextResponse.json({ error: "Failed to load filters" }, { status: 500 });
  }
}
