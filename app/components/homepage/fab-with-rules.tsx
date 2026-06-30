"use client";

import { useState } from "react";
import Fab from "./fab";
import RulesPanel from "./rules-panel";
import { useKudoCompose } from "@/app/components/kudos/kudo-compose-provider";

/**
 * Client wrapper that co-locates the FAB and the Thể lệ (Rules) overlay panel.
 * The Viết Kudo compose modal is provided globally (KudoComposeProvider in the
 * root layout), so both the FAB and the panel just call openCreate() — the modal
 * opens in place, no navigation.
 */
export default function FabWithRules() {
  const [rulesOpen, setRulesOpen] = useState(false);
  const compose = useKudoCompose();

  const openCompose = () => {
    setRulesOpen(false);
    compose?.openCreate();
  };

  return (
    <>
      <Fab onOpenRules={() => setRulesOpen(true)} onWriteKudos={openCompose} />
      <RulesPanel
        open={rulesOpen}
        onClose={() => setRulesOpen(false)}
        onWriteKudos={openCompose}
      />
    </>
  );
}
