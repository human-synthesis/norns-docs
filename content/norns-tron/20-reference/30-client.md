---
title: Client
description: The api wrapper, createApi, parseResponse and ApiError.
---

```ts
import { api, createApi, parseResponse, ApiError, TRON_CONTENT_TYPE } from '@human-synthesis/norns-tron/client';
```

## `Api`

```ts
interface Api {
  request(method: string, url: string, body?: unknown, opts?: RequestOptions): Promise<any>;
  get(url: string, opts?: RequestOptions): Promise<any>;
  del(url: string, opts?: RequestOptions): Promise<any>;
  post(url: string, body?: unknown, opts?: RequestOptions): Promise<any>;
  put(url: string, body?: unknown, opts?: RequestOptions): Promise<any>;
  patch(url: string, body?: unknown, opts?: RequestOptions): Promise<any>;
}
```

`api` is the default instance for browser code. `createApi(defaults?)` makes a new one:

| Default | Notes |
|---|---|
| `fetch` | fetch implementation; pass SvelteKit's `fetch` inside `load` functions |
| `base` | URL prefix, e.g. `'https://api.example.com'` |
| `headers` | sent on every request |

`RequestOptions` per call: `fetch`, `headers`, `init` (a raw `RequestInit`).

## `parseResponse(res)`

Decodes a `Response` by its content type: TRON, JSON, or raw text.

## `ApiError`

Thrown for non-2xx responses. `status`, `body` (decoded) and `response` (raw).
