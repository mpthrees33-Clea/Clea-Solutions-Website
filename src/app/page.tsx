import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: "820px" }} className="fade-up">
            <div className="eyebrow" style={{ marginBottom: "2rem", display: "inline-flex", alignItems: "center" }}>
              <span className="dot-mark" />
              (01) · Clea Solutions
            </div>
            <h1
              className="display"
              style={{
                fontSize: "clamp(2.5rem, 6.2vw, 4.75rem)",
                marginBottom: "1.75rem",
              }}
            >
              AI that does real work. And your data never{" "}
              <em
                className="text-accent"
                style={{ fontStyle: "normal" }}
              >
                leaves
              </em>{" "}
              the building.
            </h1>
            <p
              style={{
                fontSize: "1.2rem",
                lineHeight: 1.55,
                color: "var(--ink-muted)",
                maxWidth: "640px",
                marginBottom: "2.5rem",
              }}
            >
              Clea Solutions builds private AI systems for small and mid-size businesses.
              Software that reads your documents, drafts your email, and handles the
              repetitive work, trained on how your company actually operates. It runs on
              hardware you control, so nothing sensitive ever touches someone else&rsquo;s cloud.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <Link href="/work" className="btn btn-primary">
                See the work
                <span aria-hidden>→</span>
              </Link>
              <Link href="/contact" className="btn btn-ghost">
                Book a free assessment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section style={{ background: "var(--bg-tint)", borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)" }}>
        <div className="container" style={{ padding: "3.5rem 1.5rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "2rem",
            }}
            className="stats-grid"
          >
            <Stat figure="0" suffix="" label="customer documents sent to the cloud. Everything runs on your premises" />
            <Stat figure="100" suffix="%" label="of AI outputs traced to the exact source text, or flagged for a person" />
            <Stat figure="0" prefix="$" label="in per-seat or per-message fees. You own the system outright" />
            <Stat figure="60" prefix="<" suffix="sec" label="to turn a purchase order PDF into a validated, double-checked order" />
          </div>
        </div>
        <style>{`
          @media (max-width: 720px) {
            .stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 2rem 1.5rem !important; }
          }
        `}</style>
      </section>

      {/* Ticker */}
      <div className="ticker">
        <div className="ticker-track">
          {[...Array(2)].flatMap((_, k) =>
            TICKER_ITEMS.map((item, i) => (
              <span key={`${k}-${i}`} className="ticker-item" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem" }}>
                <span className="ticker-dot">◆</span>
                {item}
              </span>
            )),
          )}
        </div>
      </div>

      {/* Principles */}
      <section className="section">
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(180px, 220px) 1fr",
              gap: "3rem",
              alignItems: "start",
              marginBottom: "4rem",
            }}
            className="principles-header"
          >
            <div>
              <div className="eyebrow" style={{ display: "inline-flex", alignItems: "center" }}>
                <span className="dot-mark" />
                (02) · Approach
              </div>
            </div>
            <h2
              className="display"
              style={{
                fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                maxWidth: "720px",
              }}
            >
              Three things that separate{" "}
              <em
                className="text-accent"
                style={{ fontStyle: "normal" }}
              >
                a demo
              </em>{" "}
              from a system you can actually deploy.
            </h2>
          </div>

          <div className="grid-3">
            <Principle
              num="01"
              title="Generic AI guesses. Guessing costs money."
              body="Off-the-shelf chatbots will always give you an answer, even when they're making it up. That's fine for brainstorming and dangerous for orders, invoices, and customer email. We build systems that check their own work before it reaches yours."
            />
            <Principle
              num="02"
              title="Trained on your business, checked against your documents"
              body="Think of it like onboarding a new hire: we take a capable AI and train it on your documents, your terminology, and your way of working. Then every answer it gives must point back to a real source, or it says so and hands off to a person."
            />
            <Principle
              num="03"
              title="It does the task, not just the chat"
              body="The value isn't a chat window. It's the purchase order that becomes a validated sales order in seconds, the reply drafted in your voice, the quote that adds up. Multi-step work, done end to end, with a person in the loop where it matters."
            />
          </div>
        </div>
        <style>{`
          @media (max-width: 720px) {
            .principles-header { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
          }
        `}</style>
      </section>

      <hr className="rule" />

      {/* Founder */}
      <section className="section">
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(180px, 220px) 1fr",
              gap: "3rem",
              alignItems: "start",
            }}
            className="founder-grid"
          >
            <div>
              <div className="eyebrow" style={{ display: "inline-flex", alignItems: "center" }}>
                <span className="dot-mark" />
                (03) · Who you&rsquo;ll work with
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "240px 1fr",
                gap: "2.5rem",
                alignItems: "start",
                maxWidth: "980px",
              }}
              className="founder-inner"
            >
              <Image
                src="/colton.jpg"
                alt="Colton, founder of Clea Solutions"
                width={474}
                height={474}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "8px",
                  border: "1px solid var(--rule)",
                }}
              />
              <div style={{ maxWidth: "720px" }}>
              <h2
                className="display"
                style={{
                  fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                  marginBottom: "1.5rem",
                }}
              >
                You&rsquo;ll work with me, not a team of{" "}
                <em
                  className="text-accent"
                  style={{ fontStyle: "normal" }}
                >
                  subcontractors.
                </em>
              </h2>
              <p style={{ color: "var(--ink-muted)", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                I&rsquo;m Colton, the founder of Clea Solutions. I spent six years as an
                architectural sales rep for a commercial distributor before I ever built
                software. I don&rsquo;t come from a development background, and that&rsquo;s the point.
                I&rsquo;ve lived the problems these systems solve: the purchase orders keyed in
                by hand, the inbox that never empties, the quote that has to be right the
                first time.
              </p>
              <p style={{ color: "var(--ink-muted)", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                So I spent the last year learning to build the fix myself, relentlessly.
                Every system on this site was built, deployed, and is maintained by me.
                When you call, you talk to the person who understands your day-to-day
                because I&rsquo;ve lived it, and who also writes the code.
              </p>
              <Link href="/contact" className="btn-link">
                Book a free assessment
                <span aria-hidden>→</span>
              </Link>
              </div>
            </div>
          </div>
        </div>
        <style>{`
          @media (max-width: 720px) {
            .founder-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
            .founder-inner { grid-template-columns: 1fr !important; gap: 2rem !important; }
            .founder-inner img { max-width: 280px; }
          }
        `}</style>
      </section>

      <hr className="rule" />

      {/* Closing */}
      <section className="section">
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "3rem",
              alignItems: "end",
              flexWrap: "wrap",
            }}
            className="closing-grid"
          >
            <div style={{ maxWidth: "640px" }}>
              <div className="eyebrow" style={{ marginBottom: "1.25rem", display: "inline-flex", alignItems: "center" }}>
                <span className="dot-mark" />
                (04) · In practice
              </div>
              <p
                className="display"
                style={{
                  fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)",
                  lineHeight: 1.3,
                }}
              >
                Every project ships with a paper trail: outputs that{" "}
                <em
                  className="text-accent"
                  style={{ fontStyle: "normal" }}
                >
                  show their sources,
                </em>{" "}
                and the honest answer when the system isn&rsquo;t sure.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", alignItems: "flex-start" }}>
              <Link href="/work" className="btn-link">
                Browse projects
                <span aria-hidden>→</span>
              </Link>
              <Link href="/contact" className="btn-link">
                Book a free assessment
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
        <style>{`
          @media (max-width: 720px) {
            .closing-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>
    </>
  );
}

const TICKER_ITEMS = [
  "YOUR DATA STAYS INSIDE YOUR WALLS",
  "NO PER-SEAT FEES",
  "YOU OWN THE MODEL",
  "EVERY ANSWER SHOWS ITS SOURCE",
  "HONEST WHEN IT ISN'T SURE",
  "HUMAN HANDOFF BUILT IN",
  "RUNS ON YOUR HARDWARE",
];

function Stat({
  figure,
  label,
  prefix,
  suffix,
}: {
  figure: string;
  label: string;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div>
      <div className="stat-figure">
        {prefix && <span style={{ fontSize: "0.55em", color: "var(--ink-muted)", marginRight: "0.05em" }}>{prefix}</span>}
        <em>{figure}</em>
        {suffix && <span style={{ fontSize: "0.55em", color: "var(--ink-muted)", marginLeft: "0.05em" }}>{suffix}</span>}
      </div>
      <span className="stat-label">{label}</span>
    </div>
  );
}

function Principle({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
        <span
          style={{
            width: "28px",
            height: "1px",
            background: "var(--accent)",
            display: "inline-block",
          }}
        />
        <span
          className="mono"
          style={{
            fontSize: "0.72rem",
            color: "var(--accent-deep)",
            letterSpacing: "0.12em",
          }}
        >
          {num}
        </span>
      </div>
      <h3
        style={{
          fontSize: "1.2rem",
          fontWeight: 500,
          marginBottom: "0.85rem",
          letterSpacing: "-0.01em",
          color: "var(--ink)",
        }}
      >
        {title}
      </h3>
      <p style={{ color: "var(--ink-muted)", fontSize: "0.95rem", lineHeight: 1.65 }}>{body}</p>
    </div>
  );
}
