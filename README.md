# Abdelali El Baz: Personal Portfolio

This is my personal portfolio website. It presents my systems and
full-stack projects, technical background, contact details, and downloadable CVs.
It is a custom React + Vite site, not a general-purpose template.

The interface uses a terminal-inspired visual style because my work focuses on C,
C++, Linux, Docker, React, and TypeScript.

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
- CVs live in `public/cv/`. Replace those files directly to update the downloadable PDFs.
- Avatar is `src/assets/avatar.webp`. Swap the file, keeping the same name, to change the hero/nav image.
