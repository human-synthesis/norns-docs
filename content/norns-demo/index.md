---
title: norns-demo
description: The reference app — notes on Cloudflare D1, tic-tac-toe with stores, the norns-ui showcase, each example also written in vanilla SvelteKit for comparison.
---

```sh
git clone https://github.com/human-synthesis/norns-demo
cd norns-demo
bun install
bun run db:migrate   # apply migrations to the local D1 under .wrangler/state/
bun run dev          # http://localhost:5173
```

The dev server gets `event.platform.env.DB` from adapter-cloudflare's platform proxy, which reads `wrangler.toml` and keeps a local D1 under `.wrangler/state/`. No Cloudflare account is needed to run locally. Production runs at `norns-demo.humansynthesis.ai`.

## What it shows

- [Notes](/norns-demo/notes) — D1, dynamic routes, form actions, valibot, error pages, SSR `load`, the DI container, the facade boundary, the page wrappers, and a TRON endpoint in schema mode.
- [Tic-tac-toe](/norns-demo/tic-tac-toe) — multi-component composition, `$props` with defaults, Svelte stores, `$state` / `$effect`, scoped CSS and a small AI heuristic.
- [UI showcase](/norns-demo/ui-showcase) — every norns-ui component with live props.
- [Deploy](/norns-demo/deploy) — the Workers + D1 setup and the GitHub Actions workflow.

Each example exists twice, once in Norns (`src/routes/examples/norns/`, `src/lib/norns/`) and once in vanilla SvelteKit (`src/routes/examples/svelte/`, `src/lib/svelte/`), so the two can be compared line for line. Do not "convert" the vanilla side; it is the control group.

## Commands

```sh
bun run lint             # norns lint
bun run check            # norns check — every .n / .c / .svelte through svelte.config.js
bun run check:svelte     # svelte-check over the vanilla .svelte / .ts side
bun run build
bun run migrate create notes/<name>      # scaffold a migration (norns CLI)
bun run db:migrate / db:migrate:remote   # apply with wrangler, local / production
```

The repo has no test suite of its own; it is exercised through the dev server and the build.
