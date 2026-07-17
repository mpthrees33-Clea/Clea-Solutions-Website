import type { Metadata } from "next";
import Link from "next/link";
import ReferenceArchitectureNote from "@/components/ReferenceArchitectureNote";
import RevealSection from "@/components/motion/RevealSection";

export const metadata: Metadata = {
  title: "The Harness · Anatomy of a Production Agent · Clea Solutions",
  description:
    "How a production agent is actually structured, secured, and looped — agent contracts, trust boundaries, typed tool calls, MCP connections, and durable execution — in the vocabulary of Vercel's open-source eve framework.",
};

const FILE_TREE = String.raw`
quote-builder/
├── agent.ts              defineAgent · model + reasoning level
│                         per-session token limits · compaction threshold
├── instructions.md       the always-on system prompt, version-controlled
├── tools/
│   ├── catalog_search.ts defineTool · Zod input schema · execute()
│   └── pricing_engine.ts deterministic math — the model never does arithmetic
├── skills/               longer procedures, loaded on demand — not
│                         permanently burning context
├── channels/             HTTP · Slack — signatures verified in constant
│                         time; identity never trusted from a request body
├── schedules/            cron: stale-quote follow-ups, pipeline sweeps
├── connections/          MCP servers · OpenAPI 3.x APIs — tokens brokered,
│                         never shown to the model
├── subagents/
│   └── po-intake/        its own tools, its own sandbox, isolated context —
│                         exposed to the parent as one model-visible tool
└── sandbox/              /workspace only · no process.env · no secrets
`;

const LOOP_FLOW = String.raw`
  SESSION  (lives for days · survives crashes and deploys)
  └── TURN  (one inbound message and all the work it triggers)
      └── STEP × N  — each one durably checkpointed
          ┌────────────────────────────────────────────────┐
          │  assemble context ─→ model call ─→ tool dispatch │◄──┐
          └────────────────────────┬───────────────────────┘   │
                       ✓ checkpoint written                     │
                                   │                            │
              ┌────────────────────┼──────────────────┐         │
              ▼                    ▼                  ▼         │
        needs approval?      context filling?     more work? ───┘
              │                    │
              ▼                    ▼
        TURN PARKS           COMPACTION
        zero compute ·       older turns summarized ·
        resumes on human     todo list re-injected ·
        input — even weeks   obligations survive
        later
`;

const TOOL_PROTOCOL = String.raw`
  model emits tool call
        │
        ▼
  schema validation        typed input (Zod) — malformed calls never execute
        │
        ▼
  scope check              catalog.read · crm.write:draft · mail.draft
        │
        ▼
  approval gate?           create / modify / delete / transmit / purchase /
        │                  message / access sensitive data → a person signs off;
        │                  the turn parks durably until they do
        ▼
  execute                  authored tools → app runtime (secrets stay here)
        │                  sandbox tools  → proxied into /workspace
        ▼
  result logged            full call + result in the run trace
        │
        ▼
  returned to context      the loop continues
`;

const MAPPING = [
  {
    ours: "Agent contract in Mission Control",
    eve: "The agent/ directory — agent.ts + instructions.md, discovered by file",
  },
  {
    ours: "Grounded, scoped tools",
    eve: "defineTool + Zod input schemas + per-tool auth scopes",
  },
  {
    ours: "Mission Control",
    eve: "The control plane — sessions, traces, run history in one place",
  },
  {
    ours: "Human review queue (< 0.70 confidence)",
    eve: "Durable approvals — the turn parks at zero compute until a person acts",
  },
  {
    ours: "Entra ID · tenant boundary",
    eve: "Trust boundaries — app runtime vs sandbox, credentials injected at the firewall",
  },
];

