import type { Metadata } from "next";
import Link from "next/link";
import Demo from "./Demo";

export const metadata: Metadata = {
  title: "PO IDP · Zero-Hallucination Document Intelligence | Clea Solutions",
  description:
    "Enterprise IDP for purchase-order to sales-order workflows. Every extracted value is grounded in verbatim source text, two independent models must agree, and the math reconciles to the cent.",
};

const LAYERS = [
  {
    n: "01",
    name: "Content-type gate",
    detail:
      "Only PDF / PNG / JPEG inputs accepted. HTML scrapes, garbled binaries, and unknown formats are rejected at the door, before a single token reaches the model.",
  },
  {
    n: "02",
    name: "Thin-source gate",
    detail:
      "Native PDFs with under 400 chars of extractable text are auto-routed to vision OCR instead of being silently treated as empty. No model ever sees a blank canvas.",
  },
  {
    n: "03",
    name: "Document-recognition gate",
    detail:
      "The system must positively confirm it is looking at a purchase order. If the input is an invoice, a brochure, or anything else, the pipeline stops rather than guesses. No sales order is built.",
  },
  {
    n: "04",
    name: "Per-field source grounding",
    detail:
      "Every extracted value must point to the exact words on the original document. The system re-checks this after the fact, and anything it can't trace to the source is flagged for a person, never silently accepted.",
  },
  {
    n: "05",
    name: "Deterministic numeric parsing",
    detail:
      'Money, dates, and quantities are never left to the AI. Tested, deterministic code converts "$1,250.00" → 1250.00 and "5/18/26" → 2026-05-18, the same way every time. The AI does not do math here.',
  },
  {
    n: "06",
    name: "Math + catalog reconciliation",
    detail:
      "Line items must add up to the subtotal, and subtotal plus tax and shipping must equal the total, to the cent. Every product code must match the internal catalog, and every price must sit within tolerance of the price list.",
  },
  {
    n: "07",
    name: "Two-model self-consistency",
    detail:
      "A primary AI extractor and an independent secondary extractor work the document with different prompts. Disagreements on PO#, SKU, quantity, prices, or totals penalize confidence and route to human review.",
  },
];

const STACK = [
  { name: "Python 3.10", use: "Service runtime" },
  { name: "FastAPI + uv", use: "API + dependency mgmt" },
  { name: "pdfplumber", use: "Native PDF tokens + bboxes" },
  { name: "pypdfium2", use: "PDF → image rendering" },
  { name: "Primary AI", use: "Extraction + vision OCR" },
  { name: "Secondary AI (local)", use: "Independent pass for consistency" },
  { name: "rapidfuzz", use: "SKU fuzzy matching" },
  { name: "ReportLab", use: "Sales-order PDF generation" },
  { name: "SQLite", use: "Job persistence" },
];

