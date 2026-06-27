"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseScrollSpyOptions {
  /**
   * Top offset in px (sticky header height). Used both to offset the
   * IntersectionObserver root and as the "active line" below the header.
   * MUST match the section `scroll-margin-top`.
   */
  offset?: number;
}

export interface UseScrollSpyReturn {
  /** Slug of the section currently under the active line. Exactly one at a time. */
  activeSlug: string;
  /** Smooth-scroll to a section. Unknown slug is a no-op (no throw). */
  scrollTo: (slug: string) => void;
}

/**
 * Scroll-spy for an anchored, in-page section list.
 *
 * - `activeSlug` tracks scroll position: the last section whose top has scrolled
 *   above the header line is active (exclusive — only one).
 * - `scrollTo(slug)` smooth-scrolls to a section and sets it active immediately.
 *   While that programmatic scroll runs, scroll-spy updates are LOCKED so the
 *   active indicator jumps straight to the target instead of stepping through
 *   every section the page passes on the way.
 * - Unknown slugs are ignored (TC ID-13: no JS error on invalid section).
 *
 * Sections must render `id={slug}` and `scroll-margin-top: {offset}px`.
 */
export function useScrollSpy(
  slugs: string[],
  options?: UseScrollSpyOptions
): UseScrollSpyReturn {
  const offset = options?.offset ?? 80;
  const [activeSlug, setActiveSlug] = useState<string>(slugs[0] ?? "");

  // While a click-driven smooth scroll is in flight, ignore observer updates so
  // the active state goes directly to the clicked item (no step-through jitter).
  const lockedRef = useRef(false);
  const unlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const elements = slugs
      .map((slug) => document.getElementById(slug))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const recompute = () => {
      if (lockedRef.current) return; // locked during programmatic scroll
      let current = slugs[0] ?? "";
      for (const slug of slugs) {
        const el = document.getElementById(slug);
        if (!el) continue;
        // Section top has scrolled above the header line → we're reading it.
        if (el.getBoundingClientRect().top - offset <= 1) current = slug;
      }
      setActiveSlug(current);
    };

    const observer = new IntersectionObserver(recompute, {
      rootMargin: `-${offset}px 0px 0px 0px`,
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });
    elements.forEach((el) => observer.observe(el));
    recompute(); // initial state (handles deep-link landing)

    return () => observer.disconnect();
  }, [slugs, offset]);

  // Clear any pending unlock timer on unmount.
  useEffect(() => {
    return () => {
      if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
    };
  }, []);

  const scrollTo = useCallback((slug: string) => {
    const el = document.getElementById(slug);
    if (!el) return; // unknown slug → no-op

    // Jump the active state straight to the target and lock the observer so the
    // intermediate sections passed during the smooth scroll don't override it.
    lockedRef.current = true;
    setActiveSlug(slug);

    const unlock = () => {
      lockedRef.current = false;
      if (unlockTimerRef.current) {
        clearTimeout(unlockTimerRef.current);
        unlockTimerRef.current = null;
      }
      window.removeEventListener("scrollend", unlock);
    };

    el.scrollIntoView({ behavior: "smooth", block: "start" });

    // Unlock when the scroll settles ('scrollend' where supported), with a
    // timeout fallback for browsers without it.
    window.addEventListener("scrollend", unlock, { once: true });
    if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
    unlockTimerRef.current = setTimeout(unlock, 1000);
  }, []);

  return { activeSlug, scrollTo };
}
