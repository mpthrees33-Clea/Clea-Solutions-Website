import { AGENTS, TOOLS, MEMORY, PLATFORMS } from "@/data/mission-control";

/**
 * Mobile rendering of the Mission Control architecture. The desktop SVG lays
 * nodes out on a fixed 1200x700 grid that becomes illegible below ~900px, so
 * phones get this vertical tier stack derived from the same dataset.
 *
 * Class names are deliberately mc-m-* — the GSAP timeline in
 * MissionControlScroll queries .mc-agent/.mc-tool/.mc-edge/… and must never
 * match these nodes.
 */
export default function MissionControlMobileGraph() {
  return (
    <div className="mc-m-board">
      {PLATFORMS.map((p) => (
        <div key={p.id} className="mc-m-platform">
          <div className="mc-m-eyebrow mono">{p.name.toUpperCase()}</div>
          <div className="mc-m-agents">
            {AGENTS.filter((a) => a.platformId === p.id).map((a) => (
              <div key={a.id} className="mc-m-agent">
                <span className="mc-m-ring" aria-hidden />
                {a.name}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mc-m-flow mono">
        <span className="mc-m-arrow" aria-hidden>↓</span> AGENTS CALL SCOPED TOOLS
      </div>
      <div className="mc-m-chips">
        {TOOLS.map((t) => (
          <span key={t.id} className="mc-m-tool mono">
            {t.name}
          </span>
        ))}
      </div>

      <div className="mc-m-flow mono">
        <span className="mc-m-arrow" aria-hidden>↓</span> AND READ GOVERNED MEMORY
      </div>
      <div className="mc-m-chips">
        {MEMORY.map((m) => (
          <span key={m.id} className="mc-m-memory mono">
            {m.name}
          </span>
        ))}
      </div>

      <div className="mc-m-flow mono">
        <span className="mc-m-arrow" aria-hidden>↓</span> ALL OBSERVED BY
      </div>
      <div className="mc-m-hub">
        <span className="mc-m-hub-glyph glow-node" aria-hidden>
          <span />
        </span>
        <div>
          <div className="mc-m-hub-title mono">MISSION CONTROL</div>
          <div className="mc-m-hub-sub">
            Every agent&apos;s prompt, tool permissions, memory bindings, and run
            history — one pane of glass.
          </div>
        </div>
      </div>

      <div className="mc-m-boundary mono">
        AZURE AI · MICROSOFT ENTRA ID · TENANT-ONLY DATA
      </div>

      <style>{`
        .mc-m-board {
          border: 1px solid var(--rule-strong);
          border-radius: 16px;
          padding: 1.4rem 1.15rem 1.15rem;
          background: var(--bg-elevated);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .mc-m-platform {
          border: 1px solid var(--rule);
          border-radius: 10px;
          background: var(--bg-tint);
          padding: 0.85rem 0.95rem;
        }
        .mc-m-eyebrow {
          font-size: 0.62rem;
          letter-spacing: 0.22em;
          color: var(--ink-muted);
          margin-bottom: 0.6rem;
        }
        .mc-m-agents {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .mc-m-agent {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.85rem;
          color: var(--ink);
        }
        .mc-m-ring {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 1.5px solid var(--accent);
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .mc-m-ring::after {
          content: "";
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--accent);
        }
        .mc-m-flow {
          font-size: 0.6rem;
          letter-spacing: 0.16em;
          color: var(--ink-faint);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .mc-m-arrow {
          color: var(--accent);
        }
        .mc-m-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }
        .mc-m-tool {
          font-size: 0.62rem;
          padding: 0.3rem 0.6rem;
          border-radius: 6px;
          background: var(--bg-tint);
          border: 1px solid var(--rule-strong);
          color: var(--ink-muted);
          white-space: nowrap;
        }
        .mc-m-memory {
          font-size: 0.6rem;
          padding: 0.28rem 0.55rem;
          border-radius: 999px;
          border: 1px dashed var(--ink-faint);
          color: var(--ink-faint);
          white-space: nowrap;
        }
        .mc-m-hub {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          border: 1px solid var(--accent-soft);
          border-radius: 12px;
          background: var(--accent-wash);
          padding: 0.9rem 1rem;
        }
        .mc-m-hub-glyph {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 2px solid var(--accent);
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .mc-m-hub-glyph span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent);
        }
        .mc-m-hub-title {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          margin-bottom: 0.25rem;
        }
        .mc-m-hub-sub {
          font-size: 0.78rem;
          line-height: 1.5;
          color: var(--ink-muted);
        }
        .mc-m-boundary {
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
