# Portfolio Build Spec — Abdelali El Baz

Single source of truth for building this portfolio in VS Code with GitHub Copilot.
If scope changes mid-build, update this file so Copilot and the Claude chat stay in sync.

## Project Goal
A single-page personal portfolio for Abdelali El Baz — software engineering student (1337/42 Network) —
fusing a Linux/hacking-terminal interaction style with a premium, modern visual polish. Fast, light, no bloat.

## Tech Stack
- React 18 + Vite
- Plain CSS / CSS Modules (no Tailwind/UI kit required — keep bundle small; component-scoped CSS is fine)
- No backend — fully static, deployed on Vercel

## Design Fusion (from the two references provided)
- **Structure & interactivity** (Reference A — terminal portfolio): nav styled as file paths
  (`./home.exe`, `./projects.sh`, `./contact.sh`), a terminal window component with colored
  window-control dots, typed command-line boot sequence, file-card grid for content blocks.
- **Color & typography polish** (Reference B — Aarslan S. portfolio): bold, large display
  headline; pill-shaped CTA buttons; soft radial glow backdrop; clean dark theme; generous spacing.
- **Fusion rule**: keep Reference A's terminal/file-path interaction language, but reskin its
  green-on-black into this project's black + neon purple palette, and borrow Reference B's
  headline weight, pill buttons, and glow treatment for the hero.

## Color Tokens
```css
--bg: #05030a;            /* near-black base */
--bg-alt: #0b0714;        /* secondary panel bg */
--purple-primary: #a855f7;
--purple-glow: #7c3aed;
--accent: #22d3ee;        /* cyan — sparse use: success states, secondary prompt text */
--text-primary: #f5f3ff;
--text-dim: #9ca3af;
--dot-red: #ff5f56;
--dot-amber: #ffbd2e;
--dot-green: #27c93f;
```

## Typography
- Monospace (e.g. JetBrains Mono / Fira Code) — terminal text, nav file-paths, prompts, code-styled labels
- Bold sans-serif (e.g. Space Grotesk / Inter) — hero headline, section titles

## Layout — Single Page, Scroll Sections

### Nav bar (fixed top)
- Left: avatar logo, **small (~32–36px), static, no glow/shine, no hover effect**
- Nav links styled as file paths: `./home.sh` `./projects.sh` `./contact.sh`
- Right: pill-shaped "Download CV" button → opens EN/FR choice (see Contact section)

### Hero Section
- Terminal window component: red/amber/green dots, title bar (`terminal.app` style)
- Boot-sequence typing animation on page load, e.g.:
  ```
  $ whoami
  Software Engineering Student — Systems & Full-Stack
  $ cat mission.txt
  [short line paraphrased from CV summary]
  $ echo "STATUS: OPEN TO INTERNSHIPS"
  ```
- Large avatar (uploaded purple neon avatar) prominent in hero — **this one CAN glow/pulse
  idle, and on hover does a glitch/circuit-scan reveal effect** (CSS clip-path or SVG
  filter based — no extra image asset needed, pure CSS/SVG)
- Bold headline (Reference B style), purple gradient on key word(s)
- Scroll cue: glowing chevron / `scroll_down()` label

### Projects Section
- Header styled as a command, e.g. `$ ls -la projects/`
- Cards grid, each styled like Reference A's file cards: icon, `./repo-name.ext`, short
  description, tech tag(s)
- **Data source: GitHub REST API, fetched client-side at runtime** (not hardcoded):
  `GET https://api.github.com/users/abd3l3li/repos?per_page=100&sort=updated`
- Filter logic:
  ```js
  const WHITELISTED_FORKS = ["Webserv"]; // add more real team-project forks here
  const visibleRepos = repos.filter(r => !r.fork || WHITELISTED_FORKS.includes(r.name));
  ```
- Card hover: scan-line / glitch effect
- Click → opens `repo.html_url` in new tab

### Contact Section
- Header styled as a command, e.g. `$ cat contact.sh`
- Show: email (elbazness2@gmail.com), LinkedIn, GitHub — **no phone number**
- CV download: EN/FR toggle, serving:
  - `/public/cv/Abdelali_Elbaz_cv_en.pdf`
  - `/public/cv/Abdelali_Elbaz_cv_fr.pdf`

### Global Effects
- Custom cursor: terminal-styled (blinking block or crosshair)
- Background: low-opacity animated circuit-grid or matrix-rain, canvas-based (cheap), not
  DOM-heavy
- All motion respects `prefers-reduced-motion`

## Performance Requirements
- Target Lighthouse Performance 90+, Best Practices 95+
- Lazy-load below-the-fold content
- No heavy animation/UI libraries — native CSS + a single lightweight canvas for background/cursor
- Compress avatar to WebP

## Assets to add to the project
- `/public/cv/Abdelali_Elbaz_cv_en.pdf`
- `/public/cv/Abdelali_Elbaz_cv_fr.pdf`
- `/src/assets/avatar-purple.png` (the uploaded neon avatar)

## Out of Scope
- No backend/server, no CMS — static site only

## Deployment Target
Vercel (free tier). Domain to be claimed later via GitHub Student Developer Pack (Namecheap offer) — covered separately once the build is live.
