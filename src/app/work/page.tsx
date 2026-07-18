import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work · Clea Solutions",
  description:
    "One agentic AI platform — Mission Control, Sales Hub, Quotes Hub, PO IDP, and the email voice model — plus the standalone tools around it.",
};

type Project = {
  name: string;
  description: string;
  language: string;
  href: string;
  isLiveDemo: boolean;
  sourceUrl: string;
};

const PLATFORM: Project[] = [
  {
    name: "Mission Control · The Agent Control Plane",
    description:
      "A visual graph of every agent across every platform — prompts, memory bindings, tool permissions, and run history governed in one place. Azure AI backed, Entra ID secured. Explore the sanitized interactive replica.",
    language: "Every agent, observed, from one pane of glass",
    href: "/mission-control",
    isLiveDemo: true,
    sourceUrl: "https://github.com/mpthrees33-clea",
  },
  {
    name: "Quotes Hub · Agentic Quoting Platform",
    description:
      "Four cooperating AI capabilities: inbound request → priced draft quote with per-field grounding, catalog and private-label crossover, follow-ups drafted in the rep's voice, and grounded Q&A over quote history. Deployed inside a distributor's Microsoft environment.",
    language: "Request in → priced quote out, sources attached",
    href: "/quotes-hub",
    isLiveDemo: false,
    sourceUrl: "https://github.com/mpthrees33-clea",
  },
  {
    name: "Sales Hub · Field Sales Workspace",
    description:
      "A field rep's whole day in one tool: voice-first AI assistant with grounded answers, multi-step sample orders, CRM kanban, and crossover lookup. The AI is scoped — draft-only writes, human sends every email.",
    language: "A field rep's whole day in one tool",
    href: "/sales-hub",
    isLiveDemo: false,
    sourceUrl: "https://github.com/mpthrees33-clea/Sales-Hub",
  },
  {
    name: "PO IDP · Document Intelligence You Can Audit",
    description:
      "Turns inbound purchase-order PDFs into validated sales orders in seconds. Seven independent validation layers, every value double-checked against the original document, math reconciled to the cent. Feeds the Quotes Hub and service workflows.",
    language: "Purchase order → validated sales order in seconds",
    href: "/po-idp",
    isLiveDemo: true,
    sourceUrl: "https://github.com/mpthrees33-clea/po-idp",
  },
  {
    name: "Email in Your Own Voice · Built On-Prem",
    description:
      "An AI trained on years of real sent email so its drafts sound like the author, not a bot. Trained and running entirely on our own hardware — it powers the drafting agents inside Sales Hub and Quotes Hub.",
    language: "The voice model behind the platform's drafting agents",
    href: "/email-voice",
    isLiveDemo: false,
    sourceUrl: "https://github.com/mpthrees33-clea/clea-solutions-website",
  },
];

const TOOLS: Project[] = [
  {
    name: "Private Label Brochure Generator",
    description:
      "Scrapes factory product pages and generates distributor-branded PDF brochures with color crossover lists in under 60 seconds. Built for flooring sales reps who need instant, professional collateral.",
    language: "Branded sales collateral in under 60 seconds",
    href: "https://brochures.clea-solutions.ai",
    isLiveDemo: true,
    sourceUrl: "https://github.com/mpthrees33-clea/private-label-brochure-generator",
  },
  {
    name: "Film Estimation Tool",
    description:
      "Architectural film material estimation. Calculate linear footage, rolls, and costs for doors, walls, columns, and custom surfaces with smart templates and waste-factor logic.",
    language: "Accurate material quotes without spreadsheet errors",
    href: "https://estimator.clea-solutions.ai",
    isLiveDemo: true,
    sourceUrl: "https://github.com/mpthrees33-clea/Architectual-film-estimation",
  },
];

export default function WorkPage() {
  return (
    <>
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: "680px", marginBottom: "5rem" }}>
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
              One platform, and the tools around it.
            </h1>
            <p style={{ fontSize: "1.1rem", color: "var(--ink-muted)", lineHeight: 1.6 }}>
              These aren&rsquo;t disconnected projects. The platform pieces feed each
              other — documents become orders, orders become quotes, every agent is
              observed from one control plane. The standalone tools are live and open
              to try right now.
            </p>
          </div>

          <ProjectGroup label="I · THE PLATFORM" projects={PLATFORM} startAt={1} />
          <div style={{ height: "4rem" }} />
          <ProjectGroup label="II · STANDALONE TOOLS" projects={TOOLS} startAt={PLATFORM.length + 1} />

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

function ProjectGroup({
  label,
  projects,
  startAt,
}: {
  label: string;
  projects: Project[];
  startAt: number;
}) {
  return (
    <div>
      <div
        className="mono"
        style={{
          fontSize: "0.7rem",
          letterSpacing: "0.18em",
          color: "var(--accent)",
          marginBottom: "1.25rem",
        }}
      >
        {label}
      </div>
      <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {projects.map((p, i) => {
          const isInternal = p.href.startsWith("/");
          const num = String(startAt + i).padStart(2, "0");
          return (
            <li
              key={p.name}
              style={{
                borderTop: "1px solid var(--rule)",
                borderBottom: i === projects.length - 1 ? "1px solid var(--rule)" : undefined,
              }}
            >
              <a
                href={p.href}
                target={isInternal ? undefined : "_blank"}
                rel={isInternal ? undefined : "noopener noreferrer"}
                className="work-row"
              >
                <span className="mono work-row-num">{num}</span>

                <div>
                  <h2
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: 500,
                      letterSpacing: "-0.01em",
                      marginBottom: "0.6rem",
                      fontFamily: "var(--font-display), sans-serif",
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

                <span className="work-row-action">
                  {p.isLiveDemo ? "Open" : "Case study"}
                  <span aria-hidden>→</span>
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
