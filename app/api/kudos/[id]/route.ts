import { NextResponse } from "next/server";
import { updateKudo, KudoWriteError } from "@/app/lib/liveboard/kudos-write";
import type { KudosInput } from "@/app/lib/liveboard/types";

export const dynamic = "force-dynamic";

/** PATCH /api/kudos/[id] — edit a kudo (only the original sender may edit). */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = (await req.json()) as Partial<KudosInput>;
    const kudo = await updateKudo(id, {
      receiverId: body.receiverId ?? "",
      title: body.title ?? "",
      content: body.content ?? "",
      category: body.category ?? "",
      tags: body.tags ?? [],
      images: body.images ?? [],
      isAnonymous: !!body.isAnonymous,
      anonymousName: body.anonymousName ?? "",
    });
    return NextResponse.json(kudo);
  } catch (err) {
    if (err instanceof KudoWriteError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("PATCH /api/kudos/[id] failed:", err);
    return NextResponse.json({ error: "Failed to update kudo" }, { status: 500 });
  }
}
