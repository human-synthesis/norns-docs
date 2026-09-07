---
title: Migrations
description: Forward-only SQL files per feature, applied and tracked by the norns CLI.
---

```sh
bun run migrate create notes/add_pinned    # scaffold migrations/notes/<timestamp>_add_pinned.sql
bun run migrate up                         # apply pending migrations
bun run migrate status                     # list applied and pending
```

(`"migrate": "norns migrate"` in `package.json`.)

## Layout

```
<project>/migrations/<feature>/<timestamp>_<slug>.sql
```

Migrations live at the project root, outside `src/`, one folder per feature. They are operational artefacts read by tooling, not application code, and keeping them out of `src/lib` keeps the bundler away from them. Files apply in file-name order across features, so the timestamp prefix gives a global chronology; the feature name breaks ties.

`create` does not check that the feature exists, so nested layouts such as `src/lib/<group>/<feature>/` work too. A typo simply produces an orphan folder under `migrations/` that is easy to spot.

## Tracking

Applied migrations are recorded in a `norns_migrations` table (`id TEXT PRIMARY KEY, applied_at INTEGER`). The id is `<feature>/<file-without-.sql>`. Each migration runs in a transaction together with its tracking insert, so a failing file leaves nothing half-applied.

## Target database

The CLI reads `DATABASE_URL` and supports SQLite only in v1: `file:<path>`, defaulting to `file:./data/app.db`. Any other scheme fails with a message pointing at the alternatives.

The SQLite backend is chosen at runtime: `bun:sqlite` under Bun (no native build, works on Alpine) and `better-sqlite3` under Node, where the consumer app must have it installed.

```sh
DATABASE_URL=file:./data/notes.db bun run migrate up
```

## Cloudflare D1

`norns migrate` does not talk to D1. Point wrangler at the same folder and use its migration commands; see [Cloudflare D1](/norns/data/cloudflare-d1). Postgres and libSQL through the CLI are planned.
