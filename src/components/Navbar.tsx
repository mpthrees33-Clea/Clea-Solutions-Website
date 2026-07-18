"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Mark from "./Mark";

const LINKS = [
  { href: "/work", label: "Platform" },
  { href: "/mission-control", label: "Mission Control" },
  { href: "/#thesis", label: "Approach" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the panel when the route changes (e.g. back/forward navigation).
  // Hash links (/#thesis) don't change the pathname, so links also close on click.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="site-header">
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

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
        </button>
      </div>

      <nav id="mobile-nav" className={open ? "nav-panel is-open" : "nav-panel"} aria-label="Mobile">
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
