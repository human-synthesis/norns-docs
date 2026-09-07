---
title: norns-core
description: The Svelte preprocessor behind .n files — Civet scripts, Pug templates, +if and +snippet chains, class-shorthand rewriting and source-mapped errors.
---

`@human-synthesis/norns-core` is the syntax layer. It is a dependency of [norns](/norns) and most apps never install it directly; the pages here explain what happens to a `.n` file between your editor and the Svelte compiler.

## What it does

- `.n` files default `<script>` to `lang="civet"` and `<template>` to `lang="pug"`. Write neither attribute and it just works.
- Top-level Pug is wrapped in `<template lang="pug">` automatically, and a trailing `<script>` or `<style>` without its closing tag is closed for you.
- `<script lang="civet">` blocks compile to JavaScript through [@danielx/civet](https://civet.dev) before svelte-preprocess sees them.
- `+if` / `+elseif` / `+else` chains and `+snippet('name', args)` blocks are rewritten to Svelte block syntax.
- Pug class shorthand is rewritten so Tailwind variants (`.hover:bg-x`), slashes (`.bg-white/40`) and fractions (`.gap-2.5`) work without escaping.
- Pug and Civet errors are mapped back to `file:line:column` in the source you wrote.

## Standalone use

```sh
bun add -D @human-synthesis/norns-core svelte
```

```js
// svelte.config.js
import { nornsPreprocess } from '@human-synthesis/norns-core/preprocess';

export default {
  extensions: ['.svelte', '.n'],
  preprocess: nornsPreprocess()
};
```

That gives you `.n` components in any Svelte 5 project. Auto-imports, the `.c` module extension and the runtime live in [norns](/norns), which needs Vite plugin hooks the preprocessor does not have.

The repository `human-synthesis/norns-core` is a fork of `sveltejs/svelte` in which `packages/svelte` is an untouched mirror and `packages/norns-core` is this package. See the [fork policy](/reference/upstream-policy).
