// Supabase-backed queries for the "Profile bản thân" (My Profile) page.
// Scoped to the current user; reuses the Live board mappers, select shape and stats.
import { getServiceClient } from "@/app/lib/supabase/server-client";
import { auth } from "@/auth";
import { toKudos, toSunner, type KudosRow, type SunnerRow } from "./mappers";
import { KUDOS_SELECT, likedKudosIds } from "./kudos-queries";
import { currentUserId, getStats, resolveUserId } from "./user-queries";
import { COLLECTIBLE_COUNT } from "@/app/lib/collectibles";
import type {
  KudosDirection,
  KudosFeedResponse,
  ProfileData,
  Sunner,
} from "./types";

// Columns toSunner() needs (avoids select("*")).
const SUNNER_COLUMNS = "id, name, department, avatar_url, title, star_count";

/** The current user's sunner profile (name, avatar, department, tier badge). */
export async function getProfileUser(presolvedUid?: string | null): Promise<Sunner | null> {
  // `undefined` = resolve here; `null` = no current user.
  const uid = presolvedUid === undefined ? await currentUserId() : presolvedUid;
  if (!uid) return null;
  const { data } = await getServiceClient()
    .from("sunners")
    .select(SUNNER_COLUMNS)
    .eq("id", uid)
    .maybeSingle();
  return data ? toSunner(data as SunnerRow) : null;
}

/**
 * Paginated kudos for a user, by direction:
 *  - "received": kudos where the user is the receiver
 *  - "sent": kudos where the user is the sender
 *
 * `userId` targets a specific user (other-user profile); when omitted, falls
 * back to the signed-in user (own profile). The `liked` flag always reflects the
 * current viewer, not the profile owner.
 */
export async function getKudosByUser(opts: {
  direction: KudosDirection;
  userId?: string;
  page?: number;
  pageSize?: number;
}): Promise<KudosFeedResponse> {
  const uid = opts.userId ?? (await currentUserId());
  if (!uid) return { items: [], nextPage: null, total: 0 };

  const page = Math.max(0, opts.page ?? 0);
  const pageSize = Math.min(50, opts.pageSize ?? 8);
  const from = page * pageSize;
  const column = opts.direction === "received" ? "receiver_id" : "sender_id";

  const { data, count, error } = await getServiceClient()
    .from("kudos")
    .select(KUDOS_SELECT, { count: "exact" })
    .eq(column, uid)
    .order("created_at", { ascending: false })
    .range(from, from + pageSize - 1);
  if (error) throw error;

  const total = count ?? 0;
  const rows = data as unknown as KudosRow[];
  const liked = await likedKudosIds(rows.map((r) => r.id));
  const items = rows.map((r) => toKudos(r, liked));
  const nextPage = from + pageSize < total ? page + 1 : null;
  return { items, nextPage, total };
}

/** Header payload for the profile page: user + stats + icon collection. */
export async function getProfileData(): Promise<ProfileData> {
  // One auth() call: reuse the session for both id resolution and the display name.
  let sessionUser: { name?: string | null; image?: string | null } | null = null;
  let uid: string | null;
  try {
    const session = await auth();
    sessionUser = session?.user ?? null;
    uid = await resolveUserId(session?.user);
  } catch {
    // auth() unavailable → treat as not signed in.
    uid = null;
  }

  const [rowUser, stats] = await Promise.all([getProfileUser(uid), getStats(uid)]);

  // Show the signed-in identity: prefer the session's name/avatar over the
  // sunners row (department + tier badge still come from the row).
  const user =
    rowUser && sessionUser
      ? {
          ...rowUser,
          name: sessionUser.name ?? rowUser.name,
          avatarUrl: sessionUser.image ?? rowUser.avatarUrl,
        }
      : rowUser;

  return {
    user,
    stats,
    iconCollection: {
      // Icon slots = the full collectible set (6); unlocked = opened secret boxes.
      unlocked: Math.min(stats.secretBoxOpened, COLLECTIBLE_COUNT),
      total: COLLECTIBLE_COUNT,
    },
  };
}

/**
 * Public profile payload for any user ("Profile người khác").
 * Unlike getProfileData() there is no session override — the identity comes
 * straight from the sunners row.
 *
 * Secret-box progress is personal: it is zeroed here so it never leaks through
 * the public endpoint (the other-user view hides those rows + the icon
 * collection client-side anyway). Returns user=null when the id matches no sunner.
 */
export async function getPublicProfile(userId: string): Promise<ProfileData> {
  const [user, stats] = await Promise.all([
    getProfileUser(userId),
    getStats(userId),
  ]);
  return {
    user,
    stats: { ...stats, secretBoxOpened: 0, secretBoxUnopened: 0 },
    iconCollection: { unlocked: 0, total: COLLECTIBLE_COUNT },
  };
}
