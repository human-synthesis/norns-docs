---
title: Walkthrough
description: Every file in the starter, the messages feature, and how to go further.
---

```
src/
  hooks.server.c                # boots the norns runtime, eager-loads feature modules
  app.css, app.html             # global styles + html shell
  routes/
    +layout.c, +layout.n        # app shell with the <Header>
    +page.n                     # one-page demo: form + list of messages
    +page.server.c              # load() + send action wired to the messages feature
    api/messages/+server.c      # GET + POST endpoint through route()
  lib/
    components/Header.n         # site nav
    norns/
      messages/                 # one feature folder, in-memory store
        server/{module,repo,service,public}.c
        shared/schema.c         # valibot schema shared by the form action and the API route
tests/
  civet-loader.js               # bun plugin: compiles .c on import so tests can load feature code
  messages.test.js              # the feature through the DI container
wrangler.toml                   # commented Cloudflare stub
```

## The starter feature

`src/lib/norns/messages/` is a complete feature folder in miniature. The [feature folders](/norns/getting-started/feature-folders) page prints it in full.

- `repo.c` is an in-memory `list` / `add`. Replace it with a database when you need persistence; only `list` and `add` are called from outside.
- `service.c` holds the business logic and takes the validated input type from `shared/schema.c`.
- `module.c` registers `messages.repo` and `messages.service` on the container. It is the only file `boot()` reaches.
- `public.c` exports `messages(container)`, the facade routes import.

## How it is wired

- `src/routes/+page.server.c` calls `messages(container).list()` in `page.load` and `messages(container).create(input)` in the `send` action, validated by `sendMessageSchema`.
- `src/routes/+page.n` renders `<Form>` from norns-ui. Field errors arrive through the `form` prop and the Form context; no per-page boilerplate.
- `src/routes/api/messages/+server.c` exposes the same operations as `GET` and `POST` through `route()`. Responses are content-negotiated by the TRON serializer installed in `hooks.server.c`, so `Accept: application/tron` gets TRON and everyone else gets JSON.
- `hooks.server.c` globs `./lib/norns/*/server/module.c` and calls `boot({ features, serializer: tronSerializer() })`.

## The test

`tests/messages.test.js` boots the feature's module into a fresh container and calls the facade, the same way a route would. That is the pattern for every feature: no HTTP, no mocks of the framework, just the container. Bun loads the Civet files through the small plugin in `tests/civet-loader.js`.

## Going further

Delete `src/lib/norns/messages/` and `src/routes/+page.*` and rewrite, or copy the feature folder for each new domain. That is the whole pattern.

For persistence, bind a database in one module (see [Drivers](/norns/data/drivers) or [Cloudflare D1](/norns/data/cloudflare-d1)) and resolve it from the repo. For a fuller example with SQLite, dynamic routes, error pages and a component-heavy page, clone [norns-demo](/norns-demo).

The repository's `CLAUDE.md` carries the [pitfalls](/norns/pitfalls) and the [verification order](/norns/pitfalls/verification) so coding agents working in your app follow them.
