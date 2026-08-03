"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Interactive replay of one real (deterministic, demo-mode) nightly workflow
 * run exported from the open Sales Hub build — every child agent run, every
 * tool call, and each moment an effect:'external' tool was intercepted into
 * a pending approval row instead of executing.
 */

type TraceStep = {
  seq: number;
  kind: string;
  name: string;
  intercepted?: boolean;
  approvalId?: string;
  input?: unknown;
  output?: unknown;
  durationMs: number;
};

type ChildRun = {
  runId: string;
  agentName: string;
  model: string;
  status: string;
  tokensIn: number;
  tokensOut: number;
  costUsd: string;
  steps: TraceStep[];
};

type Trace = {
  workflow: {
    runId: string;
    status: string;
    counts: Record<string, number>;
    elapsedMs: number;
    steps: { seq: number; kind: string; name: string; output: unknown; durationMs: number }[];
  };
  childRuns: ChildRun[];
};

const KIND_LABEL: Record<string, string> = {
  llm_call: "model",
  tool_call: "tool",
  validation: "validate",
  escalation: "escalate",
  workflow_step: "step",
};

function StepRow({ step }: { step: TraceStep }) {
  const intercepted = step.intercepted === true;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: "0.6rem",
        padding: "0.35rem 0",
        borderTop: "1px solid var(--rule)",
        flexWrap: "wrap",
      }}
    >
      <span className="mono" style={{ fontSize: "0.68rem", color: "var(--ink-faint)", minWidth: "1.5rem" }}>
        {step.seq}
      </span>
      <span
        className="mono"
        style={{
          fontSize: "0.66rem",
          letterSpacing: "0.08em",
          color: intercepted ? "var(--accent-deep)" : "var(--ink-faint)",
          minWidth: "4.5rem",
        }}
      >
        {intercepted ? "external" : (KIND_LABEL[step.kind] ?? step.kind)}
      </span>
      <span className="mono" style={{ fontSize: "0.74rem", color: "var(--ink)" }}>
        {step.name}
      </span>
      {intercepted && (
        <span
          className="mono"
          style={{
            fontSize: "0.64rem",
            letterSpacing: "0.06em",
            color: "var(--accent-deep)",
            border: "1px solid var(--accent-soft)",
            borderRadius: "3px",
            padding: "0.05rem 0.4rem",
            background: "var(--accent-wash)",
          }}
        >
          intercepted → approval row
        </span>
      )}
    </div>
  );
}

export default function RunTrace() {
  const [trace, setTrace] = useState<Trace | null>(null);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    let stop = false;
    fetch("/sales-hub/run-trace.json")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: Trace) => {
        if (!stop) setTrace(d);
      })
      .catch(() => {
        if (!stop) setError(true);
      });
    return () => {
      stop = true;
    };
  }, []);

  const interceptions = useMemo(
    () => trace?.childRuns.reduce((a, r) => a + r.steps.filter((s) => s.intercepted).length, 0) ?? 0,
    [trace],
  );

  if (error) return null;
  if (!trace) {
    return (
      <div className="panel" style={{ padding: "2rem" }}>
        <span className="mono" style={{ fontSize: "0.75rem", color: "var(--ink-muted)" }}>
          loading run trace…
        </span>
      </div>
    );
  }

  const c = trace.workflow.counts;
  return (
    <div className="panel" style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
        <span className="mono" style={{ fontSize: "0.8rem", color: "var(--ink)" }}>
          nightly-run · {trace.workflow.status}
        </span>
        <span className="mono" style={{ fontSize: "0.7rem", color: "var(--ink-muted)" }}>
          {c.triaged} triaged · {c.drafts} drafts · {c.approvalsPending} approvals pending ·{" "}
          {trace.childRuns.length} child agent runs ·{" "}
          <em style={{ fontStyle: "normal", color: "var(--accent-deep)" }}>{interceptions} external calls intercepted</em>
        </span>
      </div>
      <p style={{ fontSize: "0.85rem", color: "var(--ink-muted)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
        A real workflow run from the open build (deterministic demo mode, re-runnable from source). Expand any agent run:
        highlighted steps are <span className="mono" style={{ fontSize: "0.78rem" }}>effect:&lsquo;external&rsquo;</span>{" "}
        tool calls the harness refused to execute — each became a pending approval row for a human instead.
      </p>
      <div style={{ maxHeight: "420px", overflowY: "auto", borderTop: "1px solid var(--rule-strong)" }}>
        {trace.childRuns.map((run) => {
          const isOpen = open === run.runId;
          const runInterceptions = run.steps.filter((s) => s.intercepted).length;
          return (
            <div key={run.runId} style={{ borderBottom: "1px solid var(--rule)" }}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : run.runId)}
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "baseline",
                  gap: "0.75rem",
                  padding: "0.6rem 0.25rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  flexWrap: "wrap",
                }}
              >
                <span className="mono" aria-hidden style={{ fontSize: "0.7rem", color: "var(--ink-faint)" }}>
                  {isOpen ? "▾" : "▸"}
                </span>
                <span className="mono" style={{ fontSize: "0.78rem", color: "var(--ink)" }}>
                  {run.agentName}
                </span>
                <span className="mono" style={{ fontSize: "0.68rem", color: "var(--ink-muted)" }}>
                  {run.status} · {run.steps.length} steps
                  {runInterceptions > 0 && (
                    <span style={{ color: "var(--accent-deep)" }}> · {runInterceptions} intercepted</span>
                  )}
                </span>
                <span className="mono" style={{ fontSize: "0.68rem", color: "var(--ink-faint)", marginLeft: "auto" }}>
                  {run.model}
                </span>
              </button>
              {isOpen && (
                <div style={{ padding: "0 0.25rem 0.75rem 2rem" }}>
                  {run.steps.map((s) => (
                    <StepRow key={s.seq} step={s} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
