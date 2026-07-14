"use client";

import {
  AGENTS,
  TOOLS,
  MEMORY,
  HUB,
  CONNECTIONS,
  type NodePos,
} from "@/data/mission-control";

const W = 1200;
const H = 700;

function pct(p: NodePos) {
  return { left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%` };
}

function curve(a: NodePos, b: NodePos): string {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const bend = Math.abs(a.y - b.y) > 60 ? 0 : 40;
  return `M ${a.x} ${a.y} Q ${mx} ${my + bend} ${b.x} ${b.y}`;
}

type Edge = { from: string; to: string; kind: string };

const POS: Record<string, NodePos> = Object.fromEntries([
  ...AGENTS.map((a) => [a.id, a.pos]),
  ...TOOLS.map((t) => [t.id, t.pos]),
  ...MEMORY.map((m) => [m.id, m.pos]),
  [HUB.id, HUB.pos],
]);

const EDGES: Edge[] = [
  ...AGENTS.flatMap((a) => [
    ...a.toolIds.map((t) => ({ from: a.id, to: t, kind: "tool" })),
    ...a.memoryIds.map((m) => ({ from: a.id, to: m, kind: "memory" })),
  ]),
  ...CONNECTIONS.map((c) => ({ from: c.from, to: c.to, kind: "cross" })),
  ...AGENTS.map((a) => ({ from: HUB.id, to: a.id, kind: "observe" })),
];

export default function GraphCanvas({
  selectedId,
  activeAgentId,
  onSelect,
}: {
  selectedId: string | null;
  activeAgentId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const touches = (e: Edge, id: string | null) => id !== null && (e.from === id || e.to === id);

  return (
    <div
      className="panel"
      style={{
        position: "relative",
        aspectRatio: "1200 / 700",
        padding: 0,
        overflow: "hidden",
        background: "var(--bg-tint)",
      }}
    >
      {/* Edge layer */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        aria-hidden
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        {EDGES.map((e) => {
          const hot = touches(e, selectedId) || touches(e, activeAgentId);
          return (
            <path
              key={`${e.from}->${e.to}`}
              d={curve(POS[e.from], POS[e.to])}
              fill="none"
              stroke={hot ? "var(--accent)" : e.kind === "cross" ? "var(--accent-soft)" : "var(--rule-strong)"}
              strokeWidth={hot ? 1.8 : e.kind === "observe" ? 0.7 : 1}
              strokeDasharray={e.kind === "observe" ? "4 5" : undefined}
              opacity={hot ? 1 : e.kind === "observe" ? 0.45 : 0.8}
              style={{ transition: "stroke 200ms ease, opacity 200ms ease" }}
            />
          );
        })}
      </svg>

      {/* Boundary label */}
      <div
        className="mono"
        style={{
          position: "absolute",
          left: "1.25rem",
          bottom: "0.7rem",
          fontSize: "0.6rem",
          letterSpacing: "0.16em",
          color: "var(--ink-faint)",
        }}
      >
        AZURE AI · MICROSOFT ENTRA ID · TENANT-ONLY DATA
      </div>

      {/* Platform labels */}
      {[
        { label: "SALES HUB", x: 235, y: 52 },
        { label: "QUOTES HUB", x: 600, y: 42 },
        { label: "SERVICE DESK", x: 995, y: 52 },
      ].map((p) => (
        <div
          key={p.label}
          className="mono"
          style={{
            position: "absolute",
            ...pct({ x: p.x, y: p.y }),
            transform: "translate(-50%, -50%)",
            fontSize: "0.62rem",
            letterSpacing: "0.22em",
            color: "var(--ink-muted)",
            whiteSpace: "nowrap",
          }}
        >
          {p.label}
        </div>
      ))}

      {/* Tool chips */}
      {TOOLS.map((t) => (
        <div
          key={t.id}
          title={`${t.name} · ${t.authScope}`}
          className="mono"
          style={{
            position: "absolute",
            ...pct(t.pos),
            transform: "translate(-50%, -50%)",
            fontSize: "0.62rem",
            padding: "0.3rem 0.6rem",
            borderRadius: "6px",
            background: "var(--bg-elevated)",
            border: `1px solid ${selectedId && AGENTS.find((a) => a.id === selectedId)?.toolIds.includes(t.id) ? "var(--accent)" : "var(--rule-strong)"}`,
            color: "var(--ink-muted)",
            whiteSpace: "nowrap",
            transition: "border-color 200ms ease",
          }}
        >
          {t.name}
        </div>
      ))}

      {/* Memory chips */}
      {MEMORY.map((m) => (
        <div
          key={m.id}
          title={`${m.name} · ${m.retention}`}
          className="mono"
          style={{
            position: "absolute",
            ...pct(m.pos),
            transform: "translate(-50%, -50%)",
            fontSize: "0.6rem",
            padding: "0.28rem 0.55rem",
            borderRadius: "999px",
            background: "transparent",
            border: `1px dashed ${selectedId && AGENTS.find((a) => a.id === selectedId)?.memoryIds.includes(m.id) ? "var(--accent)" : "var(--ink-faint)"}`,
            color: "var(--ink-faint)",
            whiteSpace: "nowrap",
            transition: "border-color 200ms ease",
          }}
        >
          {m.name}
        </div>
      ))}

      {/* Agent nodes */}
      {AGENTS.map((a) => {
        const selected = selectedId === a.id;
        const active = activeAgentId === a.id;
        return (
          <button
            key={a.id}
            onClick={() => onSelect(selected ? null : a.id)}
            aria-pressed={selected}
            style={{
              position: "absolute",
              ...pct(a.pos),
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.35rem",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "0.4rem",
              fontFamily: "inherit",
            }}
          >
            <span
              className={active || selected ? "glow-node" : undefined}
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background: "var(--bg-elevated)",
                border: `1.5px solid ${selected ? "var(--accent)" : active ? "var(--accent-deep)" : "var(--rule-strong)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "border-color 200ms ease",
              }}
            >
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  border: "1.5px solid var(--accent)",
                  display: "block",
                }}
              />
            </span>
            <span
              className="mono"
              style={{
                fontSize: "0.62rem",
                color: selected ? "var(--accent)" : "var(--ink)",
                whiteSpace: "nowrap",
                letterSpacing: "0.02em",
                transition: "color 200ms ease",
              }}
            >
              {a.name}
            </span>
          </button>
        );
      })}

      {/* Hub */}
      <button
        onClick={() => onSelect(selectedId === HUB.id ? null : HUB.id)}
        aria-pressed={selectedId === HUB.id}
        style={{
          position: "absolute",
          ...pct(HUB.pos),
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.4rem",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        <span
          className="glow-node"
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "var(--bg-elevated)",
            border: `2px solid ${selectedId === HUB.id ? "var(--accent-deep)" : "var(--accent)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              border: "1px solid var(--accent)",
              opacity: 0.6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)" }} />
          </span>
        </span>
        <span
          className="mono"
          style={{ fontSize: "0.66rem", fontWeight: 600, color: "var(--ink)", letterSpacing: "0.08em", whiteSpace: "nowrap" }}
        >
          MISSION CONTROL
        </span>
      </button>
    </div>
  );
}
