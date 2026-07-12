import type { Metadata } from "next";
import Link from "next/link";
import Demo from "../po-idp/Demo";

export const metadata: Metadata = {
  title: "Live Demos · Watch the systems work | Clea Solutions",
  description:
    "Run the purchase-order automation pipeline on a real sample PO, then open the live quoting, brochure, and sales tools. Real systems, real output — not slideware.",
};

const LIVE_TOOLS = [
  {
    num: "01",
    name: "Private-Label Brochure Generator",
    problem: "Reps wait days for marketing to produce branded collateral.",
    what: "Scrapes factory product pages and generates distributor-branded PDF brochures with color crossover lists in under 60 seconds.",
    href: "https://brochures.clea-solutions.ai",
    cta: "Open the live tool",
    external: true,
  },
  {
    num: "02",
    name: "Film Estimation Tool",
    problem: "Material quotes built in spreadsheets, with spreadsheet errors.",
    what: "Architectural film estimation: linear footage, roll counts, and costs for doors, walls, and columns, with smart templates and waste-factor logic built in.",
    href: "https://estimator.clea-solutions.ai",
    cta: "Open the live tool",
    external: true,
  },
  {
    num: "03",
    name: "Sales Hub",
    problem: "A field rep's day scattered across six apps and a legal pad.",
    what: "A field-ready workspace for distributor reps: voice-first AI assistant, multi-step sample orders, CRM kanban, and private-label price crossover lookup.",
    href: "https://mpthrees33-clea.github.io/Sales-Hub/",
    cta: "Open the live tool",
    external: true,
  },
  {
    num: "04",
    name: "Email in Your Own Voice",
    problem: "AI drafts that sound like a bot wearing your name tag.",
    what: "A model trained on years of real sent email, running entirely on our own hardware. See the same incoming email answered twice: the stock model's draft next to one in the author's actual voice.",
    href: "/email-voice",
    cta: "See the side-by-side",
    external: false,
  },
];

