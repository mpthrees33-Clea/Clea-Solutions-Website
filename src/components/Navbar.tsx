import Link from "next/link";

export default function Navbar() {
  return (
    <header
      style={{
        borderBottom: "1px solid var(--rule)",
        background: "rgba(250, 250, 247, 0.85)",
        backdropFilter: "saturate(180%) blur(6px)",
        WebkitBackdropFilter: "saturate(180%) blur(6px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "64px",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "baseline",
            gap: "0.5rem",
            fontFamily: "var(--font-serif), serif",
            fontSize: "1.25rem",
            fontWeight: 500,
            letterSpacing: "-0.01em",
            color: "var(--ink)",
          }}
        >
          Clea
          <span className="mono" style={{ fontSize: "0.7rem", color: "var(--ink-faint)", letterSpacing: "0.1em" }}>
            /SOLUTIONS
          </span>
        </Link>

        <nav style={{ display: "flex", gap: "2rem", alignItems: "center", fontSize: "0.9rem" }}>
          <Link href="/" style={{ color: "var(--ink-muted)" }}>
            Approach
          </Link>
          <Link href="/work" style={{ color: "var(--ink-muted)" }}>
            Work
          </Link>
          <Link href="/contact" className="btn btn-ghost" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}>
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
