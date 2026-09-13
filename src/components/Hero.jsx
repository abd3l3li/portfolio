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

function TermLine({ line, showCursor }) {
  return (
    <p className={`term-line term-${line.type}`}>
      {line.type === 'cmd' && <span className="term-prompt">$ </span>}
      {line.text}
      {showCursor && <span className="term-cursor" aria-hidden="true" />}
    </p>
  );
}

export default function Hero() {
  const { displayed, current, done } = useTypedBoot(bootLines);

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
          {displayed.map((l, i) => (
            <TermLine key={i} line={l} showCursor={false} />
          ))}
          {current && <TermLine line={current} showCursor={!done} />}
          {done && (
            <p className="term-line term-out">
              <span className="term-prompt">$ </span>
              <span className="term-cursor blink" aria-hidden="true" />
            </p>
          )}
        </TerminalWindow>
      </div>
    </section>
  );
}
