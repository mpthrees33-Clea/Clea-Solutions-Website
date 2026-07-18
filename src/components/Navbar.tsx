"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Mark from "./Mark";

const LINKS = [
  { href: "/work", label: "Platform" },
  { href: "/mission-control", label: "Mission Control" },
  { href: "/#thesis", label: "Approach" },
];

export default function Navbar() {
  const toggleRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  const close = () => {
    if (toggleRef.current) toggleRef.current.checked = false;
  };

  // Close the panel when the route changes (back/forward, or after a link tap).
  // The toggle itself is a native checkbox driven by CSS, so the menu opens and
  // closes even if this JavaScript never runs — these effects are enhancement only.
  useEffect(() => {
    close();
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="site-header">
      {/* Uncontrolled checkbox: the browser toggles it natively and CSS shows the
          panel via #nav-toggle:checked ~ #mobile-nav — no hydration required. */}
      <input
        ref={toggleRef}
        type="checkbox"
        id="nav-toggle"
        className="nav-toggle-checkbox"
        aria-label="Toggle navigation menu"
      />
      <div className="container site-header-row">
        <Link href="/" className="site-brand" onClick={close}>
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
            className="mono"
            style={{
              fontSize: "0.68rem",
              color: "var(--ink-faint)",
              letterSpacing: "0.14em",
            }}
          >
            /SOLUTIONS
          </span>
        </Link>

        <nav className="site-nav" aria-label="Primary">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} style={{ color: "var(--ink-muted)" }}>
              {l.label}
            </Link>
          ))}
          <Link href="/contact" className="btn btn-ghost" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}>
            Contact
          </Link>
        </nav>

        <label htmlFor="nav-toggle" className="nav-toggle">
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-label-a11y">Menu</span>
        </label>
      </div>

      <nav id="mobile-nav" className="nav-panel" aria-label="Mobile">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} onClick={close}>
            {l.label}
          </Link>
        ))}
        <Link href="/contact" className="btn btn-ghost" onClick={close}>
          Contact
        </Link>
      </nav>
    </header>
  );
}
