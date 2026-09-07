---
title: Schema mode
description: When both ends know the shape, derive the wire schema from the valibot schema you already have and skip shape detection entirely.
---

Both ends of an internal endpoint already know the row shape from the feature contract, so nothing descriptive needs to travel. Derive the wire schema from the valibot schema in `shared/schema.c`:

```civet
// src/lib/norns/notes/shared/schema.c
import * as v from 'valibot'
import { tronSchemaFromValibot } from '@human-synthesis/norns-tron/valibot'

export noteSchema := v.object
	id: v.number()
	title: v.string()
	status: v.picklist ['draft', 'published']

export noteWire := tronSchemaFromValibot noteSchema, { id: 'notes.v1', path: '$.data' }
```

Server:

```civet
export GET := route
	serializer: tronSerializer({ schema: noteWire })
	handler: async ({ container }) =>
		data: await notes(container).list()
```

Client: the same `noteWire` decodes it, or `api.get('/api/notes')` when the client only ever sees this shape.

## Rules

- `picklist` / `enum` fields become dictionary columns (integers on the wire); booleans become 0/1.
- **Compile once at module scope, never per request.** `tronSchemaFromValibot` (and `defineSchema`) resolve field order, enum tables and the row path, and compile the row constructor. Doing that per request is the difference between winning and losing on small payloads.
- `path` says where the row array lives: `'$'` for the root, `'$.data'` for an envelope.
- The `#notes.v1` tag (`id`) is emitted as a header line and makes version mismatches fail loudly instead of misdecoding. A client that consumes several shapes uses `createRegistry()`, registers each schema, and calls `registry.decode(text)`, which peeks the tag and picks the schema.

## Without valibot

`defineSchema({ id, fields, enums, path })` builds the same compiled schema by hand; see the [core reference](/norns-tron/reference/core).
