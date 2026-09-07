---
title: Core
description: encode, decode, defineSchema, createRegistry, the columnar pair and the WASM controls.
---

```ts
import { encode, decode, defineSchema, createRegistry } from '@human-synthesis/norns-tron';
```

## Functions

| Function | Notes |
|---|---|
| `encode(value, opts?)` | self-describing TRON, or plain JSON when the equivalent JSON is under `minBytes` |
| `decode(text)` | any TRON document, including plain JSON |
| `defineSchema(spec)` | compile a schema once at startup; returns a `CompiledSchema` |
| `createRegistry()` | a `SchemaRegistry` for services that serve several response shapes |
| `encodeColumnar(value, opts?)` | emit the form `decodeColumnar` can take (no `table` declarations) |
| `decodeColumnar(text, copy?)` | a numeric / dictionary table as a flat `Float64Array`, or `undefined` when not eligible |
| `wasmAvailable()` | whether the WASM fast path is usable here |
| `setWasmBinary(bytes)` | supply the WASM binary yourself (browsers, bundlers, Deno) |
| `raw.stringify`, `raw.parse`, `raw.parseFast`, `raw.parsePrelude` | the underlying primitives |

## `EncodeOptions`

| Option | Default | Notes |
|---|---|---|
| `minBytes` | `1024` | below this many bytes of equivalent JSON, `encode()` returns plain JSON. `0` always encodes |
| `dict` | `true` | dictionary-encode low-cardinality string and boolean columns |
| `table` | `true` | emit `table` declarations so decoding needs no text transform. `true` = flat uniform rows only (always a win); `'nested'` = also rows with nested objects (faster, but inner shapes lose compression) |
| `force` | `false` | skip the `minBytes` check |

## `SchemaSpec`

```ts
interface SchemaSpec {
  id?: string;                                        // version tag, emitted as a `#id` line
  fields: string[];                                   // in the exact serialization order
  enums?: Record<string, Array<string | boolean>>;    // per-field dictionaries; numbers are rejected
  path?: string;                                      // '$' (root) or e.g. '$.data'; default '$'
}
```

## `CompiledSchema`

`encode(value)`, `decode(text)`, `peek(text)` (read the `#id` tag without parsing the body, `null` when untagged), and the readonly `fields` and `id`.

## `SchemaRegistry`

`register(spec)`, `get(id)`, and `decode(text)`, which peeks the tag and decodes with the matching schema.

## `ColumnarResult`

`{ fields, rows, cols, tape }` where `tape` is row-major with length `rows * cols`.
