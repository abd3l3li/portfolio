import { useEffect, useState } from 'react';

const GITHUB_USER = 'abd3l3li';
// Forked repos that are real team projects worth showing.
// Add more repo names here as needed. Other forks are filtered out.
const WHITELISTED_FORKS = ['Webserv'];
const HIDDEN_REPOS = new Set([
  'abd3l3li',
  'web-lab',
  'AppGallery',
  'weatherApp',
  'cpp-shots',
  'mini-http-server',
  'webserv-parsing',
  'Shell',
  'zero_day',
]);

const FALLBACK_DESCRIPTIONS = {
  Webserv:
    'HTTP/1.1-compliant web server built from scratch in C++ with a team of three: request parsing, method routing, CGI execution, and non-blocking I/O with poll(). Validated against real browser and curl clients.',
  chaosshell:
    'POSIX-compliant Unix shell in C: pipes, redirections, heredoc, signals, and 10+ builtins. Zero memory leaks confirmed with Valgrind.',
  paradox3d:
    'First-person 3D raycasting engine in C using MiniLibX: DDA raycasting, texture mapping, collision detection, and stable frame pacing.',
  Inception:
    'Containerized multi-service stack: Nginx, WordPress, and MariaDB with custom Dockerfiles, TLS, and persistent volumes.',
  minitalk: 'UNIX signal-based communication program between two processes.',
  push_swap: 'Sorting algorithm challenge using a constrained instruction set and two stacks.',
  AppGallery: 'React gallery of historic Islamic battles with descriptions, dates, and locations.',
  'mini-http-server': 'C++ HTTP/1.1 server built while completing the CodeCrafters HTTP server challenge.',
  'mini-server': 'Tiny TCP chat server in C using select() to handle multiple clients.',
  portfolio: 'React and Vite portfolio site for Abdelali El Baz.',
  'webserv-parsing': 'C++ Webserv practice module for parsing server blocks and matching request locations.',
};

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
          .filter(
            (r) =>
              !HIDDEN_REPOS.has(r.name) &&
              !r.name.toLowerCase().startsWith('alx-') &&
              (!r.fork || WHITELISTED_FORKS.includes(r.name)),
          )
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
          Couldn't reach GitHub just now. See the full list at{' '}
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
              <p className="project-desc">
                {repo.description || FALLBACK_DESCRIPTIONS[repo.name] || 'Peer-reviewed project at 1337, see the repo for details.'}
              </p>
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
