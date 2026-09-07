---
title: Notes
description: A CRUD feature on Cloudflare D1 with form actions, a dynamic route, an error page and a schema-mode TRON endpoint.
---

## The feature folder

`src/lib/norns/notes/`:

- `shared/schema.c` defines `createNoteSchema` (title trimmed and required, optional body), `updateNoteSchema`, the row shape `noteSchema`, and `noteWire`, the TRON schema derived from it with `tronSchemaFromValibot(noteSchema, { id: 'notes.v1', path: '$.data' })`.
- `server/module.c` binds `db` transiently from the request's `event.platform.env.DB`, then `notes.repo` and `notes.service` transiently on top of it (see [Cloudflare D1](/norns/data/cloudflare-d1) for the code).
- `server/repo.c` is hand-written SQL on the raw D1 API: `list`, `get`, `create`, `update`, `remove`, every call async.
- `server/service.c` is a thin `NotesService` with typed `Note` and `NoteInput`.
- `server/public.c` exports `notes(container)` with the same five operations.

`migrations/notes/20260508_001_init.sql` creates the table.

## Routes

`src/routes/examples/norns/notes/+page.server.c`:

```civet
export load := page.load
	handler: async ({ container }) =>
		notes: await notes(container).list()

export actions := page.actions
	create:
		input: createNoteSchema
		run: async ({ input, container }) =>
			id := await notes(container).create input
			throw redirect 303, `/examples/norns/notes/${id}`
```

`+page.n` renders the create form with `Form`, `Field`, `Input`, `Textarea` and `Btn`, echoing `form?.values` back into the inputs, and lists notes as `Card` links.

`[id]/+page.server.c` loads one note (throwing `error 404` when missing) and defines `update` and `delete` actions that read `event.params.id`. `[id]/+error.n` renders the 404.

## The API endpoint

`src/routes/api/notes/+server.c` demonstrates schema-preloaded TRON:

```civet
export GET := route
	serializer: tronSerializer({ schema: noteWire })
	handler: async ({ container }) =>
		data: await notes(container).list()

export POST := route
	input: createNoteSchema
	handler: async ({ input, container }) =>
		id: await notes(container).create input
```

Both ends import the same compiled contract, so no shape declarations travel and the response is tagged `#notes.v1`. Clients without `Accept: application/tron` still get JSON.

## The vanilla twin

`src/lib/svelte/notes/` (`db.ts`, `repo.ts`, `service.ts`, `schema.ts`) and `src/routes/examples/svelte/notes/` implement the same feature in `.svelte` / `.ts` without the runtime, for a side-by-side comparison.
