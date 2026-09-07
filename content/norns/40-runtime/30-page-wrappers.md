---
title: Page wrappers
description: page.load and page.actions wrap +page.server.c exports with container resolution, form parsing and valibot validation.
---

`page` is auto-imported in server files. It mirrors [`route()`](/norns/runtime/route) with two differences that match SvelteKit's form conventions: `load` returns its result as plain data, and actions return `fail(400, ...)` on validation errors instead of throwing.

```civet
import { notes } from '$lib/norns/notes/server/public'
import { createNoteSchema } from '$lib/norns/notes/shared/schema'

export load := page.load
	handler: async ({ container }) =>
		notes: await notes(container).list()

export actions := page.actions
	create:
		input: createNoteSchema
		run: async ({ input, container }) =>
			id := await notes(container).create input
			throw redirect 303, `/notes/${id}`
```

## `page.load({ handler })`

The handler receives:

| Field | Value |
|---|---|
| `container` | the request-scoped container (`event.locals.container`) |
| `event` | the raw SvelteKit `ServerLoadEvent` |
| `params`, `url` | shortcuts for `event.params` and `event.url` |
| `user` | `event.locals.user`, whatever your auth handle put there |

Whatever the handler returns is the page's `data`. Throw `error(404, ...)` or `redirect(...)` as in plain SvelteKit.

## `page.actions({ name: { input?, run } })`

Each action is `{ input?, run }`:

- When `input` is present the form body is read with `request.formData()`, flattened with `Object.fromEntries`, and validated. On failure the action returns `fail(400, { errors, values })`: `errors` is the issue list, `values` is the raw form data echoed back so the page can re-render it.
- `run` receives `{ input, container, event, user }`. `input` is the validated value (or `undefined` when there is no schema).

A route with a dynamic parameter reads it from the event:

```civet
export actions := page.actions
	update:
		input: updateNoteSchema
		run: async ({ input, container, event }) =>
			id := Number event.params.id
			await notes(container).update id, input
			{ saved: true }

	delete:
		run: async ({ container, event }) =>
			await notes(container).remove Number(event.params.id)
			throw redirect 303, '/notes'
```

## Rendering errors

The `fail(400, { errors, values })` shape is what norns-ui's `<Form form={form}>` reads. Each `<Field name="...">` inside looks up its own message from `errors` by path, and `values` lets inputs keep what the user typed:

```pug
Form(action="?/create" form!="{form}")
	Field(label="Title" name="title" required)
		Input(name="title" value!="{form?.values?.title ?? ''}" required)
	Btn(type="submit" variant="primary") Create
```

> [!NOTE] Actions only see form-encoded bodies. A client that posts JSON must call a `+server.c` endpoint wrapped in `route()`, not a form action.
