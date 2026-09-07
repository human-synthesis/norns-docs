---
title: Semantics and limits
description: What TRON preserves, what it does not, and where it should not be used.
---

- **Same value semantics as JSON.** `toJSON()` is honoured, so a `Date` arrives as its ISO string, not a `Date` (exactly like `response.json()`). `Map` and `Set` serialize as `{}` and `BigInt` throws, as with `JSON.stringify`; dev mode logs a warning when a route returns them.
- **Not for `load` or form actions.** SvelteKit serializes those with devalue, which preserves Dates, Maps and Sets. This package targets `route()` endpoints, LLM-facing output and service-to-service payloads.
- **Payloads under about 1 KB stay JSON** unless `minBytes: 0` or `force: true` is set. They are still decoded transparently.
- **Content type is `application/tron`.** A TRON body may carry a declaration preamble that is not valid JSON, so never label it `application/json`.
- **Schema mode uses `new Function`** for the row constructor where the runtime allows it. In CSP-restricted browsers the fallback scanner takes over, and on Cloudflare Workers, which forbid `new Function`, versions from 0.0.2 use a closure-based row constructor instead.
- **Numeric enum values are rejected** in `enums`: they would be ambiguous with dictionary indices and decode as `undefined`. Enum values must be strings or booleans.
- **`decodeColumnar` needs `encodeColumnar` output.** The default `encode()` emits `table` declarations that the WASM columnar scanner does not accept; it returns `undefined` for them.
