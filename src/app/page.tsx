import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: "780px" }}>
            <div className="eyebrow" style={{ marginBottom: "2rem" }}>
              (01) — Clea Solutions
            </div>
            <h1
              className="display"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                marginBottom: "1.75rem",
              }}
            >
              Agentic systems that can be trusted with the work.
            </h1>
            <p
              style={{
                fontSize: "1.15rem",
                lineHeight: 1.6,
                color: "var(--ink-muted)",
                maxWidth: "620px",
                marginBottom: "2.5rem",
              }}
            >
              We build grounded, fine-tuned agents for the parts of a business where wrong answers cost
              real money. Domain-specific. Auditable. Production-grade.
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

      <hr className="rule" />

      {/* Principles */}
      <section className="section">
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: "1rem" }}>
            (02) — How we think
          </div>
          <h2
            className="display"
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              maxWidth: "640px",
              marginBottom: "4rem",
            }}
          >
            Three things we believe make the difference between a demo and a system you can{" "}
            <em style={{ fontStyle: "italic" }}>actually deploy.</em>
          </h2>

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
      </section>

      <hr className="rule" />

      {/* Closing */}
      <section className="section">
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "end",
              flexWrap: "wrap",
              gap: "2rem",
            }}
          >
            <div style={{ maxWidth: "560px" }}>
              <div className="eyebrow" style={{ marginBottom: "1rem" }}>
                (03) — In practice
              </div>
              <p
                className="display"
                style={{
                  fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                  lineHeight: 1.3,
                }}
              >
                Every project ships with audit bundles, source-grounded outputs, and the honest
                answer when the system isn't sure.
              </p>
            </div>
            <Link href="/work" className="btn-link">
              Browse projects
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Principle({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <div>
      <div
        className="mono"
        style={{
          fontSize: "0.75rem",
          color: "var(--ink-faint)",
          marginBottom: "1rem",
          letterSpacing: "0.1em",
        }}
      >
        {num}
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
