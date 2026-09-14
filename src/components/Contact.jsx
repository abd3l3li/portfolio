const links = [
  { label: 'email', value: 'elbazness2@gmail.com', href: 'mailto:elbazness2@gmail.com' },
  { label: 'github', value: 'github.com/abd3l3li', href: 'https://github.com/abd3l3li' },
  {
    label: 'linkedin',
    value: 'linkedin.com/in/abdelalielbaz',
    href: 'https://linkedin.com/in/abdelalielbaz',
  },
];

export default function Contact() {
  return (
    <section id="contact" className="section">
      <p className="section-tag">cat contact.sh</p>
      <h2 className="section-title">Let's talk</h2>
      <p className="contact-sub">
        Open to internships and collaborations involving systems or full-stack development.
      </p>

      <div className="contact-list">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="contact-row"
            data-cursor-hover
          >
            <span className="contact-label">{l.label}</span>
            <span className="contact-value">{l.value}</span>
          </a>
        ))}
      </div>

      <div className="contact-cv">
        <span className="contact-label">resume</span>
        <div className="cv-links">
          <a
            href="/cv/Abdelali_Elbaz_cv_en.pdf"
            download
            className="pill-btn pill-outline"
            data-cursor-hover
          >
            Download CV (EN)
          </a>
          <a
            href="/cv/Abdelali_Elbaz_cv_fr.pdf"
            download
            className="pill-btn pill-outline"
            data-cursor-hover
          >
            Télécharger CV (FR)
          </a>
        </div>
      </div>
    </section>
  );
}
