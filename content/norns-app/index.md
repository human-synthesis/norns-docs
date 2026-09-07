---
title: norns-app
description: The starter template — a single page that exercises the whole runtime in about sixty lines you can read in one sitting and rewrite in two.
---

```sh
bun create human-synthesis/norns-app my-app
cd my-app
bun install
bun run dev          # http://localhost:5173
```

`bun create` clones the public repository `human-synthesis/norns-app` and runs `bun install`, which resolves `@human-synthesis/norns`, `norns-core` (through norns), `norns-ui`, `norns-tron`, the SvelteKit and Svelte peers, Tailwind v4 and valibot from npm. You never see the framework's forks.

## Stack

Svelte 5, SvelteKit 2, Pug, Civet, Tailwind CSS v4, Vite, bun, the three Norns packages, and valibot for validation.

## Commands

```sh
bun run dev          # dev server
bun run build        # production build
bun run preview      # preview the build
bun run lint         # norns lint: Civet + Pug pitfall scan
bun run check        # norns check: preprocess + compile every .n / .c through svelte.config.js
bun test             # tests/*.test.js — the feature through the DI container
bun run build        # full Vite build
bunx norns diag src/lib/norns/messages/server/service.c
bun run check:svelte # svelte-check over the .js / .ts / .svelte parts only
```

Run them in that order before calling a change done; `norns check`, not `svelte-check`, is the pass signal for Norns code. The template ships one bun test as the pattern for testing a feature through the container (a small bun plugin in `tests/civet-loader.js` compiles `.c` files on import). The framework's own suites live in the framework repositories.

- [Walkthrough](/norns-app/walkthrough) — every file in the template and what to do next.
