// Map raw Supabase rows → canonical Live board API shapes.
import type { Sunner, KudosPost, BadgeInfo } from "./types";

export interface SunnerRow {
  id: string;
  name: string;
  department: string;
  avatar_url: string | null;
  title: string | null;
  star_count: number;
  email?: string;
}

export interface KudosRow {
  id: string;
  title?: string | null;
  content: string;
  category: string | null;
  tags: string[];
  images: string[];
  is_anonymous?: boolean | null;
  anonymous_name?: string | null;
  created_at: string;
  sender: SunnerRow | SunnerRow[];
  receiver: SunnerRow | SunnerRow[];
  hearts?: { count: number }[];
}

const TIER_BY_STAR: Record<number, string> = {
  1: "New Hero",
  2: "Rising Hero",
  3: "Legend Hero",
};

const BADGE_BORDER = "#FFEA9E";

export function badgeForStar(star: number): BadgeInfo | undefined {
  const label = TIER_BY_STAR[star];
  return label ? { label, borderColor: BADGE_BORDER } : undefined;
}

// Supabase may return an embedded relation as an object or a single-element array.
export function one<T>(v: T | T[]): T {
  return Array.isArray(v) ? v[0] : v;
}

export function toSunner(row: SunnerRow): Sunner {
  return {
    id: row.id,
    name: row.name,
    team: row.department,
    avatarUrl: row.avatar_url ?? "",
    badge: badgeForStar(row.star_count),
  };
}

// Sender shown for anonymous kudos — real identity is never serialized.
// The alias (anonymous_name) is shown when provided, else a generic label.
const anonSender = (alias?: string | null) => ({
  id: "anonymous",
  name: alias && alias.trim() ? alias.trim() : "Người ẩn danh",
  team: "",
  avatarUrl: "",
  badge: undefined,
});

export function toKudos(
  row: KudosRow,
  likedIds?: Set<string>,
  meId?: string | null,
  self?: { name?: string | null; avatarUrl?: string | null }
): KudosPost {
  const realSender = toSunner(one(row.sender));
  const isAnonymous = row.is_anonymous ?? false;
  // Ownership is computed from the REAL sender before masking, so the author can
  // still edit their own anonymous kudo while others never see the sender.
  const isMine = !!meId && realSender.id === meId;
  // Render the current user's own (non-anonymous) kudo with their real session
  // identity — the underlying sunner row may be a seed/fallback ("not me").
  const ownSender =
    isMine && !isAnonymous && (self?.name || self?.avatarUrl)
      ? { ...realSender, name: self?.name ?? realSender.name, avatarUrl: self?.avatarUrl ?? realSender.avatarUrl }
      : realSender;
  return {
    id: row.id,
    sender: isAnonymous ? anonSender(row.anonymous_name) : ownSender,
    receiver: toSunner(one(row.receiver)),
    postedAt: row.created_at,
    title: row.title ?? "",
    hashtag: row.category ?? "",
    content: row.content,
    images: row.images ?? [],
    tags: row.tags ?? [],
    heartCount: row.hearts?.[0]?.count ?? 0,
    liked: likedIds?.has(row.id) ?? false,
    isAnonymous,
    isMine,
  };
}
