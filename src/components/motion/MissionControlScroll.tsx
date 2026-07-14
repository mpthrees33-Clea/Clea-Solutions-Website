"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import {
  AGENTS,
  TOOLS,
  MEMORY,
  HUB,
  CONNECTIONS,
  PLATFORMS,
  type NodePos,
} from "@/data/mission-control";

const CAPTIONS = [
  {
    k: "01",
    title: "Agents live where the work happens.",
    body: "Seven agents across Sales Hub, Quotes Hub, and the Service Desk — each with one job, one prompt, one owner.",
  },
  {
    k: "02",
    title: "Every capability is a permissioned tool.",
    body: "Agents never touch systems directly. They call scoped tools — pricing math is deterministic, CRM writes are draft-only — and read from governed memory.",
  },
  {
    k: "03",
    title: "The pieces connect.",
    body: "PO intake hands validated orders to the quote builder. The voice fine-tune drafts inside both hubs. Low confidence routes to a person, every time.",
  },
  {
    k: "04",
    title: "One control plane sees everything.",
    body: "Mission Control governs every agent's prompt, memory bindings, tool permissions, and run history — one pane of glass.",
  },
  {
    k: "05",
    title: "Sealed inside the enterprise boundary.",
    body: "Azure AI models, Microsoft Entra ID sign-in, tenant-only data. Nothing leaves the walls.",
  },
];

/** Smooth cubic curve between two node positions. */
function curve(a: NodePos, b: NodePos): string {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const bend = Math.abs(a.y - b.y) > 60 ? 0 : 40;
  return `M ${a.x} ${a.y} Q ${mx} ${my + bend} ${b.x} ${b.y}`;
}

const NODE_INDEX: Record<string, NodePos> = Object.fromEntries([
  ...AGENTS.map((a) => [a.id, a.pos]),
  ...TOOLS.map((t) => [t.id, t.pos]),
  ...MEMORY.map((m) => [m.id, m.pos]),
  [HUB.id, HUB.pos],
]);

const PLATFORM_LABELS: Record<string, { label: string; pos: NodePos }> = {
  "sales-hub": { label: "SALES HUB", pos: { x: 235, y: 55 } },
  "quotes-hub": { label: "QUOTES HUB", pos: { x: 600, y: 45 } },
  "service-desk": { label: "SERVICE DESK", pos: { x: 995, y: 55 } },
};

