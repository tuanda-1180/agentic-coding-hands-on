// Supabase-backed queries for kudos feed, highlights, spotlight and filters.
import { getServiceClient } from "@/app/lib/supabase/server-client";
import { toKudos, one, type KudosRow, type SunnerRow } from "./mappers";
import { currentUserId } from "./user-queries";
import type {
  KudosFeedResponse,
  KudosPost,
  SpotlightResponse,
  SpotlightNode,
  FilterOptions,
} from "./types";

const KUDOS_SELECT =
  "id, content, category, tags, images, created_at, " +
  "sender:sunners!sender_id(*), receiver:sunners!receiver_id!inner(*), hearts(count)";

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
// Cap how many rows highlights scans before picking the top 5 by hearts.
const HIGHLIGHT_SCAN_LIMIT = 100;

/** Which of the given kudos the current user has already liked (for the lit heart). */
async function likedKudosIds(ids: string[]): Promise<Set<string>> {
  if (ids.length === 0) return new Set();
  const uid = await currentUserId();
  if (!uid) return new Set();
  const { data } = await getServiceClient()
    .from("hearts")
    .select("kudos_id")
    .eq("user_id", uid)
    .in("kudos_id", ids);
  return new Set((data ?? []).map((h: { kudos_id: string }) => h.kudos_id));
}

export async function getFeed(opts: {
  hashtag?: string;
  department?: string;
  page?: number;
  pageSize?: number;
}): Promise<KudosFeedResponse> {
  const page = Math.max(0, opts.page ?? 0);
  const pageSize = Math.min(50, opts.pageSize ?? 10);
  const from = page * pageSize;

  let q = getServiceClient()
    .from("kudos")
    .select(KUDOS_SELECT, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + pageSize - 1);

  if (opts.hashtag) q = q.contains("tags", [opts.hashtag]);
  if (opts.department) q = q.eq("receiver.department", opts.department);

  const { data, count, error } = await q;
  if (error) throw error;

  const total = count ?? 0;
  const rows = data as unknown as KudosRow[];
  const liked = await likedKudosIds(rows.map((r) => r.id));
  const items = rows.map((r) => toKudos(r, liked));
  const nextPage = from + pageSize < total ? page + 1 : null;
  return { items, nextPage, total };
}

export async function getHighlights(opts: {
  hashtag?: string;
  department?: string;
}): Promise<KudosPost[]> {
  // Scan only the most recent N (bounded) and pick the top 5 by hearts, rather
  // than fetching the whole table.
  let q = getServiceClient()
    .from("kudos")
    .select(KUDOS_SELECT)
    .order("created_at", { ascending: false })
    .limit(HIGHLIGHT_SCAN_LIMIT);

  if (opts.hashtag) q = q.contains("tags", [opts.hashtag]);
  if (opts.department) q = q.eq("receiver.department", opts.department);

  const { data, error } = await q;
  if (error) throw error;

  const rows = data as unknown as KudosRow[];
  const liked = await likedKudosIds(rows.map((r) => r.id));
  return rows
    .map((r) => toKudos(r, liked))
    .sort((a, b) => b.heartCount - a.heartCount)
    .slice(0, 5);
}

export async function getSpotlight(): Promise<SpotlightResponse> {
  const { data, error } = await getServiceClient()
    .from("kudos")
    .select("receiver:sunners!receiver_id!inner(id,name)");
  if (error) throw error;

  const counts = new Map<string, { name: string; count: number }>();
  for (const row of data as unknown as { receiver: SunnerRow | SunnerRow[] }[]) {
    const r = one(row.receiver);
    const entry = counts.get(r.id) ?? { name: r.name, count: 0 };
    entry.count += 1;
    counts.set(r.id, entry);
  }

  const entries = [...counts.entries()].map(([id, v]) => ({ id, ...v }));
  return { total: (data as unknown[]).length, nodes: layoutNodes(entries) };
}

function layoutNodes(
  entries: { id: string; name: string; count: number }[]
): SpotlightNode[] {
  const sorted = [...entries].sort((a, b) => b.count - a.count);
  const max = sorted[0]?.count ?? 1;
  const min = sorted[sorted.length - 1]?.count ?? 1;
  const span = Math.max(1, max - min);
  const GOLDEN = 2.399963229; // radians

  return sorted.map((e, i) => {
    const radius = Math.sqrt((i + 0.5) / sorted.length) * 46;
    const angle = i * GOLDEN;
    return {
      id: e.id,
      name: e.name,
      kudosCount: e.count,
      x: clamp(50 + radius * Math.cos(angle), 4, 96),
      y: clamp(50 + radius * Math.sin(angle), 6, 94),
      // Small by design (~6–10px); names grow to 11.34px on hover.
      fontSize: 6 + Math.round(((e.count - min) / span) * 4),
    };
  });
}

export async function getFilters(): Promise<FilterOptions> {
  const supabase = getServiceClient();
  const [{ data: tagRows, error: tagErr }, { data: deptRows, error: deptErr }] =
    await Promise.all([
      supabase.from("kudos").select("tags"),
      supabase.from("sunners").select("department"),
    ]);
  if (tagErr) throw tagErr;
  if (deptErr) throw deptErr;

  const hashtags = [
    ...new Set((tagRows as { tags: string[] }[]).flatMap((r) => r.tags)),
  ].sort();
  const departments = [
    ...new Set((deptRows as { department: string }[]).map((r) => r.department)),
  ].sort();
  return { hashtags, departments };
}
