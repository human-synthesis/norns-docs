---
title: File extensions
description: What .n, .c and .civet mean, and why the framework did not invent a new component extension.
---

| Extension | Meaning |
|---|---|
| `.n` | A Svelte component with a Pug template and a Civet script. The [norns-core preprocessor](/norns-core) defaults `<script>` to `lang="civet"` and `<template>` to `lang="pug"`, wraps top-level Pug in a template block automatically, and rewrites `+if` / `+snippet` chains and class shorthand. |
| `.c` | A Civet module. Recognised everywhere `.civet` is; both compile through the same Civet compiler. |
| `.civet` | The same as `.c`, for people who prefer the long name. |

`.svelte`, `.js` and `.ts` keep working everywhere. Mixing is normal: write routes, components and feature code in `.n` / `.c`, and drop to `.js` for dense library-style code that Civet's parser dislikes (see [Civet pitfalls](/norns/pitfalls/civet)).

## Why not a `.norns` component extension

Norns keeps `.svelte` semantics and simply adds `.n` to SvelteKit's `extensions`. A truly new component format would mean forking the Svelte compiler and parser, which is high cost for no gain. `.n` and `.c` are aliases layered on `extensions` and `kit.moduleExtensions`.

## Seeing what a file compiles to

```sh
bunx norns diag src/lib/norns/notes/server/service.c    # the JS Civet emits
bunx norns diag --template src/routes/+page.n            # the Svelte source after Pug / Civet / auto-imports
```

See [check and diag](/norns/cli/check-and-diag).
