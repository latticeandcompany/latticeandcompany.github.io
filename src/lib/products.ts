import { withBase } from './base';

/**
 * The three projects, in the order they appear everywhere on the site.
 *
 * Copy here is canonical. The Lattice tagline is fixed verbatim by
 * lattice/marketing/MESSAGING.md and must not be reworded; the ArenaSwap copy tracks
 * arenaswap/apps/extension/marketing/short_summary_chrome.txt.
 */
export interface ProductLink {
	name: string;
	href: string;
	/** The one accent-colored link per product. Everything else is quiet. */
	primary?: boolean;
	external?: boolean;
}

export interface Product {
	id: 'build' | 'cloud' | 'arenaswap';
	/** Full name in prose. */
	name: string;
	/** Route on this site. */
	href: string;
	/** Sets --accent / --accent-link. See _tokens.scss. */
	accentClass: string;
	/**
	 * Lattice products render as the rosette plus `lattice` plus a colored product word.
	 * ArenaSwap uses its own wordmark art, which is never redrawn here.
	 */
	wordmark: { kind: 'lattice'; product: string } | { kind: 'own'; name: string };
	heading: string;
	blurb: string;
	links: ProductLink[];
}

export const products: Product[] = [
	{
		id: 'build',
		name: 'Lattice Build',
		href: withBase('/build'),
		accentClass: 'accent-build',
		wordmark: { kind: 'lattice', product: 'build' },
		heading: 'A high-performance, local toolchain for managing monorepos.',
		blurb:
			'One command builds and tests every project in your repo, whatever language it is written in. Lattice works out the order, runs what it can in parallel, and skips anything whose inputs have not changed. It also pins the compiler and tool versions, so a fresh clone builds the same as your laptop and the same as CI.',
		links: [
			{
				name: 'Docs and install',
				href: 'https://latticeandcompany.github.io/lattice/',
				primary: true,
				external: true,
			},
			{ name: 'GitHub', href: 'https://github.com/latticeandcompany/lattice', external: true },
		],
	},
	{
		id: 'cloud',
		name: 'Lattice Cloud',
		href: withBase('/cloud'),
		accentClass: 'accent-cloud',
		wordmark: { kind: 'lattice', product: 'cloud' },
		heading: 'A shared cache for Lattice builds.',
		blurb:
			'Right now everyone on your team rebuilds the same code on their own machine, and CI rebuilds it again from scratch. Cloud will let one build serve all of them. Still being built.',
		links: [{ name: 'What it does', href: withBase('/cloud'), primary: true }],
	},
	{
		id: 'arenaswap',
		name: 'ArenaSwap',
		href: withBase('/arenaswap'),
		accentClass: 'accent-arena',
		wordmark: { kind: 'own', name: 'ArenaSwap' },
		heading: 'Never miss the moment.',
		blurb:
			'ArenaSwap tracks every live game across 30+ leagues, scores how good each one is right now, and flips your browser to the best of them, rechecking as often as every 6 seconds. Free, open source, and it works with whatever you already pay for.',
		links: [
			{
				name: 'Get the extension',
				href: 'https://hiteacheryouare.github.io/arenaswap/',
				primary: true,
				external: true,
			},
			{ name: 'GitHub', href: 'https://github.com/hiteacheryouare/arenaswap', external: true },
		],
	},
];

export const productById = (id: Product['id']) => products.find((p) => p.id === id)!;

export interface StoreLink {
	name: string;
	href: string;
}

/** Extension store listings, used on the ArenaSwap page. */
export const arenaswapStores: StoreLink[] = [
	{
		name: 'Chrome Web Store',
		href: 'https://chromewebstore.google.com/detail/arenaswap/gibojibgihombdmmfnhnimajppamfeee',
	},
	{ name: 'Firefox Add-ons', href: 'https://addons.mozilla.org/addon/arenaswap/' },
	{
		name: 'Edge Add-ons',
		href: 'https://microsoftedge.microsoft.com/addons/detail/arenaswap/oeballpnidkinkcbjokogdgjckdjeeba',
	},
];
