// Root-relative links and public assets go through here. This site serves from the bare
// origin, so the prefix is empty today, but routing every path through one helper keeps
// it correct if the base ever moves. Vite inlines import.meta.env.BASE_URL at build time,
// so this works in .astro templates and client-side React alike.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefix a root-relative path (leading slash) with the configured site base. */
export const withBase = (path: string) => `${base}${path}`;
