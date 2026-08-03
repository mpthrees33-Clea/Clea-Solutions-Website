import type { Metadata } from "next";
import Link from "next/link";
import ConfidentialityNote from "@/components/ConfidentialityNote";
import MobileFlow from "@/components/MobileFlow";
import RevealSection from "@/components/motion/RevealSection";
import Screenshot from "@/components/Screenshot";
import RunTrace from "./RunTrace";
import shotApprovals from "../../../public/sales-hub/approvals-inbox.png";
import shotAudit from "../../../public/sales-hub/approvals-audit.png";
import shotDashboard from "../../../public/sales-hub/dashboard.png";
import shotEmail from "../../../public/sales-hub/email-triage.png";
import shotMeetings from "../../../public/sales-hub/meetings.png";
import shotPipeline from "../../../public/sales-hub/pipeline.png";
import shotPoIntake from "../../../public/sales-hub/po-intake.png";

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

const GALLERY = [
  {
    src: shotDashboard,
    alt: "Mission-control dashboard with morning brief, KPI tiles, and agent run activity",
    label: "Dashboard",
    caption:
      "The morning brief the rep wakes up to. Counts, docket, and KPIs are assembled by SQL — the model writes only the narrative sentence. Deterministic facts, drafted prose.",
  },
  {
    src: shotEmail,
    alt: "Email inbox with triage category and confidence chips on every thread",
    label: "Overnight triage",
    caption:
      "Metadata-first classification on the cheap model tier; the body is loaded only when metadata is inconclusive. The model outputs {category, confidence} — deterministic code picks every route.",
  },
  {
    src: shotPoIntake,
    alt: "PO intake queue showing validated and escalated purchase-order extractions",
    label: "PO intake",
    caption:
      "One grounded extraction call over the native PDF (zero tools by design), then seven deterministic validation layers. Escalations name the exact failing layer — never a vague retry.",
  },
  {
    src: shotPipeline,
    alt: "CRM pipeline kanban board with stage columns and next steps",
    label: "CRM pipeline",
    caption:
      "Agent-proposed opportunity updates land as approval drafts with field-level diffs; the human owns every stage change that matters.",
  },
  {
    src: shotAudit,
    alt: "Audit trail of resolved approvals",
    label: "Audit trail",
    caption:
      "Every resolved approval is an immutable audit row — who approved what, when, on which agent run, with the evidence attached.",
  },
  {
    src: shotMeetings,
    alt: "Meeting follow-ups generated from diarized transcripts",
    label: "Meetings",
    caption:
      "Follow-ups grounded in the diarized transcript: every summary bullet, action item, and CRM delta cites the segment indices it came from.",
  },
];

