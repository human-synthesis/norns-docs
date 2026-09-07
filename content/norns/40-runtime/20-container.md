---
title: Container
description: A small DI container with string tokens, singleton and transient bindings, overrides for tests, and child scopes per request.
---

Tokens are namespaced strings, conventionally `<feature>.<role>`: `notes.repo`, `notes.service`, `db`. Bindings register a factory that receives the container it is resolved through.

```civet
import type { Container } from '@human-synthesis/norns/server'

export default (app: Container) =>
	app.single 'notes.repo', (c: Container) => new NotesRepo c.resolve('db')
	app.single 'notes.service', (c: Container) => new NotesService c.resolve('notes.repo')
```

## Methods

| Method | Behaviour |
|---|---|
| `bind(token, factory)` | Transient: the factory runs on every `resolve(token)`. |
| `single(token, factory)` | Singleton: the factory runs once per container scope where the binding is declared, and the result is memoised there. |
| `override(token, factory)` | Wins over any binding in this scope or any parent. Made for tests: swap a real service for a fake without touching the production module. |
| `resolve(token)` | Returns the value. Walks the scope chain: nearest override first, then nearest binding; throws `Container: no binding for token "..."` when nothing matches. |
| `has(token)` | Whether a binding or override is reachable. |
| `scope()` | Creates a child container that inherits bindings through the parent walk but keeps its own overrides and singletons. |
| `migrations(dir)` | Registers a migrations directory on the root container. |
| `getMigrationDirs()` | All registered migration directories, from the root. |

Factories are called with the **leaf** container, the one `resolve` was called on. A factory can therefore resolve other tokens at the same scope, which is how `notes.service` gets a request-scoped `db` even though `notes.service` itself was declared on the root.

## Singleton versus transient

- `single` on the root container is a process-wide instance: a repo over a local SQLite file, a service without per-request state.
- `bind` re-runs the factory each resolve. Use it when the value depends on the request, such as a D1 binding that only exists on `event.platform.env` (see [Cloudflare D1](/norns/data/cloudflare-d1)). Resolving a transient binding several times inside one request yields several instances; resolve once and pass it along if that matters.
- A `single` declared on a **child** scope is per request, because the child scope is created per request.

## Tests

```civet
import { createContainer } from '@human-synthesis/norns/server'

c := createContainer()
c.single 'notes.repo', => new FakeRepo!
c.single 'notes.service', (c) => new NotesService c.resolve('notes.repo')

svc := c.resolve 'notes.service'
```

Or boot the real modules and `override` one token on a child scope.
