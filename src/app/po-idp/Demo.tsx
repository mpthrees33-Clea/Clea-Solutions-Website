"use client";

import { useState } from "react";

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
  { key: "route", label: "01 · route document" },
  { key: "ocr", label: "02 · OCR + bboxes" },
  { key: "extract", label: "03 · extract (Gemini Flash)" },
  { key: "ground", label: "04 · verify grounding" },
  { key: "check", label: "05 · cross-check math + catalog" },
  { key: "consistency", label: "06 · second model agrees?" },
  { key: "so", label: "07 · build sales order" },
] as const;

export default function Demo() {
  const [stage, setStage] = useState<number>(-1);
  const [data, setData] = useState<SamplePayload | null>(null);
  const [running, setRunning] = useState(false);

  async function run() {
    setRunning(true);
    setData(null);
    setStage(-1);

    const res = await fetch("/api/po-idp/sample");
    const payload: SamplePayload = await res.json();

    for (let i = 0; i < STAGES.length; i++) {
      await new Promise((r) => setTimeout(r, 380));
      setStage(i);
    }
    setData(payload);
    setRunning(false);
  }

  return (
    <div
      style={{
        padding: "2.5rem",
        background: "var(--bg-elevated)",
        border: "1px solid var(--rule)",
        borderRadius: "12px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "baseline",
          gap: "0.75rem 1.5rem",
          marginBottom: "2rem",
        }}
      >
        <h2
          className="display"
          style={{ fontSize: "1.6rem", margin: 0, letterSpacing: "-0.01em" }}
        >
          Try it on a sample PO.
        </h2>
        <span style={{ color: "var(--ink-muted)", fontSize: "0.9rem" }}>
          Real output from the running pipeline.
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem 1.25rem",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <button
          onClick={run}
          disabled={running}
          className="btn btn-primary"
          style={{ opacity: running ? 0.6 : 1, cursor: running ? "wait" : "pointer" }}
        >
          {running ? "Running pipeline…" : data ? "Run again" : "Run the demo"}
          <span aria-hidden>→</span>
        </button>
        <a href="/po-idp/sample_po.pdf" target="_blank" rel="noopener noreferrer" className="btn-link" style={{ fontSize: "0.85rem" }}>
          ↓ Sample PO (input)
        </a>
        <a href="/po-idp/sample_so.pdf" target="_blank" rel="noopener noreferrer" className="btn-link" style={{ fontSize: "0.85rem" }}>
          ↓ Generated SO
        </a>
        <a href="/po-idp/sample_audit.zip" className="btn-link" style={{ fontSize: "0.85rem" }}>
          ↓ Audit bundle (.zip)
        </a>
      </div>

      <ol style={{ listStyle: "none", display: "grid", gap: "0.35rem", margin: 0, padding: 0, marginBottom: "2rem" }}>
        {STAGES.map((s, i) => {
          const state = stage > i ? "done" : stage === i ? "running" : "pending";
          const color =
            state === "done"
              ? "var(--ink)"
              : state === "running"
                ? "var(--accent)"
                : "var(--ink-faint)";
          return (
            <li
              key={s.key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.55rem 0.85rem",
                borderRadius: "6px",
                background: state === "running" ? "rgba(30, 58, 138, 0.04)" : "transparent",
                border: "1px solid",
                borderColor:
                  state === "pending" ? "var(--rule)" : state === "running" ? "var(--accent)" : "var(--rule)",
                transition: "all 200ms ease",
              }}
            >
              <span style={{ width: "16px", textAlign: "center", color, fontSize: "0.85rem" }}>
                {state === "done" ? "✓" : state === "running" ? "●" : "○"}
              </span>
              <span
                className="mono"
                style={{ fontSize: "0.82rem", color }}
              >
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>

      {data && <Results data={data} />}
    </div>
  );
}

function Results({ data }: { data: SamplePayload }) {
  const { sales_order: so, report, primary } = data;
  const groundedPct = (report.grounded_field_ratio * 100).toFixed(1);
  const confidencePct = (report.overall_confidence * 100).toFixed(1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", borderTop: "1px solid var(--rule)", paddingTop: "2rem" }}>
      {/* Top metrics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: "0.5rem",
        }}
      >
        <Stat label="document recognized" value={report.document_recognized ? "yes" : "no"} good={report.document_recognized} />
        <Stat label="fields grounded" value={`${groundedPct}%`} good={report.grounded_field_ratio === 1} />
        <Stat label="overall confidence" value={`${confidencePct}%`} good={report.overall_confidence >= 0.92} />
        <Stat label="checks failed" value={String(report.checks.filter((c) => !c.passed).length)} good={report.checks.every((c) => c.passed)} />
        <Stat label="consistency diffs" value={String(report.consistency_diffs.length)} good={report.consistency_diffs.length === 0} />
        <Stat
          label="requires review"
          value={so.requires_human_review ? "yes" : "no"}
          good={!so.requires_human_review}
        />
      </div>

      {/* Extracted fields */}
      <div>
        <div className="eyebrow" style={{ marginBottom: "0.75rem" }}>
          Extracted header (with provenance)
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "0.5rem",
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
        <div className="eyebrow" style={{ marginBottom: "0.75rem" }}>
          Mapped sales-order lines
        </div>
        <div
          style={{
            overflowX: "auto",
            border: "1px solid var(--rule)",
            borderRadius: "8px",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.85rem",
              minWidth: "720px",
            }}
          >
            <thead>
              <tr style={{ background: "var(--bg)" }}>
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
                <tr key={l.line_no} style={{ borderTop: "1px solid var(--rule)" }}>
                  <Td>{l.line_no}</Td>
                  <Td mono>{l.customer_sku}</Td>
                  <Td mono>{l.internal_sku ?? "—"}</Td>
                  <Td>{l.internal_description}</Td>
                  <Td align="right">{l.quantity}</Td>
                  <Td align="right">${l.unit_price.toFixed(2)}</Td>
                  <Td align="right">${l.extended_price.toFixed(2)}</Td>
                  <Td>
                    <span
                      className="mono"
                      style={{
                        fontSize: "0.68rem",
                        padding: "0.15rem 0.5rem",
                        borderRadius: "999px",
                        border: "1px solid var(--rule-strong)",
                        color:
                          l.sku_match_method === "exact" ? "var(--ink)" : "var(--ink-muted)",
                        background: l.sku_match_method === "exact" ? "var(--bg)" : "transparent",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                      }}
                    >
                      {l.sku_match_method}
                    </span>
                  </Td>
                </tr>
              ))}
              <tr style={{ borderTop: "1px solid var(--rule-strong)" }}>
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
              <tr style={{ borderTop: "1px solid var(--rule-strong)" }}>
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
        <div className="eyebrow" style={{ marginBottom: "0.75rem" }}>
          Validation checks ({report.checks.length})
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
          {report.checks.map((c, i) => (
            <div
              key={i}
              className="mono"
              style={{
                display: "flex",
                gap: "0.6rem",
                alignItems: "baseline",
                fontSize: "0.8rem",
                padding: "0.4rem 0.7rem",
                borderRadius: "4px",
                background: c.passed ? "transparent" : "rgba(220, 60, 60, 0.06)",
                border: c.passed ? "1px solid var(--rule)" : "1px solid rgba(220, 60, 60, 0.25)",
              }}
            >
              <span
                style={{
                  color: c.passed ? "var(--ink)" : "#B91C1C",
                  fontWeight: 700,
                  minWidth: "20px",
                }}
              >
                {c.passed ? "✓" : "✗"}
              </span>
              <span style={{ color: "var(--ink)" }}>{c.name}</span>
              <span style={{ color: "var(--ink-muted)" }}>{c.detail}</span>
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
        padding: "0.85rem 1rem",
        borderRadius: "8px",
        background: "var(--bg)",
        border: "1px solid var(--rule)",
      }}
    >
      <div
        className="mono"
        style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-muted)" }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-serif), serif",
          fontSize: "1.5rem",
          fontWeight: 500,
          marginTop: "0.3rem",
          letterSpacing: "-0.01em",
          color: good ? "var(--ink)" : "#B45309",
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
        padding: "0.7rem 0.9rem",
        background: "var(--bg)",
        borderRadius: "6px",
        border: "1px solid var(--rule)",
      }}
    >
      <div
        className="mono"
        style={{ fontSize: "0.65rem", color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}
      >
        {field}
      </div>
      <div style={{ fontSize: "0.95rem", color: "var(--ink)", fontWeight: 500, margin: "0.2rem 0" }}>
        {value}
      </div>
      <div
        className="mono"
        style={{ fontSize: "0.72rem", color: "var(--ink-faint)" }}
        title="verbatim source quote — must substring-match OCR text"
      >
        ↳ {quote}
      </div>
    </div>
  );
}

function Th({ children, align = "left" }: { children?: React.ReactNode; align?: "left" | "right" }) {
  return (
    <th
      className="mono"
      style={{
        textAlign: align,
        padding: "0.7rem 0.85rem",
        fontWeight: 500,
        fontSize: "0.7rem",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: "var(--ink-muted)",
      }}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align = "left",
  mono = false,
  colSpan,
}: {
  children?: React.ReactNode;
  align?: "left" | "right";
  mono?: boolean;
  colSpan?: number;
}) {
  return (
    <td
      colSpan={colSpan}
      style={{
        padding: "0.6rem 0.85rem",
        textAlign: align,
        fontFamily: mono ? "var(--font-mono), monospace" : "inherit",
        color: "var(--ink)",
      }}
    >
      {children}
    </td>
  );
}
