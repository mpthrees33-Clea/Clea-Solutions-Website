"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

export default function Waitlist() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    const data = new FormData(e.currentTarget);
    const companyLine = data.get("org") ? `Company/role: ${data.get("org")}\n` : "";
    const docsLine = data.get("docs") ? `Bid flow: ${data.get("docs")}\n` : "";
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          description: `SPECSCOUT FOUNDING-PARTNER WAITLIST\n${companyLine}${docsLine}`,
          company: data.get("company"), // honeypot
        }),
      });
      const json = await res.json().catch(() => ({ success: false }));
      setStatus(res.ok && json.success ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        style={{
          padding: "2.5rem",
          background: "var(--bg-tint)",
          border: "1px solid var(--rule)",
          borderRadius: "12px",
        }}
      >
        <h3 className="display" style={{ fontSize: "1.4rem", marginBottom: "0.75rem" }}>
          You&rsquo;re on the list.
        </h3>
        <p style={{ color: "var(--ink-muted)", fontSize: "0.95rem", lineHeight: 1.65 }}>
          Colton reads every submission personally and will reply within two business
          days to set up a 20-minute call — bring a recent bid set if you have one handy.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        padding: "2.5rem",
        background: "var(--bg-tint)",
        border: "1px solid var(--rule)",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "1.1rem",
      }}
    >
      <div>
        <label className="form-label" htmlFor="ss-name">
          Name
        </label>
        <input id="ss-name" name="name" required maxLength={200} className="form-input" placeholder="Your name" />
      </div>
      <div>
        <label className="form-label" htmlFor="ss-email">
          Work email
        </label>
        <input id="ss-email" name="email" type="email" required maxLength={320} className="form-input" placeholder="you@company.com" />
      </div>
      <div>
        <label className="form-label" htmlFor="ss-org">
          Company & role
        </label>
        <input id="ss-org" name="org" maxLength={200} className="form-input" placeholder="e.g. Territory rep, resilient flooring" />
      </div>
      <div>
        <label className="form-label" htmlFor="ss-docs">
          Roughly how many spec sets / bid invites do you see a month?
        </label>
        <input id="ss-docs" name="docs" maxLength={200} className="form-input" placeholder="e.g. 10–15, mostly healthcare and education" />
      </div>
      {/* Honeypot — humans never see this field */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", height: 0, width: 0, opacity: 0 }}
      />
      <button
        type="submit"
        className="btn btn-primary"
        disabled={status === "sending"}
        style={{ justifyContent: "center", opacity: status === "sending" ? 0.6 : 1 }}
      >
        {status === "sending" ? "Sending…" : "Request a founding seat"}
        <span aria-hidden>→</span>
      </button>
      {status === "error" && (
        <p style={{ color: "#B91C1C", fontSize: "0.85rem", margin: 0 }}>
          Something went wrong. Email{" "}
          <a href="mailto:contact@clea-solutions.ai" style={{ textDecoration: "underline" }}>
            contact@clea-solutions.ai
          </a>{" "}
          instead.
        </p>
      )}
      <p style={{ color: "var(--ink-faint)", fontSize: "0.78rem", lineHeight: 1.5, margin: 0 }}>
        Five founding seats at $200/month, locked. No payment now — this is a request to
        talk, not a checkout.
      </p>
    </form>
  );
}
