import type { Metadata } from 'next';
import Link from 'next/link';
import Demo from './Demo';

export const metadata: Metadata = {
  title: 'PO IDP — Zero-Hallucination Document Intelligence | Clea Solutions',
  description:
    'Enterprise IDP for purchase-order to sales-order workflows. Every extracted value is grounded in verbatim source text, two independent models must agree, and the math reconciles to the cent.',
};

const LAYERS = [
  {
    n: '01',
    name: 'Content-type gate',
    detail:
      'Only PDF / PNG / JPEG inputs accepted. HTML scrapes, garbled binaries, and unknown formats are rejected at the door — before a single token reaches the model.',
  },
  {
    n: '02',
    name: 'Thin-source gate',
    detail:
      'Native PDFs with under 400 chars of extractable text are auto-routed to vision OCR instead of being silently treated as empty. No model ever sees a blank canvas.',
  },
  {
    n: '03',
    name: 'Document-recognition gate',
    detail:
      'The model must explicitly mark `document_recognized: true`. If the input is an invoice, brochure, or anything else — the pipeline short-circuits. No sales order is built.',
  },
  {
    n: '04',
    name: 'Per-field source-quote grounding',
    detail:
      'Every leaf value carries a `source_quote` that must literally substring-match the OCR text. The validator reverifies after the model returns — ungrounded fields are flagged, not silently accepted.',
  },
  {
    n: '05',
    name: 'Deterministic numeric parsing',
    detail:
      'Money, dates, quantities never round-trip through the LLM. Pure regex parsers handle "$1,250.00" → 1250.00, "5/18/26" → 2026-05-18. Models do not do math here.',
  },
  {
    n: '06',
    name: 'Math + catalog reconciliation',
    detail:
      'sum(line.extended) == subtotal. subtotal + tax + ship == total. ±5¢ tolerance. Every customer SKU must map to internal catalog. Price within ±2% of price-list.',
  },
  {
    n: '07',
    name: 'Two-model self-consistency',
    detail:
      'Primary (Gemini 2.5 Flash) + secondary (local Ollama Qwen2.5-32B) extract independently with different prompts. Disagreements on PO#, SKU, quantity, prices, or totals penalize confidence and route to human review.',
  },
];

const STACK = [
  { name: 'Python 3.10', use: 'Service runtime' },
  { name: 'FastAPI + uv', use: 'API + dependency mgmt' },
  { name: 'pdfplumber', use: 'Native PDF tokens + bboxes' },
  { name: 'pypdfium2', use: 'PDF → image rendering' },
  { name: 'Gemini 2.5 Flash', use: 'Primary extraction + vision OCR' },
  { name: 'Ollama (Qwen2.5)', use: 'Local secondary for consistency' },
  { name: 'rapidfuzz', use: 'SKU fuzzy matching' },
  { name: 'ReportLab', use: 'Sales-order PDF generation' },
  { name: 'SQLite', use: 'Job persistence' },
];

