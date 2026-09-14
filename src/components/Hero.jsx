import { useState } from 'react';
import { useTypedBoot } from '../hooks/useTypedBoot';
import TerminalWindow from './TerminalWindow';
import avatar from '../assets/avatar.webp';

const bootLines = [
  { type: 'cmd', text: 'whoami' },
  { type: 'out', text: 'Software engineering student — systems & full-stack' },
  { type: 'cmd', text: 'cat mission.txt' },
  {
    type: 'out',
    text: 'Building production-grade systems in C/C++ and shipping full-stack apps in React/TypeScript at 1337 (42 Network).',
  },
  { type: 'cmd', text: 'echo $STATUS' },
  { type: 'out', text: 'OPEN_TO_INTERNSHIPS=true' },
];

const MAX_INPUT_LENGTH = 64;

const SAFE_COMMANDS = {
  help: () =>
    'Available commands: help, whoami, about, skills, projects, contact, cv en, cv fr, clear, echo <text>',
  whoami: () => 'root — software engineering student / full-stack builder',
  about: () =>
    'I build reliable systems and polished interfaces: C/C++, shell tooling, React, TypeScript, and shipping product-grade experiences.',
  skills: () =>
    'C/C++, Bash, Git, Linux, Docker, React, TypeScript, Node.js, REST APIs, systems thinking, debugging, performance.',
  projects: () => 'Open the project cards below to review recent work. This terminal is read-only and never navigates the page.',
  contact: () =>
    'email: elbazness2@gmail.com | github: github.com/abd3l3li | linkedin: linkedin.com/in/abdelalielbaz',
  'cv en': () => 'CV (EN): /cv/Abdelali_Elbaz_cv_en.pdf',
  'cv fr': () => 'CV (FR): /cv/Abdelali_Elbaz_cv_fr.pdf',
};

function TermLine({ line, showCursor }) {
  return (
    <p className={`term-line term-${line.type}`}>
      {line.type === 'cmd' && <span className="term-prompt">$ </span>}
      {line.text}
      {showCursor && <span className="term-cursor" aria-hidden="true" />}
    </p>
  );
}

function sanitizeCommand(raw) {
  // Security boundary: allow only explicit safe characters and a tiny command allow-list.
  // No eval, no dangerouslySetInnerHTML, no user-controlled navigation, no shell metacharacters.
  if (typeof raw !== 'string') return null;

  const value = raw.trim();
  if (!value) return null;
  if (value.length > MAX_INPUT_LENGTH) return null;
  if (!/^[a-zA-Z0-9 _./:-]+$/.test(value)) return null;
  return value;
}

function parseCommand(raw) {
  const safeInput = sanitizeCommand(raw);
  if (!safeInput) {
    return {
      type: 'error',
      text: 'error: unsupported command. type "help" to see the allow-list.',
    };
  }

  const [command, ...restParts] = safeInput.split(/\s+/);
  const normalized = command.toLowerCase();
  const rest = restParts.join(' ');

  if (normalized === 'clear') {
    return { type: 'clear' };
  }

  if (normalized === 'echo') {
    return { type: 'output', text: rest || '' };
  }

  if (normalized === 'cv') {
    const target = rest.toLowerCase();
    if (target === 'en') return { type: 'output', text: SAFE_COMMANDS['cv en']() };
    if (target === 'fr') return { type: 'output', text: SAFE_COMMANDS['cv fr']() };
    return { type: 'error', text: 'usage: cv en | cv fr' };
  }

  if (!Object.prototype.hasOwnProperty.call(SAFE_COMMANDS, normalized)) {
    return {
      type: 'error',
      text: 'error: command not allowed. type "help" to view the safe command list.',
    };
  }

  return { type: 'output', text: SAFE_COMMANDS[normalized](rest) };
}

export default function Hero() {
  const { displayed, current, done } = useTypedBoot(bootLines);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const value = input.trim();
    if (!value) return;

    const parsed = parseCommand(value);
    setHistory((prev) => {
      const next = [...prev, { type: 'cmd', text: value }];
      if (parsed.type === 'clear') return [];
      if (parsed.type === 'output') next.push({ type: 'out', text: parsed.text });
      if (parsed.type === 'error') next.push({ type: 'out', text: parsed.text });
      return next;
    });

    setInput('');
  }

  return (
    <section id="home" className="hero section">
      <div className="hero-copy">
        <p className="hero-tag">root access granted</p>
        <h1 className="hero-title">
          I build the parts most portfolios skip: the shell, the server, the socket.
        </h1>
        <p className="hero-sub">
          Software engineering student at 1337 (42 Network), based in Marrakech —
          currently shipping systems in C/C++ and interfaces in React, one
          peer-reviewed project at a time.
        </p>
        <div className="hero-actions">
          <a href="#projects" className="pill-btn pill-filled" data-cursor-hover>
            View projects
          </a>
          <a href="#contact" className="pill-btn pill-outline" data-cursor-hover>
            Get in touch
          </a>
        </div>
      </div>

      <div className="hero-visual">
        <div className="avatar-badge" tabIndex={0} data-cursor-hover>
          <img src={avatar} alt="Abdelali El Baz" />
        </div>

        <TerminalWindow title="boot.sh — 80x24" className="hero-terminal">
          <div className="terminal-scroll" aria-live="polite">
            {displayed.map((l, i) => (
              <TermLine key={`boot-${i}`} line={l} showCursor={false} />
            ))}
            {current && <TermLine line={current} showCursor={!done} />}

            {history.map((entry, index) => (
              <p key={`history-${index}`} className={`term-line term-${entry.type}`}>
                {entry.type === 'cmd' && <span className="term-prompt">$ </span>}
                {entry.text}
              </p>
            ))}

            <form onSubmit={handleSubmit} className="terminal-form">
              <label className="term-prompt" htmlFor="terminal-input">
                ${' '}
              </label>
              <input
                id="terminal-input"
                className="terminal-input"
                type="text"
                value={input}
                maxLength={MAX_INPUT_LENGTH}
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="none"
                autoFocus={done}
                disabled={!done}
                onChange={(event) => setInput(event.target.value)}
                placeholder={done ? 'type a command' : 'booting...'}
                aria-label="Terminal command input"
              />
            </form>

            {!done && !history.length && (
              <p className="term-line term-out">
                <span className="term-prompt">$ </span>
                <span className="term-cursor blink" aria-hidden="true" />
              </p>
            )}
          </div>
        </TerminalWindow>
      </div>
    </section>
  );
}
