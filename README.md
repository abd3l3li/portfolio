# Abdelali El Baz: Portfolio

React + Vite, single-page, black/purple terminal-hacking aesthetic.

## Run locally

```
npm install
npm run dev
```

## Build for production

```
npm run build
```

Output goes to `dist/`.

## Notes

- Projects section fetches public repos live from `https://api.github.com/users/abd3l3li/repos`.
  Fork filtering lives in `src/components/Projects.jsx`. Edit `WHITELISTED_FORKS` to add more
  team-project forks beyond `Webserv`.
- CVs live in `public/cv/`. Replace those files directly to update the downloadable PDFs.
- Avatar is `src/assets/avatar.webp`. Swap the file, keeping the same name, to change the hero/nav image.
- Full design/feature spec: see `SKILL.md` in the project root (add it there if not already present).
