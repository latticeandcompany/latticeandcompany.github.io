import { withBase } from './base';

export interface NavLink {
	name: string;
	href: string;
	external?: boolean;
}

export const orgUrl = 'https://github.com/latticeandcompany';

// "Lattice Build" rather than "Lattice": MESSAGING.md reserves the longer name for
// contexts where the product sits beside its siblings, and every page here lists all
// three.
export const navLinks: NavLink[] = [
	{ name: 'Lattice Build', href: withBase('/build') },
	{ name: 'Lattice Cloud', href: withBase('/cloud') },
	{ name: 'ArenaSwap', href: withBase('/arenaswap') },
	{ name: 'GitHub', href: orgUrl, external: true },
];
