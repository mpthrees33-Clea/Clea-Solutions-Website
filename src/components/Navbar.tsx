import Link from "next/link";
import Mark from "./Mark";

export default function Navbar() {
  return (
    <header
      style={{
        borderBottom: "1px solid var(--rule)",
        background: "rgba(11, 12, 14, 0.75)",
        backdropFilter: "saturate(180%) blur(8px)",
        WebkitBackdropFilter: "saturate(180%) blur(8px)",
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
          height: "68px",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            color: "var(--ink)",
          }}
        >
          <Mark size={20} />
          <span
            style={{
              fontFamily: "var(--font-serif), serif",
              fontSize: "1.3rem",
              fontWeight: 500,
              letterSpacing: "-0.015em",
            }}
          >
            Clea
          </span>
          <span
            className="mono nav-solutions"
            style={{
              fontSize: "0.68rem",
              color: "var(--ink-faint)",
              letterSpacing: "0.14em",
            }}
          >
            /SOLUTIONS
          </span>
        </Link>

        <nav className="main-nav" style={{ display: "flex", gap: "2rem", alignItems: "center", fontSize: "0.9rem" }}>
          <Link href="/work" className="nav-platform" style={{ color: "var(--ink-muted)" }}>
            Platform
          </Link>
          <Link href="/mission-control" style={{ color: "var(--ink-muted)" }}>
            Mission Control
          </Link>
          <Link href="/harness" style={{ color: "var(--ink-muted)" }}>
            Harness
          </Link>
          <Link href="/#thesis" className="nav-approach" style={{ color: "var(--ink-muted)" }}>
            Approach
          </Link>
          <Link href="/contact" className="btn btn-ghost" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}>
            Contact
          </Link>
        </nav>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .main-nav { gap: 1rem !important; font-size: 0.82rem !important; }
          .nav-approach { display: none; }
        }
        @media (max-width: 560px) {
          .main-nav { gap: 0.85rem !important; font-size: 0.8rem !important; }
          .nav-platform { display: none; }
          .nav-solutions { display: none; }
        }
      `}</style>
    </header>
  );
}
