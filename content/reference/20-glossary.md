---
title: Glossary
description: Terms used across the Norns docs.
---

| Term | Meaning |
|---|---|
| **`.n` file** | A Svelte component written as Pug (template) and Civet (script). See [the .n file](/norns-core/guide/the-n-file). |
| **`.c` file** | A Civet module; `.civet` is the same. |
| **Civet** | A TypeScript-flavoured, indentation-based language that compiles to JavaScript ([civet.dev](https://civet.dev)). |
| **Pug** | An indentation-based HTML template language ([pugjs.org](https://pugjs.org)). |
| **Feature** | A bounded domain in `src/lib/norns/<feature>/` with a module, repo, service, facade and schema. |
| **Module** | `server/module.c`; the function that registers a feature's bindings on the container. |
| **Repo** | `server/repo.c`; data access, the only place SQL lives. |
| **Service** | `server/service.c`; business rules. |
| **Facade** | `server/public.c`; the feature's public API, the only legal entry point from routes and other features. |
| **Schema** | `shared/schema.c`; valibot schemas shared by server and client. |
| **Container** | The DI container: string tokens, `bind` / `single` / `override`, child scopes. |
| **Token** | A container key, conventionally `<feature>.<role>`. |
| **Request scope** | The child container created per request and attached to `event.locals.container`. |
| **Page wrappers** | `page.load` and `page.actions`, for `+page.server.c`. |
| **`route()`** | The wrapper for `+server.c` handlers. |
| **Serializer** | The hook that turns `route()` results into a `Response`; `tronSerializer()` is the shipped one. |
| **TRON** | The token-efficient wire format implemented by norns-tron. |
| **Auto-import** | Resolving helpers, components, presets and exports by name without import lines. |
| **Preset** | A UI library's `components` map for the auto-importer, e.g. `presetUI()`. |
| **Atom** | A CSS-only class from norns-ui (`.btn`, `.card`, ...). |
| **Snippet** | A Svelte 5 `{#snippet}`; written as `+snippet('name')` in Pug. |
| **Migration** | A forward-only SQL file under `migrations/<feature>/`. |
| **Vetted subset** | The Civet and Pug constructs the norns-core tests guarantee. |
| **Verification order** | `norns lint`, then `norns check`, then `bun run build`, then `curl` through the dev server. See [verification workflow](/norns/pitfalls/verification). |
