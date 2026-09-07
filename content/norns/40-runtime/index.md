---
title: Runtime
description: The server layer exported from @human-synthesis/norns/server — boot, the container, the page and route wrappers, validation, serializers and request scope.
---

Everything on these pages is exported from `@human-synthesis/norns/server` and auto-imported in server files:

| Export | Page |
|---|---|
| `boot`, `createApp` | [Boot](/norns/runtime/boot) |
| `Container`, `createContainer` | [Container](/norns/runtime/container) |
| `page` | [Page wrappers](/norns/runtime/page-wrappers) |
| `route`, `setSerializer`, `getSerializer` | [route()](/norns/runtime/route), [Serializers](/norns/runtime/serializers) |
| `validate`, `ValidationError` | [Validation](/norns/runtime/validation) |
| `withScope`, `getScope`, `getContainer`, `contextHandle`, `errorHandle` | [Request scope](/norns/runtime/request-scope) |
| `betterSqlite`, `d1`, `libsql`, `postgres`, `withTransaction` | [Drivers](/norns/data/drivers) |

The runtime is opinionated on purpose. Its value is an app architecture on top of SvelteKit's primitives, not syntax sugar: feature folders, a facade boundary, validated input at the edge, and a container that tools can reason about.
