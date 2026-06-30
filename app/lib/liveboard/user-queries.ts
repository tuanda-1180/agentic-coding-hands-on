// Supabase-backed queries for the sidebar: current-user stats, leaderboards, like toggle.
import "server-only";
import { getServiceClient } from "@/app/lib/supabase/server-client";
import { auth } from "@/auth";
import { toSunner, one, type SunnerRow } from "./mappers";
import type { Stats, Leaderboards, LeaderboardEntry } from "./types";

/**
 * Resolve the signed-in user's sunner id.
 * - No email (not signed in) → null. Login is required.
 * - Email matches a sunner → that row.
 * - Email present but NOT in the mock seed → a deterministic mock sunner, so a
 *   real signed-in account still maps onto the mock dataset (seed emails are fake).
 *   The signed-in name/avatar are layered on top by getProfileData.
 */
export async function resolveUserId(email?: string | null): Promise<string | null> {
  if (!email) return null;
  const supabase = getServiceClient();

  const { data } = await supabase
    .from("sunners")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (data?.id) return data.id;

  // Dev/demo convenience: seed emails are fake, so map a signed-in account onto
  // the designated "current user" seed row (is_current_user = true) — the same
  // identity the profile page presents. NEVER in production — it would let any
  // authenticated user act as (and edit kudos of) that seeded sunner.
  if (process.env.NODE_ENV !== "development") return null;

  const { data: fallback } = await supabase
    .from("sunners")
    .select("id")
    .eq("is_current_user", true)
    .limit(1)
    .maybeSingle();
  return fallback?.id ?? null;
}

export async function currentUserId(): Promise<string | null> {
  try {
    const session = await auth();
    return resolveUserId(session?.user?.email);
  } catch {
    // No request context / auth unavailable → treat as not signed in.
    return null;
  }
}

export interface CurrentIdentity {
  uid: string;
  name?: string | null;
  avatarUrl?: string | null;
}

/**
 * The signed-in user's sunner id PLUS their session display name/avatar.
 * Used to render the current user's own kudos with their real (Google) identity
 * even when the underlying sunner row is a seed/fallback. Null when not signed in.
 */
export async function currentIdentity(): Promise<CurrentIdentity | null> {
  try {
    const session = await auth();
    const uid = await resolveUserId(session?.user?.email);
    if (!uid) return null;
    return { uid, name: session?.user?.name, avatarUrl: session?.user?.image };
  } catch {
    return null;
  }
}

export interface SunnerOption {
  id: string;
  name: string;
  avatarUrl: string;
  department: string;
  title: string | null;
}

/**
 * Search sunners by name or email for the recipient picker and @mention list.
 * Empty query returns the first `limit` sunners (initial dropdown state).
 */
export async function searchSunners(q: string, limit = 8): Promise<SunnerOption[]> {
  const supabase = getServiceClient();
  let query = supabase
    .from("sunners")
    .select("id, name, avatar_url, department, title")
    .order("name", { ascending: true })
    .limit(Math.min(50, Math.max(1, limit)));

  // Cap length and escape ILIKE wildcards so a stray % / _ can't broaden the match.
  const term = q.trim().slice(0, 100).replace(/[%_]/g, (c) => `\\${c}`);
  if (term) query = query.or(`name.ilike.%${term}%,email.ilike.%${term}%`);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(
    (r: { id: string; name: string; avatar_url: string | null; department: string; title: string | null }) => ({
      id: r.id,
      name: r.name,
      avatarUrl: r.avatar_url ?? "",
      department: r.department,
      title: r.title,
    })
  );
}

