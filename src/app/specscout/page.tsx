import type { Metadata } from "next";
import Link from "next/link";
import Demo from "./Demo";
import Waitlist from "./Waitlist";

export const metadata: Metadata = {
  title: "SpecScout · Know every spec you're winning or losing | Clea Solutions",
  description:
    "An AI agent for building-product reps in interior finishes. Forward the bid sets you already receive — it finds every Division 09 section, flags who's basis-of-design, and drafts the substitution package. Join the founding-partner waitlist.",
};

const STEPS = [
  {
    num: "01",
    title: "Forward the documents you already get",
    body: "Spec books, bid sets, addenda — email them in or upload them. No plan-room integrations required, no data you don't already have the right to read.",
  },
  {
    num: "02",
    title: "The agent reads every finishes section",
    body: "It finds each Division 09 section, pulls the basis-of-design product, the listed acceptable manufacturers, and where you stand — with a page-number citation for every claim, or it flags a person.",
  },
  {
    num: "03",
    title: "You get the attack list — and the paperwork",
    body: "A digest of specs to defend and specs to attack, ranked by value and deadline. For the attacks, it drafts the substitution / prior-approval package: request form, comparison matrix, data sheets. You review, sign, send.",
  },
];

export default function SpecScoutPage() {
  return (
    <>
      {/* Hero */}
      <section className="section" style={{ paddingBottom: "3rem" }}>
        <div className="container">
          <div style={{ maxWidth: "800px" }} className="fade-up">
            <div className="eyebrow" style={{ marginBottom: "1.75rem", display: "inline-flex", alignItems: "center" }}>
              <span className="dot-mark" />
              SpecScout · Early access
            </div>
            <h1
              className="display"
              style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.25rem)", marginBottom: "1.5rem" }}
            >
              Every spec you&rsquo;re losing,{" "}
              <em
                className="text-accent"
                style={{ fontStyle: "italic", fontFamily: "var(--font-serif), serif" }}
              >
                caught before bid day.
              </em>
            </h1>
            <p style={{ fontSize: "1.15rem", color: "var(--ink-muted)", lineHeight: 1.6, maxWidth: "660px", marginBottom: "1rem" }}>
              SpecScout is an AI agent for building-product reps, rep agencies, and
              distributor architectural reps in interior finishes. It reads the spec
              books and bid sets you already receive, tells you who&rsquo;s
              basis-of-design in every Division 09 section, and drafts the substitution
              package for the specs worth fighting for.
            </p>
            <p style={{ fontSize: "1rem", color: "var(--ink-muted)", lineHeight: 1.6, maxWidth: "660px", marginBottom: "2rem" }}>
              Built by a rep who spent six years finding out about lost specs after the
              PO went to someone else.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <a href="#waitlist" className="btn btn-primary">
                Become a founding partner
                <span aria-hidden>→</span>
              </a>
              <a href="#demo" className="btn btn-ghost">
                See it read a bid set
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: "var(--bg-tint)", borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)" }}>
        <div className="container" style={{ padding: "4rem 1.5rem" }}>
          <div className="grid-3">
            {STEPS.map((s) => (
              <div key={s.num}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                  <span style={{ width: "28px", height: "1px", background: "var(--accent)", display: "inline-block" }} />
                  <span className="mono" style={{ fontSize: "0.72rem", color: "var(--accent-deep)", letterSpacing: "0.12em" }}>
                    {s.num}
                  </span>
                </div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 500, marginBottom: "0.75rem", letterSpacing: "-0.01em", color: "var(--ink)" }}>
                  {s.title}
                </h3>
                <p style={{ color: "var(--ink-muted)", fontSize: "0.95rem", lineHeight: 1.65 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo */}
      <section className="section" id="demo">
        <div className="container">
          <div style={{ maxWidth: "680px", marginBottom: "2.5rem" }}>
            <div className="eyebrow" style={{ marginBottom: "1.5rem", display: "inline-flex", alignItems: "center" }}>
              <span className="dot-mark" />
              Sample run
            </div>
            <h2 className="display" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", marginBottom: "1rem" }}>
              Watch it work a bid set.
            </h2>
            <p style={{ color: "var(--ink-muted)", fontSize: "1rem", lineHeight: 1.65 }}>
              This is a worked example on a sample project (names are fictional; the
              document structure is real). Every extracted fact carries the page it came
              from — the same source-grounding discipline as our{" "}
              <Link href="/po-idp" className="btn-link" style={{ fontSize: "1rem" }}>
                purchase-order pipeline
              </Link>
              . Early-access runs happen on your real documents.
            </p>
          </div>
          <Demo />
        </div>
      </section>

      <hr className="rule" />

      {/* Founding partner / waitlist */}
      <section className="section" id="waitlist">
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "3.5rem",
              alignItems: "start",
            }}
            className="waitlist-grid"
          >
            <div>
              <div className="eyebrow" style={{ marginBottom: "1.5rem", display: "inline-flex", alignItems: "center" }}>
                <span className="dot-mark" />
                Founding partners
              </div>
              <h2 className="display" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", marginBottom: "1.25rem" }}>
                Five seats. Your documents shape the product.
              </h2>
              <p style={{ color: "var(--ink-muted)", fontSize: "1rem", lineHeight: 1.7, marginBottom: "1rem" }}>
                We&rsquo;re taking five founding partners — reps or sales managers in
                flooring, resilient, carpet, tile, or architectural film. You get
                SpecScout running on your live bid flow at a locked founding rate of{" "}
                <strong style={{ color: "var(--ink)" }}>$200/month</strong> (standard
                pricing will be per territory), direct access to the founder, and a say
                in what gets built next.
              </p>
              <p style={{ color: "var(--ink-muted)", fontSize: "1rem", lineHeight: 1.7 }}>
                In return we ask for real spec sets, honest feedback, and a case study
                when it earns one. If it doesn&rsquo;t save you hours in the first month,
                you shouldn&rsquo;t pay for it — and we&rsquo;ll say so.
              </p>
            </div>
            <Waitlist />
          </div>
        </div>
        <style>{`
          @media (max-width: 820px) {
            .waitlist-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          }
        `}</style>
      </section>
    </>
  );
}
