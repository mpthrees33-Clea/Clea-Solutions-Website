"use client";

import { useCallback, useState } from "react";
import GraphCanvas from "@/components/mission-control/GraphCanvas";
import DetailPanel from "@/components/mission-control/DetailPanel";
import ActivityFeed from "@/components/mission-control/ActivityFeed";

export default function MissionControlDemo() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);

  const handleActiveAgent = useCallback((id: string | null) => setActiveAgentId(id), []);

  return (
    <div>
      <div className="mc-demo-grid">
        <GraphCanvas selectedId={selectedId} activeAgentId={activeAgentId} onSelect={setSelectedId} />
        <DetailPanel selectedId={selectedId} />
      </div>
      <div style={{ marginTop: "1.5rem" }}>
        <ActivityFeed onActiveAgent={handleActiveAgent} />
      </div>
      <style>{`
        .mc-demo-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 360px;
          gap: 1.5rem;
          align-items: stretch;
        }
        @media (max-width: 980px) {
          .mc-demo-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
