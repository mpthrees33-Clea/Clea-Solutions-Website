"use client";

import { useState } from "react";

const CONTACT_EMAIL = "contact@clea-solutions.ai";

const ENGAGEMENT_STEPS = [
  {
    num: "01",
    title: "Free assessment call",
    body: "Thirty minutes. You describe the workflow, I tell you honestly whether AI is a fit. Sometimes the answer is no, and I'll tell you that too.",
  },
  {
    num: "02",
    title: "Small pilot, priced up front",
    body: "A fixed-scope project that proves value on your real documents before you commit to anything bigger.",
  },
  {
    num: "03",
    title: "Production build",
    body: "Fixed quote, agreed milestones. You own everything at the end: the code, the model, the hardware setup.",
  },
];

type Status = "idle" | "sending" | "success" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          description: data.get("description"),
          company: data.get("company"),
        }),
      });
      const json = await res.json().catch(() => ({ success: false }));
      setStatus(res.ok && json.success ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="section">
      <div className="container-narrow">
        <div style={{ marginBottom: "3.5rem" }}>
          <div className="eyebrow" style={{ marginBottom: "1.5rem" }}>
            (00) · Contact
          </div>
          <h1
            className="display"
            style={{
              fontSize: "clamp(2.25rem, 5vw, 3.25rem)",
              marginBottom: "1.25rem",
            }}
          >
            Tell me what you're trying to solve.
          </h1>
          <p style={{ fontSize: "1.1rem", color: "var(--ink-muted)", lineHeight: 1.6 }}>
            Short notes are welcome. I read every message personally and reply within two
            business days, usually sooner.
          </p>
        </div>

        <div style={{ marginBottom: "3.5rem" }}>
          <div className="eyebrow" style={{ marginBottom: "1.5rem" }}>
            How engagements work
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {ENGAGEMENT_STEPS.map((step) => (
              <div
                key={step.num}
                style={{
                  display: "flex",
                  gap: "1.25rem",
                  borderTop: "1px solid var(--line)",
                  paddingTop: "1.25rem",
                }}
              >
                <span
                  className="mono"
                  style={{ fontSize: "0.8rem", color: "var(--ink-faint)", paddingTop: "0.2rem" }}
                >
                  {step.num}
                </span>
                <div>
                  <h3 style={{ fontSize: "1rem", marginBottom: "0.35rem" }}>{step.title}</h3>
                  <p style={{ color: "var(--ink-muted)", lineHeight: 1.6, fontSize: "0.95rem" }}>
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p
            style={{
              marginTop: "1.5rem",
              color: "var(--ink-muted)",
              lineHeight: 1.6,
              fontSize: "0.95rem",
            }}
          >
            No retainers unless you want ongoing support. No per-seat licenses. No surprise
            invoices.
          </p>
        </div>

        {status === "success" ? (
          <div
            style={{
              border: "1px solid var(--line)",
              padding: "2.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div className="eyebrow">Message sent</div>
            <p style={{ fontSize: "1.1rem", lineHeight: 1.6 }}>
              Thanks. I read every message personally and reply within two business days,
              usually sooner.
            </p>
            <p style={{ color: "var(--ink-muted)", lineHeight: 1.6 }}>
              If it's urgent, email me directly at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
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

            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "-9999px",
                height: 0,
                width: 0,
                opacity: 0,
              }}
            />

            {status === "error" && (
              <p style={{ color: "var(--ink-muted)", lineHeight: 1.6 }}>
                Something went wrong sending your message. Please email me directly at{" "}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and I'll reply within
                two business days.
              </p>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "1rem",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <div>
                <p
                  className="mono"
                  style={{ fontSize: "0.72rem", color: "var(--ink-faint)", letterSpacing: "0.08em" }}
                >
                  REPLIES WITHIN 2 BUSINESS DAYS
                </p>
                <p style={{ fontSize: "0.85rem", color: "var(--ink-muted)", marginTop: "0.35rem" }}>
                  Prefer email? <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                </p>
              </div>
              <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Send message"}
                <span aria-hidden>→</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
