---
title: Vite plugin
description: nornsCivetPlugin() compiles Civet modules and teaches Vite the Norns extensions; pugTailwindExtract() closes Tailwind's blind spot on Pug class chains.
---

```js
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { nornsCivetPlugin, pugTailwindExtract } from '@human-synthesis/norns/vite';
import { nornsAutoImport } from '@human-synthesis/norns/auto-import';
import { presetUI } from '@human-synthesis/norns-ui/auto-import';

const ui = presetUI();

export default defineConfig({
  plugins: [
    pugTailwindExtract(),
    nornsCivetPlugin(),
    nornsAutoImport({ components: ui.components }),
    tailwindcss(),
    sveltekit()
  ],
  server: { allowedHosts: true }
});
```

## `nornsCivetPlugin()`

Runs with `enforce: 'pre'` and does four things:

- **Compiles `.c` and `.civet` files** through `@danielx/civet` with source maps, so `+page.server.c`, `hooks.server.c`, `+server.c` and any module you write in Civet load like `.js`.
- **Registers the extensions** `.svelte`, `.n`, `.civet`, `.c` with Vite's resolver, after Vite's defaults, so `import X from './Foo'` finds `Foo.n` or `Foo.c`.
- **Resolves bare sibling imports.** `import { play } from 'store'` (no `./`) resolves to a sibling `store.c` / `store.n` / `store.js` when one exists next to the importer. Package imports are untouched because they contain a slash or a scope; imports from inside `node_modules` are never rewritten.
- **Workspace mode.** When the framework packages resolve to symlinks outside `node_modules` (the framework's own development workspace), they are excluded from dependency pre-bundling and lifted out of the watch ignore list so edits to the framework source hot-reload. Published installs never enter this branch.

## `pugTailwindExtract(options?)`

Tailwind v4's scanner extracts class candidates from string contexts. Pug's chained shorthand, `.flex.items-center.p-4`, reads as one dotted token and is dropped, and `.grid.gap-6(class="...")` loses the class before the paren. The page renders with the classes in the HTML but no CSS for them.

The plugin walks every `.n` file, extracts each shorthand class with `extractPugClasses` from norns-core, and writes the deduplicated set into a sidecar HTML file that Tailwind can scan. It re-runs on every `.n` change in dev.

| Option | Default | Notes |
|---|---|---|
| `root` | `'src'` | directory to scan |
| `ext` | `'.n'` | file extension |
| `outFile` | `'node_modules/.cache/norns/tailwind-pug-classes.html'` | sidecar path, relative to the project root, taken verbatim |

Reference the sidecar from your CSS, with a path relative to the CSS file:

```css
@import 'tailwindcss';
@source "./**/*.n";
@source "../node_modules/.cache/norns/tailwind-pug-classes.html";
```

The first `@source` is the raw scan, which handles chains that end at whitespace; the sidecar covers the rest.

## Vite options worth setting

- `server.allowedHosts: true` (or an explicit list) when the dev server sits behind any reverse proxy. `norns lint` warns when it is missing.
- In the framework workspace only: `resolve.dedupe: ['@sveltejs/kit']` and `ssr.noExternal: ['@human-synthesis/norns']`, so the symlinked norns package uses the app's single copy of SvelteKit instead of the fork's. A normal install does not need either.
