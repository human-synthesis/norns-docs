---
title: Turn it on app-wide
description: Pass tronSerializer() to boot(); every route() response becomes content-negotiated and nothing breaks for JSON clients.
---

```civet
// src/hooks.server.c
import { tronSerializer } from '@human-synthesis/norns-tron/server'

features := import.meta.glob './lib/norns/*/server/module.c', { eager: true }
app := await boot { features, serializer: tronSerializer() }

{ handle, handleError } := app
export { handle, handleError }
```

From now on every `route()` response is content-negotiated: clients that send `Accept: application/tron` get TRON, everyone else (curl, third parties, existing code) keeps getting JSON. Remove the `serializer` line to roll the whole thing back.

## Per-route control

```civet
export GET  := route serializer: tronSerializer({ schema: noteWire }), handler: ...
export POST := route serializer: null, handler: ...   // force plain JSON
```

A per-route serializer overrides the app-wide one; `null` forces JSON.

## Request bodies

The serializer's `parseBody` hook lets `route()` read TRON request bodies (`Content-Type: application/tron`) in addition to JSON and form bodies, so the same endpoint accepts all three:

```civet
export POST := route
	input: createNoteSchema
	handler: async ({ input, container }) =>
		id: await notes(container).create input
```

## What goes on the wire

- Content type `application/tron`, never `application/json`: a TRON body may carry a declaration preamble that is not valid JSON.
- Payloads under about 1 KB are emitted as plain JSON automatically (and still decoded transparently); below that size TRON's fixed costs do not pay off.
- The serializer's options are the `EncodeOptions` (`minBytes`, `dict`, `table`, `force`) plus `schema` for [schema mode](/norns-tron/guide/schema-mode).
