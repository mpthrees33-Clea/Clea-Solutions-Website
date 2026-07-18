"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import GraphCanvas from "@/components/mission-control/GraphCanvas";
import GraphList from "@/components/mission-control/GraphList";
import DetailPanel from "@/components/mission-control/DetailPanel";
import ActivityFeed from "@/components/mission-control/ActivityFeed";

export default function MissionControlDemo() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const handleActiveAgent = useCallback((id: string | null) => setActiveAgentId(id), []);

  // On phones the DetailPanel sits below the graph list; bring it into view
  // when a node is tapped so the tap visibly responds.
  useEffect(() => {
    if (!selectedId) return;
    if (window.matchMedia("(max-width: 720px)").matches) {
      detailRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selectedId]);

  return (
    <div>
      <div className="mc-demo-grid">
        <div>
          <div className="mc-graph-desktop">
            <GraphCanvas selectedId={selectedId} activeAgentId={activeAgentId} onSelect={setSelectedId} />
          </div>
          <div className="mc-graph-mobile">
            <GraphList selectedId={selectedId} activeAgentId={activeAgentId} onSelect={setSelectedId} />
          </div>
        </div>
        <div ref={detailRef}>
          <DetailPanel selectedId={selectedId} />
        </div>
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
        .mc-graph-mobile { display: none; }
        @media (max-width: 980px) {
          .mc-demo-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 720px) {
          .mc-graph-desktop { display: none; }
          .mc-graph-mobile { display: block; }
        }
      `}</style>
    </div>
  );
}
