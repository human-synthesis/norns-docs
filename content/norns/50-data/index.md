---
title: Data
description: Migrations, database driver factories, and the Cloudflare D1 pattern.
---

- [Migrations](/norns/data/migrations) — `norns migrate` and the `migrations/<feature>/` layout.
- [Drivers](/norns/data/drivers) — `betterSqlite`, `d1`, `libsql`, `postgres` and `withTransaction`.
- [Cloudflare D1](/norns/data/cloudflare-d1) — binding a per-request D1 handle and applying migrations with wrangler.

Norns takes no position on how you query. The reference apps use hand-written SQL on the raw driver; the driver factories give you a Drizzle instance if you want one.
