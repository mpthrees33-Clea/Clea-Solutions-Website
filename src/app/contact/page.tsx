"use client";

export default function Contact() {
  return (
    <section className="section">
      <div className="container-narrow">
        <div style={{ marginBottom: "3.5rem" }}>
          <div className="eyebrow" style={{ marginBottom: "1.5rem" }}>
            (00) — Contact
          </div>
          <h1
            className="display"
            style={{
              fontSize: "clamp(2.25rem, 5vw, 3.25rem)",
              marginBottom: "1.25rem",
            }}
          >
            Tell us what you're trying to solve.
          </h1>
          <p style={{ fontSize: "1.1rem", color: "var(--ink-muted)", lineHeight: 1.6 }}>
            Short notes are welcome. We'll respond within two business days, usually sooner.
          </p>
        </div>

        <form style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your name"
              required
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@company.com"
              required
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="phone" className="form-label">
              Phone <span style={{ color: "var(--ink-faint)", fontWeight: 400 }}>(optional)</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="(555) 555-5555"
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="description" className="form-label">
              What are you working on?
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="A few sentences about the workflow, decision, or document type you'd like to automate."
              rows={6}
              required
              className="form-input"
              style={{ resize: "vertical", fontFamily: "inherit" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", gap: "1rem", flexWrap: "wrap" }}>
            <p className="mono" style={{ fontSize: "0.72rem", color: "var(--ink-faint)", letterSpacing: "0.08em" }}>
              REPLIES WITHIN 2 BUSINESS DAYS
            </p>
            <button type="submit" className="btn btn-primary">
              Send message
              <span aria-hidden>→</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
