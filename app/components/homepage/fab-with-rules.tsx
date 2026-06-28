"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Fab from "./fab";
import RulesPanel from "./rules-panel";

/**
 * Client wrapper that co-locates the FAB and the Thể lệ (Rules) overlay panel so
 * they can share open/close state. homepage-screen stays a Server Component and
 * just renders <FabWithRules />.
 *
 * - FAB "Thể lệ" action  → opens the panel
 * - Panel Đóng / Esc / backdrop → closes it
 * - Panel "Viết KUDOS"   → closes the panel, then navigates to /kudos
 */
export default function FabWithRules() {
  const router = useRouter();
  const [rulesOpen, setRulesOpen] = useState(false);

  const handleWriteKudos = () => {
    setRulesOpen(false);
    router.push("/kudos");
  };

  return (
    <>
      <Fab onOpenRules={() => setRulesOpen(true)} />
      <RulesPanel
        open={rulesOpen}
        onClose={() => setRulesOpen(false)}
        onWriteKudos={handleWriteKudos}
      />
    </>
  );
}
