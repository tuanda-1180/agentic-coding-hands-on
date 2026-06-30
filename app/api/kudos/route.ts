import { NextResponse } from "next/server";
import { createKudo, KudoWriteError } from "@/app/lib/liveboard/kudos-write";
import type { KudosInput } from "@/app/lib/liveboard/types";

export const dynamic = "force-dynamic";

/** POST /api/kudos — create a new kudo authored by the signed-in user. */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<KudosInput>;
    const kudo = await createKudo({
      receiverId: body.receiverId ?? "",
      title: body.title ?? "",
      content: body.content ?? "",
      category: body.category ?? "",
      tags: body.tags ?? [],
      images: body.images ?? [],
      isAnonymous: !!body.isAnonymous,
      anonymousName: body.anonymousName ?? "",
    });
    return NextResponse.json(kudo, { status: 201 });
  } catch (err) {
    if (err instanceof KudoWriteError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("POST /api/kudos failed:", err);
    return NextResponse.json({ error: "Failed to create kudo" }, { status: 500 });
  }
}
