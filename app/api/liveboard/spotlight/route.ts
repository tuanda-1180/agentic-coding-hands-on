import { NextResponse } from "next/server";
import { getSpotlight } from "@/app/lib/liveboard/kudos-queries";

export const dynamic = "force-dynamic";

/** GET /api/liveboard/spotlight — total kudos count + word-cloud nodes. */
export async function GET() {
  try {
    return NextResponse.json(await getSpotlight());
  } catch (err) {
    console.error("GET /api/liveboard/spotlight failed:", err);
    return NextResponse.json({ error: "Failed to load spotlight" }, { status: 500 });
  }
}
