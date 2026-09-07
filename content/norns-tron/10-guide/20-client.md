---
title: Call it from the client
description: The api wrapper sends the Accept header and decodes TRON or JSON transparently; inside load functions create one with SvelteKit's fetch.
---

```civet
import { api, createApi } from '@human-synthesis/norns-tron/client'

users := await api.get '/api/users'          // sends Accept: application/tron
await api.post '/api/notes', { title, body } // body goes out as TRON too

// inside a load function, keep SvelteKit's fetch semantics:
api := createApi { fetch }
```

| Method | Notes |
|---|---|
| `api.get(url, opts?)`, `api.del(url, opts?)` | no body |
| `api.post(url, body?, opts?)`, `api.put(...)`, `api.patch(...)` | body encoded as TRON |
| `api.request(method, url, body?, opts?)` | the general form |
| `createApi({ fetch?, base?, headers? })` | a new instance with defaults: a fetch implementation, a URL prefix, headers sent on every request |
| `parseResponse(res)` | decode any `Response` by its content type (TRON, JSON or text) |

Per-request `opts` accept `fetch`, `headers` and a raw `init` object.

A non-2xx response throws `ApiError` with `status`, the decoded `body` and the raw `response`.

## Browser notes

The 1.7 KB WASM scanner ships embedded as base64, so nothing needs to be served or wired; it works in Node, Bun and the browser. Under a strict CSP without `unsafe-eval` the decoder transparently falls back to the JavaScript scanner (about 1.1–1.5× slower). `setWasmBinary(bytes)` lets you supply the binary yourself, and `wasmAvailable()` reports which path is active.
