// Canonical Live board data types — shared by the Supabase-backed API and the UI.
// Shapes intentionally match the presentational props the liveboard components expect.

export interface BadgeInfo {
  label: string; // hero tier, e.g. "New Hero", "Rising Hero", "Legend Hero"
  borderColor: string;
}

export interface Sunner {
  id: string;
  name: string;
  team: string; // department, e.g. "CEVC10"
  avatarUrl: string;
  badge?: BadgeInfo;
}

export interface KudosPost {
  id: string;
  sender: Sunner;
  receiver: Sunner;
  postedAt: string; // ISO string
  hashtag: string; // primary category hashtag, e.g. "IDOL GIỚI TRẺ"
  content: string;
  images: string[]; // up to 5 image URLs
  tags: string[]; // clickable #tags, e.g. ["#Dedicated"]
  heartCount: number;
  liked: boolean; // whether the current user has liked this kudos
}

export interface LeaderboardEntry {
  rank: number;
  sunner: Sunner;
  description?: string; // prize / rank-up note
}

export interface Stats {
  kudosReceived: number;
  kudosSent: number;
  heartsReceived: number;
  secretBoxOpened: number;
  secretBoxUnopened: number;
}

// ---- Profile page ----

export type KudosDirection = "received" | "sent";

export interface IconCollection {
  unlocked: number; // count of unlocked (opened secret box) icon slots
  total: number; // total slots rendered (locked ones shown gray)
}

export interface ProfileData {
  user: Sunner | null; // null when no current user can be resolved
  stats: Stats; // reused for the stats panel AND the received/sent counts
  iconCollection: IconCollection;
}

export interface SpotlightNode {
  id: string;
  name: string;
  kudosCount: number;
  x: number; // percent 0–100
  y: number; // percent 0–100
  fontSize: number; // px
}

// ---- API response envelopes ----

export interface KudosFeedResponse {
  items: KudosPost[];
  nextPage: number | null;
  total: number;
}

export interface SpotlightResponse {
  total: number;
  nodes: SpotlightNode[];
}

export interface Leaderboards {
  rise: LeaderboardEntry[];
  gifts: LeaderboardEntry[];
}

export interface FilterOptions {
  hashtags: string[];
  departments: string[];
}
