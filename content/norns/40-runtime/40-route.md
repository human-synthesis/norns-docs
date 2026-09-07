---
title: route()
description: Wrap a +server.c handler with body parsing, validation, container resolution and JSON (or TRON) serialization.
---

```civet
import { messages } from '$lib/norns/messages/server/public'
import { sendMessageSchema } from '$lib/norns/messages/shared/schema'

export GET := route
	handler: ({ container }) =>
		data: messages(container).list()

export POST := route
	input: sendMessageSchema
	handler: ({ input, container }) =>
		messages(container).create input
		{ ok: true }
```

`route` is auto-imported in server files.

## What the wrapper does, in order

1. **Body parsing**, only when `input` is set. `application/json` is parsed as JSON; `application/x-www-form-urlencoded` and `multipart/form-data` are read with `formData()` and flattened. An app-wide or per-route serializer can claim other content types first through its `parseBody` hook (this is how TRON request bodies work). Empty or unsupported bodies become `null`, and the schema decides whether `null` is acceptable.
2. **Body validation** against `input`. Failure throws `error(400, { message, issues })`.
3. **Query validation** against `query`, over `Object.fromEntries(url.searchParams)`. Same 400 on failure.
4. **Handler call** with `{ input, query, container, event, user }`.
5. **Serialization.** A `Response` returned by the handler passes through untouched. Otherwise the serializer (per-route, else app-wide) may turn the value into a `Response`; if it declines, the value is sent as JSON with `json()`. `undefined` becomes `null`.

## Options

| Option | Notes |
|---|---|
| `input` | body schema: a valibot schema, any Standard Schema, or a function |
| `query` | query-string schema, same forms |
| `serializer` | per-route serializer; `null` forces plain JSON even when an app-wide one is set |
| `handler` | required |

For non-success outcomes throw `error(...)` or `redirect(...)` inside the handler; SvelteKit surfaces them.

## Returning something that is not JSON

Return a `Response` yourself:

```civet
export GET := route
	handler: ({ container }) =>
		new Response(docs(container).sitemap(), { headers: { 'content-type': 'application/xml' } })
```

## Calling it from the browser

Plain `fetch` works. With [norns-tron](/norns-tron) installed, `api.get('/api/messages')` sends `Accept: application/tron` and decodes either format transparently.
