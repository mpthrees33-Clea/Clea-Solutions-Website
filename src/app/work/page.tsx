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
    name: 'FilmViz AI',
    description:
      'AI-powered architectural visualization for flooring and surface film. Upload site photos, apply finishes with smart masking, and export photorealistic renders for client presentations.',
    language: 'JavaScript / React',
    href: 'https://visualizer-test-97214.web.app',
    isLiveDemo: true,
    sourceUrl: 'https://github.com/mpthrees33-clea',
  },
  {
    name: 'Sales Hub',
    description:
      'Field-ready sales workspace for flooring distributor reps — voice-first AI assistant, multi-step sample orders, CRM kanban, and private-label price crossover lookup.',
    language: 'TypeScript / React',
    href: 'https://mpthrees33-clea.github.io/Sales-Hub/',
    isLiveDemo: true,
    sourceUrl: 'https://github.com/mpthrees33-clea/Sales-Hub',
  },
  {
    name: 'Travel Country V6',
    description:
      'Travel destination experience redesign. Live demo coming soon — view source on GitHub.',
    language: 'TypeScript / React',
    href: 'https://github.com/mpthrees33-clea/Travel-Country-V6',
    isLiveDemo: false,
    sourceUrl: 'https://github.com/mpthrees33-clea/Travel-Country-V6',
  },
];

export default function WorkPage() {
  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <h1 className="glow-text text-gradient" style={{ fontSize: '3.5rem', marginBottom: '1rem', textAlign: 'center' }}>
        Our Work
      </h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '4rem', maxWidth: '600px', margin: '0 auto 4rem' }}>
        A collection of open-source projects, tools, and experiments building the future of Agentic AI.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
        {PROJECTS.map((p) => (
          <a
            key={p.name}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-panel project-card"
            style={{ position: 'relative' }}
          >
            <span
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '0.25rem 0.6rem',
                borderRadius: '999px',
                background: p.isLiveDemo ? 'var(--accent-green)' : 'rgba(255,255,255,0.08)',
                color: p.isLiveDemo ? '#000' : 'var(--text-secondary)',
                border: p.isLiveDemo ? 'none' : '1px solid rgba(255,255,255,0.15)',
              }}
            >
              {p.isLiveDemo ? '● Live Demo' : 'Source'}
            </span>

            <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-green)', marginBottom: '0.5rem', paddingRight: '6rem' }}>
              {p.name}
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', minHeight: '3rem', fontSize: '0.9rem' }}>
              {p.description}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
              <span>{p.language}</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                {p.isLiveDemo ? 'Open app →' : 'View on GitHub →'}
              </span>
            </div>
          </a>
        ))}
      </div>

      <p style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        Source code for every project is available at{' '}
        <a
          href="https://github.com/mpthrees33-clea"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--accent-green)', textDecoration: 'none' }}
        >
          github.com/mpthrees33-clea
        </a>
        .
      </p>
    </div>
  );
}
