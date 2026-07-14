"use client";

import { useState } from "react";
import {
  AGENTS,
  HUB,
  PLATFORMS,
  agentById,
  toolById,
  memoryById,
} from "@/data/mission-control";

const TABS = ["Prompt", "Tools", "Memory", "Guardrails"] as const;
type Tab = (typeof TABS)[number];

export default function DetailPanel({ selectedId }: { selectedId: string | null }) {
  const [tab, setTab] = useState<Tab>("Prompt");

  if (!selectedId) {
    return (
      <Shell>
        <p style={{ color: "var(--ink-faint)", fontSize: "0.9rem", lineHeight: 1.7 }}>
          Select an agent to inspect its system prompt, tool permissions, memory
          bindings, and guardrails — the same four things the production control
          plane governs for every agent.
        </p>
      </Shell>
    );
  }

  if (selectedId === HUB.id) {
    return (
      <Shell>
        <Header eyebrow="CONTROL PLANE" title={HUB.name} sub="Azure AI · Entra ID" />
        <p style={{ color: "var(--ink-muted)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>
          {HUB.blurb}
        </p>
        <div className="mono" style={{ fontSize: "0.65rem", letterSpacing: "0.14em", color: "var(--ink-faint)", marginBottom: "0.6rem" }}>
          GOVERNS {AGENTS.length} AGENTS
        </div>
        <ul style={{ listStyle: "none", display: "grid", gap: "0.45rem" }}>
          {AGENTS.map((a) => (
            <li key={a.id} style={{ fontSize: "0.85rem", color: "var(--ink-muted)", display: "flex", gap: "0.5rem", alignItems: "baseline" }}>
              <span className="ticker-dot">◆</span>
              {a.name}
              <span className="mono" style={{ fontSize: "0.62rem", color: "var(--ink-faint)" }}>
                {PLATFORMS.find((p) => p.id === a.platformId)?.name}
              </span>
            </li>
          ))}
        </ul>
      </Shell>
    );
  }

  const agent = agentById(selectedId);
  if (!agent) return null;

  return (
    <Shell>
      <Header
        eyebrow={PLATFORMS.find((p) => p.id === agent.platformId)?.name.toUpperCase() ?? ""}
        title={agent.name}
        sub={agent.model}
        status={agent.status}
      />
      <p style={{ color: "var(--ink-muted)", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>
        {agent.role}
      </p>

      <div style={{ display: "flex", gap: "0.35rem", marginBottom: "1.1rem", flexWrap: "wrap" }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="mono"
            style={{
              fontSize: "0.64rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "0.4rem 0.7rem",
              borderRadius: "6px",
              cursor: "pointer",
              background: tab === t ? "var(--accent-wash)" : "transparent",
              border: `1px solid ${tab === t ? "var(--accent-soft)" : "var(--rule)"}`,
              color: tab === t ? "var(--accent)" : "var(--ink-muted)",
              transition: "all 160ms ease",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Prompt" && (
        <pre
          className="mono"
          style={{
            fontSize: "0.74rem",
            lineHeight: 1.7,
            color: "var(--ink-muted)",
            background: "var(--bg)",
            border: "1px solid var(--rule)",
            borderRadius: "6px",
            padding: "1rem",
            whiteSpace: "pre-wrap",
            margin: 0,
          }}
        >
          {agent.systemPromptExcerpt}
          {"\n\n"}
          <span style={{ color: "var(--ink-faint)" }}>— sanitized excerpt · full prompt version-controlled in the production control plane</span>
        </pre>
      )}

      {tab === "Tools" && (
        <ul style={{ listStyle: "none", display: "grid", gap: "0.85rem" }}>
          {agent.toolIds.map((id) => {
            const t = toolById(id);
            if (!t) return null;
            return (
              <li key={id} style={{ borderLeft: "2px solid var(--accent-soft)", paddingLeft: "0.85rem" }}>
                <div className="mono" style={{ fontSize: "0.78rem", color: "var(--ink)", marginBottom: "0.2rem" }}>
                  {t.name}
                  <span style={{ color: "var(--accent)", marginLeft: "0.6rem", fontSize: "0.62rem", letterSpacing: "0.08em" }}>
                    {t.authScope}
                  </span>
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--ink-muted)", lineHeight: 1.55, margin: 0 }}>{t.description}</p>
              </li>
            );
          })}
        </ul>
      )}

      {tab === "Memory" && (
        <ul style={{ listStyle: "none", display: "grid", gap: "0.85rem" }}>
          {agent.memoryIds.map((id) => {
            const m = memoryById(id);
            if (!m) return null;
            return (
              <li key={id} style={{ borderLeft: "2px solid var(--ink-faint)", paddingLeft: "0.85rem" }}>
                <div className="mono" style={{ fontSize: "0.78rem", color: "var(--ink)", marginBottom: "0.2rem" }}>
                  {m.name}
                  <span style={{ color: "var(--ink-faint)", marginLeft: "0.6rem", fontSize: "0.62rem", letterSpacing: "0.08em" }}>
                    {m.kind.toUpperCase()} · {m.retention}
                  </span>
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--ink-muted)", lineHeight: 1.55, margin: 0 }}>{m.description}</p>
              </li>
            );
          })}
        </ul>
      )}

      {tab === "Guardrails" && (
        <ul style={{ listStyle: "none", display: "grid", gap: "0.6rem" }}>
          {agent.guardrails.map((g) => (
            <li key={g} style={{ fontSize: "0.86rem", color: "var(--ink-muted)", display: "flex", gap: "0.6rem", alignItems: "baseline" }}>
              <span style={{ color: "var(--accent)" }}>▸</span>
              {g}
            </li>
          ))}
        </ul>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="panel" style={{ minHeight: "100%", padding: "1.5rem", position: "relative", zIndex: 2 }}>
      {children}
    </div>
  );
}

function Header({
  eyebrow,
  title,
  sub,
  status,
}: {
  eyebrow: string;
  title: string;
  sub: string;
  status?: "active" | "idle";
}) {
  return (
    <div style={{ marginBottom: "0.85rem" }}>
      <div className="mono" style={{ fontSize: "0.62rem", letterSpacing: "0.16em", color: "var(--accent)", marginBottom: "0.5rem" }}>
        {eyebrow}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
        <h3 className="display" style={{ fontSize: "1.35rem", margin: 0 }}>
          {title}
        </h3>
        {status && (
          <span className="badge-mono" style={{ color: status === "active" ? "var(--accent)" : "var(--ink-faint)" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: status === "active" ? "var(--accent)" : "var(--ink-faint)", display: "inline-block" }} />
            {status}
          </span>
        )}
      </div>
      <div className="mono" style={{ fontSize: "0.68rem", color: "var(--ink-faint)", marginTop: "0.35rem", letterSpacing: "0.06em" }}>
        {sub}
      </div>
    </div>
  );
}
