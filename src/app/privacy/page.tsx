import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Clea Solutions",
  description: "How Clea Solutions handles the information you share with us.",
};

export default function PrivacyPage() {
  return (
    <section className="section">
      <div className="container-narrow">
        <div className="eyebrow" style={{ marginBottom: "1.5rem" }}>
          Privacy policy
        </div>
        <h1
          className="display"
          style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)", marginBottom: "2.5rem" }}
        >
          Plain-language privacy.
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", color: "var(--ink-muted)", lineHeight: 1.7 }}>
          <p>
            This is the same standard we hold our AI systems to: nothing collected that
            isn&rsquo;t needed, nothing shared that wasn&rsquo;t given for that purpose.
          </p>
          <div>
            <h2 style={{ fontSize: "1.15rem", color: "var(--ink)", marginBottom: "0.5rem" }}>
              What we collect
            </h2>
            <p>
              The contact form asks for your name, email address, an optional phone
              number, and your message. That&rsquo;s it. We don&rsquo;t use tracking
              cookies, analytics scripts, or advertising pixels on this site.
            </p>
          </div>
          <div>
            <h2 style={{ fontSize: "1.15rem", color: "var(--ink)", marginBottom: "0.5rem" }}>
              What happens to it
            </h2>
            <p>
              Your message is delivered to us by email through Resend, an email delivery
              service, and kept as ordinary business correspondence. We use it to reply
              to you and for nothing else. We never sell it, rent it, or share it with
              anyone.
            </p>
          </div>
          <div>
            <h2 style={{ fontSize: "1.15rem", color: "var(--ink)", marginBottom: "0.5rem" }}>
              Your choices
            </h2>
            <p>
              If you&rsquo;d like your correspondence deleted, email{" "}
              <a href="mailto:contact@clea-solutions.ai">contact@clea-solutions.ai</a> and
              we&rsquo;ll take care of it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
