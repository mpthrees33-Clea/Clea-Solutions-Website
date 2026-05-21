'use client';

import { useState } from 'react';

type SamplePayload = {
  primary: {
    document_recognized: boolean;
    header: Record<string, { value: string; source_quote: string }>;
    lines: Array<{
      line_no: number;
      customer_sku: { value: string; source_quote: string };
      description: { value: string; source_quote: string };
      quantity: { value: string; source_quote: string };
      unit_price: { value: string; source_quote: string };
      extended_price: { value: string; source_quote: string };
    }>;
    totals: Record<string, { value: string; source_quote: string } | null>;
  };
  grounding: Record<string, { passed: boolean; severity: string; reason: string }>;
  report: {
    document_recognized: boolean;
    grounded_field_ratio: number;
    overall_confidence: number;
    checks: Array<{ name: string; passed: boolean; severity: string; detail: string }>;
    consistency_diffs: string[];
  };
  sales_order: {
    so_number: string;
    po_number: string;
    customer: string;
    confidence: number;
    requires_human_review: boolean;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    lines: Array<{
      line_no: number;
      customer_sku: string;
      internal_sku: string | null;
      internal_description: string | null;
      quantity: number;
      unit_price: number;
      extended_price: number;
      sku_match_method: string;
      flags: string[];
    }>;
  };
};

const STAGES = [
  { key: 'route', label: '1 · route document' },
  { key: 'ocr', label: '2 · OCR + bboxes' },
  { key: 'extract', label: '3 · extract (Gemini Flash)' },
  { key: 'ground', label: '4 · verify grounding' },
  { key: 'check', label: '5 · cross-check math + catalog' },
  { key: 'consistency', label: '6 · second model agrees?' },
  { key: 'so', label: '7 · build sales order' },
] as const;

export default function Demo() {
  const [stage, setStage] = useState<number>(-1);
  const [data, setData] = useState<SamplePayload | null>(null);
  const [running, setRunning] = useState(false);

  async function run() {
    setRunning(true);
    setData(null);
    setStage(-1);

    const res = await fetch('/api/po-idp/sample');
    const payload: SamplePayload = await res.json();

    for (let i = 0; i < STAGES.length; i++) {
      await new Promise((r) => setTimeout(r, 380));
      setStage(i);
    }
    setData(payload);
    setRunning(false);
  }

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <h2 className="text-gradient" style={{ fontSize: '1.6rem', margin: 0 }}>
          Try it on a sample PO
        </h2>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Real output from the running pipeline — captured on the last test run.
        </span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button
          onClick={run}
          disabled={running}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--accent-green)',
            color: '#000',
            fontWeight: 700,
            border: 'none',
            borderRadius: '8px',
            cursor: running ? 'wait' : 'pointer',
            boxShadow: '0 0 12px var(--accent-green-glow)',
            opacity: running ? 0.7 : 1,
          }}
        >
          {running ? 'Running pipeline…' : data ? 'Run again' : '▶  Run the demo'}
        </button>
        <a
          href="/po-idp/sample_po.pdf"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: '0.9rem', color: 'var(--accent-green)' }}
        >
          ↓ Sample PO PDF (input)
        </a>
        <a
          href="/po-idp/sample_so.pdf"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: '0.9rem', color: 'var(--accent-green)' }}
        >
          ↓ Generated SO PDF
        </a>
        <a
          href="/po-idp/sample_audit.zip"
          style={{ fontSize: '0.9rem', color: 'var(--accent-green)' }}
        >
          ↓ Full audit bundle (.zip)
        </a>
      </div>

      <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {STAGES.map((s, i) => {
          const state = stage > i ? 'done' : stage === i ? 'running' : 'pending';
          return (
            <div
              key={s.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.55rem 0.9rem',
                borderRadius: '6px',
                background:
                  state === 'done'
                    ? 'rgba(0,145,80,0.08)'
                    : state === 'running'
                      ? 'rgba(0,145,80,0.18)'
                      : 'rgba(255,255,255,0.03)',
                border:
                  state === 'pending'
                    ? '1px solid rgba(255,255,255,0.05)'
                    : '1px solid rgba(0,145,80,0.3)',
                transition: 'all 0.25s ease',
              }}
            >
              <span style={{ width: '14px', textAlign: 'center', color: 'var(--accent-green)' }}>
                {state === 'done' ? '✓' : state === 'running' ? '◐' : '○'}
              </span>
              <span
                style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  fontSize: '0.88rem',
                  color: state === 'pending' ? 'var(--text-secondary)' : 'var(--text-primary)',
                }}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {data && <Results data={data} />}
    </div>
  );
}

