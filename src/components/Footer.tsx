import Link from "next/link";
import Mark from "./Mark";

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--rule)", marginTop: "6rem" }}>
      <div
        className="container"
        style={{
          padding: "3rem 1.5rem 2rem",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "2rem",
          alignItems: "end",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
            <Mark size={20} />
            <span
              style={{
                fontFamily: "var(--font-serif), serif",
                fontSize: "1.5rem",
                letterSpacing: "-0.015em",
              }}
            >
              Clea Solutions
            </span>
          </div>
          <p className="muted" style={{ fontSize: "0.9rem", maxWidth: "420px" }}>
            Enterprise-grade agentic AI harnesses and infrastructure. Every agent
            grounded, governed, and observed — and your data stays{" "}
            <em className="text-accent-deep" style={{ fontStyle: "normal" }}>inside your walls</em>.
          </p>
        </div>

        <nav
          style={{
            display: "flex",
            gap: "1.5rem",
            fontSize: "0.85rem",
            color: "var(--ink-muted)",
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          <Link href="/work">Work</Link>
          <Link href="/mission-control">Mission Control</Link>
          <Link href="/contact">Contact</Link>
          <a href="mailto:contact@clea-solutions.ai">contact@clea-solutions.ai</a>
          <a href="https://github.com/mpthrees33-clea" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </nav>
      </div>

      <div className="container" style={{ borderTop: "1px solid var(--rule)" }}>
        <div
          style={{
            padding: "1.25rem 0",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.72rem",
            color: "var(--ink-faint)",
          }}
          className="mono"
        >
          <span>© {new Date().getFullYear()} CLEA SOLUTIONS</span>
          <span>
            <span className="ticker-dot">●</span> AVAILABLE FOR NEW WORK
          </span>
        </div>
      </div>
    </footer>
  );
}
