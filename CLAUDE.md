# CLAUDE.md

The Lattice & Company parent site. An Astro static site served from the bare origin at
`https://latticeandcompany.github.io`. Its job is to point at three projects — Lattice
Build, Lattice Cloud, and ArenaSwap — not to sell anything. Nothing on it is installable.

## Commands

| | |
|---|---|
| `npm run dev` | Dev server on :4321 |
| `npm run build` | Static build to `dist/` |
| `npm run preview` | Serve the built output |

Deploy is automatic: `.github/workflows/astro.yml` builds on push to `main` and uploads
`dist/` as the Pages artifact.

## Brand

The source of truth is `lattice/marketing/BRAND.md` and `MESSAGING.md` in the sibling
`lattice` repo. Read them before touching copy or color. The rules that bite most often:

- **`Lattice` is never colored.** Only the product word takes an accent — `lattice build`
  in teal, `lattice cloud` in purple. The mark itself is always ink or paper.
- **The parent is neutral.** Lattice & Company gets no accent of its own.
- **60 · 25 · 10 · 5.** The accent is the 5%. Two accent uses per product row: the product
  word and the primary link. Nothing else takes color.
- **ArenaSwap keeps its own identity.** Use the wordmark SVGs in
  `public/brand/arenaswap/` — copied from that repo, never redrawn or re-typeset. Two
  files, black and white, because the orange period has to survive the theme swap. Its
  page sets headlines in DM Sans Bold, its own face, not the parent's serif.
- **Voice: precise, confident, understated.** Vercel/Linear register. `BRAND.md` §4 has
  the full list of banned constructions — no rhythmic triads, no bolded-lead-in bullet
  lists, no unmeasurable comparatives, no invented numbers, and never name a competing
  task runner.
- Banned words: *local-first*, *zero-config*, *polyglot*, *never prescribe*, *coming
  soon*.

Two deliberate departures from the product site, both parent-specific:

1. **DM Serif Text is the display face here**, not just the lockup face. `BRAND.md` §3
   says "no third typeface" and §6 licenses the serif for the parent lockup only; using
   it for headings is how this property reads as the parent rather than as a fourth
   product. Product surfaces stay on DM Sans.
2. **Three accents appear on one page.** The product sites carry one each.

## Code style

- **Tabs.** CRLF. Single quotes. Semicolons always.
- **Arrow functions only** — never the `function` keyword.
- **camelCase filenames** (`productRow.astro`, `loom.astro`). `src/layouts/*.astro` is
  PascalCase, matching Astro's own convention.
- Default export for a file's primary item, named exports for utilities.
- Prefer `interface` over an object `type` alias.
- **No BEM.** Class names are plain and descriptive: `.warp-thread`, `.strand`,
  `.loom-link`, `.row-heading`. Not `.warp__thread`.

## Styling

Bootstrap 5 first, customized through variable overrides in `src/styles/bootstrap.scss`.
Tailwind v4 fills utility gaps and is prefixed `tw:` so it can't collide with Bootstrap's
class names. Hand-written SCSS last.

- `src/styles/_tokens.scss` — all color. SCSS vars feed Bootstrap; CSS custom properties
  feed everything else and swap on `[data-bs-theme]`.
- `--accent` is the display shade (a product word at 24px+). `--accent-link` is the
  link-safe shade. They differ because `-500` on paper is ~3.1:1, which clears AA for
  large text but fails the 4.5:1 body threshold a 16px link has to meet. A row or page
  sets one of `.accent-build` / `.accent-cloud` / `.accent-arena` once.
- Fonts are self-hosted woff2 in `public/fonts`, declared in `src/styles/_fonts.scss`.
  **No CDN font links.** Bootstrap Icons loads as a font through SASS.
- `src/styles/_paths.scss` holds the asset prefix, because Sass can't read
  `import.meta.env.BASE_URL`. It must match `base` in `astro.config.mjs`.

## Things not to do

- No pill-shaped tag chips.
- No eyebrow text — a small label above a heading.
- Don't reach for the 16-rotation rosette on screen. It collapses into a solid disc under
  about 200px; it only has room in the pattern band.
- Don't write copy about the brand architecture. Nobody visiting cares which project is
  donated or what typeface is shared — say what the software does for them instead.
- No marquees.
- Don't hide the hero under `prefers-reduced-motion`, at any width, or without JavaScript.
  It carries the only place the three accents appear together, so every one of those cases
  renders the resolved picture — `threadPath(i, 1)`, the same function the animation
  ends on. Never describe the resting state twice.
- Don't add a second lockup to the hero. `Lattice & Company` is in the navbar directly
  above, and the mark is the animation's first frame.
- Don't add the `Built with ❤️ by Lattice` endorsement footer. `BRAND.md` §7 is for
  donated projects signalling lineage upstream; the parent using it on itself is
  backwards.

## Layout

```
src/
	globals.scss              tokens, fonts, icons, shared classes, animations
	styles/                   _tokens _fonts _paths bootstrap.scss tailwind.css
	layouts/Layout.astro      shell: SEO, theme script, navbar, footer, pattern band
	lib/
		base.ts                 withBase() for root-relative paths
		loom.ts                 hero geometry, shared by the render and the animation
		nav.ts                  nav links, org URL
		products.ts             the three projects — canonical copy lives here
	components/
		rosette.tsx             the mark; 8 rotations on screen, 16 in the pattern band
		parentLockup.astro      rosette + `Lattice & Company` in DM Serif Text
		productLockup.astro     product mark + wordmark, or ArenaSwap's own
		loom.astro              the hero: the mark unravelling into the 3 products
		hero.astro productRow.astro projects.astro orgBand.astro
		productHeader.astro footer.astro patternBand.astro navbar.tsx themeControl.tsx
	pages/                    index build cloud arenaswap 404
```

`src/lib/products.ts` is the single source for product copy, links, accents and
lockups — the landing rows, the product pages, the nav and the footer all read it.

`src/lib/loom.ts` is the hero's geometry: eight polylines of equal point count, so the mark can
be paid out into a braid that runs on to three product lines. One progress value per thread
drives all of it — `settledAt` and `bendAt` read off the same value, which is why a crossing
resolves and a lockup arrives in step with the thread rather than on their own timers, and why
nothing in the sequence has a seam. It is pure — no DOM, no clock — and both `loom.astro`'s
server render and its animation call the same `threadPath`. The panel is a fixed 11:5 box so one user unit is the same length across and
down; that is what keeps the mark round without measuring anything. Two constants are
duplicated on purpose and are commented as such: the resting stroke weights (`globals.scss`
and the script) and `--loom-anchor` (set inline from `ANCHOR_X`). The picture is narrower than
its panel — the lockups' width depends on type, not on the geometry — so `.loom` measures the
leftover and splits it to sit centered, which is why `.hero` clips overflow.

## Related repos

- `latticeandcompany/lattice` — Lattice Build. Site at `/lattice`, brand docs in
  `marketing/`. Its footer links back here.
- `hiteacheryouare/arenaswap` — ArenaSwap. Site at `hiteacheryouare.github.io/arenaswap`.
  Its footer links back here.
