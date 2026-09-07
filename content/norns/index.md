---
title: norns
description: SvelteKit preconfigured for Pug + Civet, plus a small opinionated runtime — feature folders, a DI container, page and route wrappers with valibot validation, migrations, and the norns CLI.
---

`@human-synthesis/norns` is the umbrella package. Install it and you get four things:

- **The build pipeline.** `nornsConfig()` for `svelte.config.js`, `nornsCivetPlugin()` for Vite, and the `.n` / `.c` file extensions wired into SvelteKit. The preprocessor that turns Pug + Civet into Svelte lives in [norns-core](/norns-core) and is pulled in as a dependency.
- **Auto-imports.** Framework helpers, your own components, UI-library presets and (opt-in) your project's named exports resolve by name, so a `.n` file that uses `<Btn>` or `onMount` needs no import line.
- **The runtime.** `boot()`, a DI container with per-request scopes, `page.load` / `page.actions` / `route()` wrappers that validate input with valibot, and database driver factories.
- **The CLI.** `norns dev | build | preview | migrate | lint | check | diag`.

## Where to start

- New project: [Install](/norns/getting-started/install), or just run `bun create human-synthesis/norns-app my-app`.
- Existing SvelteKit project: [svelte.config.js](/norns/config/svelte-config) and the [Vite plugin](/norns/config/vite-plugin).
- Building features: [Feature folders](/norns/getting-started/feature-folders), then the [Runtime](/norns/runtime) section.
- Something does not compile: [Pitfalls](/norns/pitfalls) and [check and diag](/norns/cli/check-and-diag).

## Relationship to SvelteKit and Svelte

Norns does not replace the framework you run. `@sveltejs/kit` and `svelte` are peer dependencies that come from the official packages; SvelteKit routing, `load`, form actions, adapters and everything else in the [SvelteKit docs](https://svelte.dev/docs/kit) apply unchanged. Norns adds file extensions, a preprocessor, an auto-importer and an opinionated server layer on top.

The `human-synthesis/norns` repository is a fork of `sveltejs/kit` only so that `packages/norns` can be developed next to an untouched `packages/kit`. Nothing in the upstream packages is modified; see the [fork and release policy](/reference/upstream-policy).
