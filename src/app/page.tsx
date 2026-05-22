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
              (01) — Clea Solutions
            </div>
            <h1
              className="display"
              style={{
                fontSize: "clamp(2.5rem, 6.2vw, 4.75rem)",
                marginBottom: "1.75rem",
              }}
            >
              Agentic systems that can be{" "}
              <em
                className="text-accent"
                style={{ fontStyle: "italic", fontFamily: "var(--font-serif), serif" }}
              >
                trusted
              </em>{" "}
              with the work.
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
              We build grounded, fine-tuned agents for the parts of a business where wrong
              answers cost real money. Domain-specific. Auditable. Production-grade.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <Link href="/work" className="btn btn-primary">
                See the work
                <span aria-hidden>→</span>
              </Link>
              <Link href="/contact" className="btn btn-ghost">
                Start a conversation
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
            <Stat figure="7" suffix="" label="anti-hallucination layers in our IDP pipeline" />
            <Stat figure="2" suffix="" label="independent models must agree per extraction" />
            <Stat figure="0.0001" prefix="$" label="marginal cost per processed document" />
            <Stat figure="100" suffix="%" label="of extracted fields grounded in source text" />
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
                (02) — Approach
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
                style={{ fontStyle: "italic", fontFamily: "var(--font-serif), serif" }}
              >
                a demo
              </em>{" "}
              from a system you can actually deploy.
            </h2>
          </div>

          <div className="grid-3">
            <Principle
              num="01"
              title="Generic chatbots fail in production"
              body="Wrapping an LLM API and calling it an agent has a ceiling. Off-the-shelf models are unpredictable, hallucinate quietly, and can't be trusted with critical workflows. The interesting work starts where the wrapper ends."
            />
            <Principle
              num="02"
              title="Fine-tuning and grounding are the work"
              body="We train models on your domain, ground every output in source evidence, and require two independent passes to agree before a value is accepted. Accuracy isn't an aspiration — it's an invariant."
            />
            <Principle
              num="03"
              title="An agent should act, not chat"
              body="Real value comes from autonomous workflows that decide, use tools, and execute multi-step tasks across your existing systems — safely, observably, with clean handoffs back to a human when it matters."
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
                (03) — In practice
              </div>
              <p
                className="display"
                style={{
                  fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)",
                  lineHeight: 1.3,
                }}
              >
                Every project ships with audit bundles,{" "}
                <em
                  className="text-accent"
                  style={{ fontStyle: "italic", fontFamily: "var(--font-serif), serif" }}
                >
                  source-grounded outputs,
                </em>{" "}
                and the honest answer when the system isn't sure.
              </p>
            </div>
            <Link href="/work" className="btn-link">
              Browse projects
              <span aria-hidden>→</span>
            </Link>
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
  "GROUNDED EXTRACTION",
  "TWO-MODEL CONSISTENCY",
  "AUDIT BUNDLES",
  "FINE-TUNED FOR DOMAIN",
  "PYTHON · TYPESCRIPT · NEXT.JS",
  "FASTAPI · GEMINI · OLLAMA",
  "ZERO HALLUCINATION",
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
