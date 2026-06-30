"use client";

// Client hook: loads all Live board data from the Supabase-backed API.
// Re-queries highlights + feed when filters change; supports infinite-scroll paging.
import { useCallback, useEffect, useState } from "react";
import type {
  KudosPost,
  Stats,
  LeaderboardEntry,
  SpotlightResponse,
  FilterOptions,
} from "./types";

const PAGE_SIZE = 8;

function qs(hashtag: string | null, department: string | null, extra?: Record<string, string>) {
  const p = new URLSearchParams(extra);
  if (hashtag) p.set("hashtag", hashtag);
  if (department) p.set("department", department);
  const s = p.toString();
  return s ? `?${s}` : "";
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.json();
}

export interface LiveboardData {
  loading: boolean;
  error: string | null;
  highlights: KudosPost[];
  feed: KudosPost[];
  feedTotal: number;
  hasMore: boolean;
  loadingMore: boolean;
  loadMore: () => void;
  spotlight: SpotlightResponse | null;
  stats: Stats | null;
  gifts: LeaderboardEntry[];
  filters: FilterOptions;
  hashtag: string | null;
  department: string | null;
  setHashtag: (v: string | null) => void;
  setDepartment: (v: string | null) => void;
  toggleLike: (id: string) => void;
}

export function useLiveboardData(): LiveboardData {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<KudosPost[]>([]);
  const [feed, setFeed] = useState<KudosPost[]>([]);
  const [feedTotal, setFeedTotal] = useState(0);
  const [nextPage, setNextPage] = useState<number | null>(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [spotlight, setSpotlight] = useState<SpotlightResponse | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [gifts, setGifts] = useState<LeaderboardEntry[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({ hashtags: [], departments: [] });
  const [hashtag, setHashtag] = useState<string | null>(null);
  const [department, setDepartment] = useState<string | null>(null);

  // One-time: spotlight, stats, leaderboards, filter options.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [sp, st, lb, fl] = await Promise.all([
          getJson<SpotlightResponse>("/api/liveboard/spotlight"),
          getJson<Stats>("/api/liveboard/stats"),
          getJson<{ gifts: LeaderboardEntry[] }>("/api/liveboard/leaderboards"),
          getJson<FilterOptions>("/api/liveboard/filters"),
        ]);
        if (cancelled) return;
        setSpotlight(sp);
        setStats(st);
        setGifts(lb.gifts);
        setFilters(fl);
      } catch (e) {
        if (!cancelled) setError(String(e));
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Filter-driven: highlights + first feed page (resets on filter change).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [hl, fd] = await Promise.all([
          getJson<{ items: KudosPost[] }>(`/api/liveboard/highlights${qs(hashtag, department)}`),
          getJson<{ items: KudosPost[]; nextPage: number | null; total: number }>(
            `/api/liveboard/kudos${qs(hashtag, department, { page: "0", pageSize: String(PAGE_SIZE) })}`
          ),
        ]);
        if (cancelled) return;
        setHighlights(hl.items);
        setFeed(fd.items);
        setFeedTotal(fd.total);
        setNextPage(fd.nextPage);
      } catch (e) {
        if (!cancelled) setError(String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [hashtag, department]);

  const loadMore = useCallback(() => {
    if (nextPage === null || loadingMore) return;
    setLoadingMore(true);
    (async () => {
      try {
        const fd = await getJson<{ items: KudosPost[]; nextPage: number | null }>(
          `/api/liveboard/kudos${qs(hashtag, department, { page: String(nextPage), pageSize: String(PAGE_SIZE) })}`
        );
        setFeed((prev) => [...prev, ...fd.items]);
        setNextPage(fd.nextPage);
      } catch {
        /* keep current feed on paging error */
      } finally {
        setLoadingMore(false);
      }
    })();
  }, [nextPage, loadingMore, hashtag, department]);

  const toggleLike = useCallback((id: string) => {
    // Apply the same change to the post in both the feed and the highlights.
    const patch = (fn: (k: KudosPost) => KudosPost) => {
      setFeed((prev) => prev.map((k) => (k.id === id ? fn(k) : k)));
      setHighlights((prev) => prev.map((k) => (k.id === id ? fn(k) : k)));
    };
    const flip = (k: KudosPost): KudosPost => ({
      ...k,
      liked: !k.liked,
      heartCount: k.heartCount + (k.liked ? -1 : 1),
    });

    patch(flip); // optimistic
    fetch(`/api/liveboard/kudos/${id}/like`, { method: "POST" })
      .then((r) => (r.ok ? r.json() : null))
      .then((res: { heartCount: number; likedByMe: boolean } | null) => {
        // Reconcile with the server (authoritative) — reverts disallowed likes
        // (e.g. liking your own kudos) since the server returns the real state.
        if (res) patch((k) => ({ ...k, liked: !!res.likedByMe, heartCount: res.heartCount }));
      })
      .catch(() => patch(flip)); // revert optimistic on network failure
  }, []);

  // Insert a freshly created kudo at the top of the feed (no refetch needed).
  const prependKudo = useCallback((k: KudosPost) => {
    setFeed((prev) => [k, ...prev.filter((x) => x.id !== k.id)]);
    setFeedTotal((n) => n + 1);
  }, []);

  // Replace an edited kudo in both the feed and highlights.
  const replaceKudo = useCallback((k: KudosPost) => {
    setFeed((prev) => prev.map((x) => (x.id === k.id ? k : x)));
    setHighlights((prev) => prev.map((x) => (x.id === k.id ? k : x)));
  }, []);

  // Apply create/edit done anywhere (the global compose modal broadcasts this)
  // so the feed updates without a refetch.
  useEffect(() => {
    const onSaved = (e: Event) => {
      const { kudo, mode } = (e as CustomEvent<{ kudo: KudosPost; mode: "create" | "edit" }>).detail;
      if (mode === "edit") {
        replaceKudo(kudo);
        return;
      }
      // Create: only surface the new kudo if it matches the active filters,
      // otherwise it would appear in a view it doesn't belong to.
      const matchesHashtag = !hashtag || kudo.tags.includes(hashtag);
      const matchesDept = !department || kudo.receiver.team === department;
      if (matchesHashtag && matchesDept) prependKudo(kudo);
    };
    window.addEventListener("kudos:saved", onSaved);
    return () => window.removeEventListener("kudos:saved", onSaved);
  }, [prependKudo, replaceKudo, hashtag, department]);

  return {
    loading, error, highlights, feed, feedTotal,
    hasMore: nextPage !== null, loadingMore, loadMore,
    spotlight, stats, gifts, filters,
    hashtag, department, setHashtag, setDepartment, toggleLike,
  };
}
