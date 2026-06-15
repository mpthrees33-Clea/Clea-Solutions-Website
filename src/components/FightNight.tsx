"use client";

import { useMemo, useState } from "react";
import FightCard from "@/components/FightCard";
import {
  type Fight,
  type Selection,
  parlayOdds,
  payoutProfit,
  fmtOdds,
  fmtMoney,
} from "@/lib/odds";

const CYAN = "#22e0d0";

export default function FightNight({ fights }: { fights: Fight[] }) {
  const [slip, setSlip] = useState<Selection[]>([]);
  const [stake, setStake] = useState<number>(25);
  const [openSlip, setOpenSlip] = useState(true);

  const selectedIds = useMemo(() => new Set(slip.map((s) => s.id)), [slip]);

  function toggle(sel: Selection) {
    setSlip((prev) => {
      if (prev.some((s) => s.id === sel.id)) return prev.filter((s) => s.id !== sel.id);
      // only one fighter per bout
      const withoutSameBout = prev.filter((s) => s.bout !== sel.bout);
      return [...withoutSameBout, sel];
    });
  }

  const isParlay = slip.length >= 2;
  const combined = isParlay ? parlayOdds(slip) : slip[0]?.odds ?? 0;
  const profit = slip.length ? payoutProfit(combined, stake) : 0;
  const total = stake + profit;

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {fights.map((fight, i) => (
          <FightCard key={fight.bout} fight={fight} order={i + 1} total={fights.length} selectedIds={selectedIds} onToggle={toggle} />
        ))}
      </div>

      {/* Floating bet slip */}
      <div
        className="ufc-slip"
        style={{
          position: "fixed",
          right: "1.25rem",
          bottom: "1.25rem",
          width: "min(340px, calc(100vw - 2.5rem))",
          zIndex: 60,
          borderRadius: "16px",
          overflow: "hidden",
          background: "linear-gradient(160deg, #141620, #0a0b11)",
          border: `1px solid ${CYAN}44`,
          boxShadow: `0 0 0 1px rgba(0,0,0,0.4), 0 24px 60px -20px rgba(0,0,0,0.9), 0 0 40px -10px ${CYAN}44`,
        }}
      >
        <button
          onClick={() => setOpenSlip((o) => !o)}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.8rem 1rem", cursor: "pointer", background: `linear-gradient(90deg, ${CYAN}22, transparent)`, border: "none", color: "#fff" }}
        >
          <span className="mono" style={{ fontSize: "0.72rem", letterSpacing: "0.12em", color: CYAN, fontWeight: 700 }}>
            🎟 BET SLIP {slip.length > 0 && <span style={{ color: "#fff" }}>· {slip.length}</span>}
          </span>
          <span className="mono" style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.6)" }}>{openSlip ? "▼" : "▲"}</span>
        </button>

        {openSlip && (
          <div style={{ padding: "0.5rem 1rem 1rem" }}>
            {slip.length === 0 ? (
              <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.5, padding: "0.6rem 0" }}>
                Tap <span style={{ color: CYAN }}>+ ADD PICK</span> on any fighter to build a single bet or a parlay. Live payout calculates here.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", marginBottom: "0.8rem" }}>
                {slip.map((s) => (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", padding: "0.45rem 0.6rem", borderRadius: "8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: "0.78rem", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.fighter}</div>
                      <div className="mono" style={{ fontSize: "0.56rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.04em", textTransform: "uppercase" }}>{s.bout}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <span className="mono" style={{ fontSize: "0.74rem", fontWeight: 700, color: s.odds < 0 ? CYAN : "#fbbf24" }}>{fmtOdds(s.odds)}</span>
                      <button onClick={() => toggle(s)} aria-label="remove" style={{ cursor: "pointer", background: "none", border: "none", color: "rgba(255,255,255,0.45)", fontSize: "0.9rem", lineHeight: 1 }}>×</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {slip.length > 0 && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.7rem" }}>
                  <label className="mono" style={{ fontSize: "0.6rem", letterSpacing: "0.08em", color: "rgba(255,255,255,0.55)" }}>STAKE $</label>
                  <input
                    type="number"
                    min={1}
                    value={stake}
                    onChange={(e) => setStake(Math.max(0, Number(e.target.value)))}
                    style={{ flex: 1, padding: "0.45rem 0.6rem", borderRadius: "8px", background: "rgba(0,0,0,0.35)", border: `1px solid ${CYAN}44`, color: "#fff", fontFamily: "var(--font-mono), monospace", fontSize: "0.85rem", outline: "none", width: "100%" }}
                  />
                  <div style={{ display: "flex", gap: "0.25rem" }}>
                    {[25, 50, 100].map((q) => (
                      <button key={q} onClick={() => setStake(q)} className="mono" style={{ cursor: "pointer", padding: "0.3rem 0.4rem", borderRadius: "6px", fontSize: "0.6rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>{q}</button>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  <span className="mono" style={{ fontSize: "0.62rem", letterSpacing: "0.06em", color: "rgba(255,255,255,0.55)" }}>{isParlay ? `${slip.length}-LEG PARLAY` : "SINGLE"} ODDS</span>
                  <span className="mono" style={{ fontSize: "0.9rem", fontWeight: 700, color: combined < 0 ? CYAN : "#fbbf24" }}>{fmtOdds(combined)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "0.5rem 0.7rem", borderRadius: "10px", background: `linear-gradient(90deg, ${CYAN}1f, transparent)`, border: `1px solid ${CYAN}33` }}>
                  <span className="mono" style={{ fontSize: "0.62rem", letterSpacing: "0.06em", color: CYAN }}>TO RETURN</span>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#fff", lineHeight: 1.1, textShadow: `0 0 18px ${CYAN}66` }}>${fmtMoney(total)}</div>
                    <div className="mono" style={{ fontSize: "0.56rem", color: "rgba(255,255,255,0.5)" }}>+${fmtMoney(profit)} profit</div>
                  </div>
                </div>

                <button onClick={() => setSlip([])} className="mono" style={{ marginTop: "0.7rem", width: "100%", padding: "0.4rem", borderRadius: "8px", cursor: "pointer", background: "transparent", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.55)", fontSize: "0.6rem", letterSpacing: "0.1em" }}>CLEAR SLIP</button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