export default function POIDPPage() {
  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem', position: 'relative', zIndex: 1 }}>
      <Link
        href="/work"
        style={{
          display: 'inline-block',
          marginBottom: '2rem',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
        }}
      >
        ← All work
      </Link>

      {/* HERO */}
      <section style={{ marginBottom: '4rem' }}>
        <span
          style={{
            display: 'inline-block',
            padding: '0.25rem 0.7rem',
            borderRadius: '999px',
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            background: 'rgba(0,145,80,0.15)',
            color: 'var(--accent-green)',
            border: '1px solid rgba(0,145,80,0.3)',
            marginBottom: '1.5rem',
          }}
        >
          ● Case study — Enterprise IDP
        </span>
        <h1
          className="glow-text text-gradient"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.05, marginBottom: '1.5rem' }}
        >
          Purchase orders in.<br />Sales orders out.<br />Zero hallucinations.
        </h1>
        <p
          style={{
            fontSize: '1.2rem',
            color: 'var(--text-secondary)',
            maxWidth: '720px',
            lineHeight: 1.6,
          }}
        >
          A grounded-extraction IDP pipeline that turns inbound purchase-order PDFs into
          validated internal sales orders. Built on the conviction that an LLM should never
          be the last word on a number — every value must trace back to verbatim source text,
          two models must agree, and the math must reconcile to the cent.
        </p>
      </section>

      {/* DEMO */}
      <section style={{ marginBottom: '5rem' }}>
        <Demo />
      </section>

      {/* THE PROBLEM */}
      <section className="glass-panel glass-panel-content" style={{ marginBottom: '4rem' }}>
        <h2 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>
          The problem with shipping IDP on raw LLMs
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          The standard pattern — handing a PDF to a foundation model and asking for JSON —
          looks great in demos and falls apart in production. The model will <em>always</em>{' '}
          return something. When the source is empty, garbled, or the wrong document type,
          that &ldquo;something&rdquo; is invented. We&rsquo;ve seen this break in the wild:
          a PDF accidentally passed as HTML, parsed into nothing, a model filling the
          resulting blank with a plausible-but-fabricated product.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Enterprise-grade IDP needs defense in depth — not one confidence score, but a
          stack of independent gates that each have permission to halt the pipeline.
        </p>
      </section>

      {/* THE 7 LAYERS */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          Seven independent anti-hallucination layers
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
          Each layer can refuse the run on its own. None is allowed to be weakened to
          &ldquo;improve pass rates.&rdquo;
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {LAYERS.map((l) => (
            <div
              key={l.n}
              className="glass-panel"
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}
            >
              <span style={{ color: 'var(--accent-green)', fontSize: '0.85rem', fontWeight: 600 }}>
                {l.n} //
              </span>
              <h3 style={{ fontSize: '1.1rem', margin: '0.4rem 0 0.6rem' }}>{l.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.55 }}>
                {l.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section className="glass-panel glass-panel-content" style={{ marginBottom: '4rem' }}>
        <h2 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '2rem' }}>
          Architecture
        </h2>
        <pre
          style={{
            fontSize: '0.85rem',
            lineHeight: 1.5,
            color: 'var(--text-primary)',
            overflowX: 'auto',
            margin: 0,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
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
  pypdfium2 render  →  Gemini Flash vision OCR
       │
       ▼
  PRIMARY extractor  (Gemini 2.5 Flash, strict schema)
       │      └─ every field carries source_quote + bbox
       ▼
  grounding validator  ── every value must appear in OCR text
       │
       ▼
  cross-check  ── math · dates · SKU catalog · pricing
       │
       ▼
  SECONDARY extractor  (Ollama Qwen2.5-32B, different prompt)
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

      {/* STACK */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>
          Built on free + cheap tools
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '720px' }}>
          No GPU. No ML checkpoints to download. No system packages beyond Python.
          The marginal cost per document is dominated by Gemini Flash tokens
          (≈$0.0001 per PO) — the rest of the pipeline runs locally.
        </p>
        <div
          className="glass-panel"
          style={{ padding: '1.5rem 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem 2rem' }}
        >
          {STACK.map((s) => (
            <div key={s.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
              <span style={{ color: 'var(--accent-green)', fontWeight: 600, fontSize: '0.95rem' }}>
                {s.name}
              </span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                {s.use}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        className="glass-panel"
        style={{
          padding: '3rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(0,145,80,0.08), rgba(30,30,30,0.6))',
        }}
      >
        <h2 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
          Want it pointed at your own POs?
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Clea Solutions deploys this pipeline against your live mailbox or vendor portal,
          mapped to your SKU catalog and price list. Audit-grade by default.
        </p>
        <Link
          href="/contact"
          style={{
            display: 'inline-block',
            padding: '1rem 2rem',
            background: 'var(--accent-green)',
            color: '#000',
            fontWeight: 700,
            borderRadius: '8px',
            boxShadow: '0 0 15px var(--accent-green-glow)',
          }}
        >
          Talk to us about an integration
        </Link>
      </section>
    </div>
  );
}
