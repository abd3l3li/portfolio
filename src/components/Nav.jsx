import { useEffect, useRef, useState } from 'react';
import avatar from '../assets/avatar.webp';

const links = [
  { href: '#home', label: './home.sh' },
  { href: '#projects', label: './projects.sh' },
  { href: '#contact', label: './contact.sh' },
];

export default function Nav() {
  const [cvOpen, setCvOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setCvOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <header className="nav">
      <div className="nav-inner">
        <a href="#home" className="nav-brand" aria-label="Abdelali El Baz — home">
          <img src={avatar} alt="" className="nav-avatar" width="34" height="34" />
          <span className="nav-prompt">root@portfolio</span>
        </a>

        <nav className="nav-links" aria-label="Primary">
          {links.map((l) => (
            <a key={l.href} href={l.href} data-cursor-hover>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav-right">
          <div className="nav-cv" ref={menuRef}>
            <button
              className="pill-btn pill-filled"
              onClick={() => setCvOpen((o) => !o)}
              aria-expanded={cvOpen}
              aria-haspopup="true"
              data-cursor-hover
            >
              Download CV
            </button>
            {cvOpen && (
              <div className="nav-cv-menu" role="menu">
                <a role="menuitem" href="/cv/Abdelali_Elbaz_cv_en.pdf" download data-cursor-hover>
                  English
                </a>
                <a role="menuitem" href="/cv/Abdelali_Elbaz_cv_fr.pdf" download data-cursor-hover>
                  Français
                </a>
              </div>
            )}
          </div>

          <button
            className="nav-burger"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-label="Toggle menu"
            data-cursor-hover
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="nav-mobile" aria-label="Primary mobile">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}>
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
