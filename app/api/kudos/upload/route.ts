import { NextResponse } from "next/server";
import { uploadKudoImages, UploadError } from "@/app/lib/kudos/upload-image";
import { currentUserId } from "@/app/lib/liveboard/user-queries";

export const dynamic = "force-dynamic";

/** POST /api/kudos/upload — multipart form-data with one or more `files`. Returns { urls }. */
export async function POST(req: Request) {
  try {
    const uid = await currentUserId();
    if (!uid) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }

    const form = await req.formData();
    const files = form.getAll("files").filter((f): f is File => f instanceof File);
    const urls = await uploadKudoImages(files);
    return NextResponse.json({ urls });
  } catch (err) {
    if (err instanceof UploadError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("POST /api/kudos/upload failed:", err);
    return NextResponse.json({ error: "Failed to upload images" }, { status: 500 });
  }
}