export default function MissionControlScroll() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        "(prefers-reduced-motion: no-preference) and (min-width: 900px)",
        () => {
          const root = scope.current;
          if (!root) return;

          // Prepare every edge for a draw-on animation.
          root.querySelectorAll<SVGPathElement>(".mc-edge").forEach((p) => {
            const len = p.getTotalLength();
            p.style.strokeDasharray = `${len}`;
            p.style.strokeDashoffset = `${len}`;
          });
          const ring = root.querySelector<SVGRectElement>(".mc-boundary");
          if (ring) {
            const len = ring.getTotalLength();
            ring.style.strokeDasharray = `${len}`;
            ring.style.strokeDashoffset = `${len}`;
          }

          // While pinned, captions stack in one spot and crossfade so the
          // rail always fits the viewport. Unpinned/mobile keeps normal flow.
          const captionBox = root.querySelector<HTMLElement>(".mc-captions");
          const captions = gsap.utils.toArray<HTMLElement>(".mc-caption", root);
          gsap.set(captionBox, { position: "relative", height: 240 });
          gsap.set(captions, { position: "absolute", top: 0, left: 0, right: 0, autoAlpha: 0 });
          gsap.set(captions[0], { autoAlpha: 1 });
          let current = 0;
          const setCaption = (idx: number) => {
            if (idx === current) return;
            gsap.to(captions[current], { autoAlpha: 0, duration: 0.25, overwrite: "auto" });
            gsap.to(captions[idx], { autoAlpha: 1, duration: 0.35, overwrite: "auto" });
            current = idx;
          };

          const tl = gsap.timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "+=250%",
              pin: true,
              scrub: 0.5,
              onUpdate(self) {
                setCaption(Math.min(4, Math.floor(self.progress * 5)));
              },
            },
          });

          // Beat 1 — agents appear per platform cluster
          tl.from(".mc-platform-label", { autoAlpha: 0, y: 8, stagger: 0.15, duration: 0.4 })
            .from(
              ".mc-agent",
              { scale: 0, autoAlpha: 0, transformOrigin: "50% 50%", stagger: 0.12, duration: 0.5 },
              "<0.1",
            )
            // Beat 2 — tools + memory appear, local edges draw
            .from(".mc-tool", { scale: 0, autoAlpha: 0, transformOrigin: "50% 50%", stagger: 0.08, duration: 0.4 }, "+=0.2")
            .from(".mc-memory", { scale: 0, autoAlpha: 0, transformOrigin: "50% 50%", stagger: 0.1, duration: 0.4 }, "<0.15")
            .to(".mc-edge-local", { strokeDashoffset: 0, stagger: 0.04, duration: 0.6 }, "<")
            // Beat 3 — cross-platform connections
            .to(".mc-edge-cross", { strokeDashoffset: 0, stagger: 0.1, duration: 0.7 }, "+=0.3")
            // Beat 4 — the hub lands and observes everything
            .from(".mc-hub", { scale: 0, autoAlpha: 0, transformOrigin: "50% 50%", duration: 0.5 }, "+=0.3")
            .to(".mc-edge-observe", { strokeDashoffset: 0, stagger: 0.05, duration: 0.6 }, "<0.2")
            // Beat 5 — enterprise boundary
            .to(".mc-boundary", { strokeDashoffset: 0, duration: 1.0 }, "+=0.3")
            .from(".mc-boundary-label", { autoAlpha: 0, y: 6, duration: 0.4 }, "<0.5");
        },
      );
    },
    { scope },
  );

  return (
    <section ref={scope} className="mc-scroll" style={{ background: "var(--bg)" }}>
      <div className="container" style={{ paddingTop: "4.5rem", paddingBottom: "3rem" }}>
        <div className="eyebrow" style={{ marginBottom: "1.5rem", display: "inline-flex", alignItems: "center" }}>
          <span className="dot-mark" />
          (03) · One pane of glass
        </div>
        <h2 className="display" style={{ fontSize: "clamp(1.9rem, 3.8vw, 2.75rem)", maxWidth: "760px", marginBottom: "2.5rem" }}>
          Mission Control: every agent, every tool, every memory — <em>observed</em>.
        </h2>

        <div className="mc-layout">
          <div className="mc-rail">
            <div className="mc-captions">
              {CAPTIONS.map((c) => (
                <div key={c.k} className="mc-caption" style={{ marginBottom: "1.75rem" }}>
                  <div className="mono" style={{ fontSize: "0.68rem", letterSpacing: "0.14em", color: "var(--accent)", marginBottom: "0.4rem" }}>
                    {c.k} / 05
                  </div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 600, letterSpacing: "-0.01em", marginBottom: "0.4rem" }}>
                    {c.title}
                  </h3>
                  <p style={{ fontSize: "0.88rem", lineHeight: 1.6, color: "var(--ink-muted)" }}>{c.body}</p>
                </div>
              ))}
            </div>
            <Link href="/mission-control" className="btn btn-accent" style={{ marginTop: "0.25rem" }}>
              Explore the interactive replica
              <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="mc-stage panel" style={{ padding: "1rem", overflow: "hidden" }}>
            <Graph />
          </div>
        </div>
      </div>

      <style>{`
        .mc-layout {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 3rem;
          align-items: start;
        }
        @media (max-width: 899px) {
          .mc-layout { grid-template-columns: 1fr; gap: 2rem; }
          .mc-rail { order: 2; }
        }
      `}</style>
    </section>
  );
}

