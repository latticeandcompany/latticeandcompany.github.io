# latticeandcompany.github.io

The Lattice &amp; Company parent site — the front door for Lattice Build, Lattice Cloud,
and ArenaSwap.

**https://latticeandcompany.github.io**

[![Astro](https://img.shields.io/badge/Astro-7-BC52EE?logo=astro&logoColor=white)](https://astro.build)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com)
[![Sass](https://img.shields.io/badge/Sass-CC6699?logo=sass&logoColor=white)](https://sass-lang.com)

## Quick start

```sh
npm install
npm run dev
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on `localhost:4321` |
| `npm run build` | Static build to `dist/` |
| `npm run preview` | Serve the built output |

## Stack

Astro with React islands, Bootstrap 5 customized through variable overrides, Tailwind v4
for utility gaps (prefixed `tw:`), and SCSS. Fonts are self-hosted; there are no external
requests at runtime.

## Deploying

Pushing to `main` runs `.github/workflows/astro.yml`, which builds the site and publishes
`dist/` as the GitHub Pages artifact. No manual step.

## Projects

| | |
| --- | --- |
| [Lattice Build](https://latticeandcompany.github.io/lattice/) | A high-performance, local toolchain for managing monorepos |
| Lattice Cloud | A shared cache for Lattice builds. In development |
| [ArenaSwap](https://hiteacheryouare.github.io/arenaswap/) | Switches your browser tab to the most exciting live game |

## Conventions

See [`CLAUDE.md`](../CLAUDE.md) for code style and the brand rules this site has to
follow. The brand source of truth is `marketing/BRAND.md` in the
[lattice](https://github.com/latticeandcompany/lattice) repo.
