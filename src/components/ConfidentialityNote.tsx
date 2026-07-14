export default function ConfidentialityNote({
  systemName = "system",
  children,
}: {
  systemName?: string;
  children?: React.ReactNode;
}) {
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
        ⬢ SANITIZED REPLICA
      </div>
      <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "var(--ink-muted)", margin: 0 }}>
        {children ?? (
          <>
            The production {systemName} runs inside an employer&rsquo;s Azure tenant behind
            Microsoft Entra ID, governing live agents across Sales Hub, Quotes Hub, and
            customer service. It can&rsquo;t be shown publicly — which is exactly the point
            of systems built for enterprise environments. What you&rsquo;re looking at here
            is a faithful, sanitized replica: same architecture, same interaction model,
            mock data.
          </>
        )}
      </p>
    </aside>
  );
}
