import Image from "next/image";
import Link from "next/link";
import HeroTitle from "@/components/motion/HeroTitle";
import RevealSection from "@/components/motion/RevealSection";
import MissionControlScroll from "@/components/motion/MissionControlScroll";

export default function Home() {
  return (
    <>
      {/* (01) Hero */}
      <section className="section section-hero">
        <div className="container">
          <div style={{ maxWidth: "900px" }}>
            <div className="eyebrow fade-up" style={{ marginBottom: "2rem", display: "inline-flex", alignItems: "center" }}>
              <span className="dot-mark" />
              (01) · Clea Solutions
            </div>
            <HeroTitle className="display display-xl">
              Anyone can demo an agent. Shipping one takes a <em>harness</em>.
            </HeroTitle>
            <p
              className="fade-up fade-up-d2"
              style={{
                fontSize: "1.2rem",
                lineHeight: 1.55,
                color: "var(--ink-muted)",
                maxWidth: "640px",
                margin: "1.75rem 0 2.5rem",
              }}
            >
              Clea Solutions builds enterprise-grade agentic AI infrastructure: the
              grounding, validation, orchestration, and observability that let agents do
              real work without inventing it. Private by default — your data never
              leaves the building.
            </p>
            <div className="fade-up fade-up-d3" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <a href="#mission-control" className="btn btn-primary">
                See the platform
                <span aria-hidden>↓</span>
              </a>
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
          <RevealSection targets=".stats-grid > div">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "2rem",
              }}
              className="stats-grid"
            >
              <Stat figure="0" suffix="" label="customer documents sent to the cloud. Everything runs inside your walls" />
              <Stat figure="100" suffix="%" label="of AI outputs traced to the exact source text, or flagged for a person" />
              <Stat figure="7" suffix="" label="independent validation layers between a document and your books" />
              <Stat figure="60" prefix="<" suffix="sec" label="to turn a purchase order PDF into a validated, double-checked order" />
            </div>
          </RevealSection>
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

      {/* (02) The thesis */}
      <section className="section" id="thesis">
        <div className="container">
          <RevealSection>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(180px, 220px) 1fr",
                gap: "3rem",
                alignItems: "start",
              }}
              className="thesis-grid"
            >
              <div>
                <div className="eyebrow" style={{ display: "inline-flex", alignItems: "center" }}>
                  <span className="dot-mark" />
                  (02) · The problem
                </div>
              </div>
              <div style={{ maxWidth: "720px" }}>
                <h2 className="display" style={{ fontSize: "clamp(2rem, 4.2vw, 3.1rem)", marginBottom: "1.5rem" }}>
                  The model is <em>10%</em> of the system.
                </h2>
                <p style={{ color: "var(--ink-muted)", fontSize: "1.1rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                  A raw language model will always give you an answer — even when it&rsquo;s
                  making one up. That&rsquo;s fine for brainstorming and fatal for orders,
                  quotes, and customer email. What separates a demo from production is
                  everything wrapped around the model: content gates, per-field source
                  grounding, deterministic math, scoped tool permissions, governed
                  memory, escalation paths, and a control plane that watches all of it.
                </p>
                <p style={{ fontSize: "1.1rem", lineHeight: 1.7 }}>
                  That other 90% is what we build.
                </p>
              </div>
            </div>
          </RevealSection>
        </div>
        <style>{`
          @media (max-width: 720px) {
            .thesis-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
          }
        `}</style>
      </section>

      <hr className="rule" />

      {/* (03) Mission Control — pinned scrubbed centerpiece */}
      <div id="mission-control">
        <MissionControlScroll />
      </div>

      <hr className="rule" />

      {/* (04) How the pieces connect */}
      <section className="section">
        <div className="container">
          <RevealSection>
            <div style={{ marginBottom: "4rem", maxWidth: "720px" }}>
              <div className="eyebrow" style={{ marginBottom: "1.25rem", display: "inline-flex", alignItems: "center" }}>
                <span className="dot-mark" />
                (04) · One platform, not point solutions
              </div>
              <h2 className="display" style={{ fontSize: "clamp(1.9rem, 3.8vw, 2.75rem)" }}>
                Every system feeds the next.
              </h2>
            </div>
          </RevealSection>

          <RevealSection targets=".connect-row">
            <div style={{ display: "grid", gap: "0" }}>
              <ConnectRow
                num="A"
                title="Documents in → orders out."
                body="PO Intake reads inbound purchase orders, grounds every field to the source document across seven validation layers, and hands validated orders to the Quotes Hub and the customer-service system. No reconciled math, no order."
                href="/po-idp"
                link="PO IDP case study + live demo"
              />
              <ConnectRow
                num="B"
                title="A voice, not a chatbot."
                body="An on-prem fine-tune trained on years of real sent email drafts replies that sound like the author. It powers the drafting agents inside Sales Hub and Quotes Hub — the tone model stays isolated from the data model."
                href="/email-voice"
                link="Email fine-tune case study"
              />
              <ConnectRow
                num="C"
                title="Orchestrated and observed."
                body="Mission Control governs every agent across every platform: its prompt, its memory bindings, its tool permissions, its run history. Azure AI backed, Microsoft Entra ID secured, one pane of glass."
                href="/mission-control"
                link="Explore the interactive replica"
              />
            </div>
          </RevealSection>
        </div>
      </section>

      {/* (05) Live proof band */}
      <section style={{ background: "var(--bg-tint)", borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)" }}>
        <div className="container" style={{ padding: "4rem 1.5rem" }}>
          <RevealSection>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: "3rem",
                alignItems: "center",
              }}
              className="proof-grid"
            >
              <div style={{ maxWidth: "640px" }}>
                <div className="eyebrow" style={{ marginBottom: "1.25rem", display: "inline-flex", alignItems: "center" }}>
                  <span className="dot-mark" />
                  (05) · Live proof
                </div>
                <h2 className="display" style={{ fontSize: "clamp(1.6rem, 3vw, 2.25rem)", marginBottom: "1rem" }}>
                  Don&rsquo;t take our word for it. <em>Run the pipeline.</em>
                </h2>
                <p style={{ color: "var(--ink-muted)", fontSize: "1rem", lineHeight: 1.65 }}>
                  The parts we&rsquo;re allowed to show run live on this site — the rest is
                  documented as sanitized architecture. Feed the PO pipeline a sample
                  purchase order and watch every validation gate fire.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", alignItems: "flex-start" }}>
                <Link href="/po-idp" className="btn btn-accent">
                  Run the PO demo
                  <span aria-hidden>→</span>
                </Link>
                <Link href="/work" className="btn-link">
                  Browse everything we&rsquo;ve built
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </RevealSection>
        </div>
        <style>{`
          @media (max-width: 720px) {
            .proof-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* (06) Principles */}
      <section className="section">
        <div className="container">
          <RevealSection>
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
                  (06) · Approach
                </div>
              </div>
              <h2
                className="display"
                style={{
                  fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                  maxWidth: "720px",
                }}
              >
                Three things that separate <em>a demo</em> from a system you can
                actually deploy.
              </h2>
            </div>
          </RevealSection>

          <RevealSection targets=".grid-3 > div">
            <div className="grid-3">
              <Principle
                num="01"
                title="Generic AI guesses. Harnesses verify."
                body="Off-the-shelf chatbots will always give you an answer, even when they're making it up. We build the gates around the model: every output is checked against its source, reconciled deterministically, or handed to a person — before it reaches your books."
              />
              <Principle
                num="02"
                title="Grounded in your business, deterministic where it counts."
                body="Agents are trained on your documents, your terminology, your way of working. Retrieval answers cite their source rows. Prices and totals come from deterministic engines, never from a model's imagination."
              />
              <Principle
                num="03"
                title="It does the task, end to end, observed."
                body="The value isn't a chat window. It's the purchase order that becomes a validated sales order, the reply drafted in your voice, the quote that adds up — with every agent's prompt, tools, and memory governed from one control plane."
              />
            </div>
          </RevealSection>
        </div>
        <style>{`
          @media (max-width: 720px) {
            .principles-header { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
          }
        `}</style>
      </section>

      <hr className="rule" />

      {/* (07) Founder */}
      <section className="section">
        <div className="container">
          <RevealSection>
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
                  (07) · Who you&rsquo;ll work with
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
                    You&rsquo;ll work with me, not a team of <em>subcontractors.</em>
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
                    Today I design and run the agent infrastructure — orchestration, evals,
                    guardrails, observability — behind a commercial distributor&rsquo;s sales,
                    quoting, and customer-service platforms. Every system on this site was
                    built, deployed, and is maintained by me. When you call, you talk to the
                    person who understands your day-to-day because I&rsquo;ve lived it, and who
                    also writes the code.
                  </p>
                  <Link href="/contact" className="btn-link">
                    Book a free assessment
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </RevealSection>
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

      {/* (08) Closing */}
      <section className="section">
        <div className="container">
          <RevealSection>
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
                  (08) · In practice
                </div>
                <p
                  className="display"
                  style={{
                    fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)",
                    lineHeight: 1.3,
                  }}
                >
                  Every agent ships with a paper trail: outputs that{" "}
                  <em>show their sources,</em>{" "}tools that log every call, and the
                  honest answer when the system isn&rsquo;t sure.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", alignItems: "flex-start" }}>
                <Link href="/mission-control" className="btn-link">
                  See the control plane
                  <span aria-hidden>→</span>
                </Link>
                <Link href="/work" className="btn-link">
                  Browse the platform
                  <span aria-hidden>→</span>
                </Link>
                <Link href="/contact" className="btn-link">
                  Book a free assessment
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </RevealSection>
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
  "EVERY AGENT OBSERVABLE",
  "GROUNDED OR IT ESCALATES",
  "ENTRA ID · AZURE AI",
  "RUNS ON YOUR HARDWARE",
  "NO PER-SEAT FEES",
  "HUMAN HANDOFF BUILT IN",
  "EVERY ANSWER SHOWS ITS SOURCE",
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
            color: "var(--accent)",
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

function ConnectRow({
  num,
  title,
  body,
  href,
  link,
}: {
  num: string;
  title: string;
  body: string;
  href: string;
  link: string;
}) {
  return (
    <div
      className="connect-row"
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(180px, 220px) 1fr",
        gap: "3rem",
        alignItems: "start",
        padding: "2.5rem 0",
        borderTop: "1px solid var(--rule)",
      }}
    >
      <div className="mono" style={{ fontSize: "0.72rem", color: "var(--accent)", letterSpacing: "0.14em", paddingTop: "0.4rem" }}>
        {num} —
      </div>
      <div style={{ maxWidth: "720px" }}>
        <h3 className="display" style={{ fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)", marginBottom: "0.85rem" }}>
          {title}
        </h3>
        <p style={{ color: "var(--ink-muted)", fontSize: "1rem", lineHeight: 1.7, marginBottom: "1rem" }}>{body}</p>
        <Link href={href} className="btn-link" style={{ fontSize: "0.92rem" }}>
          {link}
          <span aria-hidden>→</span>
        </Link>
      </div>
      <style>{`
        @media (max-width: 720px) {
          .connect-row { grid-template-columns: 1fr !important; gap: 1rem !important; }
        }
      `}</style>
    </div>
  );
}
