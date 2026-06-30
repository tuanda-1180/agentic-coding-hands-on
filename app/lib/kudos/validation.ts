// Pure, framework-free validation for the Write/Edit Kudo form.
// Shared by the client form hook (app/lib/kudos/use-kudo-form.ts) and the
// server API routes so both enforce identical rules.
import type { KudosInput } from "@/app/lib/liveboard/types";

export const MAX_TAGS = 5;
export const MAX_IMAGES = 5;
export const MIN_TAGS = 1;
export const MAX_TITLE_LEN = 100;
export const MAX_CONTENT_LEN = 10_000; // raw HTML length cap (anti-DoS / stored-XSS surface)
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Kudo images must come from our own storage bucket — reject arbitrary external URLs.
const STORAGE_PREFIX = `${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""}/storage/v1/object/public/kudo-images/`;

export type KudoFieldError =
  | "required"
  | "maxTags"
  | "maxImages"
  | "invalidFileType"
  | "invalidUrl"
  | "tooLong";

export interface KudoErrors {
  receiver?: KudoFieldError;
  title?: KudoFieldError;
  content?: KudoFieldError;
  tags?: KudoFieldError;
  images?: KudoFieldError;
}

/** True when rich-text HTML has no visible text (only tags / whitespace / &nbsp;). */
export function isHtmlEmpty(html: string): boolean {
  const text = html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
  return text.length === 0;
}

export function isAcceptedImageType(type: string): boolean {
  return ACCEPTED_IMAGE_TYPES.includes(type);
}

/**
 * Validate the full payload. Returns a map of field → error code (empty = valid).
 * Required: receiver, title, content (non-empty HTML), at least one tag.
 */
export function validateKudoInput(input: Partial<KudosInput>): KudoErrors {
  const errors: KudoErrors = {};

  if (!input.receiverId) errors.receiver = "required";
  if (!input.title || input.title.trim().length === 0) errors.title = "required";
  else if (input.title.length > MAX_TITLE_LEN) errors.title = "tooLong";

  if (!input.content || isHtmlEmpty(input.content)) errors.content = "required";
  else if (input.content.length > MAX_CONTENT_LEN) errors.content = "tooLong";

  const tags = input.tags ?? [];
  if (tags.length < MIN_TAGS) errors.tags = "required";
  else if (tags.length > MAX_TAGS) errors.tags = "maxTags";

  const images = input.images ?? [];
  if (images.length > MAX_IMAGES) errors.images = "maxImages";
  // Only enforce the origin check when we know our storage URL (server + NEXT_PUBLIC on client).
  else if (STORAGE_PREFIX.startsWith("http") && images.some((u) => !u.startsWith(STORAGE_PREFIX)))
    errors.images = "invalidUrl";

  return errors;
}

export function hasErrors(errors: KudoErrors): boolean {
  return Object.keys(errors).length > 0;
}

// ---- "Thêm đường dẫn" (Add link) dialog validation (screen OyDLDuSGEa) ----

export const LINK_TEXT_MAX = 100;
export const LINK_URL_MIN = 5;
export const LINK_URL_MAX = 2048;

/** Link display text: required, 1–100 chars, not whitespace-only. */
export function isValidLinkText(text: string): boolean {
  const t = text.trim();
  return t.length >= 1 && t.length <= LINK_TEXT_MAX;
}

/** Link URL: required, http/https, 5–2048 chars. */
export function isValidLinkUrl(url: string): boolean {
  const u = url.trim();
  if (u.length < LINK_URL_MIN || u.length > LINK_URL_MAX) return false;
  try {
    const parsed = new URL(u);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
