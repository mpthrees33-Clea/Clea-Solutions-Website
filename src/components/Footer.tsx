import Link from "next/link";

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
          <div
            style={{
              fontFamily: "var(--font-serif), serif",
              fontSize: "1.5rem",
              letterSpacing: "-0.01em",
              marginBottom: "0.25rem",
            }}
          >
            Clea Solutions
          </div>
          <p className="muted" style={{ fontSize: "0.9rem", maxWidth: "420px" }}>
            Grounded agentic systems for enterprise. Built to be trusted with real work.
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
            fontSize: "0.75rem",
            color: "var(--ink-faint)",
          }}
          className="mono"
        >
          <span>© {new Date().getFullYear()} CLEA SOLUTIONS</span>
          <span>BUILT IN-HOUSE</span>
        </div>
      </div>
    </footer>
  );
}
