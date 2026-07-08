import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | Clea Solutions",
  description: "Terms of use for the Clea Solutions website.",
};

export default function TermsPage() {
  return (
    <section className="section">
      <div className="container-narrow">
        <div className="eyebrow" style={{ marginBottom: "1.5rem" }}>
          Terms of use
        </div>
        <h1
          className="display"
          style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)", marginBottom: "2.5rem" }}
        >
          The short version.
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", color: "var(--ink-muted)", lineHeight: 1.7 }}>
          <p>
            This website is provided as-is, for information about Clea Solutions and the
            work we do. We keep it accurate, but nothing here is a contractual promise.
          </p>
          <p>
            Case studies and demos on this site show real systems, and some example
            outputs use placeholder names and details. Where that&rsquo;s the case, the
            page says so.
          </p>
          <p>
            Client engagements are governed by a written agreement between us, not by
            this website. Scope, pricing, milestones, and ownership are all defined
            there, in writing, before work begins.
          </p>
          <p>
            Questions? Email{" "}
            <a href="mailto:contact@clea-solutions.ai">contact@clea-solutions.ai</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
