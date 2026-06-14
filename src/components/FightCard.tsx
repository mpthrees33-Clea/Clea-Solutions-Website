"use client";

import { useState } from "react";

export type Fighter = {
  name: string;
  nickname?: string;
  record: string;
  flag: string;
  country: string;
  odds: number; // American moneyline, e.g. -470 or +360
  photo?: string;
};

export type Fight = {
  bout: string; // weight class / title label
  ribbon?: string; // "MAIN EVENT" | "CO-MAIN" | undefined
  rounds: string; // "5 Rounds" | "3 Rounds"
  red: Fighter; // left corner
  blue: Fighter; // right corner
};

const RED = "#ff3b3b";
const BLUE = "#3b82f6";

/* American odds → implied probability (0–1, includes the book's vig) */
function impliedProb(odds: number): number {
  return odds < 0 ? -odds / (-odds + 100) : 100 / (odds + 100);
}

/* Strip the vig: normalise both fighters' implied probs to sum to 100% */
function noVig(a: number, b: number): [number, number] {
  const pa = impliedProb(a);
  const pb = impliedProb(b);
  const sum = pa + pb;
  return [pa / sum, pb / sum];
}

/* "$100 returns $X" (profit, not including stake) */
function payoutOn100(odds: number): string {
  const profit = odds < 0 ? (100 / -odds) * 100 : (odds / 100) * 100;
  return `$${profit.toFixed(0)}`;
}

function fmtOdds(odds: number): string {
  return odds > 0 ? `+${odds}` : `${odds}`;
}

/* Deterministic vivid gradient from a name, used for the fallback tile */
function gradientFor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  const h2 = (h + 48) % 360;
  return `linear-gradient(135deg, hsl(${h}, 72%, 42%), hsl(${h2}, 78%, 28%))`;
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function FighterPhoto({ fighter, corner }: { fighter: Fighter; corner: string }) {
  const [failed, setFailed] = useState(false);
  const showImg = fighter.photo && !failed;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1 / 1",
        borderRadius: "14px",
        overflow: "hidden",
        background: gradientFor(fighter.name),
        boxShadow: `0 8px 30px -12px ${corner}88, inset 0 0 0 1px rgba(255,255,255,0.08)`,
      }}
    >
      {/* Fallback layer (always present underneath) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.35rem",
        }}
      >
        <span
          className="display"
          style={{ fontSize: "clamp(2.2rem, 7vw, 3.4rem)", color: "rgba(255,255,255,0.92)", lineHeight: 1 }}
        >
          {initials(fighter.name)}
        </span>
        <span style={{ fontSize: "1.6rem", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))" }}>
          {fighter.flag}
        </span>
      </div>

      {showImg && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={fighter.photo}
          alt={fighter.name}
          onError={() => setFailed(true)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top center",
          }}
        />
      )}

      {/* corner accent bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "5px",
          background: corner,
        }}
      />
    </div>
  );
}

function FighterColumn({
  fighter,
  corner,
  prob,
  isFav,
  align,
}: {
  fighter: Fighter;
  corner: string;
  prob: number;
  isFav: boolean;
  align: "left" | "right";
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", textAlign: align }}>
      <FighterPhoto fighter={fighter} corner={corner} />

      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            justifyContent: align === "right" ? "flex-end" : "flex-start",
            flexWrap: "wrap",
          }}
        >
          <span
            className="display"
            style={{ fontSize: "clamp(1.15rem, 3.4vw, 1.6rem)", color: "#fff", lineHeight: 1.1 }}
          >
            {fighter.name}
          </span>
          {isFav && (
            <span
              className="mono"
              style={{
                fontSize: "0.58rem",
                letterSpacing: "0.1em",
                padding: "0.18rem 0.45rem",
                borderRadius: "999px",
                background: "rgba(74, 222, 128, 0.16)",
                color: "#4ade80",
                border: "1px solid rgba(74,222,128,0.4)",
                whiteSpace: "nowrap",
              }}
            >
              FAVORITE
            </span>
          )}
        </div>
        {fighter.nickname && (
          <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.85rem", fontStyle: "italic", marginTop: "0.15rem" }}>
            &ldquo;{fighter.nickname}&rdquo;
          </div>
        )}
        <div
          className="mono"
          style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.72rem", letterSpacing: "0.05em", marginTop: "0.35rem" }}
        >
          {fighter.record} · {fighter.country}
        </div>
      </div>

      {/* odds + probability block */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.15rem",
          alignItems: align === "right" ? "flex-end" : "flex-start",
        }}
      >
        <span
          className="mono"
          style={{
            fontSize: "1.35rem",
            fontWeight: 700,
            color: fighter.odds < 0 ? "#4ade80" : "#fbbf24",
            letterSpacing: "0.02em",
          }}
        >
          {fmtOdds(fighter.odds)}
        </span>
        <span className="mono" style={{ fontSize: "0.66rem", color: "rgba(255,255,255,0.45)", letterSpacing: "0.05em" }}>
          $100 → {payoutOn100(fighter.odds)} profit
        </span>
        <span style={{ fontSize: "1.05rem", color: corner, fontWeight: 700, marginTop: "0.2rem" }}>
          {(prob * 100).toFixed(0)}%
          <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.4)", fontWeight: 400 }}> win prob</span>
        </span>
      </div>
    </div>
  );
}

