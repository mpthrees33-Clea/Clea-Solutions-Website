import type { Metadata } from "next";
import Link from "next/link";
import ConfidentialityNote from "@/components/ConfidentialityNote";
import MobileFlow from "@/components/MobileFlow";
import RevealSection from "@/components/motion/RevealSection";

export const metadata: Metadata = {
  title: "Sales Hub · Clea Solutions",
  description:
    "A field rep's whole day in one tool: voice-first AI assistant, sample orders, CRM pipeline, and crossover lookup — with every AI capability scoped and observed. Architecture case study.",
};

const CAPABILITIES = [
  {
    num: "01",
    title: "Voice-first field assistant",
    body: "Reps talk to it from the road: account briefs before a walk-in, catalog and crossover answers on the spot, visit notes captured by voice. Every answer is grounded in CRM records and catalog rows — if a lookup comes back empty, it says so and logs a follow-up instead of improvising.",
  },
  {
    num: "02",
    title: "Email in the rep's own voice",
    body: "The drafting agent runs on the on-prem fine-tune trained on years of real sent email. Facts come from the thread and tool results; tone comes from the voice model; nothing sends without the rep's click.",
  },
  {
    num: "03",
    title: "Multi-step sample orders",
    body: "A guided flow assembles multi-line sample orders against the live catalog. CRM writes are draft-only by design — the agent's auth scope literally does not include promoting its own drafts.",
  },
  {
    num: "04",
    title: "CRM pipeline, kanban style",
    body: "The pipeline view the reps actually use day to day. The assistant reads it to prioritize follow-ups; the human owns every stage change that matters.",
  },
];

const ARCHITECTURE = String.raw`
  rep (field · phone · desktop)
        │  voice / text
        ▼
  ┌─────────────────────────────────────────┐
  │  Field Voice Assistant                  │
  │  grounded answers only · 3-sentence cap │
  └───────┬───────────────┬─────────────────┘
          ▼               ▼
  ┌──────────────┐  ┌───────────────────────┐
  │ crm_api      │  │ catalog_search        │
  │ read ·       │  │ + crossover index     │
  │ write:draft  │  │ source row per hit    │
  └──────┬───────┘  └──────────┬────────────┘
         │                     │
         ▼                     ▼
  ┌─────────────────────────────────────────┐
  │  Voice-Match Email Drafter              │
  │  on-prem fine-tune · drafts only        │
  └─────────────────────────────────────────┘
   conversation_store: 90-day, per-user scope
   observed by MISSION CONTROL
   Azure AI · Entra ID · tenant-only data
`;

const OUTCOMES = [
  { figure: "—", label: "rep interactions per week [PLACEHOLDER: Colton — real anonymized number]" },
  { figure: "—", label: "voice-command adoption among reps [PLACEHOLDER: Colton]" },
  { figure: "0", label: "AI-sent emails. Every draft is reviewed and sent by a person" },
  { figure: "100%", label: "of assistant answers grounded in CRM or catalog records, or refused" },
];

export default function SalesHubPage() {
  return (
    <>
      <section className="section" style={{ paddingBottom: "3rem" }}>
        <div className="container">
          <Link href="/work" className="mono" style={{ fontSize: "0.72rem", letterSpacing: "0.12em", color: "var(--ink-muted)" }}>
            ← ALL WORK
          </Link>
          <div className="eyebrow" style={{ margin: "2.5rem 0 1.5rem", display: "inline-flex", alignItems: "center" }}>
            <span className="dot-mark" />
            (Case study) · Field sales workspace
          </div>
          <h1 className="display" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", marginBottom: "1.75rem", maxWidth: "900px" }}>
            A field rep&rsquo;s whole day, <em>one tool.</em>
          </h1>
          <p style={{ fontSize: "1.15rem", color: "var(--ink-muted)", maxWidth: "680px", lineHeight: 1.65, marginBottom: "2.5rem" }}>
            Sales Hub is the workspace a flooring distributor&rsquo;s outside reps run
            their day from: a voice-first AI assistant, multi-step sample ordering, a
            CRM kanban, and private-label crossover lookup. The AI in it is real,
            scoped, and observed — built by someone who spent six years in the
            passenger seat doing this job.
          </p>
          <ConfidentialityNote systemName="Sales Hub">
            The production Sales Hub runs inside an employer&rsquo;s Microsoft
            environment behind Entra ID and can&rsquo;t be shown with live data. A{" "}
            <a href="https://mpthrees33-clea.github.io/Sales-Hub/" target="_blank" rel="noopener noreferrer" className="btn-link">
              public shell of the app
            </a>{" "}
            is open to click through, and the architecture below documents how the
            in-tenant version actually works.
          </ConfidentialityNote>
        </div>
      </section>

      <hr className="rule" />

      {/* Capabilities */}
      <section className="section">
        <div className="container">
          <RevealSection>
            <div className="eyebrow" style={{ marginBottom: "1.5rem", display: "inline-flex", alignItems: "center" }}>
              <span className="dot-mark" />
              (01) · What&rsquo;s inside
            </div>
            <h2 className="display" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", maxWidth: "760px", marginBottom: "3rem" }}>
              Built from the passenger seat, <em>hardened</em> like infrastructure.
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
              (02) · Under the hood
            </div>
            <h2 className="display" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", marginBottom: "2rem" }}>
              Architecture.
            </h2>
            <div className="panel diagram-desktop pre-diagram" style={{ padding: "2rem" }}>
              <pre className="mono" style={{ fontSize: "0.72rem", lineHeight: 1.5, color: "var(--ink-muted)", margin: 0 }}>
                {ARCHITECTURE}
              </pre>
            </div>
            <div className="diagram-mobile">
              <MobileFlow
                steps={[
                  { title: "rep (field · phone · desktop)", detail: "voice / text in" },
                  { title: "Field Voice Assistant", detail: "grounded answers only · 3-sentence cap" },
                  {
                    parallel: [
                      { title: "crm_api", detail: "read · write:draft" },
                      { title: "catalog_search", detail: "+ crossover index · source row per hit" },
                    ],
                  },
                  { title: "Voice-Match Email Drafter", detail: "on-prem fine-tune · drafts only" },
                ]}
                footers={[
                  "conversation_store: 90-day, per-user scope",
                  "observed by MISSION CONTROL",
                  "Azure AI · Entra ID · tenant-only data",
                ]}
              />
            </div>
            <p style={{ marginTop: "1.5rem", color: "var(--ink-muted)", fontSize: "0.92rem", maxWidth: "680px", lineHeight: 1.65 }}>
              The Field Voice Assistant and Voice-Match Email Drafter are two of the
              seven agents governed from{" "}
              <Link href="/mission-control" className="btn-link">Mission Control</Link> —
              same prompts, tool scopes, and guardrails you can inspect in the replica.
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
              Adopted, because it was built for the job.
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem" }} className="sh-stats">
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
                .sh-stats { grid-template-columns: repeat(2, 1fr) !important; }
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
                Your field team&rsquo;s day probably looks like this too.
              </h2>
              <p style={{ color: "var(--ink-muted)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
                The pattern transfers: grounded assistant, drafts in your people&rsquo;s
                voice, and a human hand on everything that matters.
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
