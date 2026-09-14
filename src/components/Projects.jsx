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
  Inception:
    'Containerized multi-service stack: Nginx, WordPress, and MariaDB with custom Dockerfiles, TLS, and persistent volumes.',
  minitalk: 'Client-server text exchange in C using SIGUSR1 and SIGUSR2 to transmit characters as binary signals.',
  push_swap: 'Integer sorting program that uses two stacks and a limited instruction set to minimize operations.',
  AppGallery: 'React gallery of historic Islamic battles with descriptions, dates, and locations.',
  'mini-http-server': 'C++ HTTP/1.1 server built while completing the CodeCrafters HTTP server challenge.',
  'mini-server': 'Tiny TCP chat server in C using select() to handle multiple clients.',
  portfolio: 'React and Vite portfolio site for Abdelali El Baz.',
  'webserv-parsing': 'C++ Webserv practice module for parsing server blocks and matching request locations.',
  chaosshell: 'Minimal Unix shell in C with command execution, processes, file descriptors, and pipes.',
  paradox3d: 'C raycasting renderer inspired by early FPS games, with textured walls, movement, and collision detection.',
  'micro-shell': 'Minimal Unix shell in C with command execution, pipes, separators, and the built-in cd command.',
  Born2beroot: 'Linux server administration project covering a virtual machine, users, SSH, firewall rules, and monitoring.',
  'dining-philosophers': 'Concurrency simulation of philosophers sharing forks, using threads and mutexes to manage contention.',
  so_long: '2D tile-based game in C with map parsing, player movement, collectibles, and a MiniLibX window.',
  get_next_line: 'C function that reads and returns one line at a time from a file descriptor.',
  ft_printf: 'C implementation of formatted output based on the standard printf function.',
  libft: 'Reusable C library containing standard string, memory, character, and linked-list functions.',
  'CPP-modules': 'C++ exercises covering classes, inheritance, polymorphism, templates, exceptions, and standard containers.',
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
                {FALLBACK_DESCRIPTIONS[repo.name] || repo.description || 'Peer-reviewed project at 1337, see the repo for details.'}
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