export default function DemoPage() {
  return (
    <>
      {/* Hero */}
      <section className="section" style={{ paddingBottom: "3rem" }}>
        <div className="container">
          <div style={{ maxWidth: "760px" }} className="fade-up">
            <div className="eyebrow" style={{ marginBottom: "1.75rem", display: "inline-flex", alignItems: "center" }}>
              <span className="dot-mark" />
              (00) · Live demos
            </div>
            <h1
              className="display"
              style={{ fontSize: "clamp(2.25rem, 5.5vw, 4rem)", marginBottom: "1.5rem" }}
            >
              Don&rsquo;t take our word for it.{" "}
              <em
                className="text-accent"
                style={{ fontStyle: "italic", fontFamily: "var(--font-serif), serif" }}
              >
                Watch it work.
              </em>
            </h1>
            <p style={{ fontSize: "1.15rem", color: "var(--ink-muted)", lineHeight: 1.6, maxWidth: "620px" }}>
              Everything on this page is a real, running system — not a mockup and not
              slideware. Run the order-desk pipeline on a sample purchase order right
              here, then open the live tools and try them yourself.
            </p>
          </div>
        </div>
      </section>

      {/* Flagship: PO pipeline, runnable in-page */}
      <section className="section" style={{ paddingTop: "1rem" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(180px, 220px) 1fr",
              gap: "3rem",
              alignItems: "start",
              marginBottom: "2.5rem",
            }}
            className="demo-header"
          >
            <div>
              <div className="eyebrow" style={{ display: "inline-flex", alignItems: "center" }}>
                <span className="dot-mark" />
                (01) · Flagship
              </div>
            </div>
            <div style={{ maxWidth: "720px" }}>
              <h2 className="display" style={{ fontSize: "clamp(1.6rem, 3vw, 2.25rem)", marginBottom: "1rem" }}>
                The order desk, automated.
              </h2>
              <p style={{ color: "var(--ink-muted)", fontSize: "1.02rem", lineHeight: 1.65 }}>
                An emailed purchase-order PDF goes in. A validated sales order comes out
                in under a minute — every value traced to the exact words on the original
                document, the math reconciled to the cent, and anything uncertain routed
                to a person instead of into your order system. This is the same pipeline
                we run in production for a commercial flooring distributor.
              </p>
              <p style={{ color: "var(--ink-muted)", fontSize: "0.95rem", lineHeight: 1.65, marginTop: "0.75rem" }}>
                Press the button. What you&rsquo;ll see is genuine output from the running
                pipeline — and you can download the input PO, the generated sales order,
                and the full audit bundle below it.{" "}
                <Link href="/po-idp" className="btn-link" style={{ fontSize: "0.9rem" }}>
                  Read the full case study →
                </Link>
              </p>
            </div>
          </div>

          <Demo />
        </div>
        <style>{`
          @media (max-width: 720px) {
            .demo-header { grid-template-columns: 1fr !important; gap: 1.25rem !important; }
          }
        `}</style>
      </section>

      <hr className="rule" />

      {/* Other live tools */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: "640px", marginBottom: "3.5rem" }}>
            <div className="eyebrow" style={{ marginBottom: "1.5rem", display: "inline-flex", alignItems: "center" }}>
              <span className="dot-mark" />
              (02) · More live tools
            </div>
            <h2 className="display" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}>
              Four more systems you can open{" "}
              <em
                className="text-accent"
                style={{ fontStyle: "italic", fontFamily: "var(--font-serif), serif" }}
              >
                right now.
              </em>
            </h2>
          </div>

          <div className="grid-2" style={{ gap: "1.25rem" }}>
            {LIVE_TOOLS.map((t) => (
              <a
                key={t.name}
                href={t.href}
                target={t.external ? "_blank" : undefined}
                rel={t.external ? "noopener noreferrer" : undefined}
                className="card"
                style={{ display: "block", color: "var(--ink)", padding: "1.75rem" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                  <span style={{ width: "28px", height: "1px", background: "var(--accent)", display: "inline-block" }} />
                  <span className="mono" style={{ fontSize: "0.72rem", color: "var(--accent-deep)", letterSpacing: "0.12em" }}>
                    {t.num}
                  </span>
                </div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 500, marginBottom: "0.6rem", letterSpacing: "-0.01em" }}>
                  {t.name}
                </h3>
                <p className="mono" style={{ fontSize: "0.72rem", color: "var(--ink-faint)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                  The problem: {t.problem}
                </p>
                <p style={{ color: "var(--ink-muted)", fontSize: "0.93rem", lineHeight: 1.6, marginBottom: "1.1rem" }}>
                  {t.what}
                </p>
                <span className="btn-link" style={{ fontSize: "0.9rem" }}>
                  {t.cta} <span aria-hidden>→</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Pilot CTA */}
      <section className="section">
        <div className="container">
          <div
            style={{
              maxWidth: "760px",
              padding: "2.5rem",
              background: "var(--bg-tint)",
              border: "1px solid var(--rule)",
              borderRadius: "12px",
            }}
          >
            <div className="eyebrow" style={{ marginBottom: "1.25rem", display: "inline-flex", alignItems: "center" }}>
              <span className="dot-mark" />
              (03) · The next step
            </div>
            <h2 className="display" style={{ fontSize: "clamp(1.5rem, 2.8vw, 2rem)", marginBottom: "1rem" }}>
              Want to see it run on{" "}
              <em
                className="text-accent"
                style={{ fontStyle: "italic", fontFamily: "var(--font-serif), serif" }}
              >
                your
              </em>{" "}
              documents?
            </h2>
            <p style={{ color: "var(--ink-muted)", fontSize: "1rem", lineHeight: 1.65, marginBottom: "1.75rem" }}>
              That&rsquo;s the pilot: a fixed-price, two-week engagement where we run your
              real purchase orders, quotes, or email through the system and hand you the
              numbers — hours saved, error rate, and exactly what a production rollout
              would look like. If the numbers don&rsquo;t make the case, you walk away
              with the report and we part friends.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <Link href="/contact" className="btn btn-primary">
                Book a pilot
                <span aria-hidden>→</span>
              </Link>
              <a href="mailto:contact@clea-solutions.ai" className="btn btn-ghost">
                contact@clea-solutions.ai
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
