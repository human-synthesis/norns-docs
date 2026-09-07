---
title: Validation
description: valibot at the edge — how page.actions and route() validate input, and what the error shapes look like.
---

Schemas live in the feature's `shared/schema.c` so the server wrapper and the client form share one definition:

```civet
import * as v from 'valibot'

export createNoteSchema := v.object
	title: v.pipe v.string(), v.trim(), v.minLength(1, 'title is required')
	body: v.optional v.string(), ''

export type CreateNoteInput = v.InferOutput<typeof createNoteSchema>
```

`valibot` is a dependency of your app, not of norns; the starter installs it.

## `validate(schema, raw)`

The function both wrappers use. It accepts a valibot schema (any Standard Schema implementation works the same way) or a plain function that returns the parsed value or throws. On failure it throws `ValidationError`, whose `issues` array is the schema's issue list and whose `message` summarises them.

## Error shapes

| Wrapper | On validation failure |
|---|---|
| `page.actions` | returns `fail(400, { errors: issues, values: rawForm })` |
| `route()` | throws `error(400, { message, issues })` |

The action shape is what norns-ui's `<Form>` and `<Field>` consume; each field finds its message by matching `errors[*].path[0].key` against its `name`. The route shape reaches API clients as a 400 with a JSON body.

## Type inference

Use `v.InferOutput<typeof schema>` for the service's input type, as above, so the service signature and the schema cannot drift.

## The same schema on the wire

[norns-tron](/norns-tron/guide/schema-mode) derives a TRON wire schema from the same valibot object, which is how internal endpoints get the fastest serialization mode without a second shape definition.
