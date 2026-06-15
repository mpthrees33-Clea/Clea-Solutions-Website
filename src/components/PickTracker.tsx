"use client";

import { useEffect, useState } from "react";
import type { Fight } from "@/lib/odds";

const COLTON = "#ff7a3d";
const JOSH = "#3da5ff";
const GOLD = "#fbbf24";
const STORAGE_KEY = "ufc250-pick-tracker-v1";

type Entry = { colton?: string; josh?: string; result?: string };
type Picks = Record<string, Entry>;

export default function PickTracker({ fights }: { fights: Fight[] }) {
  const [picks, setPicks] = useState<Picks>({});
  const [hydrated, setHydrated] = useState(false);

  // load once on mount (avoids SSR hydration mismatch)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time localStorage hydration on mount
      if (raw) setPicks(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  // persist on change
  useEffect(() => {
    if (hydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(picks));
      } catch {
        /* ignore */
      }
    }
  }, [picks, hydrated]);

  function setPick(bout: string, person: "colton" | "josh", fighter: string) {
    setPicks((prev) => {
      const cur = prev[bout] ?? {};
      const next = cur[person] === fighter ? undefined : fighter; // tap again to clear
      return { ...prev, [bout]: { ...cur, [person]: next } };
    });
  }

  function setResult(bout: string, fighter: string) {
    setPicks((prev) => {
      const cur = prev[bout] ?? {};
      const next = cur.result === fighter ? undefined : fighter;
      return { ...prev, [bout]: { ...cur, result: next } };
    });
  }

  function reset() {
    if (typeof window !== "undefined" && window.confirm("Clear all picks and results?")) {
      setPicks({});
    }
  }

  // tally
  let coltonScore = 0;
  let joshScore = 0;
  let decided = 0;
  const coltonWins: string[] = [];
  const joshWins: string[] = [];
  for (const f of fights) {
    const e = picks[f.bout];
    if (e?.result) {
      decided++;
      const short = e.result.split(" ").slice(-1)[0];
      if (e.colton === e.result) { coltonScore++; coltonWins.push(short); }
      if (e.josh === e.result) { joshScore++; joshWins.push(short); }
    }
  }
  const leader = coltonScore === joshScore ? null : coltonScore > joshScore ? "colton" : "josh";

  return (
    <div className="ufc-card" style={{ position: "relative", zIndex: 2, borderRadius: "20px", padding: "1.5rem", background: "linear-gradient(160deg, rgba(28,30,40,0.92), rgba(13,14,20,0.92))", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 30px 70px -34px rgba(0,0,0,0.95)", overflow: "hidden", backdropFilter: "blur(6px)" }}>
      <div style={{ position: "absolute", top: "-50%", left: "-10%", width: "50%", height: "140%", background: `radial-gradient(circle, ${COLTON}22, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "-50%", right: "-10%", width: "50%", height: "140%", background: `radial-gradient(circle, ${JOSH}22, transparent 70%)`, pointerEvents: "none" }} />

      {/* header */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.2rem", gap: "0.5rem" }}>
        <span className="mono" style={{ fontSize: "0.7rem", letterSpacing: "0.14em", color: "#fff", fontWeight: 700 }}>🏆 LIVE PICK TRACKER</span>
        <button onClick={reset} className="mono" style={{ cursor: "pointer", fontSize: "0.58rem", letterSpacing: "0.1em", padding: "0.35rem 0.6rem", borderRadius: "7px", background: "transparent", border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.55)" }}>RESET</button>
      </div>

      {/* scoreboard */}
      <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: "0.8rem", marginBottom: "1.4rem" }}>
        <Scorecard name="COLTON" color={COLTON} score={coltonScore} leading={leader === "colton"} wins={coltonWins} align="left" />
        <span className="display" style={{ fontSize: "1.3rem", color: "rgba(255,255,255,0.35)" }}>vs</span>
        <Scorecard name="JOSH" color={JOSH} score={joshScore} leading={leader === "josh"} wins={joshWins} align="right" />
      </div>
      <div className="mono" style={{ textAlign: "center", fontSize: "0.6rem", letterSpacing: "0.08em", color: "rgba(255,255,255,0.4)", marginBottom: "1.4rem" }}>
        {decided}/{fights.length} FIGHTS DECIDED{leader === null && decided > 0 ? " · ALL SQUARE" : ""}
      </div>

      {/* per-fight rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
        {fights.map((f) => {
          const e = picks[f.bout] ?? {};
          const fighters = [f.red.name, f.blue.name];
          return (
            <div key={f.bout} style={{ padding: "0.9rem 1rem", borderRadius: "12px", background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.7rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.9rem", color: "#fff" }}>{f.red.name.split(" ").slice(-1)} <span style={{ color: "rgba(255,255,255,0.35)" }}>vs</span> {f.blue.name.split(" ").slice(-1)}</span>
                <span className="mono" style={{ fontSize: "0.54rem", letterSpacing: "0.08em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>{f.bout}</span>
              </div>

              <PickRow label="COLTON" color={COLTON} fighters={fighters} selected={e.colton} result={e.result} onPick={(fr) => setPick(f.bout, "colton", fr)} />
              <PickRow label="JOSH" color={JOSH} fighters={fighters} selected={e.josh} result={e.result} onPick={(fr) => setPick(f.bout, "josh", fr)} />

              {/* result row */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.55rem", flexWrap: "wrap" }}>
                <span className="mono" style={{ fontSize: "0.56rem", letterSpacing: "0.08em", color: GOLD, width: "58px" }}>WINNER</span>
                {fighters.map((fr) => {
                  const on = e.result === fr;
                  return (
                    <button key={fr} onClick={() => setResult(f.bout, fr)} className="ufc-pick" style={{ cursor: "pointer", padding: "0.35rem 0.6rem", borderRadius: "8px", fontSize: "0.66rem", fontWeight: 700, border: on ? `1px solid ${GOLD}` : "1px solid rgba(255,255,255,0.12)", background: on ? `${GOLD}22` : "rgba(255,255,255,0.03)", color: on ? GOLD : "rgba(255,255,255,0.6)", boxShadow: on ? `0 0 16px ${GOLD}55` : "none", transition: "all 150ms ease" }}>
                      {on ? "🏆 " : ""}{fr.split(" ").slice(-1)}
                    </button>
                  );
                })}
                {e.result && (
                  <span className="mono" style={{ fontSize: "0.58rem", marginLeft: "auto", letterSpacing: "0.05em" }}>
                    <span style={{ color: e.colton === e.result ? COLTON : "rgba(255,255,255,0.3)" }}>C {e.colton === e.result ? "✓" : "✗"}</span>
                    <span style={{ color: "rgba(255,255,255,0.2)" }}> · </span>
                    <span style={{ color: e.josh === e.result ? JOSH : "rgba(255,255,255,0.3)" }}>J {e.josh === e.result ? "✓" : "✗"}</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mono" style={{ marginTop: "1.1rem", fontSize: "0.56rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em", lineHeight: 1.6 }}>
        Each of you taps your pick per fight, then tap the WINNER as each bout ends. Score auto-tallies and saves to this device.
      </p>
    </div>
  );
}

function Scorecard({ name, color, score, leading, wins, align }: { name: string; color: string; score: number; leading: boolean; wins: string[]; align: "left" | "right" }) {
  return (
    <div style={{ textAlign: align, padding: "0.8rem 1rem", borderRadius: "14px", background: leading ? `linear-gradient(160deg, ${color}26, transparent)` : "rgba(255,255,255,0.03)", border: leading ? `1px solid ${color}66` : "1px solid rgba(255,255,255,0.07)", boxShadow: leading ? `0 0 26px -6px ${color}66` : "none", transition: "all 200ms ease" }}>
      <div className="mono" style={{ fontSize: "0.66rem", letterSpacing: "0.12em", color, fontWeight: 700 }}>{leading ? "👑 " : ""}{name}</div>
      <div className="display" style={{ fontSize: "2.6rem", lineHeight: 1, color: "#fff", textShadow: `0 0 24px ${color}66`, margin: "0.15rem 0" }}>{score}</div>
      <div className="mono" style={{ fontSize: "0.54rem", color: "rgba(255,255,255,0.45)", minHeight: "0.8rem" }}>{wins.length ? wins.join(" · ") : "—"}</div>
    </div>
  );
}

function PickRow({ label, color, fighters, selected, result, onPick }: { label: string; color: string; fighters: string[]; selected?: string; result?: string; onPick: (f: string) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem", flexWrap: "wrap" }}>
      <span className="mono" style={{ fontSize: "0.56rem", letterSpacing: "0.08em", color, width: "58px", fontWeight: 700 }}>{label}</span>
      {fighters.map((fr) => {
        const on = selected === fr;
        const correct = result && on && result === fr;
        const wrong = result && on && result !== fr;
        return (
          <button key={fr} onClick={() => onPick(fr)} className="ufc-pick" style={{ cursor: "pointer", padding: "0.35rem 0.6rem", borderRadius: "8px", fontSize: "0.66rem", fontWeight: 600, border: on ? `1px solid ${color}` : "1px solid rgba(255,255,255,0.1)", background: on ? color : "rgba(255,255,255,0.03)", color: on ? "#0a0a0a" : "rgba(255,255,255,0.6)", boxShadow: on ? `0 0 14px ${color}88` : "none", opacity: wrong ? 0.55 : 1, transition: "all 150ms ease" }}>
            {correct ? "✓ " : ""}{fr.split(" ").slice(-1)}
          </button>
        );
      })}
    </div>
  );
}
