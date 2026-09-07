---
title: Cloudflare D1
description: Bind a per-request D1 handle from event.platform.env and apply migrations with wrangler.
---

On Workers the database binding arrives **per request** on `event.platform.env`, not at boot. Bind it transiently and read it from the request scope; the repo and service become transient too, because they close over that request's handle:

```civet
import { getScope } from '@human-synthesis/norns/server'
import type { Container } from '@human-synthesis/norns/server'
import { NotesRepo } from './repo'
import { NotesService } from './service'

export default (app: Container) =>
	app.bind 'db', =>
		db := getScope()?.event?.platform?.env?.DB
		throw new Error 'D1 binding `DB` is missing — check [[d1_databases]] in wrangler.toml' unless db
		db
	app.bind 'notes.repo', (c: Container) => new NotesRepo c.resolve('db')
	app.bind 'notes.service', (c: Container) => new NotesService c.resolve('notes.repo')
```

The repo then uses the D1 API directly; every call is async on Workers:

```civet
export class NotesRepo
	db: D1Database
	constructor(@db: D1Database)

	async list(): Promise<Note[]>
		result := await @db.prepare('SELECT * FROM notes ORDER BY updated_at DESC').all()
		result.results as Note[]

	async create(title: string, body: string): Promise<number>
		now := Date.now()
		stmt := @db.prepare('INSERT INTO notes (title, body, created_at, updated_at) VALUES (?, ?, ?, ?)').bind(title, body, now, now)
		result := await stmt.run()
		Number result.meta.last_row_id
```

## wrangler.toml

```toml
[[d1_databases]]
binding = "DB"
database_name = "my-app-notes"
database_id = "<output of wrangler d1 create>"
migrations_dir = "migrations/notes"
```

Under `vite dev`, `@sveltejs/adapter-cloudflare`'s platform proxy reads this file and serves a local D1 from `.wrangler/state/`, so `event.platform.env.DB` resolves without a Cloudflare account.

## Migrations

`norns migrate` is SQLite-only; use wrangler against the same SQL files:

```sh
wrangler d1 migrations apply my-app-notes --local    # dev database under .wrangler/state/
wrangler d1 migrations apply my-app-notes --remote   # production
```

The demo wires these as `bun run db:migrate` and `bun run db:migrate:remote`, and its deploy workflow applies remote migrations before deploying the worker. `norns migrate create` still scaffolds the files.
