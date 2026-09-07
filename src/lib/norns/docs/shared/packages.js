/* global __NORNS_VERSIONS__ */

// The packages this site documents, in the order they appear in the header
// and on the landing page. `id` doubles as the URL prefix (`/norns-ui/...`)
// and as the folder name under `content/`.
//
// Versions come from the installed packages at build time (vite.config.js
// injects `__NORNS_VERSIONS__`); packages that are not on npm carry a fixed
// string or none.

const V = typeof __NORNS_VERSIONS__ !== 'undefined' ? __NORNS_VERSIONS__ : {};

export const PACKAGES = [
	{
		id: 'norns',
		name: 'norns',
		npm: '@human-synthesis/norns',
		version: V['@human-synthesis/norns'] ?? null,
		kind: 'npm',
		description:
			'SvelteKit preconfigured for Pug + Civet, plus the runtime: feature folders, DI container, page/route wrappers with valibot validation, migrations and the norns CLI.',
		repo: 'https://github.com/human-synthesis/norns'
	},
	{
		id: 'norns-core',
		name: 'norns-core',
		npm: '@human-synthesis/norns-core',
		version: V['@human-synthesis/norns-core'] ?? null,
		kind: 'npm',
		description:
			'The Svelte preprocessor behind `.n` files: Civet scripts, Pug templates, `+if` / `+snippet` chains, class-shorthand rewriting and source-mapped errors.',
		repo: 'https://github.com/human-synthesis/norns-core'
	},
	{
		id: 'norns-ui',
		name: 'norns-ui',
		npm: '@human-synthesis/norns-ui',
		version: V['@human-synthesis/norns-ui'] ?? null,
		kind: 'npm',
		description:
			'Component library written in Pug + Civet on Tailwind v4: forms, overlays, display and composite components, headless behaviors, theming tokens and motion.',
		repo: 'https://github.com/human-synthesis/norns-ui'
	},
	{
		id: 'norns-tron',
		name: 'norns-tron',
		npm: '@human-synthesis/norns-tron',
		version: V['@human-synthesis/norns-tron'] ?? null,
		kind: 'npm',
		description:
			'TRON wire format for route() responses and LLM-facing output: fewer tokens than JSON, content-negotiated, with schema mode derived from valibot.',
		repo: 'https://github.com/human-synthesis/norns-tron'
	},
	{
		id: 'norns-app',
		name: 'norns-app',
		npm: null,
		version: null,
		kind: 'github',
		description: 'The starter template: one page, one feature folder, everything wired. `bun create human-synthesis/norns-app`.',
		repo: 'https://github.com/human-synthesis/norns-app'
	},
	{
		id: 'norns-demo',
		name: 'norns-demo',
		npm: null,
		version: null,
		kind: 'github',
		description:
			'Reference app: notes on Cloudflare D1, tic-tac-toe with stores, the norns-ui showcase, each example also written in vanilla SvelteKit for comparison.',
		repo: 'https://github.com/human-synthesis/norns-demo'
	},
	{
		id: 'reference',
		name: 'Reference',
		npm: null,
		version: null,
		kind: 'site',
		description: 'Cross-cutting pages: version matrix, glossary, the fork and release policy, and how this site is built.',
		repo: 'https://github.com/human-synthesis/norns-docs'
	}
];
