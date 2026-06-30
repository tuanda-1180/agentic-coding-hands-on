"use client";

// Global compose-modal controller. Mounted once in the root layout so ANY
// component — the FAB, the liveboard banner, a kudos card's pencil, or a
// portalled avatar hover-card — can open the Write/Edit Kudo modal in place.
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import KudoComposeModal from "./kudo-compose-modal";
import type { KudosPost } from "@/app/lib/liveboard/types";

export interface ComposeRecipient {
  id: string;
  name: string;
  avatarUrl: string;
}

interface KudoComposeApi {
  openCreate: (recipient?: ComposeRecipient) => void;
  openEdit: (kudo: KudosPost) => void;
}

const KudoComposeContext = createContext<KudoComposeApi | null>(null);

/** Returns null when no provider is mounted (callers should guard). */
export function useKudoCompose(): KudoComposeApi | null {
  return useContext(KudoComposeContext);
}

interface ComposeState {
  open: boolean;
  mode: "create" | "edit";
  kudo: KudosPost | null;
  recipient: ComposeRecipient | null;
}

export default function KudoComposeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ComposeState>({
    open: false,
    mode: "create",
    kudo: null,
    recipient: null,
  });

  const openCreate = useCallback(
    (recipient?: ComposeRecipient) =>
      setState({ open: true, mode: "create", kudo: null, recipient: recipient ?? null }),
    []
  );
  const openEdit = useCallback(
    (kudo: KudosPost) => setState({ open: true, mode: "edit", kudo, recipient: null }),
    []
  );
  const close = useCallback(() => setState((s) => ({ ...s, open: false })), []);

  // Broadcast saves so any open feed (useLiveboardData) can update without a
  // refetch. The provider stays decoupled from the feed.
  const handleSaved = useCallback((kudo: KudosPost, mode: "create" | "edit") => {
    window.dispatchEvent(new CustomEvent("kudos:saved", { detail: { kudo, mode } }));
  }, []);

  return (
    <KudoComposeContext.Provider value={{ openCreate, openEdit }}>
      {children}
      <KudoComposeModal
        open={state.open}
        mode={state.mode}
        initialKudo={state.kudo}
        presetRecipient={state.recipient}
        onClose={close}
        onSaved={handleSaved}
      />
    </KudoComposeContext.Provider>
  );
}