export default function FightCard({ fight }: { fight: Fight }) {
  const [redProb, blueProb] = noVig(fight.red.odds, fight.blue.odds);
  const redFav = fight.red.odds <= fight.blue.odds;

  return (
    <div
      className="ufc-card"
      style={{
        position: "relative",
        borderRadius: "18px",
        padding: "1.4rem",
        background: "linear-gradient(160deg, #16171d 0%, #101116 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 24px 60px -30px rgba(0,0,0,0.9)",
        overflow: "hidden",
      }}
    >
      {/* ambient corner glows */}
      <div style={{ position: "absolute", top: "-40%", left: "-10%", width: "55%", height: "120%", background: `radial-gradient(circle, ${RED}22, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "-40%", right: "-10%", width: "55%", height: "120%", background: `radial-gradient(circle, ${BLUE}22, transparent 70%)`, pointerEvents: "none" }} />

      {/* header row */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.2rem",
          gap: "0.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
          {fight.ribbon && (
            <span
              className="mono"
              style={{
                fontSize: "0.62rem",
                letterSpacing: "0.14em",
                padding: "0.3rem 0.6rem",
                borderRadius: "6px",
                background: "linear-gradient(90deg, #ff3b3b, #ff8c00)",
                color: "#fff",
                fontWeight: 700,
              }}
            >
              {fight.ribbon}
            </span>
          )}
          <span
            className="mono"
            style={{ fontSize: "0.68rem", letterSpacing: "0.12em", color: "rgba(255,255,255,0.85)", textTransform: "uppercase" }}
          >
            {fight.bout}
          </span>
        </div>
        <span className="mono" style={{ fontSize: "0.62rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)" }}>
          {fight.rounds}
        </span>
      </div>

      {/* fighters */}
      <div
        className="ufc-fighters"
        style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "1rem", alignItems: "start" }}
      >
        <FighterColumn fighter={fight.red} corner={RED} prob={redProb} isFav={redFav} align="left" />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", alignSelf: "center", gap: "0.2rem", paddingTop: "1.5rem" }}>
          <span className="display" style={{ fontSize: "1.5rem", color: "rgba(255,255,255,0.35)" }}>
            VS
          </span>
        </div>

        <FighterColumn fighter={fight.blue} corner={BLUE} prob={blueProb} isFav={!redFav} align="right" />
      </div>

      {/* probability bar */}
      <div style={{ position: "relative", marginTop: "1.4rem" }}>
        <div
          style={{
            display: "flex",
            height: "12px",
            borderRadius: "999px",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div style={{ width: `${redProb * 100}%`, background: `linear-gradient(90deg, ${RED}, #ff7a45)`, transition: "width 600ms ease" }} />
          <div style={{ width: `${blueProb * 100}%`, background: `linear-gradient(90deg, #45a0ff, ${BLUE})`, transition: "width 600ms ease" }} />
        </div>
        <div className="mono" style={{ display: "flex", justifyContent: "space-between", marginTop: "0.4rem", fontSize: "0.62rem", color: "rgba(255,255,255,0.45)", letterSpacing: "0.05em" }}>
          <span>{fight.red.name.split(" ").slice(-1)} {(redProb * 100).toFixed(0)}%</span>
          <span>no-vig implied probability</span>
          <span>{(blueProb * 100).toFixed(0)}% {fight.blue.name.split(" ").slice(-1)}</span>
        </div>
      </div>
    </div>
  );
}
