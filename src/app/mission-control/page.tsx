import type { Metadata } from "next";
import Link from "next/link";
import ConfidentialityNote from "@/components/ConfidentialityNote";
import RevealSection from "@/components/motion/RevealSection";
import MissionControlDemo from "./MissionControlDemo";

export const metadata: Metadata = {
  title: "Mission Control · Clea Solutions",
  description:
    "One pane of glass for every agent: prompts, memory, tools, and run history, governed from a single control plane. Interactive sanitized replica of a production system.",
};

const CAPABILITIES = [
  {
    num: "01",
    title: "Prompt governance",
    body: "Every agent's system prompt is version-controlled in the control plane, not buried in code. Change it, review the diff, roll it back.",
  },
  {
    num: "02",
    title: "Scoped tool permissions",
    body: "Agents get an allowlist, and every tool carries an auth scope. The email agent can draft mail — it cannot send it. The quote agent can read pricing — it cannot invent it.",
  },
  {
    num: "03",
    title: "Governed memory",
    body: "Conversation, vector, and structured stores with explicit retention and scope. Which agent reads what is a configuration decision, not an accident.",
  },
  {
    num: "04",
    title: "Run observability",
    body: "Every tool call, grounding check, handoff, and escalation is logged per run. When something is flagged, you replay the exact trail — not guess.",
  },
  {
    num: "05",
    title: "Enterprise identity",
    body: "Sign-in through Microsoft Entra ID against the company tenant. Agent access maps to real directory identities, not shared API keys.",
  },
  {
    num: "06",
    title: "Cross-platform orchestration",
    body: "Agents in Sales Hub, Quotes Hub, and the Service Desk hand work to each other with evidence attached. One graph, visualized and controlled centrally.",
  },
];

const ARCHITECTURE = String.raw`
                    ┌────────────────────────────┐
  Microsoft Entra ID│  sign-in · roles · tenant  │
                    └─────────────┬──────────────┘
                                  ▼
                    ┌────────────────────────────┐
       API gateway  │  authn/z · rate · audit    │
                    └─────────────┬──────────────┘
                                  ▼
   ┌──────────────────────────────────────────────────────┐
   │                 MISSION CONTROL (control plane)      │
   │  prompts · memory bindings · tool scopes · runs      │
   └───────┬──────────────────┬──────────────────┬────────┘
           ▼                  ▼                  ▼
     ┌──────────┐       ┌──────────┐       ┌──────────┐
     │ Sales Hub│       │Quotes Hub│       │ Service  │
     │  agents  │       │  agents  │       │  agents  │
     └────┬─────┘       └────┬─────┘       └────┬─────┘
          ▼                  ▼                  ▼
   ┌──────────────────────────────────────────────────────┐
   │  tool sandbox — crm_api · catalog_search · pricing   │
   │  pdf_extract · email_send (draft-only) · ticket_api  │
   └──────────────────────────┬───────────────────────────┘
                              ▼
                    ┌────────────────────┐
        Azure AI    │  model endpoints   │
                    └─────────┬──────────┘
                              ▼
                    ┌────────────────────┐
        audit log   │  every call, every │
                    │  run, replayable   │
                    └────────────────────┘
`;

