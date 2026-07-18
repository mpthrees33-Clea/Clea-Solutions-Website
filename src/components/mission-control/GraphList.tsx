"use client";

import { AGENTS, HUB, PLATFORMS } from "@/data/mission-control";

/**
 * Mobile rendering of the interactive agent graph. GraphCanvas positions
 * nodes on a fixed 1200x700 grid that overlaps and clips below ~720px, so
 * phones get this stacked list instead — same selection state, same
 * DetailPanel wiring.
 */
export default function GraphList({
  selectedId,
  activeAgentId,
  onSelect,
}: {
  selectedId: string | null;
  activeAgentId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const hubSelected = selectedId === HUB.id;

  return (
    <div className="panel mcl-board">
      <button
        type="button"
        className="mcl-hub"
        aria-pressed={hubSelected}
        onClick={() => onSelect(hubSelected ? null : HUB.id)}
      >
        <span className="mcl-hub-glyph glow-node" aria-hidden>
          <span />
        </span>
        <span>
          <span className="mcl-hub-title mono">MISSION CONTROL</span>
          <span className="mcl-agent-role mono">CONTROL PLANE · OBSERVES EVERY AGENT</span>
        </span>
      </button>

      {PLATFORMS.map((p) => (
        <div key={p.id}>
          <div className="mcl-eyebrow mono">{p.name.toUpperCase()}</div>
          {AGENTS.filter((a) => a.platformId === p.id).map((a) => {
            const selected = selectedId === a.id;
            const active = activeAgentId === a.id;
            return (
              <button
                key={a.id}
                type="button"
                className={
                  "mcl-agent" + (selected ? " is-selected" : "") + (active ? " is-active" : "")
                }
                aria-pressed={selected}
                onClick={() => onSelect(selected ? null : a.id)}
              >
                <span className={"mcl-ring" + (active || selected ? " glow-node" : "")} aria-hidden />
                <span>
                  <span className="mcl-agent-name">{a.name}</span>
                  <span className="mcl-agent-role mono">{a.role.toUpperCase()}</span>
                </span>
              </button>
            );
          })}
        </div>
      ))}

      <div className="mcl-boundary mono">AZURE AI · MICROSOFT ENTRA ID · TENANT-ONLY DATA</div>

      <style>{`
        .mcl-board {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
          background: var(--bg-tint);
        }
        .mcl-hub {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          width: 100%;
          text-align: left;
          padding: 0.85rem 1rem;
          border-radius: 12px;
          border: 1px solid var(--accent-soft);
          background: var(--accent-wash);
          color: var(--ink);
          cursor: pointer;
          font-family: inherit;
          transition: border-color 200ms ease;
        }
        .mcl-hub[aria-pressed="true"] {
          border-color: var(--accent);
        }
        .mcl-hub-glyph {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 2px solid var(--accent);
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .mcl-hub-glyph span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent);
        }
        .mcl-hub-title {
          display: block;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          margin-bottom: 0.2rem;
        }
        .mcl-eyebrow {
          font-size: 0.62rem;
          letter-spacing: 0.22em;
          color: var(--ink-muted);
          margin-bottom: 0.55rem;
        }
        .mcl-agent {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          width: 100%;
          min-height: 44px;
          text-align: left;
          background: var(--bg-elevated);
          border: 1px solid var(--rule-strong);
          border-radius: 8px;
          padding: 0.6rem 0.8rem;
          color: var(--ink);
          cursor: pointer;
          font-family: inherit;
          transition: border-color 200ms ease;
        }
        .mcl-agent + .mcl-agent {
          margin-top: 0.5rem;
        }
        .mcl-agent.is-active {
          border-color: var(--accent-deep);
        }
        .mcl-agent.is-selected {
          border-color: var(--accent);
        }
        .mcl-ring {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          border: 1.5px solid var(--accent);
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .mcl-ring::after {
          content: "";
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--accent);
        }
        .mcl-agent-name {
          display: block;
          font-size: 0.85rem;
          line-height: 1.3;
        }
        .mcl-agent-role {
          display: block;
          font-size: 0.58rem;
          letter-spacing: 0.1em;
          color: var(--ink-muted);
          margin-top: 0.2rem;
        }
        .mcl-boundary {
          font-size: 0.58rem;
          letter-spacing: 0.14em;
          color: var(--ink-faint);
          text-align: center;
          line-height: 1.8;
        }
      `}</style>
    </div>
  );
}
