import type { Metadata } from "next";
import FightNight from "@/components/FightNight";
import PickTracker from "@/components/PickTracker";
import type { Fight } from "@/lib/odds";

export const metadata: Metadata = {
  title: "UFC Freedom 250 · Fight Night Dashboard",
  description:
    "Futuristic fight-night betting dashboard for UFC Freedom 250 at the White House — tale of the tape, win-method breakdowns, no-vig probabilities, and a live parlay builder for every bout.",
};

/*
 * UFC Freedom 250 — White House South Lawn — Sun June 14, 2026 — 8PM ET — Paramount+
 * Odds are American moneyline, compiled fight-day. Physical stats / records / win-method
 * splits are approximate and for reference only — verify before betting.
 * Real photos: drop a file in /public/ufc-250/<name>.jpg and set photo accordingly.
 * Wikimedia URLs below are best-effort; failures fall back to a designed gradient tile.
 */
const FIGHTS: Fight[] = [
  {
    bout: "Lightweight Title",
    ribbon: "MAIN EVENT",
    rounds: "5 Rounds",
    insight:
      "Topuria's undefeated record and finishing rate make him a heavy favorite, but Gaethje is the hardest-hitting underdog on the card — live-dog value and a real KO threat if it stays standing.",
    red: { name: "Ilia Topuria", nickname: "El Matador", record: "16-0", flag: "🇬🇪", country: "Georgia / Spain", odds: -470, rank: "C", age: 29, height: "5'7\"", reach: "69\"", stance: "Orthodox", style: "Striker-Grappler", streak: "W16", methods: { ko: 45, sub: 35, dec: 20 }, photo: "https://commons.wikimedia.org/wiki/Special:FilePath/Ilia%20Topuria%202024.jpg" },
    blue: { name: "Justin Gaethje", nickname: "The Highlight", record: "26-5", flag: "🇺🇸", country: "United States", odds: 360, rank: "iC", age: 37, height: "5'11\"", reach: "70\"", stance: "Orthodox", style: "Pressure Striker", streak: "W2", methods: { ko: 73, sub: 0, dec: 27 }, photo: "https://commons.wikimedia.org/wiki/Special:FilePath/Justin%20Gaethje%202023.jpg" },
  },
  {
    bout: "Interim Heavyweight Title",
    ribbon: "CO-MAIN",
    rounds: "5 Rounds",
    insight:
      "A near pick'em. Gane's footwork and volume vs. Pereira's one-punch KO power. Distance equals Gane rounds; any clean Poatan landing flips the fight — prop value on method of victory.",
    red: { name: "Alex Pereira", nickname: "Poatan", record: "12-3", flag: "🇧🇷", country: "Brazil", odds: -108, rank: "Ex-C", age: 38, height: "6'4\"", reach: "79\"", stance: "Orthodox", style: "KO Striker", streak: "W2", methods: { ko: 75, sub: 0, dec: 25 }, photo: "https://commons.wikimedia.org/wiki/Special:FilePath/Alex%20Pereira%202023.jpg" },
    blue: { name: "Ciryl Gane", nickname: "Bon Gamin", record: "13-2", flag: "🇫🇷", country: "France", odds: -112, rank: "#1", age: 35, height: "6'4\"", reach: "81\"", stance: "Switch", style: "Technical Striker", streak: "W2", methods: { ko: 50, sub: 20, dec: 30 }, photo: "https://commons.wikimedia.org/wiki/Special:FilePath/Ciryl%20Gane%202022.jpg" },
  },
  {
    bout: "Bantamweight",
    rounds: "3 Rounds",
    insight: "O'Malley's range and output should bank rounds; Zahabi needs to make it a grappling fight. Favorite is steep — look to method/round props rather than the moneyline.",
    red: { name: "Sean O'Malley", nickname: "Suga", record: "18-2", flag: "🇺🇸", country: "United States", odds: -440, rank: "#2", age: 31, height: "5'11\"", reach: "72\"", stance: "Switch", style: "Sniper Striker", streak: "W1", methods: { ko: 55, sub: 5, dec: 40 }, photo: "https://commons.wikimedia.org/wiki/Special:FilePath/Sean%20O%27Malley%202023.jpg" },
    blue: { name: "Aiemann Zahabi", record: "13-2", flag: "🇨🇦", country: "Canada", odds: 340, rank: "#11", age: 38, height: "5'8\"", reach: "70\"", stance: "Orthodox", style: "Counter Grappler", streak: "W4", methods: { ko: 35, sub: 15, dec: 50 } },
  },
  {
    bout: "Heavyweight",
    rounds: "3 Rounds",
    insight: "Classic puncher's chance. Lewis carries fight-ending power into round one, but the young, athletic Hokit is favored to wrestle and grind. Don't sleep on a +320 Lewis KO.",
    red: { name: "Derrick Lewis", nickname: "The Black Beast", record: "28-12", flag: "🇺🇸", country: "United States", odds: 320, rank: "#13", age: 41, height: "6'3\"", reach: "79\"", stance: "Orthodox", style: "KO Artist", streak: "W2", methods: { ko: 82, sub: 7, dec: 11 }, photo: "https://commons.wikimedia.org/wiki/Special:FilePath/Derrick%20Lewis%202019.jpg" },
    blue: { name: "Josh Hokit", record: "7-1", flag: "🇺🇸", country: "United States", odds: -410, rank: "NR", age: 28, height: "6'1\"", reach: "76\"", stance: "Orthodox", style: "Power Wrestler", streak: "W7", methods: { ko: 60, sub: 25, dec: 15 } },
  },
  {
    bout: "Lightweight",
    rounds: "3 Rounds",
    insight: "Ruffy is the rising dynamic striker and a big favorite; Chandler's wrestling and heart keep him live, but at 40 the line says the torch is passing. Underdog grit vs. youth.",
    red: { name: "Michael Chandler", nickname: "Iron", record: "23-9", flag: "🇺🇸", country: "United States", odds: 390, rank: "#8", age: 40, height: "5'8\"", reach: "71\"", stance: "Orthodox", style: "Wrestle-Boxer", streak: "L2", methods: { ko: 48, sub: 30, dec: 22 }, photo: "https://commons.wikimedia.org/wiki/Special:FilePath/Michael%20Chandler%202021.jpg" },
    blue: { name: "Mauricio Ruffy", nickname: "Maquina", record: "14-1", flag: "🇧🇷", country: "Brazil", odds: -520, rank: "#14", age: 29, height: "5'11\"", reach: "75\"", stance: "Orthodox", style: "Dynamic Striker", streak: "W4", methods: { ko: 70, sub: 10, dec: 20 } },
  },
  {
    bout: "Middleweight",
    rounds: "3 Rounds",
    insight: "Nickal's elite wrestling should dictate where it goes; Daukaus is a slick grappler who can threaten off his back. If Nickal can't finish, Daukaus's sub threat is the live angle.",
    red: { name: "Bo Nickal", record: "8-0", flag: "🇺🇸", country: "United States", odds: -305, rank: "#10", age: 29, height: "6'1\"", reach: "75\"", stance: "Orthodox", style: "Elite Wrestler", streak: "W8", methods: { ko: 50, sub: 40, dec: 10 }, photo: "https://commons.wikimedia.org/wiki/Special:FilePath/Bo%20Nickal%202023.jpg" },
    blue: { name: "Kyle Daukaus", record: "14-5", flag: "🇺🇸", country: "United States", odds: 245, rank: "NR", age: 32, height: "6'2\"", reach: "76\"", stance: "Orthodox", style: "Submission Grappler", streak: "W2", methods: { ko: 30, sub: 45, dec: 25 } },
  },
  {
    bout: "Featherweight",
    rounds: "3 Rounds",
    insight: "The closest non-title line. Lopes brings power and a nasty guard; Garcia is a finisher with momentum. High finish probability both ways — over/under and method props are juicy.",
    red: { name: "Diego Lopes", nickname: "El Mexicano", record: "26-7", flag: "🇲🇽", country: "Mexico / Brazil", odds: -142, rank: "#3", age: 31, height: "5'9\"", reach: "71\"", stance: "Orthodox", style: "Power Grappler", streak: "W3", methods: { ko: 40, sub: 45, dec: 15 }, photo: "https://commons.wikimedia.org/wiki/Special:FilePath/Diego%20Lopes%202024.jpg" },
    blue: { name: "Steve Garcia", nickname: "Mean Machine", record: "18-5", flag: "🇺🇸", country: "United States", odds: 120, rank: "#11", age: 33, height: "5'10\"", reach: "72\"", stance: "Orthodox", style: "Finisher", streak: "W6", methods: { ko: 78, sub: 11, dec: 11 } },
  },
];

