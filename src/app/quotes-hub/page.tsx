import type { Metadata } from "next";
import Link from "next/link";
import ConfidentialityNote from "@/components/ConfidentialityNote";
import RevealSection from "@/components/motion/RevealSection";

export const metadata: Metadata = {
  title: "Quotes Hub · Clea Solutions",
  description:
    "An agentic quoting platform: inbound request to priced draft quote with per-field grounding, deterministic pricing, pipeline follow-ups, and grounded Q&A. Architecture case study.",
};

const CAPABILITIES = [
  {
    num: "01",
    title: "Inbound request → draft quote",
    body: "The quote agent reads inbound emails, POs, and spec lists, extracts products, quantities, and constraints with a source line attached to every value, and assembles a priced draft for a human to approve. Below 0.70 confidence, it routes to review instead of guessing.",
  },
  {
    num: "02",
    title: "Price & product crossover",
    body: "Requested products are resolved against the catalog and the private-label crossover index. Every match carries its source row; fuzzy matches return ranked candidates, never a silent best guess. Prices come from a deterministic pricing engine — the model never does arithmetic.",
  },
  {
    num: "03",
    title: "Pipeline follow-ups",
    body: "Quote status is tracked end to end. The follow-up agent drafts nudges in the rep's own voice (powered by the on-prem fine-tune), flags stale quotes, and prioritizes the pipeline by value and age. Drafts only — a person clicks send.",
  },
  {
    num: "04",
    title: "Grounded Q&A over quote data",
    body: "Reps ask questions in plain language — \"what did we quote them last spring?\", \"which quotes over $10k are stalled?\" — and the assistant answers from quote history and documents, citing the records it used.",
  },
];

const ARCHITECTURE = String.raw`
  inbound request (email · PO PDF · spec list)
        │
        ▼
  ┌───────────────────────────────────────────┐
  │  intake  —  PO Intake (IDP) for documents │
  │  7 validation gates · per-field grounding │
  └────────────────────┬──────────────────────┘
                       ▼
  ┌───────────────────────────────────────────┐
  │  quote agent                              │
  │  extract → catalog_search → crossover     │
  │  every value carries its source line      │
  └──────┬─────────────────────────┬──────────┘
         ▼                         ▼
  ┌──────────────┐        ┌─────────────────┐
  │ pricing      │        │ human review    │
  │ engine       │        │ queue (<0.70    │
  │ (determin.)  │        │ confidence)     │
  └──────┬───────┘        └────────┬────────┘
         ▼                         │
  ┌───────────────────────────┐    │
  │ draft quote · rep approves│◄───┘
  └──────┬────────────────────┘
         ▼
  ┌───────────────────────────────────────────┐
  │ pipeline: follow-up agent (voice model)   │
  │ grounded Q&A over quote_history           │
  └───────────────────────────────────────────┘
   all agents observed by MISSION CONTROL
   Azure AI · Entra ID · tenant-only data
`;

const OUTCOMES = [
  { figure: "—", label: "quotes drafted per week [PLACEHOLDER: Colton — real anonymized number]" },
  { figure: "—", label: "average turnaround, before vs after [PLACEHOLDER: Colton]" },
  { figure: "100%", label: "of extracted values traced to a source line or routed to a person" },
  { figure: "0", label: "prices computed by a language model. All math is deterministic" },
];

