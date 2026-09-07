---
title: Deploy
description: The Workers + D1 configuration and the GitHub Actions workflow that applies migrations and deploys on push.
---

`wrangler.toml`:

```toml
name = "norns-demo"
main = ".svelte-kit/cloudflare/_worker.js"
compatibility_date = "2026-04-01"
compatibility_flags = ["nodejs_als", "nodejs_compat"]

routes = [
	{ pattern = "norns-demo.humansynthesis.ai", custom_domain = true }
]

[assets]
directory = ".svelte-kit/cloudflare"
binding = "ASSETS"

[observability]
enabled = true

[[d1_databases]]
binding = "DB"
database_name = "norns-demo-notes"
database_id = "<output of wrangler d1 create>"
migrations_dir = "migrations/notes"
```

`.github/workflows/deploy.yml` runs on every push to `main`: `bun install`, `bun run lint`, `bun run build`, then `wrangler d1 migrations apply norns-demo-notes --remote` and `wrangler deploy` through `cloudflare/wrangler-action`. It needs two repository secrets, `CLOUDFLARE_API_TOKEN` (Workers Scripts: Edit and D1: Edit) and `CLOUDFLARE_ACCOUNT_ID`.

By hand, with a logged-in wrangler:

```sh
bun run db:migrate:remote
bun run deploy           # bun run build && wrangler deploy
```

The general recipe is on the [Cloudflare Workers](/norns/deploy/cloudflare) page.
