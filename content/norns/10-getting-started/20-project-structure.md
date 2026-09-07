---
title: Project structure
description: The layout of a Norns app and which SvelteKit files can be written in Civet.
---

A Norns app is an ordinary SvelteKit source tree. There is no generated tree and no spec directory.

```
src/
  hooks.server.c              boots the runtime, eager-loads feature modules
  app.html, app.css           html shell, global styles
  routes/                     SvelteKit routes
    +layout.n, +layout.c
    +page.n, +page.server.c
    api/<name>/+server.c
  lib/
    components/               components auto-imported by name (<Header>, <Card>, ...)
    norns/
      <feature>/              feature folders, see next page
        server/{module,repo,service,public}.c
        shared/schema.c
migrations/
  <feature>/<timestamp>_<slug>.sql
svelte.config.js, vite.config.js
wrangler.toml                 optional, Cloudflare deploys
```

## File types

| Extension | What it is | Compiled by |
|---|---|---|
| `.n` | A Svelte component whose template is Pug and whose `<script>` is Civet. No `lang` attributes needed. | norns-core preprocessor |
| `.c` | A Civet module. `.civet` is the same thing with a longer name. | `nornsCivetPlugin()` |
| `.svelte`, `.js`, `.ts` | Plain Svelte and JavaScript, still allowed anywhere. | Vite / Svelte as usual |

## SvelteKit special files in Civet

`nornsConfig()` sets `kit.moduleExtensions` to `['.js', '.ts', '.c', '.civet']`, so every SvelteKit module file has a Civet spelling: `+page.server.c`, `+layout.c`, `+server.c`, `+page.c`. Components use `extensions: ['.svelte', '.n']`, so `+page.n`, `+layout.n` and `+error.n` work.

Hooks are the one exception SvelteKit does not discover through `moduleExtensions`. `nornsConfig()` looks for `src/hooks.server.c` / `.civet` (and the client and universal counterparts) and sets `kit.files.hooks` explicitly when one exists. Name the file that way and nothing else is required.

## Where feature code goes

The starter and the demo keep features under `src/lib/norns/<feature>/` and boot them with:

```civet
features := import.meta.glob './lib/norns/*/server/module.c', { eager: true }
```

The glob in `hooks.server.c` is what decides; `src/lib/<feature>/` works just as well if you change it. Keep migrations outside `src/` so the bundler never sees them.
