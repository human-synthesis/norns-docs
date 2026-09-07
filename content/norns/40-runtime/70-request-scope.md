---
title: Request scope
description: Every request gets a child container on event.locals.container, also reachable through AsyncLocalStorage.
---

`boot()` installs `contextHandle(container)` as the first SvelteKit handle. For each request it:

1. creates `app.scope()`, a child of the root container;
2. sets it on `event.locals.container`;
3. runs the rest of the pipeline inside `withScope({ container, event }, ...)`, so code that never receives `event` can still find the scope.

The wrappers pass `container` to your handlers, so most code never needs the helpers below.

## Helpers

| Function | Use |
|---|---|
| `getScope()` | The current `{ container, event }` scope, or `undefined` outside a request. |
| `getContainer()` | The current request container; throws when called outside a request. |
| `withScope(scope, fn)` | Run `fn` with a given scope. `contextHandle` calls this; tests can too. |
| `contextHandle(app)` | The handle itself, for apps that assemble their own `handle` without `boot()`. |
| `errorHandle()` | The default `handleError`. |

A factory registered on the root container can read the request through the scope. This is how the demo binds a Cloudflare D1 database that only exists on `event.platform`:

```civet
app.bind 'db', =>
	db := getScope()?.event?.platform?.env?.DB
	throw new Error 'D1 binding `DB` is missing' unless db
	db
```

## Adding your own handle

Pass `extraHandle` to `boot()`; the handles run after the context handle, so `event.locals.container` is already set. A typical auth handle resolves a session and sets `event.locals.user`, which the wrappers expose as `user`.

## Platform note

The scope uses `AsyncLocalStorage` from `node:async_hooks`. On Cloudflare Workers that requires the `nodejs_als` and `nodejs_compat` compatibility flags in `wrangler.toml`; see [Deploy to Cloudflare](/norns/deploy/cloudflare).
