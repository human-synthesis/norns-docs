---
title: Cloudflare Workers
description: adapter-cloudflare, the two compatibility flags the runtime needs, static assets, custom domains and a deploy workflow.
---

This is the setup the demo and the docs site use.

## svelte.config.js

```js
import adapter from '@sveltejs/adapter-cloudflare';

export default nornsConfig({
  // ...preprocess
  kit: { adapter: adapter() }
});
```

## wrangler.toml

```toml
name = "my-app"
main = ".svelte-kit/cloudflare/_worker.js"
compatibility_date = "2026-04-01"
compatibility_flags = ["nodejs_als", "nodejs_compat"]

routes = [
  { pattern = "my-app.example.com", custom_domain = true }
]

[assets]
directory = ".svelte-kit/cloudflare"
binding = "ASSETS"

[observability]
enabled = true
```

The two compatibility flags are not optional:

- `nodejs_als` provides `AsyncLocalStorage`, which the [request scope](/norns/runtime/request-scope) is built on.
- `nodejs_compat` is the general Node compatibility layer that Drizzle drivers and many libraries need.

`custom_domain = true` works when the zone is on Cloudflare; Workers issues the certificate. Otherwise point a CNAME at the `workers.dev` hostname.

Add a `[[d1_databases]]` block for a database; see [Cloudflare D1](/norns/data/cloudflare-d1).

## Local development

`vite dev` gets `event.platform` from the adapter's platform proxy, which reads `wrangler.toml` and keeps local state under `.wrangler/state/`. No account is needed to run locally. Add `.wrangler/` to `.gitignore`.

## Deploying

```sh
bun run build && wrangler deploy
```

A GitHub Actions workflow that lints, checks, builds and deploys on every push to `main`:

```yaml
name: Deploy
on:
  push:
    branches: [main]
  workflow_dispatch:
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bun run lint
      - run: bun run check
      - run: bun run build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          packageManager: bun
          command: deploy
```

The token needs *Workers Scripts: Edit* (and *D1: Edit* when the workflow applies migrations). Keep it in repository secrets, never in `wrangler.toml`.

## Prerendering

A fully prerendered app (like this documentation site) still produces a worker, but every page lands in the assets directory and the worker only runs for misses. Set `export prerender := true` in the root `+layout.c`.
