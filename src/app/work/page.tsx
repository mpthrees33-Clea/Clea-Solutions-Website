type Project = {
  name: string;
  description: string;
  language: string;
  href: string;
  isLiveDemo: boolean;
  sourceUrl: string;
};

const PROJECTS: Project[] = [
  {
    name: "PO IDP · Zero-Hallucination Document Intelligence",
    description:
      "Enterprise IDP that turns inbound purchase-order PDFs into validated sales orders. Seven independent anti-hallucination layers: every value traces to verbatim source text, two models must agree, math reconciles to the cent.",
    language: "Python · FastAPI · AI",
    href: "/po-idp",
    isLiveDemo: true,
    sourceUrl: "https://github.com/mpthrees33-clea/po-idp",
  },
  {
    name: "Private Label Brochure Generator",
    description:
      "AI-powered tool that scrapes factory product pages and generates Trinity-branded PDF brochures with color crossover lists in under 60 seconds. Built for flooring sales reps who need instant, professional collateral.",
    language: "TypeScript · Next.js",
    href: "https://brochures.clea-solutions.ai",
    isLiveDemo: true,
    sourceUrl: "https://github.com/mpthrees33-clea/private-label-brochure-generator",
  },
  {
    name: "Film Estimation Tool",
    description:
      "Architectural film material estimation. Calculate linear footage, rolls, and costs for doors, walls, columns, and custom surfaces with smart templates and waste-factor logic.",
    language: "TypeScript · Next.js",
    href: "https://estimator.clea-solutions.ai",
    isLiveDemo: true,
    sourceUrl: "https://github.com/mpthrees33-clea/Architectual-film-estimation",
  },
  {
    name: "Sales Hub",
    description:
      "Field-ready sales workspace for flooring distributor reps. Voice-first AI assistant, multi-step sample orders, CRM kanban, and private-label price crossover lookup.",
    language: "TypeScript · React",
    href: "https://mpthrees33-clea.github.io/Sales-Hub/",
    isLiveDemo: true,
    sourceUrl: "https://github.com/mpthrees33-clea/Sales-Hub",
  },
  {
    name: "Travel Country V6",
    description:
      "Travel destination experience redesign. Live demo coming soon. View source on GitHub.",
    language: "TypeScript · React",
    href: "https://github.com/mpthrees33-clea/Travel-Country-V6",
    isLiveDemo: false,
    sourceUrl: "https://github.com/mpthrees33-clea/Travel-Country-V6",
  },
];

export default function WorkPage() {
  return (
    <>
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: "640px", marginBottom: "5rem" }}>
            <div className="eyebrow" style={{ marginBottom: "1.5rem" }}>
              (00) · Selected work
            </div>
            <h1
              className="display"
              style={{
                fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
                marginBottom: "1.5rem",
              }}
            >
              Things we've built.
            </h1>
            <p style={{ fontSize: "1.1rem", color: "var(--ink-muted)", lineHeight: 1.6 }}>
              Production tools, research prototypes, and shipped products. Each one a working
              answer to a specific question.
            </p>
          </div>

          <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {PROJECTS.map((p, i) => {
              const isInternal = p.href.startsWith("/");
              const num = String(i + 1).padStart(2, "0");
              return (
                <li
                  key={p.name}
                  style={{
                    borderTop: "1px solid var(--rule)",
                    borderBottom: i === PROJECTS.length - 1 ? "1px solid var(--rule)" : undefined,
                  }}
                >
                  <a
                    href={p.href}
                    target={isInternal ? undefined : "_blank"}
                    rel={isInternal ? undefined : "noopener noreferrer"}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "60px 1fr auto",
                      gap: "2rem",
                      padding: "2.5rem 0",
                      alignItems: "start",
                      color: "var(--ink)",
                    }}
                    className="work-row"
                  >
                    <span
                      className="mono"
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--ink-faint)",
                        paddingTop: "0.4rem",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {num}
                    </span>

                    <div>
                      <h2
                        style={{
                          fontSize: "1.4rem",
                          fontWeight: 500,
                          letterSpacing: "-0.01em",
                          marginBottom: "0.6rem",
                          fontFamily: "var(--font-serif), serif",
                        }}
                      >
                        {p.name}
                      </h2>
                      <p
                        style={{
                          color: "var(--ink-muted)",
                          fontSize: "0.95rem",
                          lineHeight: 1.6,
                          marginBottom: "1rem",
                          maxWidth: "620px",
                        }}
                      >
                        {p.description}
                      </p>
                      <span
                        className="mono"
                        style={{ fontSize: "0.72rem", color: "var(--ink-faint)", letterSpacing: "0.06em" }}
                      >
                        {p.language.toUpperCase()}
                      </span>
                    </div>

                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        fontSize: "0.8rem",
                        color: "var(--ink-muted)",
                        paddingTop: "0.4rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.isLiveDemo ? "Open" : "Source"}
                      <span aria-hidden>→</span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>

          <p style={{ marginTop: "3rem", fontSize: "0.9rem", color: "var(--ink-muted)" }}>
            All source code is open at{" "}
            <a
              href="https://github.com/mpthrees33-clea"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-link"
            >
              github.com/mpthrees33-clea
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
