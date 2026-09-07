---
title: Feature folders
description: The unit of modularity in a Norns app — a bounded domain with a module, a repo, a service, a facade and a shared schema.
---

A feature is a folder that owns one domain. Its files have fixed roles:

| File | Role | Who may import it |
|---|---|---|
| `server/module.c` | Registers the feature's DI bindings (and migration dirs). The only file `boot()` reaches. | the runtime |
| `server/repo.c` | Data access. The only place SQL lives. | `service.c` |
| `server/service.c` | Business rules. No SQL, no HTTP. | `public.c` |
| `server/public.c` | The facade: the feature's public API. | routes and other features |
| `shared/schema.c` | valibot schemas shared by server and client. | routes, components, `service.c` |
| `ui/*.n` | Components that belong to the feature. | routes |

Routes and other features call a feature **only through its facade**. That rule is what makes a feature movable, testable with an overridden container, and safe for an agent to edit: the graph of who calls whom is explicit.

## The starter feature, in full

`norns-app` ships `src/lib/norns/messages/`, an in-memory message board. It is the whole pattern in forty lines.

`server/repo.c`:

```civet
export class MessagesRepo
	items: { id: number; text: string; at: number }[] = []

	list()
		[...@items]

	add(text: string)
		item := { id: @items.length + 1, text, at: Date.now() }
		@items.unshift item
		item
```

`server/service.c`:

```civet
import type { MessagesRepo } from './repo'
import type { SendMessageInput } from '../shared/schema'

export class MessagesService
	repo: MessagesRepo
	constructor(@repo: MessagesRepo)

	list()
		@repo.list()

	create(input: SendMessageInput)
		@repo.add input.text
```

`server/module.c` registers the tokens. The convention is `<feature>.<role>`:

```civet
import type { Container } from '@human-synthesis/norns/server'
import { MessagesRepo } from './repo'
import { MessagesService } from './service'

export default (app: Container) =>
	app.single 'messages.repo', => new MessagesRepo!
	app.single 'messages.service', (c: Container) => new MessagesService c.resolve('messages.repo')
```

`server/public.c` is what everyone else imports. It takes the request's container and returns the operations:

```civet
import type { Container } from '@human-synthesis/norns/server'
import type { MessagesService, SendMessageInput } from './service'

svc := (c: Container) => c.resolve('messages.service') as MessagesService

export messages := (c: Container) => {
	list: () => svc(c).list()
	create: (input: SendMessageInput) => svc(c).create(input)
}
```

And a route uses it through the [page wrappers](/norns/runtime/page-wrappers):

```civet
// src/routes/+page.server.c
import { messages } from '$lib/norns/messages/server/public'
import { sendMessageSchema } from '$lib/norns/messages/shared/schema'

export load := page.load
	handler: ({ container }) =>
		items: messages(container).list()

export actions := page.actions
	send:
		input: sendMessageSchema
		run: ({ input, container }) =>
			messages(container).create input
			{ ok: true }
```

## Adding a feature

1. Create `src/lib/norns/<feature>/server/` with `module.c`, `repo.c`, `service.c`, `public.c`, and `shared/schema.c` if the feature validates input.
2. Register bindings in `module.c`; use `app.single` for process-wide instances and `app.bind` for per-resolve instances (for example a request-scoped D1 handle, see [Cloudflare D1](/norns/data/cloudflare-d1)).
3. Import the facade from routes. Never import `service.c` or `repo.c` from outside the folder.
4. Migrations go to `migrations/<feature>/`, created with `norns migrate create <feature>/<name>`.

The `import.meta.glob` in `hooks.server.c` picks the new module up automatically; nothing else registers it.
