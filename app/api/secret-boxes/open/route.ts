import { NextResponse } from "next/server";
import { openSecretBox, SecretBoxError } from "@/app/lib/secret-box/secret-box-write";

export const dynamic = "force-dynamic";

/** POST /api/secret-boxes/open — open one box, return the won badge + remaining. */
export async function POST() {
  try {
    const result = await openSecretBox();
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    if (err instanceof SecretBoxError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("POST /api/secret-boxes/open failed:", err);
    return NextResponse.json({ error: "Failed to open secret box" }, { status: 500 });
  }
}
