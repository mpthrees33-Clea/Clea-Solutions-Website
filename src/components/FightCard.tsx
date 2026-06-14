"use client";

import { useState } from "react";
import {
  type Fight,
  type Fighter,
  type Selection,
  noVig,
  fmtOdds,
} from "@/lib/odds";

const RED = "#ff3355";
const BLUE = "#2f9bff";
const CYAN = "#22e0d0";

function selId(bout: string, name: string) {
  return `${bout}::${name}`;
}

/* Deterministic vivid gradient from a name (fallback tile) */
function gradientFor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return `linear-gradient(135deg, hsl(${h},70%,40%), hsl(${(h + 50) % 360},75%,24%))`;
}

function initials(name: string): string {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

function FighterPhoto({ fighter, corner, size }: { fighter: Fighter; corner: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  const showImg = fighter.photo && !failed;
  return (
    <div
      style={{
        position: "relative",
        width: size ? `${size}px` : "100%",
        aspectRatio: "1 / 1",
        borderRadius: "14px",
        overflow: "hidden",
        background: gradientFor(fighter.name),
        boxShadow: `0 0 0 1px rgba(255,255,255,0.07), 0 10px 34px -14px ${corner}cc`,
      }}
    >
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.3rem" }}>
        <span className="display" style={{ fontSize: "clamp(2rem, 6vw, 3.2rem)", color: "rgba(255,255,255,0.92)", lineHeight: 1 }}>
          {initials(fighter.name)}
        </span>
        <span style={{ fontSize: "1.5rem", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }}>{fighter.flag}</span>
      </div>
      {showImg && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={fighter.photo} alt={fighter.name} onError={() => setFailed(true)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
      )}
      {fighter.rank && (
        <span className="mono" style={{ position: "absolute", top: "0.5rem", left: "0.5rem", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.05em", padding: "0.15rem 0.4rem", borderRadius: "5px", background: "rgba(0,0,0,0.55)", color: CYAN, border: `1px solid ${CYAN}55`, backdropFilter: "blur(4px)" }}>
          {fighter.rank}
        </span>
      )}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "4px", background: corner, boxShadow: `0 0 14px ${corner}` }} />
    </div>
  );
}

function MethodBars({ m, corner }: { m: NonNullable<Fighter["methods"]>; corner: string }) {
  const rows: [string, number, string][] = [
    ["KO/TKO", m.ko, "#ff6b3d"],
    ["SUB", m.sub, "#a855f7"],
    ["DEC", m.dec, "#3b82f6"],
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
      {rows.map(([label, val, c]) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span className="mono" style={{ fontSize: "0.56rem", width: "46px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em" }}>{label}</span>
          <div style={{ flex: 1, height: "6px", borderRadius: "999px", background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
            <div style={{ width: `${val}%`, height: "100%", background: c, boxShadow: `0 0 8px ${c}88`, transition: "width 700ms ease" }} />
          </div>
          <span className="mono" style={{ fontSize: "0.56rem", width: "30px", textAlign: "right", color: "rgba(255,255,255,0.75)" }}>{val}%</span>
        </div>
      ))}
      <span className="mono" style={{ fontSize: "0.5rem", color: corner, letterSpacing: "0.06em", marginTop: "0.1rem" }}>WIN METHODS</span>
    </div>
  );
}

function FighterColumn({
  fighter, corner, prob, isFav, align, selected, onToggle,
}: {
  fighter: Fighter; corner: string; prob: number; isFav: boolean; align: "left" | "right";
  selected: boolean; onToggle: () => void;
}) {
  const a = align === "right" ? "flex-end" : "flex-start";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem", textAlign: align }}>
      <FighterPhoto fighter={fighter} corner={corner} />
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", justifyContent: a, flexWrap: "wrap" }}>
          <span className="display" style={{ fontSize: "clamp(1.1rem, 3.2vw, 1.55rem)", color: "#fff", lineHeight: 1.1 }}>{fighter.name}</span>
          {isFav && (
            <span className="mono" style={{ fontSize: "0.54rem", letterSpacing: "0.1em", padding: "0.16rem 0.4rem", borderRadius: "999px", background: "rgba(34,224,208,0.14)", color: CYAN, border: `1px solid ${CYAN}66`, whiteSpace: "nowrap" }}>FAV</span>
          )}
        </div>
        {fighter.nickname && <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", fontStyle: "italic", marginTop: "0.1rem" }}>&ldquo;{fighter.nickname}&rdquo;</div>}
        <div className="mono" style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.7rem", letterSpacing: "0.04em", marginTop: "0.3rem" }}>{fighter.record} · {fighter.country}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem", alignItems: a }}>
        <span className="mono" style={{ fontSize: "1.3rem", fontWeight: 700, color: fighter.odds < 0 ? CYAN : "#fbbf24" }}>{fmtOdds(fighter.odds)}</span>
        <span style={{ fontSize: "1.4rem", color: corner, fontWeight: 800, lineHeight: 1, textShadow: `0 0 18px ${corner}66` }}>
          {(prob * 100).toFixed(0)}<span style={{ fontSize: "0.8rem" }}>%</span>
        </span>
        <span className="mono" style={{ fontSize: "0.56rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.04em" }}>WIN PROBABILITY</span>
      </div>

      <button
        onClick={onToggle}
        className="ufc-pick"
        style={{
          marginTop: "0.1rem", padding: "0.5rem 0.7rem", borderRadius: "9px", cursor: "pointer",
          fontFamily: "var(--font-mono), monospace", fontSize: "0.64rem", letterSpacing: "0.08em", fontWeight: 700,
          border: selected ? `1px solid ${corner}` : "1px solid rgba(255,255,255,0.14)",
          background: selected ? `${corner}` : "rgba(255,255,255,0.04)",
          color: selected ? "#fff" : "rgba(255,255,255,0.8)",
          boxShadow: selected ? `0 0 18px ${corner}88` : "none",
          transition: "all 160ms ease",
        }}
      >
        {selected ? "✓ ON SLIP" : "+ ADD PICK"}
      </button>
    </div>
  );
}

function TapeRow({ label, red, blue }: { label: string; red?: string | number; blue?: string | number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", padding: "0.4rem 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <span className="mono" style={{ fontSize: "0.78rem", color: "#fff", textAlign: "right" }}>{red ?? "—"}</span>
      <span className="mono" style={{ fontSize: "0.56rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", padding: "0 0.9rem", textTransform: "uppercase" }}>{label}</span>
      <span className="mono" style={{ fontSize: "0.78rem", color: "#fff", textAlign: "left" }}>{blue ?? "—"}</span>
    </div>
  );
}

export default function FightCard({
  fight, selectedIds, onToggle,
}: {
  fight: Fight;
  selectedIds: Set<string>;
  onToggle: (s: Selection) => void;
}) {
  const [open, setOpen] = useState(false);
  const [redProb, blueProb] = noVig(fight.red.odds, fight.blue.odds);
  const redFav = fight.red.odds <= fight.blue.odds;

  const redSel = selId(fight.bout, fight.red.name);
  const blueSel = selId(fight.bout, fight.blue.name);

  return (
    <div className="ufc-card" style={{ position: "relative", borderRadius: "20px", padding: "1.4rem", background: "linear-gradient(160deg, rgba(28,30,40,0.92), rgba(13,14,20,0.92))", border: "1px solid rgba(255,255,255,0.09)", boxShadow: "0 30px 70px -34px rgba(0,0,0,0.95)", overflow: "hidden", backdropFilter: "blur(6px)" }}>
      <div style={{ position: "absolute", top: "-45%", left: "-12%", width: "55%", height: "130%", background: `radial-gradient(circle, ${RED}26, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "-45%", right: "-12%", width: "55%", height: "130%", background: `radial-gradient(circle, ${BLUE}26, transparent 70%)`, pointerEvents: "none" }} />

      {/* header */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.2rem", gap: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", flexWrap: "wrap" }}>
          {fight.ribbon && (
            <span className="mono" style={{ fontSize: "0.6rem", letterSpacing: "0.14em", padding: "0.3rem 0.6rem", borderRadius: "6px", background: "linear-gradient(90deg, #ff3355, #ff8c00)", color: "#fff", fontWeight: 700, boxShadow: "0 0 18px rgba(255,80,80,0.5)" }}>{fight.ribbon}</span>
          )}
          <span className="mono" style={{ fontSize: "0.66rem", letterSpacing: "0.12em", color: "rgba(255,255,255,0.85)", textTransform: "uppercase" }}>{fight.bout}</span>
        </div>
        <span className="mono" style={{ fontSize: "0.6rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)" }}>{fight.rounds}</span>
      </div>

      {/* fighters */}
      <div className="ufc-fighters" style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "1rem", alignItems: "start" }}>
        <FighterColumn fighter={fight.red} corner={RED} prob={redProb} isFav={redFav} align="left" selected={selectedIds.has(redSel)} onToggle={() => onToggle({ id: redSel, fighter: fight.red.name, bout: fight.bout, odds: fight.red.odds })} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", alignSelf: "center", paddingTop: "1.5rem" }}>
          <span className="display" style={{ fontSize: "1.5rem", color: "rgba(255,255,255,0.32)", textShadow: `0 0 16px ${CYAN}44` }}>VS</span>
        </div>
        <FighterColumn fighter={fight.blue} corner={BLUE} prob={blueProb} isFav={!redFav} align="right" selected={selectedIds.has(blueSel)} onToggle={() => onToggle({ id: blueSel, fighter: fight.blue.name, bout: fight.bout, odds: fight.blue.odds })} />
      </div>

      {/* probability bar */}
      <div style={{ position: "relative", marginTop: "1.4rem" }}>
        <div style={{ display: "flex", height: "13px", borderRadius: "999px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ width: `${redProb * 100}%`, background: `linear-gradient(90deg, ${RED}, #ff7a45)`, boxShadow: `inset 0 0 12px ${RED}`, transition: "width 700ms ease" }} />
          <div style={{ width: `${blueProb * 100}%`, background: `linear-gradient(90deg, #45a0ff, ${BLUE})`, boxShadow: `inset 0 0 12px ${BLUE}`, transition: "width 700ms ease" }} />
        </div>
        <div className="mono" style={{ display: "flex", justifyContent: "space-between", marginTop: "0.4rem", fontSize: "0.6rem", color: "rgba(255,255,255,0.45)", letterSpacing: "0.04em" }}>
          <span>{fight.red.name.split(" ").slice(-1)} {(redProb * 100).toFixed(0)}%</span>
          <span>NO-VIG IMPLIED PROBABILITY</span>
          <span>{(blueProb * 100).toFixed(0)}% {fight.blue.name.split(" ").slice(-1)}</span>
        </div>
      </div>

      {/* expand toggle */}
      <button onClick={() => setOpen((o) => !o)} className="ufc-tape-btn" style={{ marginTop: "1.1rem", width: "100%", padding: "0.55rem", borderRadius: "9px", cursor: "pointer", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: CYAN, fontFamily: "var(--font-mono), monospace", fontSize: "0.64rem", letterSpacing: "0.12em", transition: "all 160ms ease" }}>
        {open ? "▲ HIDE TALE OF THE TAPE" : "▼ TALE OF THE TAPE · STATS · BREAKDOWN"}
      </button>

      {open && (
        <div className="ufc-fade" style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1.1rem" }}>
          <div>
            <TapeRow label="Rank" red={fight.red.rank} blue={fight.blue.rank} />
            <TapeRow label="Age" red={fight.red.age} blue={fight.blue.age} />
            <TapeRow label="Height" red={fight.red.height} blue={fight.blue.height} />
            <TapeRow label="Reach" red={fight.red.reach} blue={fight.blue.reach} />
            <TapeRow label="Stance" red={fight.red.stance} blue={fight.blue.stance} />
            <TapeRow label="Style" red={fight.red.style} blue={fight.blue.style} />
            <TapeRow label="Streak" red={fight.red.streak} blue={fight.blue.streak} />
          </div>
          {fight.red.methods && fight.blue.methods && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.4rem" }}>
              <MethodBars m={fight.red.methods} corner={RED} />
              <MethodBars m={fight.blue.methods} corner={BLUE} />
            </div>
          )}
          {fight.insight && (
            <div style={{ padding: "0.8rem 1rem", borderRadius: "10px", background: `linear-gradient(90deg, ${CYAN}14, transparent)`, border: `1px solid ${CYAN}33` }}>
              <div className="mono" style={{ fontSize: "0.56rem", letterSpacing: "0.12em", color: CYAN, marginBottom: "0.3rem" }}>⚡ BETTING ANGLE</div>
              <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.78)", lineHeight: 1.55 }}>{fight.insight}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
