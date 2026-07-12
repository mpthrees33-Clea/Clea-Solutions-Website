"use client";

import { useState } from "react";

const STAGES = [
  { key: "ingest", label: "01 · ingest bid set (1,240 pages)" },
  { key: "locate", label: "02 · locate Division 09 sections" },
  { key: "extract", label: "03 · extract products + manufacturers" },
  { key: "bod", label: "04 · detect basis-of-design & positions" },
  { key: "score", label: "05 · score opportunities vs. deadlines" },
  { key: "package", label: "06 · draft substitution package" },
] as const;

type Position = "attack" | "defend" | "no-fit";

const SECTIONS: Array<{
  section: string;
  title: string;
  bod: string;
  acceptable: string;
  position: Position;
  note: string;
  quote: string;
  page: string;
  value: string;
}> = [
  {
    section: "09 65 19",
    title: "Resilient Tile Flooring",
    bod: "Meridian Surfaces · Axis LVT 5mm",
    acceptable: "Meridian, Corestone",
    position: "attack",
    note: "Competitor is basis-of-design. Substitution window closes 10 days before bid.",
    quote: "Basis-of-Design: Meridian Surfaces “Axis LVT”, 5.0 mm, 20 mil wear layer…",
    page: "p. 847",
    value: "$96,400",
  },
  {
    section: "09 68 13",
    title: "Tile Carpeting",
    bod: "Harborweave · Meridian Loop 24×24",
    acceptable: "Harborweave, YOUR LINE, Duracord",
    position: "defend",
    note: "You're listed as an acceptable manufacturer. Confirm the dealer is quoting you.",
    quote: "…or comparable products of one of the following: Harborweave; [Your Line]; Duracord.",
    page: "p. 902",
    value: "$61,200",
  },
  {
    section: "09 77 00",
    title: "Special Wall Surfacing (Architectural Film)",
    bod: "Lamina Pro · WF-Series",
    acceptable: "Lamina Pro only — closed spec",
    position: "attack",
    note: "Addendum 2 changed this section — the original bid set listed an open spec. Prior-approval request drafted.",
    quote: "ADDENDUM NO. 2: Section 09 77 00, 2.1.A — delete “or approved equal”.",
    page: "Add. 2, p. 4",
    value: "$26,800",
  },
  {
    section: "09 30 13",
    title: "Ceramic Tiling",
    bod: "Terrastone · Quarry Series",
    acceptable: "Terrastone, Novaterra, Claybound",
    position: "no-fit",
    note: "No matching product in your catalog. Skipped — no time wasted.",
    quote: "Provide unglazed quarry tile conforming to ANSI A137.1…",
    page: "p. 811",
    value: "—",
  },
];

const PACKAGE_ROWS = [
  { criterion: "Wear layer", spec: "20 mil", yours: "22 mil", verdict: "exceeds" },
  { criterion: "Overall thickness", spec: "5.0 mm", yours: "5.0 mm", verdict: "meets" },
  { criterion: "ASTM F1700", spec: "Class III, Type B", yours: "Class III, Type B", verdict: "meets" },
  { criterion: "Critical radiant flux (NFPA 253)", spec: "Class I", yours: "Class I", verdict: "meets" },
  { criterion: "Commercial warranty", spec: "15 yr", yours: "20 yr", verdict: "exceeds" },
];

