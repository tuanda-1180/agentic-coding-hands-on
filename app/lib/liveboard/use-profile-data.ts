"use client";

// Client hook for the Profile page: loads a profile header (user + stats + icon
// collection) and a received/sent filtered kudos feed.
//
// Pass `{ userId }` for another user's public profile ("Profile người khác");
// omit it for the signed-in user's own profile ("Profile bản thân").
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

export function useProfileData(options?: { userId?: string }): ProfileDataState {
  const userId = options?.userId;
  // Other-user profile reads the public endpoints; own profile uses /api/profile.
  const profileUrl = userId ? `/api/users/${userId}/profile` : "/api/profile";
  const kudosBase = userId ? `/api/users/${userId}/kudos` : "/api/profile/kudos";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [feed, setFeed] = useState<KudosPost[]>([]);
  const [nextPage, setNextPage] = useState<number | null>(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filter, setFilter] = useState<KudosDirection>("sent"); // default "Đã gửi"

  // Per-profile: header (user + stats + icon collection). Re-runs when the URL
  // changes (e.g. navigating /profile/A → /profile/B); reset first so the
  // previous user's data never flashes while the new fetch is in flight.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setProfile(null); // drop the previous user's header before the new fetch
      setError(null);
      try {
        const p = await getJson<ProfileData>(profileUrl);
        if (!cancelled) setProfile(p);
      } catch (e) {
        if (!cancelled) setError(String(e));
      }
    })();
    return () => { cancelled = true; };
  }, [profileUrl]);

  // Filter-driven: first feed page (resets on direction change).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setFeed([]); // clear the previous user's/direction's posts immediately
      setNextPage(null); // clear stale paging from the previous direction
      try {
        const fd = await getJson<{ items: KudosPost[]; nextPage: number | null; total: number }>(
          `${kudosBase}?direction=${filter}&page=0&pageSize=${PAGE_SIZE}`
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
  }, [filter, kudosBase]);

  const loadMore = useCallback(() => {
    if (nextPage === null || loadingMore) return;
    setLoadingMore(true);
    (async () => {
      try {
        const fd = await getJson<{ items: KudosPost[]; nextPage: number | null }>(
          `${kudosBase}?direction=${filter}&page=${nextPage}&pageSize=${PAGE_SIZE}`
        );
        setFeed((prev) => [...prev, ...fd.items]);
        setNextPage(fd.nextPage);
      } catch {
        /* keep current feed on paging error */
      } finally {
        setLoadingMore(false);
      }
    })();
  }, [nextPage, loadingMore, filter, kudosBase]);

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
