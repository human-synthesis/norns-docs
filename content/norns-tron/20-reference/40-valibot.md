---
title: valibot
description: Derive a TRON schema spec, or a compiled schema, from a valibot object schema.
---

```ts
import { tronSpecFromValibot, tronSchemaFromValibot } from '@human-synthesis/norns-tron/valibot';
```

| Function | Returns |
|---|---|
| `tronSpecFromValibot(objectSchema, opts?)` | a plain `SchemaSpec` (fields, enums, path) |
| `tronSchemaFromValibot(objectSchema, opts?)` | derive and compile in one step; a `CompiledSchema` |

`DeriveOptions`: `id` (version tag emitted as a `#id` line and used by `createRegistry()`) and `path` (`'$'` or e.g. `'$.data'`).

`v.picklist([...])` and `v.enum(...)` fields become dictionary columns; booleans become 0/1. Call at module scope, never per request. Requires `valibot` (optional peer, `>=0.31`).