const DECISIONS = [
  {
    num: "01",
    title: "Required-but-nullable extraction fields",
    problem: "Optional schema fields let a model silently skip a fact — or worse, fill it with a plausible guess.",
    decision:
      "Every model-reported fact is required and nullable: the JSON Schema the model sees carries [\"type\",\"null\"] unions with “null if not printed — never guess” descriptions. Omission is a schema failure; fabrication is caught by the validators.",
    payoff: "null becomes an explicit, auditable answer. The eval suite counts fabricated-vs-missed separately.",
    snippet: String.raw`tax_cents: z.number().int().nullable()
  .describe("null if no tax line is printed — never compute it")

// the schema the model sees:
"tax_cents": { "type": ["integer", "null"] }   // and always required`,
  },
  {
    num: "02",
    title: "Structured output as tool use",
    problem: "Asking for “JSON only, please” in prose and regex-scraping the reply enforces nothing at generation time.",
    decision:
      "The agent's output schema is transmitted to the model as the input schema of a submit_result tool it must call. On a validation failure the errors go back for exactly one repair turn before the run escalates to a human.",
    payoff: "Schema enforcement happens while the model generates, not after; the prose fallback survives as defense-in-depth.",
    snippet: String.raw`tools.submit_result = aiTool({
  inputSchema: zodSchema(cfg.outputSchema),  // schema IS sent to the model
})
stopWhen: [stepCountIs(maxSteps + 1), hasToolCall("submit_result")]
// validation failure → one repair turn with the zod issues → else escalate`,
  },
  {
    num: "03",
    title: "Message Batches for the overnight run",
    problem: "Nightly triage is latency-insensitive and item-independent — paying interactive prices for it is waste.",
    decision:
      "With a direct Anthropic key, the overnight sweep runs through the Message Batches API at 50% token cost. The boundary is architectural: a batch item is one stateless request, so only single-shot classification batches; agents whose tools are intercepted into approvals mid-loop stay interactive.",
    payoff: "Half-price overnight tokens, with a graceful ladder down to serial calls and the deterministic demo.",
    snippet: String.raw`demo mode                 → deterministic scripts
live, no ANTHROPIC key    → serial gateway calls
live + ANTHROPIC key      → messages.batches.create()   // −50% tokens
// batch what's stateless; keep human-in-the-loop loops interactive`,
  },
  {
    num: "04",
    title: "Token-frugal agent handoffs",
    problem: "Piping one agent's full transcript into the next agent's prompt burns tokens and smuggles noise forward.",
    decision:
      "Each pipeline step passes only the extracted fields the next step needs. Triage reduces to {category, confidence}; deterministic code picks the route and writes a tiny payload row; downstream agents re-fetch what they need through their own scoped tools.",
    payoff: "No transcript ever crosses an agent boundary — and every fetch is governed by that agent's own allowlist.",
    snippet: String.raw`triage → { category, confidence }          // the entire handoff
  → categoryToTarget()                     // code routes, never the model
  → routing row { emailId, threadId, … }   // a pointer, not a payload
next agent re-fetches via its own scoped tools`,
  },
  {
    num: "05",
    title: "Measured, not vibes",
    problem: "Unit tests prove the code runs; they say nothing about whether the model is right.",
    decision:
      "Golden datasets with adversarial cases (prompt injection, keyword traps, unknown-sender POs) score triage accuracy with a confusion matrix, and PO extraction field-by-field — with expected nulls counted, so inventing a value for an absent fact is its own metric: fabricated, distinct from missed or wrong.",
    payoff: "Model claims on this page are measurable. First live-keyed scores publish here when the keys land.",
    snippet: String.raw`pnpm eval:triage → accuracy + confusion matrix (20 labeled, 6 adversarial)
pnpm eval:po     → field accuracy, nulls counted:
                   fabricated / missed / wrong / nullsCorrect`,
  },
];

const INCIDENTS = [
  {
    num: "01",
    symptom: `escalated · output_schema_failed
"no JSON object in model output"`,
    title: "Live models don't behave like scripts",
    story:
      "The first live night escalated 11 of 19 runs. The deployed code asked for JSON in prose and regex-scraped the reply — live Claude chatted its way through the tool loop and ended in sentences. The structured-output rework (schema transmitted as a submit_result tool, plus one repair turn) was already on the branch; production just wasn't running it yet.",
    fix: "Merged. Every one of those escalations disappeared.",
  },
  {
    num: "02",
    symptom: `failed · ENOENT: no such file or directory
open '/var/task/var/blob/…/transcript.json'`,
    title: "The filesystem that isn't there",
    story:
      "The nightly crashed reading seed fixtures from local disk — but a serverless function's filesystem is throwaway, and the bytes lived in Vercel Blob. App-relative blob references now resolve through the active store, and the serving route redirects instead of reading disk.",
    fix: "Meetings pipeline and PO extraction went green on the next cycle.",
  },
  {
    num: "03",
    symptom: `email-triage → "Could you provide the
sender's email address to proceed?"`,
    title: "The model can only see the prompt",
    story:
      "Live triage was handed a bare database id — but its sender-lookup tool needs the address, and its archive tool needs the thread id. The deterministic demo scripts read those from the DB directly, masking the gap for months. Deterministic code now resolves every pointer and puts it in the prompt: the model consumes ids, it never guesses them.",
    fix: "All 14 live triage runs succeeded on the next night.",
  },
  {
    num: "04",
    symptom: `HTTP 504 · FUNCTION_INVOCATION_TIMEOUT
batch msgbatch_018ACQ… status: in_progress`,
    title: "Async workloads need async hosts",
    story:
      "A Message Batch is asynchronous; a Vercel function may only wait 300 seconds — and the poll loop outlived its host. The batch wait is now budgeted (cancel on expiry, so it never double-bills; degrade to serial, recorded honestly as serial-after-batch-timeout), and the whole nightly became resumable: a run that dies mid-flight is adopted by the next invocation and continued duplicate-free, because every step was already idempotent.",
    fix: "The next night: attempt one died at 300s, attempt two adopted the same run and finished it. Zero duplicates.",
  },
];

