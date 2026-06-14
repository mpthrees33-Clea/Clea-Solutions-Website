import type { Metadata } from "next";
import FightCard, { type Fight } from "@/components/FightCard";

export const metadata: Metadata = {
  title: "UFC Freedom 250 · Fight Night Dashboard",
  description:
    "Live fight-night dashboard for UFC Freedom 250 at the White House — fighters, records, betting odds and no-vig win probabilities for every bout.",
};

/*
 * UFC Freedom 250 — White House South Lawn — Sun June 14, 2026 — 8PM ET — Paramount+
 * Odds compiled fight-day (American moneyline). Probabilities are computed in <FightCard>
 * by stripping the book's vig. Records are approximate — verify before betting.
 *
 * To use real photos: drop a file in /public/ufc-250/<name>.jpg and set photo: "/ufc-250/<name>.jpg".
 * The Wikimedia URLs below are best-effort; any that don't load fall back to a designed gradient tile.
 */
const FIGHTS: Fight[] = [
  {
    bout: "Lightweight Title",
    ribbon: "MAIN EVENT",
    rounds: "5 Rounds",
    red: { name: "Ilia Topuria", nickname: "El Matador", record: "16-0", flag: "🇬🇪", country: "Georgia / Spain", odds: -470, photo: "https://commons.wikimedia.org/wiki/Special:FilePath/Ilia%20Topuria%202024.jpg" },
    blue: { name: "Justin Gaethje", nickname: "The Highlight", record: "26-5", flag: "🇺🇸", country: "United States", odds: 360, photo: "https://commons.wikimedia.org/wiki/Special:FilePath/Justin%20Gaethje%202023.jpg" },
  },
  {
    bout: "Interim Heavyweight Title",
    ribbon: "CO-MAIN",
    rounds: "5 Rounds",
    red: { name: "Alex Pereira", nickname: "Poatan", record: "12-3", flag: "🇧🇷", country: "Brazil", odds: -108, photo: "https://commons.wikimedia.org/wiki/Special:FilePath/Alex%20Pereira%202023.jpg" },
    blue: { name: "Ciryl Gane", nickname: "Bon Gamin", record: "13-2", flag: "🇫🇷", country: "France", odds: -112, photo: "https://commons.wikimedia.org/wiki/Special:FilePath/Ciryl%20Gane%202022.jpg" },
  },
  {
    bout: "Bantamweight",
    rounds: "3 Rounds",
    red: { name: "Sean O'Malley", nickname: "Suga", record: "18-2", flag: "🇺🇸", country: "United States", odds: -440, photo: "https://commons.wikimedia.org/wiki/Special:FilePath/Sean%20O%27Malley%202023.jpg" },
    blue: { name: "Aiemann Zahabi", record: "13-2", flag: "🇨🇦", country: "Canada", odds: 340 },
  },
  {
    bout: "Heavyweight",
    rounds: "3 Rounds",
    red: { name: "Derrick Lewis", nickname: "The Black Beast", record: "28-12", flag: "🇺🇸", country: "United States", odds: 320, photo: "https://commons.wikimedia.org/wiki/Special:FilePath/Derrick%20Lewis%202019.jpg" },
    blue: { name: "Josh Hokit", record: "7-1", flag: "🇺🇸", country: "United States", odds: -410 },
  },
  {
    bout: "Lightweight",
    rounds: "3 Rounds",
    red: { name: "Michael Chandler", nickname: "Iron", record: "23-9", flag: "🇺🇸", country: "United States", odds: 390, photo: "https://commons.wikimedia.org/wiki/Special:FilePath/Michael%20Chandler%202021.jpg" },
    blue: { name: "Mauricio Ruffy", nickname: "Maquina", record: "14-1", flag: "🇧🇷", country: "Brazil", odds: -520 },
  },
  {
    bout: "Middleweight",
    rounds: "3 Rounds",
    red: { name: "Bo Nickal", record: "8-0", flag: "🇺🇸", country: "United States", odds: -305, photo: "https://commons.wikimedia.org/wiki/Special:FilePath/Bo%20Nickal%202023.jpg" },
    blue: { name: "Kyle Daukaus", record: "14-5", flag: "🇺🇸", country: "United States", odds: 245 },
  },
  {
    bout: "Featherweight",
    rounds: "3 Rounds",
    red: { name: "Diego Lopes", nickname: "El Mexicano", record: "26-7", flag: "🇲🇽", country: "Mexico / Brazil", odds: -142, photo: "https://commons.wikimedia.org/wiki/Special:FilePath/Diego%20Lopes%202024.jpg" },
    blue: { name: "Steve Garcia", nickname: "Mean Machine", record: "18-5", flag: "🇺🇸", country: "United States", odds: 120 },
  },
];

