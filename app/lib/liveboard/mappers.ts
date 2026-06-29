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
  is_current_user?: boolean;
}

export interface KudosRow {
  id: string;
  content: string;
  category: string | null;
  tags: string[];
  images: string[];
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

export function toKudos(row: KudosRow, likedIds?: Set<string>): KudosPost {
  return {
    id: row.id,
    sender: toSunner(one(row.sender)),
    receiver: toSunner(one(row.receiver)),
    postedAt: row.created_at,
    hashtag: row.category ?? "",
    content: row.content,
    images: row.images ?? [],
    tags: row.tags ?? [],
    heartCount: row.hearts?.[0]?.count ?? 0,
    liked: likedIds?.has(row.id) ?? false,
  };
}
