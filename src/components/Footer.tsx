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
            Grounded agentic systems for enterprise. Built to be{" "}
            <em className="text-accent-deep" style={{ fontStyle: "italic" }}>trusted</em> with real work.
          </p>
        </div>

        <nav style={{ display: "flex", gap: "1.5rem", fontSize: "0.85rem", color: "var(--ink-muted)" }}>
          <Link href="/work">Work</Link>
          <Link href="/contact">Contact</Link>
          <a href="https://github.com/mpthrees33-clea" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
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
