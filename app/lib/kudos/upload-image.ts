// Server-only: upload kudo image attachments to Supabase Storage.
import "server-only";
import { getServiceClient } from "@/app/lib/supabase/server-client";
import { isAcceptedImageType, MAX_IMAGES } from "./validation";

const BUCKET = "kudo-images";

export class UploadError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "UploadError";
  }
}

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB per image

// Verify real file type by magic bytes — File.type is client-supplied and spoofable.
function sniffImageType(bytes: Uint8Array): "image/jpeg" | "image/png" | "image/webp" | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png";
  // RIFF....WEBP
  if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) return "image/webp";
  return null;
}

/**
 * Upload up to MAX_IMAGES files; returns their public URLs.
 * Rejects unsupported MIME types and oversized batches.
 */
export async function uploadKudoImages(files: File[]): Promise<string[]> {
  if (files.length === 0) return [];
  if (files.length > MAX_IMAGES) {
    throw new UploadError(400, `Tối đa ${MAX_IMAGES} ảnh`);
  }

  const supabase = getServiceClient();
  const urls: string[] = [];

  for (const file of files) {
    if (file.size > MAX_FILE_BYTES) {
      throw new UploadError(400, "Ảnh tối đa 5MB");
    }
    // Authoritative type check by content, not the spoofable File.type header.
    const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    const realType = sniffImageType(header);
    if (!realType || !isAcceptedImageType(realType)) {
      throw new UploadError(400, "Định dạng file không hợp lệ");
    }
    const path = `${crypto.randomUUID()}.${EXT[realType]}`;
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: realType, upsert: false });
    if (error) throw new UploadError(500, error.message);

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return urls;
}
