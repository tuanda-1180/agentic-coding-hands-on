"use client";

// Global Secret Box controller. Mounted once in the root layout so the FAB (or
// any component) can open the modal in place. Owns the modal state and drives
// the open flow through the server API — the client never decides the badge or
// the count (TC: secured data source).
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { useTranslations } from "next-intl";
import { getBadge, FALLBACK_BADGE_ASSET, type Badge } from "@/app/lib/secret-box/badges";
import SecretBoxModal, { type RevealedPrize } from "./secret-box-modal";

interface SecretBoxApi {
  open: () => void;
}

const SecretBoxContext = createContext<SecretBoxApi | null>(null);

/** Returns null when no provider is mounted (callers should guard). */
export function useSecretBox(): SecretBoxApi | null {
  return useContext(SecretBoxContext);
}

interface OpenResult {
  badge: Badge;
  unopenedRemaining: number;
}

export default function SecretBoxProvider({ children }: { children: ReactNode }) {
  const t = useTranslations("secretBox");
  const [open, setOpen] = useState(false);
  const [unopenedCount, setUnopenedCount] = useState(0);
  const [prize, setPrize] = useState<RevealedPrize | null>(null);
  const [opening, setOpening] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
    setPrize(null);
    setOpening(false);
  }, []);

  const openModal = useCallback(() => {
    setPrize(null);
    setOpen(true);
    // Load the real unopened count from the server (source of truth).
    fetch("/api/secret-boxes")
      .then((r) => (r.ok ? r.json() : { unopenedRemaining: 0 }))
      .then((d: { unopenedRemaining?: number }) => setUnopenedCount(d.unopenedRemaining ?? 0))
      .catch(() => setUnopenedCount(0));
  }, []);

  const handleOpenBox = useCallback(async () => {
    if (opening) return;
    setOpening(true);
    try {
      const res = await fetch("/api/secret-boxes/open", { method: "POST" });
      if (res.ok) {
        const data = (await res.json()) as Partial<OpenResult>;
        // Resolve the display fields from the LOCAL catalog by id — never trust
        // the wire for the name key / asset path (the id is the only thing we
        // read from the response). getBadge() tolerates a missing/unknown/corrupt
        // id (returns null), so a malformed payload falls back instead of crashing.
        const wonId = data.badge?.id ?? null;
        const catalog = getBadge(wonId);
        setPrize({
          id: wonId ?? "unknown",
          name: t(catalog?.nameKey ?? "badges.stay_gold"),
          asset: catalog?.asset ?? FALLBACK_BADGE_ASSET,
        });
        // Clamp at 0 in case the server ever returns a bad/negative count.
        if (typeof data.unopenedRemaining === "number") {
          setUnopenedCount(Math.max(0, data.unopenedRemaining));
        }
      } else if (res.status === 409 || res.status === 401) {
        // No boxes left (409) or not signed in (401) — disable the box instead
        // of silently retrying forever.
        setUnopenedCount(0);
      }
      // Other (5xx) errors: leave state as-is; the box stays clickable to retry.
    } catch {
      // Network error — allow retry.
    } finally {
      setOpening(false);
    }
  }, [opening, t]);

  return (
    <SecretBoxContext.Provider value={{ open: openModal }}>
      {children}
      <SecretBoxModal
        open={open}
        unopenedCount={unopenedCount}
        prize={prize}
        opening={opening}
        onClose={close}
        onOpenBox={handleOpenBox}
      />
    </SecretBoxContext.Provider>
  );
}
