"use client";

// Client hook for the Profile page: loads the current user's profile header
// (user + stats + icon collection) and a received/sent filtered kudos feed.
import { useCallback, useEffect, useState } from "react";
import type { KudosPost, KudosDirection, ProfileData } from "./types";

const PAGE_SIZE = 8;

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.json();
}

export interface ProfileDataState {
  loading: boolean;
  error: string | null;
  profile: ProfileData | null;
  feed: KudosPost[];
  hasMore: boolean;
  loadingMore: boolean;
  loadMore: () => void;
  filter: KudosDirection;
  setFilter: (v: KudosDirection) => void;
  toggleLike: (id: string) => void;
}

export function useProfileData(): ProfileDataState {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [feed, setFeed] = useState<KudosPost[]>([]);
  const [nextPage, setNextPage] = useState<number | null>(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filter, setFilter] = useState<KudosDirection>("sent"); // default "Đã gửi"

  // One-time: profile header (user + stats + icon collection).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const p = await getJson<ProfileData>("/api/profile");
        if (!cancelled) setProfile(p);
      } catch (e) {
        if (!cancelled) setError(String(e));
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Filter-driven: first feed page (resets on direction change).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setNextPage(null); // clear stale paging from the previous direction
      try {
        const fd = await getJson<{ items: KudosPost[]; nextPage: number | null; total: number }>(
          `/api/profile/kudos?direction=${filter}&page=0&pageSize=${PAGE_SIZE}`
        );
        if (cancelled) return;
        setFeed(fd.items);
        setNextPage(fd.nextPage);
      } catch (e) {
        if (!cancelled) setError(String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [filter]);

  const loadMore = useCallback(() => {
    if (nextPage === null || loadingMore) return;
    setLoadingMore(true);
    (async () => {
      try {
        const fd = await getJson<{ items: KudosPost[]; nextPage: number | null }>(
          `/api/profile/kudos?direction=${filter}&page=${nextPage}&pageSize=${PAGE_SIZE}`
        );
        setFeed((prev) => [...prev, ...fd.items]);
        setNextPage(fd.nextPage);
      } catch {
        /* keep current feed on paging error */
      } finally {
        setLoadingMore(false);
      }
    })();
  }, [nextPage, loadingMore, filter]);

  const toggleLike = useCallback((id: string) => {
    const patch = (fn: (k: KudosPost) => KudosPost) =>
      setFeed((prev) => prev.map((k) => (k.id === id ? fn(k) : k)));
    const flip = (k: KudosPost): KudosPost => ({
      ...k,
      liked: !k.liked,
      heartCount: k.heartCount + (k.liked ? -1 : 1),
    });

    patch(flip); // optimistic
    fetch(`/api/liveboard/kudos/${id}/like`, { method: "POST" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((res: { heartCount: number; likedByMe: boolean }) => {
        // Reconcile with the server (reverts disallowed likes, e.g. own kudos).
        patch((k) => ({ ...k, liked: !!res.likedByMe, heartCount: res.heartCount }));
      })
      .catch(() => patch(flip)); // revert optimistic on network OR server error
  }, []);

  return {
    loading, error, profile, feed,
    hasMore: nextPage !== null, loadingMore, loadMore,
    filter, setFilter, toggleLike,
  };
}