const OUTCOMES = [
  { figure: "33/34", label: "agent runs succeeded on the first fully-live night — zero escalations, zero failures" },
  { figure: "$0.91", label: "total model cost for a complete overnight run on live Claude" },
  { figure: "0", label: "AI-sent emails. Every draft is reviewed and sent by a person" },
  { figure: "100%", label: "of assistant answers grounded in CRM or catalog records, or refused" },
];
// TODO(Colton): swap the first two tiles for real anonymized production
// adoption numbers (rep interactions/week, voice adoption) when available.

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

      {/* Inside the open build — screenshots + run trace */}
      <section className="section">
        <div className="container">
          <RevealSection>
            <div className="eyebrow" style={{ marginBottom: "1.5rem", display: "inline-flex", alignItems: "center" }}>
              <span className="dot-mark" />
              (03) · Inside the open build
            </div>
            <h2 className="display" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", maxWidth: "820px", marginBottom: "1.5rem" }}>
              The production hub is confidential. <em>Its architecture isn&rsquo;t.</em>
            </h2>
            <p style={{ fontSize: "0.95rem", color: "var(--ink-muted)", maxWidth: "680px", lineHeight: 1.65, marginBottom: "2.5rem" }}>
              These screens are the open-source sibling of the in-tenant build — the same
              agent harness running on seeded, fictional demo data, reproducible from{" "}
              <a href="https://github.com/mpthrees33-Clea/Sales-Hub" target="_blank" rel="noopener noreferrer" className="btn-link">
                source
              </a>{" "}
              with zero API keys. What you see below is a real overnight run, not a mockup.
            </p>
            <Screenshot
              src={shotApprovals}
              alt="Approval inbox showing a pending sales order with seven-layer validation results and evidence chips"
              label="The approval inbox — where every pipeline ends"
              caption="Agents cannot send, order, or update. Tools marked effect:'external' are intercepted by the harness: the call becomes this pending approval row — seven-layer validation results and source evidence attached — and a human resolves it."
              priority
            />
          </RevealSection>
          <RevealSection targets=".sh-gallery > figure">
            <div className="grid-2 sh-gallery" style={{ gap: "2rem", marginTop: "2rem" }}>
              {GALLERY.map((g) => (
                <Screenshot key={g.label} src={g.src} alt={g.alt} label={g.label} caption={g.caption} />
              ))}
            </div>
          </RevealSection>
          <RevealSection>
            <div style={{ marginTop: "3rem" }}>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 500, marginBottom: "0.75rem", letterSpacing: "-0.01em" }}>
                Or read the run itself.
              </h3>
              <RunTrace />
            </div>
          </RevealSection>
        </div>
      </section>

      <hr className="rule" />

      {/* Engineering decisions */}
      <section className="section">
        <div className="container">
          <RevealSection>
            <div className="eyebrow" style={{ marginBottom: "1.5rem", display: "inline-flex", alignItems: "center" }}>
              <span className="dot-mark" />
              (04) · Engineering decisions
            </div>
            <h2 className="display" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", maxWidth: "820px", marginBottom: "3rem" }}>
              Five decisions a reviewer <em>can check in the code.</em>
            </h2>
          </RevealSection>
          <RevealSection targets=".sh-decisions > div">
            <div className="grid-2 sh-decisions" style={{ gap: "3rem 2.5rem" }}>
              {DECISIONS.map((d) => (
                <div key={d.num}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                    <span style={{ width: "28px", height: "1px", background: "var(--accent)", display: "inline-block" }} />
                    <span className="mono" style={{ fontSize: "0.72rem", color: "var(--accent)", letterSpacing: "0.12em" }}>
                      {d.num}
                    </span>
                  </div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 500, marginBottom: "0.85rem", letterSpacing: "-0.01em" }}>
                    {d.title}
                  </h3>
                  <p style={{ color: "var(--ink-faint)", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: "0.6rem" }}>
                    {d.problem}
                  </p>
                  <p style={{ color: "var(--ink-muted)", fontSize: "0.92rem", lineHeight: 1.65, marginBottom: "0.6rem" }}>
                    {d.decision}
                  </p>
                  <p style={{ color: "var(--ink-muted)", fontSize: "0.92rem", lineHeight: 1.65, marginBottom: "1rem" }}>
                    <em style={{ fontStyle: "normal", color: "var(--accent-deep)" }}>Payoff:</em> {d.payoff}
                  </p>
                  <div className="panel" style={{ padding: "1rem 1.25rem", overflowX: "auto" }}>
                    <pre className="mono" style={{ fontSize: "0.7rem", lineHeight: 1.55, color: "var(--ink-muted)", margin: 0 }}>
                      {d.snippet}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>
          <RevealSection>
            <p style={{ marginTop: "2.5rem", color: "var(--ink-faint)", fontSize: "0.85rem", maxWidth: "680px", lineHeight: 1.65 }}>
              Deliberately deferred: prompt caching. The shared system prompts sit near the
              cache minimum and gateway pass-through is unverified from this environment —
              the criteria that would flip the call are documented in the repo. Knowing why
              <em style={{ fontStyle: "normal" }}> not</em> to use a feature is part of the discipline.
            </p>
          </RevealSection>
        </div>
      </section>

      <hr className="rule" />

      {/* The first live night — a production debugging story */}
      <section className="section">
        <div className="container">
          <RevealSection>
            <div className="eyebrow" style={{ marginBottom: "1.5rem", display: "inline-flex", alignItems: "center" }}>
              <span className="dot-mark" />
              (05) · The first live night
            </div>
            <h2 className="display" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", maxWidth: "860px", marginBottom: "1.5rem" }}>
              Then the API keys went in, <em>and the demo met production.</em>
            </h2>
            <p style={{ fontSize: "0.95rem", color: "var(--ink-muted)", maxWidth: "700px", lineHeight: 1.65, marginBottom: "3rem" }}>
              A deterministic demo proves the architecture; live models prove the engineering.
              The first night on real Claude models surfaced four failure modes the demo had
              masked — each diagnosed from the run ledger, fixed, and verified green the same
              evening. The error messages below are the real ones.
            </p>
          </RevealSection>
          <RevealSection targets=".sh-incidents > div">
            <div className="grid-2 sh-incidents" style={{ gap: "3rem 2.5rem" }}>
              {INCIDENTS.map((inc) => (
                <div key={inc.num}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                    <span style={{ width: "28px", height: "1px", background: "var(--accent)", display: "inline-block" }} />
                    <span className="mono" style={{ fontSize: "0.72rem", color: "var(--accent)", letterSpacing: "0.12em" }}>
                      {inc.num}
                    </span>
                  </div>
                  <div className="panel" style={{ padding: "1rem 1.25rem", marginBottom: "1rem", overflowX: "auto" }}>
                    <pre className="mono" style={{ fontSize: "0.7rem", lineHeight: 1.55, color: "var(--ink-muted)", margin: 0 }}>
                      {inc.symptom}
                    </pre>
                  </div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 500, marginBottom: "0.85rem", letterSpacing: "-0.01em" }}>
                    {inc.title}
                  </h3>
                  <p style={{ color: "var(--ink-muted)", fontSize: "0.92rem", lineHeight: 1.65, marginBottom: "0.6rem" }}>
                    {inc.story}
                  </p>
                  <p style={{ color: "var(--ink-muted)", fontSize: "0.92rem", lineHeight: 1.65 }}>
                    <em style={{ fontStyle: "normal", color: "var(--accent-deep)" }}>Result:</em> {inc.fix}
                  </p>
                </div>
              ))}
            </div>
          </RevealSection>
          <RevealSection>
            <p style={{ marginTop: "2.5rem", color: "var(--ink-faint)", fontSize: "0.85rem", maxWidth: "700px", lineHeight: 1.65 }}>
              Final ledger for the verified night: 33 of 34 agent runs succeeded, zero
              escalations, zero failures, one deliberately-escalated price-mismatch PO caught
              by the validation layers — total model cost $0.91. Forward-deployed engineering
              is exactly this loop: ship, read the run ledger, fix the real failure, verify.
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
              (06) · Outcomes
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