function Results({ data }: { data: SamplePayload }) {
  const { sales_order: so, report, primary } = data;
  const groundedPct = (report.grounded_field_ratio * 100).toFixed(1);
  const confidencePct = (report.overall_confidence * 100).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '0.75rem',
        }}
      >
        <Stat label="document recognized" value={report.document_recognized ? 'yes' : 'no'} good={report.document_recognized} />
        <Stat label="fields grounded" value={`${groundedPct}%`} good={report.grounded_field_ratio === 1} />
        <Stat label="overall confidence" value={`${confidencePct}%`} good={report.overall_confidence >= 0.92} />
        <Stat label="checks failed" value={String(report.checks.filter((c) => !c.passed).length)} good={report.checks.every((c) => c.passed)} />
        <Stat label="consistency diffs" value={String(report.consistency_diffs.length)} good={report.consistency_diffs.length === 0} />
        <Stat
          label="requires review"
          value={so.requires_human_review ? 'yes' : 'no'}
          good={!so.requires_human_review}
        />
      </div>

      {/* Extracted fields with source-quote pills */}
      <div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Extracted header (with provenance)</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '0.6rem',
          }}
        >
          {Object.entries(primary.header || {}).map(([k, v]) =>
            v ? <FieldRow key={k} field={k} value={v.value} quote={v.source_quote} /> : null,
          )}
          {Object.entries(primary.totals || {}).map(([k, v]) =>
            v ? <FieldRow key={`tot-${k}`} field={`totals.${k}`} value={v.value} quote={v.source_quote} /> : null,
          )}
        </div>
      </div>

      {/* Line items */}
      <div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Mapped sales-order lines</h3>
        <div
          style={{
            overflowX: 'auto',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.85rem',
              minWidth: '720px',
            }}
          >
            <thead>
              <tr style={{ background: 'rgba(0,145,80,0.15)' }}>
                <Th>#</Th>
                <Th>Customer SKU</Th>
                <Th>Internal SKU</Th>
                <Th>Description</Th>
                <Th align="right">Qty</Th>
                <Th align="right">Unit</Th>
                <Th align="right">Extended</Th>
                <Th>Match</Th>
              </tr>
            </thead>
            <tbody>
              {so.lines.map((l) => (
                <tr key={l.line_no} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <Td>{l.line_no}</Td>
                  <Td mono>{l.customer_sku}</Td>
                  <Td mono>{l.internal_sku ?? '—'}</Td>
                  <Td>{l.internal_description}</Td>
                  <Td align="right">{l.quantity}</Td>
                  <Td align="right">${l.unit_price.toFixed(2)}</Td>
                  <Td align="right">${l.extended_price.toFixed(2)}</Td>
                  <Td>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '999px',
                        background:
                          l.sku_match_method === 'exact'
                            ? 'rgba(0,145,80,0.2)'
                            : 'rgba(255,200,0,0.2)',
                        color:
                          l.sku_match_method === 'exact' ? 'var(--accent-green)' : '#ffc800',
                      }}
                    >
                      {l.sku_match_method}
                    </span>
                  </Td>
                </tr>
              ))}
              <tr style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                <Td colSpan={6} align="right">Subtotal</Td>
                <Td align="right">${so.subtotal.toFixed(2)}</Td>
                <Td />
              </tr>
              <tr>
                <Td colSpan={6} align="right">Tax</Td>
                <Td align="right">${so.tax.toFixed(2)}</Td>
                <Td />
              </tr>
              <tr>
                <Td colSpan={6} align="right">Shipping</Td>
                <Td align="right">${so.shipping.toFixed(2)}</Td>
                <Td />
              </tr>
              <tr style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                <Td colSpan={6} align="right"><strong>Total</strong></Td>
                <Td align="right"><strong>${so.total.toFixed(2)}</strong></Td>
                <Td />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Checks */}
      <div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Validation checks ({report.checks.length})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {report.checks.map((c, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '0.6rem',
                alignItems: 'baseline',
                fontSize: '0.82rem',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                padding: '0.35rem 0.6rem',
                borderRadius: '4px',
                background: c.passed ? 'rgba(0,145,80,0.06)' : 'rgba(220,60,60,0.1)',
              }}
            >
              <span
                style={{
                  color: c.passed ? 'var(--accent-green)' : '#ff6b6b',
                  fontWeight: 700,
                  minWidth: '20px',
                }}
              >
                {c.passed ? '✓' : '✗'}
              </span>
              <span style={{ color: 'var(--text-primary)' }}>{c.name}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{c.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, good }: { label: string; value: string; good: boolean }) {
  return (
    <div
      style={{
        padding: '0.85rem 1rem',
        borderRadius: '8px',
        background: good ? 'rgba(0,145,80,0.1)' : 'rgba(255,180,0,0.1)',
        border: `1px solid ${good ? 'rgba(0,145,80,0.3)' : 'rgba(255,180,0,0.3)'}`,
      }}
    >
      <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>
        {label}
      </div>
      <div
        style={{
          fontSize: '1.4rem',
          fontWeight: 700,
          marginTop: '0.2rem',
          color: good ? 'var(--accent-green)' : '#ffc800',
        }}
      >
        {value}
      </div>
    </div>
  );
}

function FieldRow({ field, value, quote }: { field: string; value: string; quote: string }) {
  return (
    <div
      style={{
        padding: '0.6rem 0.8rem',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '6px',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {field}
      </div>
      <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 600, margin: '0.15rem 0' }}>
        {value}
      </div>
      <div
        style={{
          fontSize: '0.72rem',
          color: 'var(--accent-green)',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        }}
        title="verbatim source quote — must substring-match OCR text"
      >
        ↳ {quote}
      </div>
    </div>
  );
}

function Th({ children, align = 'left' }: { children?: React.ReactNode; align?: 'left' | 'right' }) {
  return (
    <th
      style={{
        textAlign: align,
        padding: '0.55rem 0.75rem',
        fontWeight: 600,
        fontSize: '0.78rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: 'var(--text-primary)',
      }}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align = 'left',
  mono = false,
  colSpan,
}: {
  children?: React.ReactNode;
  align?: 'left' | 'right';
  mono?: boolean;
  colSpan?: number;
}) {
  return (
    <td
      colSpan={colSpan}
      style={{
        padding: '0.5rem 0.75rem',
        textAlign: align,
        fontFamily: mono ? 'ui-monospace, SFMono-Regular, Menlo, monospace' : 'inherit',
        color: 'var(--text-primary)',
      }}
    >
      {children}
    </td>
  );
}