export default function MissionControlPage() {
  return (
    <>
      {/* Hero */}
      <section className="section" style={{ paddingBottom: "3rem" }}>
        <div className="container">
          <Link href="/work" className="mono" style={{ fontSize: "0.72rem", letterSpacing: "0.12em", color: "var(--ink-muted)" }}>
            ← ALL WORK
          </Link>
          <div className="eyebrow" style={{ margin: "2.5rem 0 1.5rem", display: "inline-flex", alignItems: "center" }}>
            <span className="dot-mark" />
            (Platform) · Agent control plane
          </div>
          <h1
            className="display"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              marginBottom: "1.75rem",
              maxWidth: "900px",
            }}
          >
            Every agent. Every prompt. Every tool. <em>One pane of glass.</em>
          </h1>
          <p
            style={{
              fontSize: "1.15rem",
              color: "var(--ink-muted)",
              maxWidth: "680px",
              lineHeight: 1.65,
              marginBottom: "2.5rem",
            }}
          >
            Mission Control is the control plane behind the platform: a visual graph of
            every agent across Sales Hub, Quotes Hub, and customer service, where
            prompts, memory, tool permissions, and run history are governed in one
            place. This is what turns a pile of AI features into infrastructure.
          </p>
          <ConfidentialityNote systemName="Mission Control" />
        </div>
      </section>

      {/* Interactive demo */}
      <section className="section-tight" style={{ paddingBottom: "5rem" }}>
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: "1.5rem", display: "inline-flex", alignItems: "center" }}>
            <span className="dot-mark" />
            (01) · Interactive replica
          </div>
          <h2 className="display" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", marginBottom: "0.85rem" }}>
            Click an agent. Read its contract.
          </h2>
          <p style={{ color: "var(--ink-muted)", maxWidth: "680px", lineHeight: 1.65, marginBottom: "2rem" }}>
            Each node is a real pattern from the production system: an agent with a
            scoped prompt, an explicit tool allowlist, governed memory, and guardrails
            that route low confidence to a person. The activity strip below replays a
            typical morning — simulated, labeled as such.
          </p>
          <MissionControlDemo />
        </div>
      </section>

      <hr className="rule" />

      {/* What the production system governs */}
      <section className="section">
        <div className="container">
          <RevealSection>
            <div className="eyebrow" style={{ marginBottom: "1.5rem", display: "inline-flex", alignItems: "center" }}>
              <span className="dot-mark" />
              (02) · What the production system governs
            </div>
            <h2 className="display" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", maxWidth: "760px", marginBottom: "3rem" }}>
              Agents are easy. <em>Governance</em> is the product.
            </h2>
          </RevealSection>
          <RevealSection targets=".grid-3 > div">
            <div className="grid-3">
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

      {/* Under the hood */}
      <section className="section">
        <div className="container">
          <RevealSection>
            <div className="eyebrow" style={{ marginBottom: "1.5rem", display: "inline-flex", alignItems: "center" }}>
              <span className="dot-mark" />
              (03) · Under the hood
            </div>
            <h2 className="display" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", marginBottom: "2rem" }}>
              Architecture.
            </h2>
            <div className="panel" style={{ padding: "2rem", overflowX: "auto" }}>
              <pre
                className="mono"
                style={{
                  fontSize: "0.72rem",
                  lineHeight: 1.5,
                  color: "var(--ink-muted)",
                  margin: 0,
                }}
              >
                {ARCHITECTURE}
              </pre>
            </div>
            <p style={{ marginTop: "1.5rem", color: "var(--ink-muted)", fontSize: "0.92rem", maxWidth: "680px", lineHeight: 1.65 }}>
              This vocabulary maps one-for-one onto the loop in Vercel&rsquo;s
              open-source eve framework — sessions made of turns made of checkpointed
              steps, a hard trust boundary between runtime and sandbox, and approvals
              that park instead of poll.{" "}
              <Link href="/harness" className="btn-link">
                Read the full anatomy
                <span aria-hidden>→</span>
              </Link>
            </p>
          </RevealSection>
        </div>
      </section>

      {/* CTA */}
      <section className="section-tight" style={{ paddingBottom: "5rem" }}>
        <div className="container">
          <div
            className="panel"
            style={{
              padding: "2.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "2rem",
              flexWrap: "wrap",
            }}
          >
            <div style={{ maxWidth: "560px" }}>
              <h2 className="display" style={{ fontSize: "1.6rem", marginBottom: "0.75rem" }}>
                Want a control plane over your agents?
              </h2>
              <p style={{ color: "var(--ink-muted)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
                If AI is already creeping into your business ungoverned — or you want it
                to arrive governed on day one — this is the infrastructure conversation
                to have.
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