function Graph() {
  return (
    <svg viewBox="0 0 1200 700" role="img" aria-label="Mission Control agent graph: seven agents across three platforms, connected to scoped tools and governed memory, all observed by one control plane inside an Azure and Entra ID boundary" style={{ width: "100%", height: "auto", display: "block" }}>
      {/* Enterprise boundary */}
      <rect className="mc-boundary" x="30" y="20" width="1140" height="660" rx="24" fill="none" stroke="var(--rule-strong)" strokeWidth="1.5" />
      <g className="mc-boundary-label">
        <text x="52" y="668" className="mc-mono" fill="var(--ink-muted)" fontSize="11" letterSpacing="2">
          AZURE AI · MICROSOFT ENTRA ID · TENANT-ONLY DATA
        </text>
      </g>

      {/* Edges under nodes */}
      <g>
        {AGENTS.flatMap((a) => [
          ...a.toolIds.map((t) => (
            <path key={`${a.id}-${t}`} className="mc-edge mc-edge-local" d={curve(a.pos, NODE_INDEX[t])} fill="none" stroke="var(--rule-strong)" strokeWidth="1" />
          )),
          ...a.memoryIds.map((m) => (
            <path key={`${a.id}-${m}`} className="mc-edge mc-edge-local" d={curve(a.pos, NODE_INDEX[m])} fill="none" stroke="var(--rule-strong)" strokeWidth="1" strokeDasharray="0" />
          )),
        ])}
        {CONNECTIONS.map((c) => (
          <path key={`${c.from}-${c.to}`} className="mc-edge mc-edge-cross" d={curve(NODE_INDEX[c.from], NODE_INDEX[c.to])} fill="none" stroke="var(--accent-soft)" strokeWidth="1.4" />
        ))}
        {AGENTS.map((a) => (
          <path key={`hub-${a.id}`} className="mc-edge mc-edge-observe" d={curve(HUB.pos, a.pos)} fill="none" stroke="var(--accent)" strokeWidth="0.8" opacity="0.5" />
        ))}
      </g>

      {/* Platform labels */}
      {PLATFORMS.map((p) => {
        const l = PLATFORM_LABELS[p.id];
        return (
          <text key={p.id} className="mc-platform-label mc-mono" x={l.pos.x} y={l.pos.y} textAnchor="middle" fill="var(--ink-muted)" fontSize="12" letterSpacing="3">
            {l.label}
          </text>
        );
      })}

      {/* Agent nodes */}
      {AGENTS.map((a) => (
        <g key={a.id} className="mc-agent">
          <circle cx={a.pos.x} cy={a.pos.y} r="24" fill="var(--bg-elevated)" stroke="var(--rule-strong)" strokeWidth="1.5" />
          <circle cx={a.pos.x} cy={a.pos.y} r="7" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
          <circle cx={a.pos.x} cy={a.pos.y} r="2.5" fill="var(--accent)" />
          <text x={a.pos.x} y={a.pos.y + 44} textAnchor="middle" className="mc-mono" fill="var(--ink)" fontSize="12">
            {a.name}
          </text>
        </g>
      ))}

      {/* Tool nodes */}
      {TOOLS.map((t) => (
        <g key={t.id} className="mc-tool">
          <rect x={t.pos.x - 56} y={t.pos.y - 15} width="112" height="30" rx="6" fill="var(--bg-tint)" stroke="var(--rule-strong)" strokeWidth="1" />
          <text x={t.pos.x} y={t.pos.y + 4} textAnchor="middle" className="mc-mono" fill="var(--ink-muted)" fontSize="11">
            {t.name}
          </text>
        </g>
      ))}

      {/* Memory nodes */}
      {MEMORY.map((m) => (
        <g key={m.id} className="mc-memory">
          <circle cx={m.pos.x} cy={m.pos.y} r="17" fill="var(--bg-tint)" stroke="var(--ink-faint)" strokeWidth="1.2" strokeDasharray="3 3" />
          <text x={m.pos.x} y={m.pos.y + 34} textAnchor="middle" className="mc-mono" fill="var(--ink-faint)" fontSize="10.5">
            {m.name}
          </text>
        </g>
      ))}

      {/* Mission Control hub */}
      <g className="mc-hub glow-node">
        <circle cx={HUB.pos.x} cy={HUB.pos.y} r="38" fill="var(--bg-elevated)" stroke="var(--accent)" strokeWidth="2" />
        <circle cx={HUB.pos.x} cy={HUB.pos.y} r="26" fill="none" stroke="var(--accent)" strokeWidth="1" opacity="0.5" />
        <circle cx={HUB.pos.x} cy={HUB.pos.y} r="14" fill="none" stroke="var(--accent)" strokeWidth="1" opacity="0.75" />
        <circle cx={HUB.pos.x} cy={HUB.pos.y} r="4" fill="var(--accent)" />
        <text x={HUB.pos.x} y={HUB.pos.y + 62} textAnchor="middle" className="mc-mono" fill="var(--ink)" fontSize="13" fontWeight="600">
          MISSION CONTROL
        </text>
      </g>

      <style>{`.mc-mono { font-family: var(--font-mono), monospace; }`}</style>
    </svg>
  );
}
