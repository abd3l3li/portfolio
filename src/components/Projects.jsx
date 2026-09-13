import { useEffect, useState } from 'react';

const GITHUB_USER = 'abd3l3li';
// Forked repos that are real team projects worth showing.
// Add more repo names here as needed — everything else forked is filtered out.
const WHITELISTED_FORKS = ['Webserv'];

export default function Projects() {
  const [repos, setRepos] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`)
      .then((res) => {
        if (!res.ok) throw new Error('request failed');
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const visible = data
          .filter((r) => !r.fork || WHITELISTED_FORKS.includes(r.name))
          .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));
        setRepos(visible);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="projects" className="section">
      <p className="section-tag">ls -la projects/</p>
      <h2 className="section-title">Selected work</h2>

      {error && (
        <p className="projects-status">
          Couldn't reach GitHub just now — see the full list at{' '}
          <a
            href={`https://github.com/${GITHUB_USER}`}
            target="_blank"
            rel="noreferrer"
            data-cursor-hover
          >
            github.com/{GITHUB_USER}
          </a>
          .
        </p>
      )}

      {!repos && !error && <p className="projects-status">fetching repositories…</p>}

      {repos && repos.length === 0 && (
        <p className="projects-status">No public repositories yet.</p>
      )}

      {repos && repos.length > 0 && (
        <div className="project-grid">
          {repos.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="project-card"
              data-cursor-hover
            >
              <div className="project-card-head">
                <span className="project-name">./{repo.name}</span>
                {repo.fork && <span className="project-badge">fork</span>}
              </div>
              <p className="project-desc">{repo.description || 'No description provided.'}</p>
              <div className="project-meta">
                {repo.language && <span>{repo.language}</span>}
                <span>★ {repo.stargazers_count}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
