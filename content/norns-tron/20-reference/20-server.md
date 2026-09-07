---
title: Server
description: tronSerializer() and the helpers behind it.
---

```ts
import { tronSerializer, acceptsTron, TRON_CONTENT_TYPE } from '@human-synthesis/norns-tron/server';
```

| Export | Notes |
|---|---|
| `tronSerializer(opts?)` | builds a [`Serializer`](/norns/runtime/serializers) for `route()`, `setSerializer()` or `boot({ serializer })` |
| `acceptsTron(request)` | `true` when the request's `Accept` header asks for TRON |
| `TRON_CONTENT_TYPE` | `'application/tron'` |

`TronSerializerOptions` extends `EncodeOptions` with `schema?: CompiledSchema`, which skips shape detection (the fastest mode).

The serializer implements both hooks: `serialize(result, event)` returns a TRON `Response` when the client accepts it and `null` otherwise (so `route()` falls through to JSON), and `parseBody(request, contentType)` decodes `application/tron` request bodies and returns `undefined` for anything else.