export default function Demo() {
  const [stage, setStage] = useState<number>(-1);
  const [done, setDone] = useState(false);
  const [running, setRunning] = useState(false);

  async function run() {
    setRunning(true);
    setDone(false);
    setStage(-1);
    for (let i = 0; i < STAGES.length; i++) {
      await new Promise((r) => setTimeout(r, 420));
      setStage(i);
    }
    setDone(true);
    setRunning(false);
  }

  return (
    <div
      style={{
        padding: "2.5rem",
        background: "var(--bg-elevated)",
        border: "1px solid var(--rule)",
        borderRadius: "12px",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "0.75rem 1.5rem", marginBottom: "2rem" }}>
        <h3 className="display" style={{ fontSize: "1.5rem", margin: 0, letterSpacing: "-0.01em" }}>
          Riverside Medical Pavilion — Tampa, FL
        </h3>
        <span className="mono" style={{ color: "var(--ink-faint)", fontSize: "0.75rem", letterSpacing: "0.06em" }}>
          BID SET + 2 ADDENDA · SAMPLE PROJECT
        </span>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <button
          onClick={run}
          disabled={running}
          className="btn btn-primary"
          style={{ opacity: running ? 0.6 : 1, cursor: running ? "wait" : "pointer" }}
        >
          {running ? "Reading the bid set…" : done ? "Run it again" : "Run SpecScout"}
          <span aria-hidden>→</span>
        </button>
      </div>

      <ol style={{ listStyle: "none", display: "grid", gap: "0.35rem", margin: 0, padding: 0, marginBottom: done ? "2rem" : 0 }}>
        {STAGES.map((s, i) => {
          const state = stage > i || done ? "done" : stage === i ? "running" : "pending";
          const color = state === "done" ? "var(--ink)" : state === "running" ? "var(--accent)" : "var(--ink-faint)";
          return (
            <li
              key={s.key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.55rem 0.85rem",
                borderRadius: "6px",
                background: state === "running" ? "rgba(30, 58, 138, 0.04)" : "transparent",
                border: "1px solid",
                borderColor: state === "pending" ? "var(--rule)" : state === "running" ? "var(--accent)" : "var(--rule)",
                transition: "all 200ms ease",
              }}
            >
              <span style={{ width: "16px", textAlign: "center", color, fontSize: "0.85rem" }}>
                {state === "done" ? "✓" : state === "running" ? "●" : "○"}
              </span>
              <span className="mono" style={{ fontSize: "0.82rem", color }}>
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>

      {done && <Results />}
    </div>
  );
}

function Results() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", borderTop: "1px solid var(--rule)", paddingTop: "2rem" }}>
      {/* Digest */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "0.5rem",
        }}
      >
        <Stat label="Division 09 sections read" value="14" />
        <Stat label="specs to attack" value="2" accent />
        <Stat label="specs to defend" value="1" />
        <Stat label="no-fit, skipped" value="11" />
        <Stat label="material value in play" value="$184k" accent />
      </div>

      {/* Sections */}
      <div>
        <div className="eyebrow" style={{ marginBottom: "0.75rem" }}>
          Your position, section by section (every claim cites its page)
        </div>
        <div style={{ display: "grid", gap: "0.6rem" }}>
          {SECTIONS.map((s) => (
            <div
              key={s.section}
              style={{
                padding: "1rem 1.1rem",
                background: "var(--bg)",
                borderRadius: "8px",
                border: "1px solid var(--rule)",
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem 1rem", alignItems: "baseline", marginBottom: "0.5rem" }}>
                <span className="mono" style={{ fontSize: "0.8rem", color: "var(--ink)" }}>
                  {s.section}
                </span>
                <strong style={{ fontSize: "0.95rem", fontWeight: 500 }}>{s.title}</strong>
                <PositionBadge position={s.position} />
                <span className="mono" style={{ fontSize: "0.72rem", color: "var(--ink-faint)", marginLeft: "auto" }}>
                  {s.value}
                </span>
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--ink-muted)", marginBottom: "0.4rem" }}>
                <span style={{ color: "var(--ink)" }}>Basis-of-design:</span> {s.bod} ·{" "}
                <span style={{ color: "var(--ink)" }}>Acceptable:</span> {s.acceptable}
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--ink-muted)", marginBottom: "0.5rem" }}>{s.note}</div>
              <div className="mono" style={{ fontSize: "0.72rem", color: "var(--ink-faint)" }}>
                ↳ &ldquo;{s.quote}&rdquo; — {s.page}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Substitution package preview */}
      <div>
        <div className="eyebrow" style={{ marginBottom: "0.75rem" }}>
          Drafted for 09 65 19 · substitution request package (a person reviews, signs, sends)
        </div>
        <div style={{ overflowX: "auto", border: "1px solid var(--rule)", borderRadius: "8px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", minWidth: "560px" }}>
            <thead>
              <tr style={{ background: "var(--bg)" }}>
                <Th>Criterion</Th>
                <Th>Specified (Meridian Axis LVT)</Th>
                <Th>Proposed (your product)</Th>
                <Th>Verdict</Th>
              </tr>
            </thead>
            <tbody>
              {PACKAGE_ROWS.map((r) => (
                <tr key={r.criterion} style={{ borderTop: "1px solid var(--rule)" }}>
                  <Td>{r.criterion}</Td>
                  <Td>{r.spec}</Td>
                  <Td>{r.yours}</Td>
                  <Td>
                    <span
                      className="mono"
                      style={{
                        fontSize: "0.68rem",
                        padding: "0.15rem 0.5rem",
                        borderRadius: "999px",
                        border: "1px solid var(--rule-strong)",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        color: r.verdict === "exceeds" ? "var(--accent-deep)" : "var(--ink)",
                        background: "var(--bg)",
                      }}
                    >
                      {r.verdict}
                    </span>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: "0.85rem", color: "var(--ink-muted)", marginTop: "0.75rem", lineHeight: 1.6 }}>
          Package includes the CSI substitution request form, this comparison matrix,
          your product data sheets, and the addendum citation — assembled in minutes
          instead of an afternoon.
        </p>
      </div>
    </div>
  );
}

function PositionBadge({ position }: { position: Position }) {
  const styles: Record<Position, { label: string; color: string; bg: string; border: string }> = {
    attack: { label: "ATTACK", color: "#B45309", bg: "rgba(180, 83, 9, 0.07)", border: "rgba(180, 83, 9, 0.3)" },
    defend: { label: "DEFEND", color: "var(--accent-deep)", bg: "rgba(30, 58, 138, 0.05)", border: "var(--rule-strong)" },
    "no-fit": { label: "NO FIT", color: "var(--ink-faint)", bg: "transparent", border: "var(--rule)" },
  };
  const s = styles[position];
  return (
    <span
      className="mono"
      style={{
        fontSize: "0.65rem",
        padding: "0.18rem 0.55rem",
        borderRadius: "999px",
        letterSpacing: "0.08em",
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.border}`,
      }}
    >
      {s.label}
    </span>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ padding: "0.85rem 1rem", borderRadius: "8px", background: "var(--bg)", border: "1px solid var(--rule)" }}>
      <div className="mono" style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-muted)" }}>
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-serif), serif",
          fontSize: "1.5rem",
          fontWeight: 500,
          marginTop: "0.3rem",
          letterSpacing: "-0.01em",
          color: accent ? "var(--accent-deep)" : "var(--ink)",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Th({ children }: { children?: React.ReactNode }) {
  return (
    <th
      className="mono"
      style={{
        textAlign: "left",
        padding: "0.7rem 0.85rem",
        fontWeight: 500,
        fontSize: "0.7rem",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: "var(--ink-muted)",
      }}
    >
      {children}
    </th>
  );
}

function Td({ children }: { children?: React.ReactNode }) {
  return <td style={{ padding: "0.6rem 0.85rem", color: "var(--ink)" }}>{children}</td>;
}
