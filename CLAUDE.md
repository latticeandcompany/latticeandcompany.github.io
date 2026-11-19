# CLAUDE.md

The Lattice & Company parent site. An Astro static site served from the bare origin at
`https://latticeandcompany.github.io`. It is one page, a calling card for the company, not a
project showcase: a headline over an interactive pattern, then the footer. Projects appear
only in the footer's link column. There are no sub-pages. Nothing on it is installable.

## Commands

| | |
|---|---|
| `npm run dev` | Dev server on :4321 |
| `npm run build` | Static build to `dist/` |
| `npm run preview` | Serve the built output |

Deploy is automatic: `.github/workflows/astro.yml` builds on push to `mega` — the default
branch — and uploads `dist/` as the Pages artifact.

## Brand

The brand and voice documents were deleted from the `lattice` repo; the rules below are
what survives of them, and color lives in `src/styles/_tokens.scss`. The rules that bite
most often:

- **`Lattice` is never colored.** Only the product word takes an accent — `lattice build`
  in teal, `lattice cloud` in purple, `lattice desktop` in crimson. The mark itself is
  always ink or paper.
- **The parent is neutral.** Lattice & Company gets no accent of its own.
- **60 · 25 · 10 · 5.** The accent is the 5%. This page currently uses none.
- **ArenaSwap keeps its own identity.** Use the wordmark SVGs in
  `public/brand/arenaswap/` — copied from that repo, never redrawn or re-typeset. Two
  files, black and white, because the orange period has to survive the theme swap.
- **Voice: precise, confident, understated.** Vercel/Linear register. No jokes, even
  though CIWAPA is one. No rhythmic triads, no bolded-lead-in bullet lists, no
  unmeasurable comparatives, no invented numbers, and never name a competing task runner.
- Banned words: *local-first*, *zero-config*, *polyglot*, *never prescribe*, *coming
  soon*.

Two deliberate departures from the product site, both parent-specific:

1. **DM Serif Text is the display face here**, not just the lockup face. The brand
   licensed the serif for the parent lockup only; using it for the headline is how this
   property reads as the parent rather than as another product. Product surfaces stay on
   DM Sans.
2. **Every product accent appears on one page.** The product sites carry one each.

## Code style

- **Tabs.** CRLF. Single quotes. Semicolons always.
- **Arrow functions only** — never the `function` keyword.
- **camelCase filenames** (`parentLockup.astro`, `weave.astro`). `src/layouts/*.astro` is
  PascalCase, matching Astro's own convention.
- Default export for a file's primary item, named exports for utilities.
- Prefer `interface` over an object `type` alias.
- **No BEM.** Class names are plain and descriptive: `.weave-still`, `.hero-title`,
  `.latticeco-word`. Not `.hero__title`.

## Styling

Bootstrap 5 first, customized through variable overrides in `src/styles/bootstrap.scss`.
Tailwind v4 fills utility gaps and is prefixed `tw:` so it can't collide with Bootstrap's
class names. Hand-written SCSS last.

- `src/styles/_tokens.scss` — all color. SCSS vars feed Bootstrap; CSS custom properties
  feed everything else and swap on `[data-bs-theme]`.
- `--accent` is the display shade (a product word at 24px+). `--accent-link` is the
  link-safe shade. They differ because `-500` on paper is ~3.1:1, which clears AA for
  large text but fails the 4.5:1 body threshold a 16px link has to meet. An element sets
  one of `.accent-build` / `.accent-cloud` / `.accent-desktop` / `.accent-arena` once.
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
  The server renders the resting pattern as an SVG tile; the canvas only takes over when
  JavaScript runs and reduced motion is off.
- No reassuring or explanatory copy: no captions telling the reader what the pattern is,
  no "check the URL", no hints. The headline and the footer carry the page.
- Don't add a second lockup to the hero. `Lattice & Company` is in the navbar directly
  above.
- Don't bring back sub-pages or a project section. Projects live in the footer's
  link column.
- Don't add the `Built with ❤️ by Lattice` endorsement footer. That line is for
  donated projects signalling lineage upstream; the parent using it on itself is
  backwards.

## Layout

```
src/
	globals.scss              tokens, fonts, icons, shared classes, the hero
	styles/                   _tokens _fonts _paths bootstrap.scss tailwind.css
	layouts/Layout.astro      shell: SEO, theme script, navbar, footer, pattern band
	lib/
		base.ts                 withBase() for root-relative paths
		weave.ts                the rosette-chain weave and the pointer's pull
		rosette.ts              the mark's dimensions, shared by every drawing of it
		nav.ts                  the org URL
		projects.ts             every project's name and link, for the footer
	components/
		rosette.astro           the mark; 8 rotations on screen
		parentLockup.astro      rosette + `Lattice & Company` in DM Serif Text
		hero.astro              the headline, its rotating last word, and the weave
		weave.astro             the pattern: SVG tile at rest, canvas when live
		navbar.astro footer.astro patternBand.astro themeControl.tsx
	pages/                    index 404
```

`src/lib/weave.ts` is the hero's pattern: a chain of half-rosettes. Each cell holds four
strands of the mark 45° apart, alternate cells sit a half-step (22.5°) round, and the grid is
tight enough that every cell's tips weave into its neighbours'. Over-and-under comes from
drawing each strand in two halves over a surface-coloured casing, all first halves then all
second halves, ordered by cell class and strand rather than position. That ordering is what
lets one repeating SVG `<pattern>` tile (the resting state, and all that reduced motion or no
JavaScript gets) and the full canvas cross every pair of strands identically. Near the
pointer, half-rosettes spin up to 45° (their own symmetry) and darken. On load the weave
unwinds into place outward from the headline's corner; the head script sets
`data-weave="pending"` so the static tile never paints first. The canvas runs only while
something is still moving. Line widths and resting opacity are duplicated in
`globals.scss` for the SVG and commented as such.

The headline's last word plays through `audiences` in `hero.astro` once and lands on
`everyone`. It's CSS only and sits on its own line in a single grid cell, so nothing above it
reflows. Screen readers get only the landing word. Under reduced motion it shows `everyone`
from the start.

## Related repos

- `latticeandcompany/lattice` — Lattice Build. Site at `/lattice`, brand docs in
  `marketing/`. Its footer links back here.
- `hiteacheryouare/arenaswap` — ArenaSwap. Site at `hiteacheryouare.github.io/arenaswap`.
  Its footer links back here.
