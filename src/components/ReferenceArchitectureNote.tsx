export default function ReferenceArchitectureNote() {
  return (
    <aside
      style={{
        background: "var(--accent-wash)",
        border: "1px solid var(--accent-soft)",
        borderRadius: "8px",
        padding: "1.5rem 1.75rem",
        maxWidth: "820px",
      }}
    >
      <div
        className="mono"
        style={{
          fontSize: "0.65rem",
          letterSpacing: "0.16em",
          color: "var(--accent)",
          marginBottom: "0.75rem",
        }}
      >
        ⬢ REFERENCE ARCHITECTURE
      </div>
      <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "var(--ink-muted)", margin: 0 }}>
        The production systems on this site run on a custom harness inside an
        employer&rsquo;s Azure tenant behind Microsoft Entra ID — they are not built on
        eve. But the architecture maps one-for-one onto the patterns Vercel codified
        when it open-sourced{" "}
        <a
          href="https://github.com/vercel/eve"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-link"
        >
          eve
        </a>{" "}
        (Apache 2.0, June 2026): agents as inspectable contracts, typed and scoped
        tools, durable approvals, and a hard trust boundary between the model and
        your secrets. This page uses eve&rsquo;s vocabulary because it&rsquo;s becoming
        the shared language for production agents — and new client builds can be
        delivered on eve directly.
      </p>
    </aside>
  );
}
