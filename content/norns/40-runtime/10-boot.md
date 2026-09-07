---
title: Boot
description: boot() builds the root container, runs every feature module, and returns the SvelteKit hooks.
---

`src/hooks.server.c` is the whole wiring:

```civet
features := import.meta.glob './lib/norns/*/server/module.c', { eager: true }

app := await boot { features }

{ handle, handleError } := app
export { handle, handleError }
```

`boot` is auto-imported in server files; import it explicitly from `@human-synthesis/norns/server` if you prefer.

## What `boot()` does

1. Creates a fresh root `Container`.
2. If `serializer` is given, installs it as the app-wide [response serializer](/norns/runtime/serializers).
3. For every entry in `features`, takes the module's default export (or the module itself when it is a function) and calls it with the root container. Each `module.c` registers its bindings there. A module whose default export is not a function fails boot with a clear error naming the path.
4. Builds `handle` as `sequence(contextHandle(container), ...extraHandle)` and picks `handleError` (yours, or the default `errorHandle()`).

## Options

| Option | Type | Notes |
|---|---|---|
| `features` | `Record<path, module>` | Usually the result of `import.meta.glob(..., { eager: true })`. |
| `extraHandle` | `Handle` or `Handle[]` | Extra SvelteKit handles run after the context handle, for example auth. |
| `handleError` | `HandleServerError` | Replaces the default error handle. |
| `serializer` | `Serializer` or `null` | App-wide `route()` serializer, e.g. `tronSerializer()` from [norns-tron](/norns-tron). |

## Return value

`{ container, handle, handleError }`. `container` is the root container, useful in tests and scripts; requests never touch it directly, they get a child scope (see [Request scope](/norns/runtime/request-scope)).

## `createApp()`

Returns an empty root container with nothing registered. Use it in tests that want full control over bindings.
