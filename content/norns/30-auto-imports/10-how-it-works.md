---
title: How it works
description: nornsAutoImport() is a Svelte preprocessor and a Vite plugin in one object, with four resolvers that run in priority order.
---

`nornsAutoImport()` returns one object that is both a Svelte preprocessor (for `.n` / `.svelte` files) and a Vite plugin (for standalone `.c` / `.civet` modules). Register the same instance in both places, because Svelte's compiler ignores the Vite hooks and Vite ignores the Svelte hooks:

```js
// svelte.config.js
import { nornsConfig } from '@human-synthesis/norns/config';
import { nornsPreprocess } from '@human-synthesis/norns/preprocess';
import { nornsAutoImport } from '@human-synthesis/norns/auto-import';

export default nornsConfig({
  preprocess: [
    ...nornsPreprocess(),
    nornsAutoImport({
      componentDirs: ['src/lib/components', 'src/routes']
    })
  ]
});
```

```js
// vite.config.js
import { nornsCivetPlugin } from '@human-synthesis/norns/vite';
import { nornsAutoImport } from '@human-synthesis/norns/auto-import';

export default {
  plugins: [
    nornsCivetPlugin(),
    nornsAutoImport(),
    sveltekit()
  ]
};
```

Keep the two option objects identical.

## The four resolvers

| Layer | Resolves | Examples |
|---|---|---|
| Helpers | Hard-coded module-name lists, optionally path-gated | `onMount` from `svelte`; `redirect` and `error` from `@sveltejs/kit`; `page` from `$app/state` in non-server files; `page`, `route`, `boot`, `Container` from `@human-synthesis/norns/server` in server files |
| Components (dir scan) | Capitalised basenames found in `componentDirs` | `<Card>` → `$lib/components/Card.svelte`; `<Game>` → `./Game.n` when the file sits next to the route |
| Components (preset map) | A bare-specifier `Record<name, importPath>` supplied by a UI library | `<Btn>` → `'@human-synthesis/norns-ui/components/Btn.n'`, used verbatim |
| Project utilities (opt-in) | Named exports (`export const X`, `export X := ...`, `export { a, b }`) found in files matching `exportGlobs` | `notes` from `$lib/norns/notes/server/public` when `exportGlobs: ['src/lib/**/public.c']` |

Resolution order is **helpers, then component dir, then component preset, then exports**. The first match wins and later matches are shadowed silently. That is deliberate: drop `src/lib/components/Btn.n` into your project and it replaces the library's `Btn` without any configuration.

`exportGlobs` is **off by default**: project code (facades, schemas, services, stores) is imported explicitly unless you opt in. The recommended opt-in is barrel scope only, `['src/lib/**/public.c']`, so a feature's internals never leak through auto-import. Server-path files (`/server/`, `*.server.*`, `+server.*`, `hooks.server.*`) are never auto-imported into client files, and a name exported from two files in the same scope is logged and excluded. Neither the starter nor the demo enables it.

The default helper modules are `svelte`, `svelte/store`, `@sveltejs/kit`, `$app/state` (non-server paths only) and `@human-synthesis/norns/server` (server paths only). A name you have already imported or declared in the file is never injected again, so explicit imports remain safe.

## What gets emitted

- Files inside `$lib` get `$lib/...` paths. Files outside `$lib` get a path relative to the importer.
- Project-utility paths are stripped of their extension (`'$lib/notes/server/public'`, not `.../public.c`); the configured `extensions` resolve the rest.
- A `.n` file that references a known component from markup but has no `<script>` block gets one prepended.
- Runes (`$state`, `$derived`, `$effect`, `$props`) are Svelte compiler globals. The plugin never touches them.

## Scope

In `.n` and `.svelte` files the plugin scans the markup and the `<script>` body. In `.c` modules it scans the JavaScript that `nornsCivetPlugin` produced, so only helpers apply: server code does not import components. The `match` regex on a helper entry gates it by file path, which is how `page` resolves to `$app/state` in a component and to the runtime's page wrapper in `+page.server.c`.
