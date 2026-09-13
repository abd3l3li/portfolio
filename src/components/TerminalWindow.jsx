export default function TerminalWindow({ title = 'terminal', children, className = '' }) {
  return (
    <div className={`terminal-window ${className}`}>
      <div className="terminal-titlebar">
        <span className="dot dot-red" />
        <span className="dot dot-amber" />
        <span className="dot dot-green" />
        <span className="terminal-title">{title}</span>
      </div>
      <div className="terminal-body">{children}</div>
    </div>
  );
}
