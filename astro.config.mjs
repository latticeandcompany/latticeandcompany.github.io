import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	// GitHub Pages org user-site: served from the bare origin, so `base` is root.
	// The $base in src/styles/_paths.scss must stay in sync, because stylesheets
	// can't read import.meta.env.BASE_URL.
	site: 'https://latticeandcompany.github.io',
	base: '/',
	integrations: [react(), sitemap()],
	vite: {
		plugins: [tailwindcss()],
	},
});