export default function UFC250Page() {
  return (
    <main style={{ background: "radial-gradient(120% 80% at 50% 0%, #1b1c24 0%, #0b0c10 55%, #07080b 100%)", minHeight: "100vh" }}>
      {/* page-scoped responsive + motion */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .ufc-card { transition: transform 220ms ease, border-color 220ms ease; }
            .ufc-card:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.18); }
            @media (max-width: 640px) {
              .ufc-fighters { grid-template-columns: 1fr 1fr !important; }
              .ufc-fighters > div:nth-child(2) { display: none !important; }
            }
            @keyframes ufcGlow { 0%,100% { opacity: 0.55; } 50% { opacity: 1; } }
          `,
        }}
      />

      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden", padding: "4.5rem 0 3rem" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(60% 60% at 50% 0%, rgba(255,59,59,0.18), transparent 60%), radial-gradient(50% 50% at 80% 30%, rgba(59,130,246,0.16), transparent 60%)", pointerEvents: "none" }} />
        <div className="container" style={{ position: "relative", textAlign: "center" }}>
          <div className="mono" style={{ fontSize: "0.72rem", letterSpacing: "0.3em", color: "#ff5a5a", marginBottom: "1rem", animation: "ufcGlow 2.6s ease-in-out infinite" }}>
            LIVE FROM THE WHITE HOUSE · SOUTH LAWN
          </div>
          <h1
            className="display"
            style={{
              fontSize: "clamp(3rem, 11vw, 7rem)",
              lineHeight: 0.92,
              margin: 0,
              background: "linear-gradient(90deg, #ffffff 0%, #ffd27a 45%, #ff5a5a 75%, #c084fc 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.03em",
            }}
          >
            FREEDOM 250
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "clamp(1rem, 2.6vw, 1.3rem)", marginTop: "1.1rem" }}>
            Topuria vs. Gaethje · Pereira vs. Gane
          </p>
          <div className="mono" style={{ display: "inline-flex", flexWrap: "wrap", justifyContent: "center", gap: "0.6rem 1.4rem", marginTop: "1.6rem", fontSize: "0.74rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.65)" }}>
            <span>📅 SUN JUNE 14, 2026</span>
            <span>🕗 8:00 PM ET</span>
            <span>📺 PARAMOUNT+</span>
            <span>🏛️ WASHINGTON, D.C.</span>
          </div>
        </div>
      </section>

      {/* LEGEND */}
      <section className="container" style={{ paddingBottom: "1.5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "0.75rem",
            padding: "1.1rem 1.3rem",
            borderRadius: "14px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {[
            ["Moneyline", "− = favorite, + = underdog. The number is the bet math."],
            ["$100 → profit", "What a $100 bet pays out if that fighter wins."],
            ["Win probability", "Implied chance with the book's vig removed (no-vig)."],
            ["Probability bar", "Head-to-head split — eyeball the favorite instantly."],
          ].map(([t, d]) => (
            <div key={t}>
              <div className="mono" style={{ fontSize: "0.66rem", letterSpacing: "0.08em", color: "#ffd27a", marginBottom: "0.25rem" }}>
                {t.toUpperCase()}
              </div>
              <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.45 }}>{d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FIGHTS */}
      <section className="container" style={{ paddingBottom: "4rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {FIGHTS.map((fight) => (
            <FightCard key={`${fight.red.name}-${fight.blue.name}`} fight={fight} />
          ))}
        </div>

        <p className="mono" style={{ marginTop: "2.5rem", fontSize: "0.68rem", lineHeight: 1.7, color: "rgba(255,255,255,0.4)", textAlign: "center", letterSpacing: "0.03em" }}>
          Odds compiled on fight day and are static on this page — they will not update live during the event.<br />
          Records are approximate. Always confirm current lines in your sportsbook before placing a bet. For entertainment only.
        </p>
      </section>
    </main>
  );
}
