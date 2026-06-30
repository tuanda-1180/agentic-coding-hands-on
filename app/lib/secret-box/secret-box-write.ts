// Write-path for opening a secret box. Server-only (service_role).
// The badge is chosen and the count is decremented here — never trusting the
// client (TC: secured data source, no client-side manipulation).
import "server-only";
import { getServiceClient } from "@/app/lib/supabase/server-client";
import { currentIdentity } from "@/app/lib/liveboard/user-queries";
import { pickWeightedBadge, type Badge } from "./badges";

export class SecretBoxError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "SecretBoxError";
  }
}

export interface OpenSecretBoxResult {
  badge: Badge;
  /** Unopened boxes still remaining for the user AFTER this open. */
  unopenedRemaining: number;
}

/**
 * Open the user's oldest unopened secret box: assign one random badge, flip the
 * row to opened, and return the badge plus the remaining unopened count.
 */
export async function openSecretBox(): Promise<OpenSecretBoxResult> {
  const me = await currentIdentity();
  if (!me) throw new SecretBoxError(401, "Sign in required");

  const supabase = getServiceClient();

  // Oldest unopened box for this user. limit 1 → we open exactly one per call.
  const { data: box, error: findErr } = await supabase
    .from("secret_boxes")
    .select("id")
    .eq("user_id", me.uid)
    .eq("is_opened", false)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (findErr) throw findErr;
  if (!box) throw new SecretBoxError(409, "No unopened secret boxes");

  const badge = pickWeightedBadge();

  // Guard against a double-open race: only flip a row that is still unopened.
  const { data: updated, error: updErr } = await supabase
    .from("secret_boxes")
    .update({ is_opened: true, prize: badge.id })
    .eq("id", (box as { id: string }).id)
    .eq("is_opened", false)
    .select("id")
    .maybeSingle();
  if (updErr) throw updErr;
  if (!updated) throw new SecretBoxError(409, "No unopened secret boxes");

  // Best-effort remaining count: a separate query, so a concurrent open from
  // another tab can make this off by 1. Never negative (the CAS update above
  // 409s once boxes run out), and the next modal open re-syncs from the server.
  return { badge, unopenedRemaining: await countUnopened(me.uid) };
}

/** Server-side unopened count for a user — the single source of truth. */
export async function countUnopened(userId: string): Promise<number> {
  const { count, error } = await getServiceClient()
    .from("secret_boxes")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_opened", false);
  if (error) throw error;
  return count ?? 0;
}

/** Unopened count for the signed-in user; 0 when not signed in. */
export async function currentUnopenedCount(): Promise<number> {
  const me = await currentIdentity();
  if (!me) return 0;
  return countUnopened(me.uid);
}
