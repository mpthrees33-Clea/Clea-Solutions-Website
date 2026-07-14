"use client";

import { useEffect, useRef, useState } from "react";
import { ACTIVITY, agentById } from "@/data/mission-control";

const CADENCE_MS = 3500;
const VISIBLE = 6;

export default function ActivityFeed({
  onActiveAgent,
}: {
  onActiveAgent: (id: string | null) => void;
}) {
  const [cursor, setCursor] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const flashTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (paused || reduced) return;
    const id = setInterval(() => {
      setCursor((c) => (c + 1) % ACTIVITY.length);
    }, CADENCE_MS);
    return () => clearInterval(id);
  }, [paused, reduced]);

  useEffect(() => {
    if (reduced) return;
    const event = ACTIVITY[cursor];
    onActiveAgent(event.agentId);
    flashTimeout.current = setTimeout(() => onActiveAgent(null), CADENCE_MS - 900);
    return () => {
      if (flashTimeout.current) clearTimeout(flashTimeout.current);
    };
  }, [cursor, reduced, onActiveAgent]);

  const events = reduced
    ? ACTIVITY.slice(0, VISIBLE)
    : Array.from({ length: Math.min(VISIBLE, cursor + 1) }, (_, i) => {
        const idx = (cursor - i + ACTIVITY.length) % ACTIVITY.length;
        return ACTIVITY[idx];
      });

  return (
    <div className="panel" style={{ padding: "1.25rem 1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div className="mono" style={{ fontSize: "0.65rem", letterSpacing: "0.16em", color: "var(--ink-muted)" }}>
          <span className="ticker-dot">●</span> ACTIVITY — SIMULATED REPLAY
        </div>
        {!reduced && (
          <button
            onClick={() => setPaused((p) => !p)}
            className="mono"
            style={{
              fontSize: "0.62rem",
              letterSpacing: "0.1em",
              padding: "0.35rem 0.7rem",
              borderRadius: "6px",
              cursor: "pointer",
              background: "transparent",
              border: "1px solid var(--rule-strong)",
              color: "var(--ink-muted)",
            }}
          >
            {paused ? "▶ RESUME" : "⏸ PAUSE"}
          </button>
        )}
      </div>
      <ul style={{ listStyle: "none", display: "grid", gap: "0.5rem", margin: 0, padding: 0 }}>
        {events.map((e, i) => (
          <li
            key={`${e.offsetMs}-${i}`}
            className="mono"
            style={{
              display: "flex",
              gap: "0.85rem",
              alignItems: "baseline",
              fontSize: "0.72rem",
              opacity: i === 0 ? 1 : Math.max(0.35, 1 - i * 0.14),
              transition: "opacity 300ms ease",
            }}
          >
            <span style={{ color: e.status === "flagged" ? "#FBBF24" : "var(--accent)", flexShrink: 0 }}>
              {e.status === "flagged" ? "⚑" : "✓"}
            </span>
            <span style={{ color: "var(--ink-faint)", flexShrink: 0, minWidth: "9.5rem" }}>
              {agentById(e.agentId)?.name}
            </span>
            <span style={{ color: "var(--ink-muted)", letterSpacing: "0.01em" }}>{e.summary}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
