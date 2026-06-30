// Write-path queries for kudos: create + edit. Server-only (service_role).
import "server-only";
import DOMPurify from "isomorphic-dompurify";
import { getServiceClient } from "@/app/lib/supabase/server-client";
import { currentIdentity } from "./user-queries";
import { KUDOS_SELECT } from "./kudos-queries";
import { toKudos, type KudosRow } from "./mappers";
import { validateKudoInput, hasErrors, MAX_IMAGES } from "@/app/lib/kudos/validation";
import type { KudosInput, KudosPost } from "./types";

export class KudoWriteError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "KudoWriteError";
  }
}

// Trim/clamp the payload to the persisted shape (defends the DB regardless of client).
function normalize(input: KudosInput) {
  const tags = (input.tags ?? []).slice(0, 5);
  return {
    title: input.title.trim(),
    // Defense-in-depth: sanitize the rich-text HTML before it ever hits the DB,
    // so no render path (feed, export, notifications) can receive script tags.
    content: DOMPurify.sanitize(input.content),
    // Derive category from the primary hashtag server-side — never trust the
    // client value (an empty category would pollute the filter options).
    category: tags[0] ?? input.category ?? "",
    tags,
    images: (input.images ?? []).slice(0, MAX_IMAGES),
    is_anonymous: !!input.isAnonymous,
    // Only persist the alias when actually anonymous; trim + cap length.
    anonymous_name: input.isAnonymous ? (input.anonymousName ?? "").trim().slice(0, 50) || null : null,
  };
}

function assertValid(input: KudosInput) {
  const errors = validateKudoInput(input);
  if (hasErrors(errors)) {
    throw new KudoWriteError(400, `Invalid kudo payload: ${JSON.stringify(errors)}`);
  }
}

/** Insert a new kudo authored by the signed-in user. */
export async function createKudo(input: KudosInput): Promise<KudosPost> {
  const me = await currentIdentity();
  if (!me) throw new KudoWriteError(401, "Sign in required");
  assertValid(input);

  const { data, error } = await getServiceClient()
    .from("kudos")
    .insert({ sender_id: me.uid, receiver_id: input.receiverId, ...normalize(input) })
    .select(KUDOS_SELECT)
    .single();
  if (error) throw error;
  return toKudos(data as unknown as KudosRow, undefined, me.uid, me);
}

/** Update an existing kudo — only the original sender may edit it. */
export async function updateKudo(id: string, input: KudosInput): Promise<KudosPost> {
  const me = await currentIdentity();
  if (!me) throw new KudoWriteError(401, "Sign in required");

  const supabase = getServiceClient();
  const { data: existing } = await supabase
    .from("kudos")
    .select("sender_id")
    .eq("id", id)
    .maybeSingle();
  if (!existing) throw new KudoWriteError(404, "Kudo not found");
  if (existing.sender_id !== me.uid) throw new KudoWriteError(403, "Not your kudo");

  assertValid(input);

  const { data, error } = await supabase
    .from("kudos")
    .update({ receiver_id: input.receiverId, ...normalize(input) })
    .eq("id", id)
    .select(KUDOS_SELECT)
    .single();
  if (error) throw error;
  return toKudos(data as unknown as KudosRow, undefined, me.uid, me);
}
