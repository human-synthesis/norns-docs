---
title: Serializers
description: An app-wide or per-route hook that turns route() results into a Response and reads non-JSON request bodies.
---

A serializer is an object with two hooks:

```ts
interface Serializer {
  serialize(result: unknown, event: RequestEvent): Response | null;
  parseBody?(request: Request, contentType: string): Promise<unknown> | undefined;
}
```

- `serialize` turns the handler's return value into a `Response`, or returns `null` to fall through to the default JSON serialization.
- `parseBody` reads a request body for a content type `route()` does not handle natively, or returns `undefined` to fall through to the built-in JSON and form readers.

## Installing one

App-wide, through boot:

```civet
import { tronSerializer } from '@human-synthesis/norns-tron/server'

app := await boot { features, serializer: tronSerializer() }
```

Per route, which overrides the app-wide one. `null` forces plain JSON:

```civet
export GET := route
	serializer: tronSerializer({ schema: noteWire })
	handler: ...

export POST := route
	serializer: null
	handler: ...
```

`setSerializer(s)` and `getSerializer()` are the underlying functions; `boot({ serializer })` calls the first. The serializer is looked up per request, so module evaluation order does not matter.

## The one that ships

`tronSerializer()` from [norns-tron](/norns-tron) content-negotiates: clients that send `Accept: application/tron` get TRON, everyone else keeps getting JSON. Remove the option to roll back.
