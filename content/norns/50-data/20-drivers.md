---
title: Drivers
description: Driver factories that assemble a Drizzle instance for SQLite, D1, libSQL or Postgres, with a portable transaction helper.
---

The factories live in `@human-synthesis/norns/server`. Drizzle and the driver packages are **user-installed**; the framework only provides the assembly recipe and imports each driver lazily, so an app that never calls `d1()` does not need `drizzle-orm/d1` installed.

```civet
// module.c — Node with better-sqlite3 in development
import { betterSqlite } from '@human-synthesis/norns/server'

export default (app: Container) =>
	db := await betterSqlite 'data/app.db', { pragma: ['journal_mode = WAL'] }
	app.single 'db', => db
```

| Factory | Backend | Options |
|---|---|---|
| `betterSqlite(path, opts?)` | `bun:sqlite` + `drizzle-orm/bun-sqlite` under Bun, `better-sqlite3` + `drizzle-orm/better-sqlite3` under Node. The name is kept for compatibility; the runtime picks the backend. | `connection` (passed to the constructor), `pragma` (array of PRAGMA statements run after open), `drizzle` |
| `d1(binding, opts?)` | `drizzle-orm/d1` over a D1 binding from `event.platform.env` | `drizzle` |
| `libsql(url, opts?)` | `@libsql/client` + `drizzle-orm/libsql` (Turso, sqld) | `client`, `drizzle` |
| `postgres(url, opts?)` | `pg` Pool + `drizzle-orm/node-postgres` | `pool`, `drizzle` |
| `withTransaction(db, fn)` | `db.transaction(fn)`, uniform across drivers | |

All factories are async; `await` them in `module.c` before binding.

## Without Drizzle

Nothing requires an ORM. The demo's notes feature opens the raw D1 API and writes SQL by hand in `repo.c`; the starter keeps an in-memory array. Bind whatever handle you like as `db` and keep every `new Database(...)` in exactly one module so the rest of the app resolves it from the container.
