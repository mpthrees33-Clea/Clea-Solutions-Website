import Link from 'next/link';

type Repo = {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  language: string;
};

async function getRepos() {
  try {
    const res = await fetch('https://api.github.com/users/mpthrees33-Clea/repos', {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!res.ok) {
      return [];
    }
    const repos: Repo[] = await res.json();
    return repos;
  } catch (error) {
    return [];
  }
}

export default async function WorkPage() {
  const repos = await getRepos();

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <h1 className="glow-text text-gradient" style={{ fontSize: '3.5rem', marginBottom: '1rem', textAlign: 'center' }}>
        Our Work
      </h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '4rem', maxWidth: '600px', margin: '0 auto 4rem' }}>
        A collection of open-source projects, tools, and experiments building the future of Agentic AI.
      </p>

      {repos.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No projects found or unable to load from GitHub.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
          {repos.map(repo => (
            <a key={repo.id} href={repo.html_url} target="_blank" rel="noopener noreferrer" className="glass-panel project-card">
              <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-green)', marginBottom: '0.5rem' }}>{repo.name}</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', minHeight: '3rem', fontSize: '0.9rem' }}>
                {repo.description || "No description provided."}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                <span>{repo.language || 'Mixed'}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  ★ {repo.stargazers_count}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