export async function getStats(presolvedUid?: string | null): Promise<Stats> {
  const supabase = getServiceClient();
  // Allow callers that already resolved the current user to pass it in (avoids a
  // redundant auth()/DB round-trip). `undefined` = resolve here; `null` = no user.
  const uid = presolvedUid === undefined ? await currentUserId() : presolvedUid;
  if (!uid) {
    return { kudosReceived: 0, kudosSent: 0, heartsReceived: 0, secretBoxOpened: 0, secretBoxUnopened: 0 };
  }

  const [received, sent, recvKudos, boxes] = await Promise.all([
    supabase.from("kudos").select("id", { count: "exact", head: true }).eq("receiver_id", uid),
    supabase.from("kudos").select("id", { count: "exact", head: true }).eq("sender_id", uid),
    supabase.from("kudos").select("id").eq("receiver_id", uid),
    supabase.from("secret_boxes").select("is_opened").eq("user_id", uid),
  ]);

  // hearts received: +1 normal, +2 special, summed over kudos the user received
  const recvIds = (recvKudos.data ?? []).map((k: { id: string }) => k.id);
  let heartsReceived = 0;
  if (recvIds.length) {
    const { data: hearts } = await supabase
      .from("hearts")
      .select("is_special")
      .in("kudos_id", recvIds);
    heartsReceived = (hearts ?? []).reduce(
      (sum: number, h: { is_special: boolean }) => sum + (h.is_special ? 2 : 1),
      0
    );
  }

  const boxRows = (boxes.data ?? []) as { is_opened: boolean }[];
  return {
    kudosReceived: received.count ?? 0,
    kudosSent: sent.count ?? 0,
    heartsReceived,
    secretBoxOpened: boxRows.filter((b) => b.is_opened).length,
    secretBoxUnopened: boxRows.filter((b) => !b.is_opened).length,
  };
}

/** Kudos received/sent counts for any user (used by the hover-avatar info card). */
export async function getUserKudosCounts(
  userId: string
): Promise<{ received: number; sent: number }> {
  const supabase = getServiceClient();
  const [received, sent] = await Promise.all([
    supabase.from("kudos").select("id", { count: "exact", head: true }).eq("receiver_id", userId),
    supabase.from("kudos").select("id", { count: "exact", head: true }).eq("sender_id", userId),
  ]);
  return { received: received.count ?? 0, sent: sent.count ?? 0 };
}

export async function getLeaderboards(): Promise<Leaderboards> {
  const supabase = getServiceClient();
  const [gifts, ranks] = await Promise.all([
    supabase
      .from("gift_recipients")
      .select("prize_description, sunner:sunners!sunner_id(*)")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("rank_ups")
      .select("description, sunner:sunners!sunner_id(*)")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const toEntry = (
    row: { sunner: SunnerRow | SunnerRow[] },
    description: string,
    rank: number
  ): LeaderboardEntry => ({ rank, sunner: toSunner(one(row.sunner)), description });

  const giftEntries = (gifts.data ?? []).map(
    (r: { prize_description: string; sunner: SunnerRow | SunnerRow[] }, i: number) =>
      toEntry(r, r.prize_description, i + 1)
  );
  const riseEntries = (ranks.data ?? []).map(
    (r: { description: string; sunner: SunnerRow | SunnerRow[] }, i: number) =>
      toEntry(r, r.description, i + 1)
  );

  return { rise: riseEntries, gifts: giftEntries };
}

export interface LikeResult {
  heartCount: number;
  likedByMe: boolean;
  disabled?: boolean; // sender cannot like own kudos
}

export async function toggleLike(kudosId: string): Promise<LikeResult> {
  const supabase = getServiceClient();
  const uid = await currentUserId();

  const { data: kudos } = await supabase
    .from("kudos")
    .select("sender_id")
    .eq("id", kudosId)
    .maybeSingle();
  if (!kudos) throw new Error("Kudos not found");

  const countHearts = async () => {
    const { count } = await supabase
      .from("hearts")
      .select("id", { count: "exact", head: true })
      .eq("kudos_id", kudosId);
    return count ?? 0;
  };

  // No identified user → cannot like (avoids inserting a NULL user_id).
  if (!uid) {
    return { heartCount: await countHearts(), likedByMe: false, disabled: true };
  }

  // Business rule: a sender cannot like their own kudos.
  if (kudos.sender_id === uid) {
    return { heartCount: await countHearts(), likedByMe: false, disabled: true };
  }

  const { data: existing } = await supabase
    .from("hearts")
    .select("id")
    .eq("kudos_id", kudosId)
    .eq("user_id", uid)
    .maybeSingle();

  let likedByMe: boolean;
  if (existing) {
    await supabase.from("hearts").delete().eq("id", existing.id);
    likedByMe = false;
  } else {
    await supabase.from("hearts").insert({ kudos_id: kudosId, user_id: uid });
    likedByMe = true;
  }

  return { heartCount: await countHearts(), likedByMe };
}
