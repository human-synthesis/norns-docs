import { createRequire } from 'node:module';
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-cloudflare';
import tailwindcss from '@tailwindcss/vite';
import { nornsAutoImport } from '@human-synthesis/norns/auto-import';
import { nornsConfig } from '@human-synthesis/norns/config';
import { nornsPreprocess } from '@human-synthesis/norns/preprocess';
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
		// Vite-plugin half of the auto-importer, for standalone .c modules (the
		// Svelte-preprocessor half is in the sveltekit() options below). Project code (facade, repo) is always
		// imported explicitly.
		nornsAutoImport({
			components: ui.components
		}),
		tailwindcss(),
		// SvelteKit 3 takes its config here (svelte.config.js is gone).
		sveltekit(
			nornsConfig({
				preprocess: [
					...nornsPreprocess(),
					nornsAutoImport({
						componentDirs: ['src/lib/components', 'src/routes'],
						components: ui.components
					})
				],
				// Cloudflare Workers with static assets (see wrangler.toml). Every
				// content route is prerendered, so the worker only answers requests
				// that miss the asset directory.
				adapter: adapter(),
				prerender: {
					entries: ['*', '/'],
					// TODO: switch both to 'fail' once the content links have settled;
					// a broken internal link should then break the build.
					handleHttpError: 'warn',
					handleMissingId: 'warn'
				}
			})
		)
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