export default function POIDPPage() {
  return (
    <section className="section">
      <div className="container">
        <Link
          href="/work"
          className="mono"
          style={{
            display: "inline-block",
            marginBottom: "2.5rem",
            fontSize: "0.72rem",
            letterSpacing: "0.1em",
            color: "var(--ink-muted)",
          }}
        >
          ← ALL WORK
        </Link>

        {/* HERO */}
        <header style={{ marginBottom: "5rem" }}>
          <div className="eyebrow" style={{ marginBottom: "1.5rem" }}>
            (CASE STUDY) · Enterprise IDP
          </div>
          <h1
            className="display"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              marginBottom: "1.75rem",
              maxWidth: "900px",
            }}
          >
            Purchase orders in. Sales orders out.{" "}
            <em style={{ fontStyle: "normal" }}>Zero hallucinations.</em>
          </h1>
          <p
            style={{
              fontSize: "1.15rem",
              color: "var(--ink-muted)",
              maxWidth: "680px",
              lineHeight: 1.65,
            }}
          >
            Orders that took minutes of manual keying now process in seconds, and anything
            the system isn&rsquo;t sure about goes to a person, not into your books. Built
            for a commercial flooring distributor, on the conviction that an AI should
            never be the last word on a number: every value must trace back to the source
            document, two models must agree, and the math must reconcile to the cent.
          </p>
        </header>

        <hr className="rule" style={{ marginBottom: "4rem" }} />

        {/* DEMO */}
        <section style={{ marginBottom: "5rem" }}>
          <Demo />
        </section>

        <hr className="rule" style={{ marginBottom: "4rem" }} />

        {/* THE PROBLEM */}
        <section style={{ marginBottom: "5rem", maxWidth: "740px" }}>
          <div className="eyebrow" style={{ marginBottom: "1rem" }}>
            (01) · The problem
          </div>
          <h2
            className="display"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", marginBottom: "1.5rem" }}
          >
            Why raw LLMs don&rsquo;t ship in production IDP.
          </h2>
          <p style={{ color: "var(--ink-muted)", lineHeight: 1.7, marginBottom: "1rem" }}>
            The standard pattern, handing a PDF to a foundation model and asking for JSON,
            looks great in demos and falls apart in production. The model will{" "}
            <em style={{ fontStyle: "italic" }}>always</em> return something. When the source
            is empty, garbled, or the wrong document type, that &ldquo;something&rdquo; is
            invented. We&rsquo;ve seen this break in the wild: a PDF accidentally passed as HTML,
            parsed into nothing, a model filling the resulting blank with a plausible-but-fabricated
            product.
          </p>
          <p style={{ color: "var(--ink-muted)", lineHeight: 1.7 }}>
            Enterprise-grade IDP needs defense in depth. Not one confidence score, but a stack
            of independent gates that each have permission to halt the pipeline.
          </p>
        </section>

        <hr className="rule" style={{ marginBottom: "4rem" }} />

        {/* THE 7 LAYERS */}
        <section style={{ marginBottom: "5rem" }}>
          <div className="eyebrow" style={{ marginBottom: "1rem" }}>
            (02) · Defense in depth
          </div>
          <h2
            className="display"
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              marginBottom: "0.75rem",
              maxWidth: "700px",
            }}
          >
            Seven independent anti-hallucination layers.
          </h2>
          <p style={{ color: "var(--ink-muted)", marginBottom: "3rem", maxWidth: "640px" }}>
            Each layer exists to protect one thing: no invented number ever reaches your
            order system. Each can refuse the run on its own, and none is allowed to be
            weakened to &ldquo;improve pass rates.&rdquo;
          </p>
          <div className="grid-2">
            {LAYERS.map((l) => (
              <article
                key={l.n}
                style={{
                  paddingTop: "1.5rem",
                  borderTop: "1px solid var(--rule)",
                }}
              >
                <span
                  className="mono"
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--ink-faint)",
                    letterSpacing: "0.1em",
                    display: "block",
                    marginBottom: "0.6rem",
                  }}
                >
                  LAYER {l.n}
                </span>
                <h3
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 500,
                    letterSpacing: "-0.005em",
                    marginBottom: "0.6rem",
                    color: "var(--ink)",
                  }}
                >
                  {l.name}
                </h3>
                <p style={{ color: "var(--ink-muted)", fontSize: "0.92rem", lineHeight: 1.6 }}>
                  {l.detail}
                </p>
              </article>
            ))}
          </div>
        </section>

        <hr className="rule" style={{ marginBottom: "4rem" }} />

        {/* ARCHITECTURE */}
        <section style={{ marginBottom: "5rem" }}>
          <div className="eyebrow" style={{ marginBottom: "1rem" }}>
            (03) · Pipeline
          </div>
          <h2
            className="display"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", marginBottom: "2rem" }}
          >
            Architecture.
          </h2>
          <pre
            className="mono"
            style={{
              fontSize: "0.82rem",
              lineHeight: 1.55,
              color: "var(--ink)",
              overflowX: "auto",
              margin: 0,
              padding: "2rem",
              background: "var(--bg-elevated)",
              border: "1px solid var(--rule)",
              borderRadius: "8px",
            }}
          >{`   input file (PDF or image)
       │
       ▼
  content-type sniff  ──  reject HTML / unknowns
       │
       ▼
  pdfplumber tokens + bboxes
       │  (if <400 chars of text →)
       ▼
  pypdfium2 render  →  AI vision OCR
       │
       ▼
  PRIMARY extractor  (AI, strict schema)
       │      └─ every field carries source_quote + bbox
       ▼
  grounding validator  ── every value must appear in OCR text
       │
       ▼
  cross-check  ── math · dates · SKU catalog · pricing
       │
       ▼
  SECONDARY extractor  (independent AI, different prompt)
       │
       ▼
  consistency diff  ── PO#, SKUs, qty, prices, totals
       │
       ▼
  confidence aggregator  (0.92 = auto-approve · <0.70 = human review)
       │
       ▼
  catalog mapping  →  generated SO PDF  +  audit bundle (zip)`}</pre>
        </section>

        <hr className="rule" style={{ marginBottom: "4rem" }} />

        {/* STACK */}
        <section style={{ marginBottom: "5rem" }}>
          <div className="eyebrow" style={{ marginBottom: "1rem" }}>
            (04) · Stack
          </div>
          <h2
            className="display"
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              marginBottom: "1rem",
            }}
          >
            Built on free + cheap tools.
          </h2>
          <p
            style={{
              color: "var(--ink-muted)",
              marginBottom: "2.5rem",
              maxWidth: "680px",
              lineHeight: 1.65,
            }}
          >
            No GPU. No ML checkpoints to download. No system packages beyond Python. The
            marginal cost per document is dominated by AI tokens (≈$0.0001 per PO).
            The rest of the pipeline runs locally.
          </p>
          <dl
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.5rem 2rem",
              margin: 0,
            }}
          >
            {STACK.map((s) => (
              <div
                key={s.name}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.15rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid var(--rule)",
                }}
              >
                <dt
                  style={{
                    fontFamily: "var(--font-serif), serif",
                    fontSize: "1.05rem",
                    fontWeight: 500,
                    color: "var(--ink)",
                  }}
                >
                  {s.name}
                </dt>
                <dd
                  className="mono"
                  style={{
                    color: "var(--ink-faint)",
                    fontSize: "0.72rem",
                    letterSpacing: "0.06em",
                    margin: 0,
                    textTransform: "uppercase",
                  }}
                >
                  {s.use}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <hr className="rule" style={{ marginBottom: "4rem" }} />

        {/* CTA */}
        <section
          style={{
            padding: "4rem 3rem",
            background: "var(--bg-elevated)",
            border: "1px solid var(--rule)",
            borderRadius: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ maxWidth: "560px" }}>
            <h2
              className="display"
              style={{
                fontSize: "clamp(1.5rem, 2.75vw, 2rem)",
                marginBottom: "0.75rem",
              }}
            >
              Want it pointed at your own POs?
            </h2>
            <p style={{ color: "var(--ink-muted)", lineHeight: 1.6 }}>
              We deploy this pipeline against your live mailbox or vendor portal, mapped to
              your SKU catalog and price list. Audit-grade by default.
            </p>
          </div>
          <Link href="/contact" className="btn btn-primary">
            Talk to us
            <span aria-hidden>→</span>
          </Link>
        </section>
      </div>
    </section>
  );
}
