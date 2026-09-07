import { createRequire } from 'node:module';
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { nornsAutoImport } from '@human-synthesis/norns/auto-import';
import { nornsCivetPlugin, pugTailwindExtract } from '@human-synthesis/norns/vite';
import { presetUI } from '@human-synthesis/norns-ui/auto-import';

const ui = presetUI();

// Installed package versions, surfaced on the landing page and the versions
// table at build time. Read through Node resolution so workspace symlinks and
// hoisted installs both work; a package that cannot be resolved shows '—'.
const require = createRequire(import.meta.url);
const versions = {};
for (const pkg of [
	'@human-synthesis/norns',
	'@human-synthesis/norns-core',
	'@human-synthesis/norns-ui',
	'@human-synthesis/norns-tron'
]) {
	try {
		versions[pkg] = require(`${pkg}/package.json`).version;
	} catch {
		versions[pkg] = null;
	}
}

export default defineConfig({
	plugins: [
		// Scan .n files for Pug class shorthand and emit a sidecar file
		// (node_modules/.cache/norns/tailwind-pug-classes.html) that app.css
		// references via `@source`. Closes Tailwind v4's extractor blind spot on
		// `.cls.cls(` chains.
		pugTailwindExtract(),
		nornsCivetPlugin(),
		// Vite-plugin half of the auto-importer (the Svelte-preprocessor half is
		// registered in svelte.config.js). Project code (facade, repo) is always
		// imported explicitly.
		nornsAutoImport({
			components: ui.components
		}),
		tailwindcss(),
		sveltekit()
	],
	// Accept reverse-proxied Host headers in dev (norns lint: vite/allowed-hosts).
	server: { allowedHosts: true },
	define: { __NORNS_VERSIONS__: JSON.stringify(versions) },
	// In workspace mode @human-synthesis/norns is a symlink into the kit fork,
	// which has its own @sveltejs/kit under pnpm. Bundling norns through Vite
	// dedupes its kit imports onto the app's single copy.
	resolve: { dedupe: ['@sveltejs/kit'] },
	ssr: { noExternal: ['@human-synthesis/norns'] }
});