export default function QuotesHubPage() {
  return (
    <>
      <section className="section" style={{ paddingBottom: "3rem" }}>
        <div className="container">
          <Link href="/work" className="mono" style={{ fontSize: "0.72rem", letterSpacing: "0.12em", color: "var(--ink-muted)" }}>
            ← ALL WORK
          </Link>
          <div className="eyebrow" style={{ margin: "2.5rem 0 1.5rem", display: "inline-flex", alignItems: "center" }}>
            <span className="dot-mark" />
            (Case study) · Agentic quoting platform
          </div>
          <h1 className="display" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", marginBottom: "1.75rem", maxWidth: "900px" }}>
            Request in. Priced quote out. <em>Sources attached.</em>
          </h1>
          <p style={{ fontSize: "1.15rem", color: "var(--ink-muted)", maxWidth: "680px", lineHeight: 1.65, marginBottom: "2.5rem" }}>
            Quotes Hub is an agentic quoting platform for a commercial flooring
            distributor: four cooperating AI capabilities that turn an inbound request
            into a priced, human-approved quote — and keep working the pipeline after
            it&rsquo;s sent. Deployed inside the company&rsquo;s Microsoft environment.
          </p>
          <ConfidentialityNote systemName="Quotes Hub" />
        </div>
      </section>

      <hr className="rule" />

      {/* Capabilities */}
      <section className="section">
        <div className="container">
          <RevealSection>
            <div className="eyebrow" style={{ marginBottom: "1.5rem", display: "inline-flex", alignItems: "center" }}>
              <span className="dot-mark" />
              (01) · What the agents do
            </div>
            <h2 className="display" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", maxWidth: "760px", marginBottom: "3rem" }}>
              Four capabilities, one <em>governed</em> pipeline.
            </h2>
          </RevealSection>
          <RevealSection targets=".grid-2 > div">
            <div className="grid-2" style={{ gap: "3rem 2.5rem" }}>
              {CAPABILITIES.map((c) => (
                <div key={c.num}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                    <span style={{ width: "28px", height: "1px", background: "var(--accent)", display: "inline-block" }} />
                    <span className="mono" style={{ fontSize: "0.72rem", color: "var(--accent)", letterSpacing: "0.12em" }}>
                      {c.num}
                    </span>
                  </div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 500, marginBottom: "0.85rem", letterSpacing: "-0.01em" }}>
                    {c.title}
                  </h3>
                  <p style={{ color: "var(--ink-muted)", fontSize: "0.92rem", lineHeight: 1.65 }}>{c.body}</p>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      <hr className="rule" />

      {/* Architecture */}
      <section className="section">
        <div className="container">
          <RevealSection>
            <div className="eyebrow" style={{ marginBottom: "1.5rem", display: "inline-flex", alignItems: "center" }}>
              <span className="dot-mark" />
              (02) · Pipeline
            </div>
            <h2 className="display" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", marginBottom: "2rem" }}>
              Architecture.
            </h2>
            <div className="panel" style={{ padding: "2rem", overflowX: "auto" }}>
              <pre className="mono" style={{ fontSize: "0.72rem", lineHeight: 1.5, color: "var(--ink-muted)", margin: 0 }}>
                {ARCHITECTURE}
              </pre>
            </div>
            <p style={{ marginTop: "1.5rem", color: "var(--ink-muted)", fontSize: "0.92rem", maxWidth: "680px", lineHeight: 1.65 }}>
              The agents inside this pipeline — Quote Builder, PO Intake, Crossover
              Lookup, and the voice-match drafter — are all governed from{" "}
              <Link href="/mission-control" className="btn-link">Mission Control</Link>, where
              their prompts, tool scopes, and memory bindings live.
            </p>
          </RevealSection>
        </div>
      </section>

      <hr className="rule" />

      {/* Outcomes */}
      <section className="section">
        <div className="container">
          <RevealSection>
            <div className="eyebrow" style={{ marginBottom: "1.5rem", display: "inline-flex", alignItems: "center" }}>
              <span className="dot-mark" />
              (03) · Outcomes
            </div>
            <h2 className="display" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", marginBottom: "3rem" }}>
              Measured, not promised.
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem" }} className="qh-stats">
              {OUTCOMES.map((o) => (
                <div key={o.label}>
                  <div className="stat-figure">
                    <em>{o.figure}</em>
                  </div>
                  <span className="stat-label">{o.label}</span>
                </div>
              ))}
            </div>
            <style>{`
              @media (max-width: 720px) {
                .qh-stats { grid-template-columns: repeat(2, 1fr) !important; }
              }
            `}</style>
          </RevealSection>
        </div>
      </section>

      {/* CTA */}
      <section className="section-tight" style={{ paddingBottom: "5rem" }}>
        <div className="container">
          <div className="panel" style={{ padding: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
            <div style={{ maxWidth: "560px" }}>
              <h2 className="display" style={{ fontSize: "1.6rem", marginBottom: "0.75rem" }}>
                Quoting is where hallucinations get expensive.
              </h2>
              <p style={{ color: "var(--ink-muted)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
                If your team keys quotes by hand — or you&rsquo;re nervous about an AI
                doing it unsupervised — this is the pattern that makes it safe.
              </p>
            </div>
            <Link href="/contact" className="btn btn-accent">
              Talk to us
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