export default function HarnessPage() {
  return (
    <>
      {/* Hero */}
      <section className="section" style={{ paddingBottom: "3rem" }}>
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: "1.5rem", display: "inline-flex", alignItems: "center" }}>
            <span className="dot-mark" />
            (Approach) · Harness anatomy
          </div>
          <h1 className="display" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", marginBottom: "1.75rem", maxWidth: "900px" }}>
            An agent is not a prompt. It&rsquo;s a <em>contract.</em>
          </h1>
          <p style={{ fontSize: "1.15rem", color: "var(--ink-muted)", maxWidth: "680px", lineHeight: 1.65, marginBottom: "2.5rem" }}>
            Everyone shows you the chat window. This page shows you everything else:
            how a production agent is actually structured, secured, and looped — in
            the vocabulary of Vercel&rsquo;s open-source eve framework, the reference
            architecture our harness aligns to.
          </p>
          <ReferenceArchitectureNote />
        </div>
      </section>

      <hr className="rule" />

      {/* (01) Agent is a directory */}
      <section className="section">
        <div className="container">
          <RevealSection>
            <SectionHeader
              num="(01) · Structure"
              title={<>An agent you can read like a repo.</>}
            />
            <p style={{ color: "var(--ink-muted)", maxWidth: "680px", lineHeight: 1.7, marginBottom: "2rem" }}>
              In eve, an agent <em style={{ fontStyle: "normal", color: "var(--accent)" }}>is</em> a
              directory. Its always-on prompt, its typed tools, its channels, its
              schedules, its subagents — each lives in a conventional location. Add
              the file and the framework discovers it; no registry, no glue. Here is
              our Quote Builder — the same agent you can click in{" "}
              <Link href="/mission-control" className="btn-link">Mission Control</Link> —
              written as an eve-convention contract:
            </p>
            <AsciiPanel>{FILE_TREE}</AsciiPanel>
            <p style={{ marginTop: "1.5rem", color: "var(--ink-muted)", fontSize: "0.95rem", maxWidth: "680px", lineHeight: 1.7 }}>
              That inspectability is the whole point. When an agent misbehaves, you
              read its contract — not its vibes. Our harness enforces the same
              contract from a control plane instead of a filesystem: every field
              above has a home in Mission Control, where its prompt, tool scopes,
              memory bindings, and run history are governed.
            </p>
          </RevealSection>
        </div>
      </section>

      <hr className="rule" />

      {/* (02) The agentic loop */}
      <section className="section">
        <div className="container">
          <RevealSection>
            <SectionHeader
              num="(02) · The loop"
              title={<>Sessions, turns, steps — and nothing lost in between.</>}
            />
            <p style={{ color: "var(--ink-muted)", maxWidth: "680px", lineHeight: 1.7, marginBottom: "2rem" }}>
              A production agent isn&rsquo;t one model call. It&rsquo;s a durable loop:
              assemble context, call the model, dispatch tools, repeat — with a
              checkpoint written after every step.
            </p>
            <AsciiPanel>{LOOP_FLOW}</AsciiPanel>
          </RevealSection>

          <RevealSection targets=".grid-3 > div">
            <div className="grid-3" style={{ marginTop: "3rem" }}>
              <LoopCard
                num="01"
                title="Checkpointed steps"
                body="Every step is durably recorded. A crash or a deploy mid-turn resumes exactly where it stopped — completed steps never re-run; the recorded result is replayed. Long tasks survive infrastructure, not the other way around."
              />
              <LoopCard
                num="02"
                title="Compaction, not amnesia"
                body="When the context window fills, older turns are summarized — completed progress separated from remaining work, the active todo list re-injected. The agent forgets transcripts, not obligations."
              />
              <LoopCard
                num="03"
                title="Parked turns"
                body="Waiting on a human approval or an OAuth grant, the turn parks durably at zero compute — for an hour or a month. And the harness only advertises the tools available to the current session: what an agent can't use, the model never sees."
              />
            </div>
          </RevealSection>
        </div>
      </section>

      <hr className="rule" />

      {/* (03) Trust boundaries */}
      <section className="section">
        <div className="container">
          <RevealSection>
            <SectionHeader
              num="(03) · Security"
              title={<>Secrets live on one side. The model works on the other.</>}
            />
            <p style={{ color: "var(--ink-muted)", maxWidth: "680px", lineHeight: 1.7, marginBottom: "2rem" }}>
              The single most important line in an agent system is the trust
              boundary. Eve draws it between two execution contexts — and so do we.
            </p>
          </RevealSection>
          <RevealSection targets=".grid-2 > div">
            <div className="grid-2">
              <div className="panel" style={{ padding: "1.75rem" }}>
                <div className="mono" style={{ fontSize: "0.65rem", letterSpacing: "0.16em", color: "var(--accent)", marginBottom: "1rem" }}>
                  APP RUNTIME — TRUSTED
                </div>
                <BoundaryList
                  items={[
                    "Holds secrets and process.env; full network access",
                    "Authored tools execute here — the model receives results, never credentials",
                    "Connection tokens cached per step; never written into conversation history",
                    "Owns durable session state and the run trace",
                  ]}
                />
              </div>
              <div className="panel" style={{ padding: "1.75rem" }}>
                <div className="mono" style={{ fontSize: "0.65rem", letterSpacing: "0.16em", color: "var(--ink-faint)", marginBottom: "1rem" }}>
                  SANDBOX — UNTRUSTED
                </div>
                <BoundaryList
                  items={[
                    "An isolated filesystem rooted at /workspace — shell, scripts, file I/O",
                    "No environment variables. No secrets. Ever.",
                    "Network egress governed by policy: allow-list, deny-all, or open",
                    "Sandbox tool calls are proxied — the model's code never touches the app runtime",
                  ]}
                />
              </div>
            </div>
          </RevealSection>
          <RevealSection>
            <p style={{ marginTop: "2rem", color: "var(--ink-muted)", fontSize: "0.98rem", maxWidth: "720px", lineHeight: 1.7 }}>
              The consequence: <em style={{ fontStyle: "normal", color: "var(--ink)" }}>the model never
              sees a connection&rsquo;s URL or credentials.</em> In eve&rsquo;s design,
              the network policy injects credentials at the firewall, per domain — so a
              compromised prompt can ask for anything and still hold nothing. Our
              Microsoft Entra ID boundary plays the same role: agent access maps to
              real directory identities, not keys pasted into prompts.
            </p>
            <ul style={{ listStyle: "none", marginTop: "1.5rem", display: "grid", gap: "0.6rem", maxWidth: "720px" }}>
              <li style={{ fontSize: "0.9rem", color: "var(--ink-muted)", display: "flex", gap: "0.6rem" }}>
                <span style={{ color: "var(--accent)" }}>▸</span>
                Inbound routes reject unauthenticated traffic by default — no auth
                function accepts, the request gets a 401.
              </li>
              <li style={{ fontSize: "0.9rem", color: "var(--ink-muted)", display: "flex", gap: "0.6rem" }}>
                <span style={{ color: "var(--accent)" }}>▸</span>
                Channel signatures are verified in constant time, and identity is
                never trusted from a request body — only from a verified signature
                or token.
              </li>
            </ul>
          </RevealSection>
        </div>
      </section>

      <hr className="rule" />

      {/* (04) Tool-call protocol */}
      <section className="section">
        <div className="container">
          <RevealSection>
            <SectionHeader
              num="(04) · Tool calls"
              title={<>Typed in. Scoped through. Logged out.</>}
            />
            <p style={{ color: "var(--ink-muted)", maxWidth: "680px", lineHeight: 1.7, marginBottom: "2rem" }}>
              A tool call is not the model &ldquo;doing something.&rdquo; It&rsquo;s a
              request that has to survive five gates before anything happens:
            </p>
            <AsciiPanel>{TOOL_PROTOCOL}</AsciiPanel>
            <p style={{ marginTop: "1.5rem", color: "var(--ink-muted)", fontSize: "0.95rem", maxWidth: "720px", lineHeight: 1.7 }}>
              The approval rule is blunt: anything that would create, modify, delete,
              transmit, purchase, message, or access sensitive data gates on a person
              — and the turn parks until they act. It&rsquo;s why our{" "}
              <span className="mono" style={{ fontSize: "0.82rem" }}>email_send</span> tool
              carries the scope{" "}
              <span className="mono" style={{ fontSize: "0.82rem", color: "var(--accent)" }}>mail.draft</span>{" "}
              and not <span className="mono" style={{ fontSize: "0.82rem" }}>mail.send</span>:
              the harness makes the safe path the only path.
            </p>
          </RevealSection>
        </div>
      </section>

      <hr className="rule" />

      {/* (05) Protocols, not glue */}
      <section className="section">
        <div className="container">
          <RevealSection>
            <SectionHeader
              num="(05) · Protocols"
              title={<>Integrations are a protocol, not a pile of glue code.</>}
            />
            <div style={{ maxWidth: "720px" }}>
              <p style={{ color: "var(--ink-muted)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                External systems plug in as <em style={{ fontStyle: "normal", color: "var(--ink)" }}>connections</em>:
                either an MCP server — the Model Context Protocol that CRMs, ticketing
                systems, and warehouses increasingly speak natively — or any HTTP API
                described by an OpenAPI 3.x document. The agent discovers a
                connection&rsquo;s tools at runtime and calls them by namespaced
                name (<span className="mono" style={{ fontSize: "0.82rem" }}>crm__list_accounts</span>),
                while the credentials stay brokered in the runtime, app-scoped or
                keyed to the authenticated user.
              </p>
              <p style={{ color: "var(--ink-muted)", lineHeight: 1.7 }}>
                Why it matters to a buyer: a bespoke integration is a liability you
                maintain; a protocol-level connection is a contract the ecosystem
                maintains. When your vendor ships an MCP server, your agents get its
                tools — without a rewrite.
              </p>
            </div>
          </RevealSection>
        </div>
      </section>

      <hr className="rule" />

      {/* (06) Mapping */}
      <section className="section">
        <div className="container">
          <RevealSection>
            <SectionHeader
              num="(06) · Alignment"
              title={<>Our harness, in eve&rsquo;s vocabulary.</>}
            />
            <p style={{ color: "var(--ink-muted)", maxWidth: "680px", lineHeight: 1.7, marginBottom: "2.5rem" }}>
              Two implementations, one discipline. Everything Mission Control governs
              has a named counterpart in the open standard:
            </p>
          </RevealSection>
          <RevealSection targets=".map-row">
            <div>
              {MAPPING.map((m) => (
                <div
                  key={m.ours}
                  className="map-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "2rem",
                    padding: "1.4rem 0",
                    borderTop: "1px solid var(--rule)",
                    alignItems: "baseline",
                  }}
                >
                  <div style={{ fontSize: "1rem", fontWeight: 500, color: "var(--ink)" }}>{m.ours}</div>
                  <div className="mono" style={{ fontSize: "0.8rem", color: "var(--ink-muted)", lineHeight: 1.6 }}>
                    <span style={{ color: "var(--accent)" }}>eve · </span>
                    {m.eve}
                  </div>
                </div>
              ))}
              <div style={{ borderTop: "1px solid var(--rule)", paddingTop: "1.75rem" }}>
                <a
                  href="https://github.com/vercel/eve"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-link"
                >
                  Read the eve source and docs on GitHub
                  <span aria-hidden>→</span>
                </a>
              </div>
            </div>
          </RevealSection>
          <style>{`
            @media (max-width: 720px) {
              .map-row { grid-template-columns: 1fr !important; gap: 0.5rem !important; }
            }
          `}</style>
        </div>
      </section>

      <hr className="rule" />

      {/* (07) Evals and tracing */}
      <section className="section">
        <div className="container">
          <RevealSection>
            <SectionHeader
              num="(07) · Proof"
              title={<>If you can&rsquo;t replay it, you can&rsquo;t trust it.</>}
            />
            <p style={{ color: "var(--ink-muted)", maxWidth: "720px", lineHeight: 1.7 }}>
              The last piece of a harness is the one that keeps you honest: eval
              suites that grade agents against held-out cases before a prompt change
              ships, and tracing that records every model call, tool call, and
              handoff so any run can be replayed after the fact. In our harness
              that&rsquo;s the run history and activity trail you can already explore
              in the{" "}
              <Link href="/mission-control" className="btn-link">Mission Control replica</Link>
              {" "}— every event you see there mirrors a logged, replayable trace in
              production.
            </p>
          </RevealSection>
        </div>
      </section>

      {/* CTA */}
      <section className="section-tight" style={{ paddingBottom: "5rem" }}>
        <div className="container">
          <div className="panel" style={{ padding: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
            <div style={{ maxWidth: "560px" }}>
              <h2 className="display" style={{ fontSize: "1.6rem", marginBottom: "0.75rem" }}>
                Want your first agent built to the open standard?
              </h2>
              <p style={{ color: "var(--ink-muted)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
                Whether it lands on eve or inside your own tenant, the anatomy is the
                same — and it&rsquo;s the conversation to have before the first demo.
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

function SectionHeader({ num, title }: { num: string; title: React.ReactNode }) {
  return (
    <>
      <div className="eyebrow" style={{ marginBottom: "1.5rem", display: "inline-flex", alignItems: "center" }}>
        <span className="dot-mark" />
        {num}
      </div>
      <h2 className="display" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", maxWidth: "760px", marginBottom: "1.5rem" }}>
        {title}
      </h2>
    </>
  );
}

function AsciiPanel({ children }: { children: string }) {
  return (
    <div className="panel" style={{ padding: "2rem", overflowX: "auto" }}>
      <pre className="mono" style={{ fontSize: "0.72rem", lineHeight: 1.55, color: "var(--ink-muted)", margin: 0 }}>
        {children}
      </pre>
    </div>
  );
}

function LoopCard({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
        <span style={{ width: "28px", height: "1px", background: "var(--accent)", display: "inline-block" }} />
        <span className="mono" style={{ fontSize: "0.72rem", color: "var(--accent)", letterSpacing: "0.12em" }}>
          {num}
        </span>
      </div>
      <h3 style={{ fontSize: "1.15rem", fontWeight: 500, marginBottom: "0.85rem", letterSpacing: "-0.01em" }}>{title}</h3>
      <p style={{ color: "var(--ink-muted)", fontSize: "0.92rem", lineHeight: 1.65 }}>{body}</p>
    </div>
  );
}

function BoundaryList({ items }: { items: string[] }) {
  return (
    <ul style={{ listStyle: "none", display: "grid", gap: "0.75rem", margin: 0, padding: 0 }}>
      {items.map((it) => (
        <li key={it} style={{ fontSize: "0.9rem", color: "var(--ink-muted)", lineHeight: 1.6, display: "flex", gap: "0.6rem" }}>
          <span style={{ color: "var(--accent)", flexShrink: 0 }}>▸</span>
          {it}
        </li>
      ))}
    </ul>
  );
}
