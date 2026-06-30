"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * State + positioning for a dropdown that is portalled to <body> (so a scrolling
 * modal body never clips it). Tracks the trigger's rect, closes on scroll/resize
 * (a fixed popup would otherwise detach), and handles click-outside against BOTH
 * the trigger and the portalled popup.
 */
export function usePortalDropdown<T extends HTMLElement = HTMLDivElement>() {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const triggerRef = useRef<T>(null);
  const popupRef = useRef<HTMLUListElement>(null);

  const measure = useCallback(() => {
    if (triggerRef.current) setRect(triggerRef.current.getBoundingClientRect());
  }, []);

  const openDropdown = useCallback(() => {
    measure();
    setOpen(true);
  }, [measure]);

  const close = useCallback(() => setOpen(false), []);

  const toggle = useCallback(() => {
    setOpen((prev) => {
      if (!prev) measure();
      return !prev;
    });
  }, [measure]);

  // A fixed-positioned popup detaches when anything scrolls — close instead.
  useEffect(() => {
    if (!open) return;
    const onScrollOrResize = () => setOpen(false);
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open]);

  // Click-outside: ignore clicks inside the trigger or the portalled popup.
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || popupRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return { open, setOpen, openDropdown, close, toggle, triggerRef, popupRef, rect };
}