export default function UFC250Page() {
  // FIGHTS is authored main-event-first; show it in the order the fights actually
  // happen — opener at top, main event at the bottom.
  const fightOrder = FIGHTS.slice().reverse();

  return (
    <main className="ufc-root" style={{ position: "relative", minHeight: "100vh", background: "#06070b" }}>
      {/* ── futuristic background (single fixed, GPU-composited layer) ── */}
      <div className="ufc-bg" aria-hidden />
      <div className="ufc-bg-grid" aria-hidden />

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .ufc-root { color: #fff; }
            /* Background is a single fixed, GPU-composited layer so it never repaints on scroll */
            .ufc-bg {
              position: fixed; inset: 0; z-index: 0; pointer-events: none;
              transform: translateZ(0); will-change: transform;
              background:
                radial-gradient(420px 420px at 8% 2%, rgba(255,46,91,0.30), transparent 60%),
                radial-gradient(460px 460px at 96% 22%, rgba(47,123,255,0.28), transparent 60%),
                radial-gradient(520px 520px at 40% 104%, rgba(155,92,255,0.26), transparent 60%),
                linear-gradient(180deg, #07080d 0%, #06070b 100%);
            }
            .ufc-bg-grid {
              position: fixed; inset: 0; z-index: 0; pointer-events: none;
              transform: translateZ(0);
              background-image:
                linear-gradient(rgba(120,160,255,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(120,160,255,0.05) 1px, transparent 1px);
              background-size: 46px 46px;
              mask-image: radial-gradient(120% 80% at 50% 0%, #000 30%, transparent 80%);
              -webkit-mask-image: radial-gradient(120% 80% at 50% 0%, #000 30%, transparent 80%);
            }
            .ufc-card, .ufc-fade, .ufc-slip { position: relative; z-index: 2; }
            .ufc-card { transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease; }
            @media (hover: hover) {
              .ufc-card:hover { transform: translateY(-3px); border-color: rgba(34,224,208,0.4); box-shadow: 0 24px 50px -28px rgba(0,0,0,0.9), 0 0 40px -20px rgba(34,224,208,0.45); }
              .ufc-pick:hover, .ufc-tape-btn:hover { filter: brightness(1.18); }
            }
            .ufc-fade { animation: ufcFade 240ms ease both; }
            @keyframes ufcFade { from { opacity: 0; transform: translateY(-6px);} to { opacity: 1; transform: translateY(0);} }
            @keyframes ufcGlow { 0%,100%{opacity:0.5;} 50%{opacity:1;} }
            @media (max-width: 640px) {
              .ufc-fighters { grid-template-columns: 1fr 1fr !important; }
              .ufc-fighters > div:nth-child(2) { display: none !important; }
            }
            @media (prefers-reduced-motion: reduce) {
              .ufc-bg, .ufc-bg-grid { animation: none !important; }
            }
          `,
        }}
      />

      {/* ── HERO ── */}
      <section style={{ position: "relative", zIndex: 2, padding: "4.5rem 0 2.5rem" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <div className="mono" style={{ fontSize: "0.72rem", letterSpacing: "0.32em", color: "#ff5a7a", marginBottom: "1rem", animation: "ufcGlow 2.6s ease-in-out infinite" }}>
            ◉ LIVE · WHITE HOUSE SOUTH LAWN
          </div>
          <h1
            className="display"
            style={{
              fontSize: "clamp(3rem, 12vw, 7.5rem)", lineHeight: 0.9, margin: 0, letterSpacing: "-0.03em",
              background: "linear-gradient(92deg, #ffffff 0%, #7af9ff 30%, #c084fc 55%, #ff5a7a 82%, #ffd27a 100%)",
              WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 40px rgba(124,224,255,0.25))",
            }}
          >
            FREEDOM 250
          </h1>
          <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "clamp(1rem, 2.6vw, 1.35rem)", marginTop: "1.1rem" }}>
            Topuria vs. Gaethje · Pereira vs. Gane
          </p>
          <div className="mono" style={{ display: "inline-flex", flexWrap: "wrap", justifyContent: "center", gap: "0.6rem 1.4rem", marginTop: "1.6rem", fontSize: "0.74rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.66)" }}>
            <span>📅 SUN JUNE 14, 2026</span>
            <span>🕗 8:00 PM ET</span>
            <span>📺 PARAMOUNT+</span>
            <span>🏛️ WASHINGTON, D.C.</span>
          </div>

          {/* stat strip */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.7rem", marginTop: "2rem" }}>
            {[
              ["7", "BOUTS"],
              ["2", "TITLE FIGHTS"],
              ["14", "FIGHTERS"],
              ["100%", "MAIN CARD"],
            ].map(([n, l]) => (
              <div key={l} style={{ padding: "0.7rem 1.1rem", borderRadius: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", minWidth: "92px" }}>
                <div className="display" style={{ fontSize: "1.6rem", color: "#7af9ff" }}>{n}</div>
                <div className="mono" style={{ fontSize: "0.56rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEGEND ── */}
      <section className="container" style={{ position: "relative", zIndex: 2, paddingBottom: "1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.75rem", padding: "1.1rem 1.3rem", borderRadius: "14px", background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {[
            ["Moneyline", "− = favorite, + = underdog. The bet math."],
            ["Win probability", "Implied chance, vig removed (no-vig)."],
            ["Tale of the tape", "Tap a fight to expand stats + breakdown."],
            ["Bet slip", "Add picks to build a single or live parlay."],
          ].map(([t, d]) => (
            <div key={t}>
              <div className="mono" style={{ fontSize: "0.64rem", letterSpacing: "0.08em", color: "#22e0d0", marginBottom: "0.25rem" }}>{t.toUpperCase()}</div>
              <div style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.45 }}>{d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FIGHTS + interactive bet slip ── */}
      <section className="container" style={{ position: "relative", zIndex: 2, paddingBottom: "5rem" }}>
        <FightNight fights={fightOrder} />

        <div style={{ marginTop: "2rem" }}>
          <PickTracker fights={fightOrder} />
        </div>

        <p className="mono" style={{ marginTop: "2.5rem", fontSize: "0.66rem", lineHeight: 1.7, color: "rgba(255,255,255,0.38)", textAlign: "center", letterSpacing: "0.03em" }}>
          Odds are a fight-day snapshot and are static on this page — they will not update live during the event.<br />
          Stats, records and win-method splits are approximate and for reference only. Confirm current lines in your sportsbook before betting. For entertainment only.
        </p>
      </section>
    </main>
  );
}
