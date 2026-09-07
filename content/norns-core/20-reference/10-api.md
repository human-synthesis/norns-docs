---
title: API
description: nornsPreprocess(options) and the four helper functions exported from @human-synthesis/norns-core/preprocess.
---

```js
import {
  nornsPreprocess,
  transformIfChains,
  transformSnippets,
  rewritePugClasses,
  extractPugClasses
} from '@human-synthesis/norns-core/preprocess';
```

## `nornsPreprocess(options?)`

Returns an array of three Svelte preprocessors, in order:

1. `norns-default-langs` — the `.n` rewrites and defaults.
2. `norns-civet-script` — compiles `<script lang="civet">` (or `cv`) blocks.
3. svelte-preprocess, configured with `pug: {}` and TypeScript compiler options `ignoreDeprecations: '6.0'`, `verbatimModuleSyntax: true`, `isolatedModules: true`, wrapped so Pug errors come back mapped.

`options` is spread into the svelte-preprocess configuration, so any svelte-preprocess option can be added or overridden. Use the spread form when composing with other preprocessors:

```js
preprocess: [...nornsPreprocess(), nornsAutoImport({ ... })]
```

`@human-synthesis/norns/preprocess` re-exports `nornsPreprocess`.

## Helpers

| Function | Input → output |
|---|---|
| `transformIfChains(content)` | rewrites `+if` / `+elseif` / `+else` chains to `\| {#if}` text lines, recursively |
| `transformSnippets(content)` | rewrites `+snippet('name', args)` blocks to `\| {#snippet name(args)}`, recursively |
| `rewritePugClasses(content)` | routes classes with `:`, `/` or fractional suffixes into `(class="...")`, skipping script and style blocks |
| `extractPugClasses(content)` | returns a `Set<string>` of shorthand and `class=` attribute classes, for Tailwind |

All four are pure string functions; `pugTailwindExtract()` in norns is built on the last one.
