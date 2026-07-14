"use client";

import { useState, FormEvent, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/work";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/work-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        window.location.href = from;
      } else {
        setError("Invalid password. Access denied.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section">
      <div className="container-narrow" style={{ maxWidth: "420px" }}>
        <div className="eyebrow" style={{ marginBottom: "1.25rem" }}>
          (00) · Authorized access
        </div>
        <h1
          className="display"
          style={{ fontSize: "2rem", marginBottom: "0.6rem" }}
        >
          Enter password.
        </h1>
        <p style={{ color: "var(--ink-muted)", marginBottom: "2.5rem", fontSize: "0.95rem" }}>
          This area is gated. Reach out via Contact if you need access.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="form-input"
          />

          {error && (
            <p className="mono" style={{ color: "#F87171", fontSize: "0.78rem", margin: 0, letterSpacing: "0.04em" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ marginTop: "0.5rem", opacity: loading ? 0.6 : 1, cursor: loading ? "wait" : "pointer", justifyContent: "center" }}
          >
            {loading ? "Checking…" : "Enter"}
            {!loading && <span aria-hidden>→</span>}
          </button>
        </form>
      </div>
    </section>
  );
}

export default function WorkLogin() {
  return (
    <Suspense
      fallback={
        <section className="section">
          <div className="container" style={{ textAlign: "center", color: "var(--ink-muted)" }}>
            Loading…
          </div>
        </section>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
