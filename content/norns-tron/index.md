---
title: norns-tron
description: TRON serialization for the Norns ecosystem — a token-efficient, faster-than-JSON wire format for APIs and LLM-facing output, with zero runtime dependencies.
---

TRON cuts **11–61% of tokens** compared to JSON and, used correctly, beats `JSON.parse` / `JSON.stringify` on decode, encode and round-trip. Plain JSON is valid TRON, so adoption is progressive and rollback is one line.

The encoder/decoder core is absorbed from the `apitron` research library; this package adds the Norns glue as subpath exports:

| Import | Contents |
|---|---|
| `@human-synthesis/norns-tron` | `encode`, `decode`, `defineSchema`, `createRegistry`, columnar helpers, WASM controls |
| `@human-synthesis/norns-tron/server` | `tronSerializer()` for `route()` and `boot()` |
| `@human-synthesis/norns-tron/client` | `api` / `createApi()` fetch wrapper that speaks TRON |
| `@human-synthesis/norns-tron/valibot` | derive wire schemas from valibot schemas |

```sh
bun add @human-synthesis/norns-tron
```

`valibot` is an optional peer, needed only for the `/valibot` subpath.

## Where to start

- [Turn it on app-wide](/norns-tron/guide/enable) — one option in `boot()`, content-negotiated.
- [Call it from the client](/norns-tron/guide/client)
- [Schema mode](/norns-tron/guide/schema-mode) — the fastest path for internal endpoints.
- [Semantics and limits](/norns-tron/guide/limits)
- [Performance guide](/norns-tron/guide/performance)
