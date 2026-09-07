---
title: Performance guide
description: Pick the right mode, compile schemas once, declare enums, do not encode small payloads, and reach for the columnar tape when data is numeric.
---

The ratios below are measured (Node 22, interleaved pairs against native JSON, median of 15 rounds). **The ratio is TRON / JSON; under 1.00 means TRON is faster.** Absolute milliseconds depend on the machine; the ratios are the signal.

## 1. Choose the right mode

| Situation | Use | decode | encode | round-trip | tokens saved |
|---|---|---:|---:|---:|---:|
| Internal API, both ends are your code | `defineSchema` / `tronSchemaFromValibot` | 0.40–0.87× | 0.66–0.93× | 0.57–0.91× | 11–61% |
| LLM prompt or third-party consumer | `encode` / `decode` | 0.45–0.77× | 0.97–1.77× | 0.76–1.22× | 26–61% |
| Numeric or columnar data | `decodeColumnar` | ~0.30× | — | — | 35% |
| Payload under ~1 KB | plain JSON | — | — | — | 0% |

The gap between schema mode and self-describing mode is the largest optimisation available, bigger than any fine-tuning. Schema mode wins on every axis at every size.

## 2. Preload once, at application start

The number-one mistake is compiling the schema per request. `defineSchema` does real work: it resolves field order, enum tables and the path, and compiles the row constructor with `new Function`. Do it once at module scope, as [schema mode](/norns-tron/guide/schema-mode) shows. Measured effect on a 25-row envelope: decode 1.21× → **0.63×**, encode 2.49× → **0.90×**.

## 3. Declare `enums` for low-cardinality columns

Any string or boolean column with few distinct values (status, role, region, flags) becomes an integer on the wire. Three effects at once: fewer tokens (`events-10k`: 38% → **42%**), faster decode (no string allocation for that column), and WASM eligibility: a dictionary column is an integer on the wire, so a table with strings becomes eligible for the WASM scanner. Values must be strings or booleans.

## 4. Do not encode small payloads

`encode()` already returns plain JSON under 1 KB and `decode()` reads it transparently. In self-describing mode:

| rows | JSON | decode | round-trip |
|---:|---:|---:|---:|
| 5 | 0.5 KB | 4.80× | 5.16× |
| 25 | 2.1 KB | 1.21× | 1.70× |
| 100 | 8.4 KB | **0.78×** | 1.16× |
| 1000 | 86 KB | **0.68×** | **1.01×** |
| 10000 | 881 KB | **0.67×** | **0.94×** |

With a preloaded schema the threshold disappears (see §1).

## 5. Numeric data: take the columnar tape

The fastest path in the library; it never builds JavaScript objects.

```js
const wire = encodeColumnar(rows);               // server
const col = decodeColumnar(wire, /* copy */ true); // client
if (col) {
  const v = col.tape[r * col.cols + c];           // row-major
} else {
  const obj = decode(wire);                        // not eligible, normal path
}
```

About **0.30×** of `JSON.parse`. `copy: true` detaches the tape from WASM memory; without it the next decode invalidates it.

## 6. `table: 'nested'` trades tokens for speed

The default (`table: true`) tabulates only flat rows: a pure win, faster and fewer tokens. `'nested'` also accepts rows with nested objects: faster still, but the inner shapes lose their own compression. Measured on `nested-500`: round-trip 2.47× → **0.89×**, tokens saved 26% → 11%. Pick by what you pay for, latency or tokens.

## 7. Runtime details

- `new Function` is used by the trampoline and row constructors. Under a strict CSP without `unsafe-eval` the library falls back to the scanner (`parseFast`), about 1.1–1.5×. Correct, just slower.
- WASM is optional. Node and Bun load the embedded binary; in a browser you may also supply it with `setWasmBinary(...)`. Without it nothing breaks; the dispatcher just skips the WASM path.
- Send `Content-Type: application/tron` (`route()` does). Never `application/json`.
- HTTP compression still applies. TRON reduces bytes before gzip or brotli; the gains compound, less than linearly.
- Do not re-encode what has not changed; cacheable responses encode once and keep only the decode win.

## 8. Checklist

- `defineSchema` / `tronSchemaFromValibot` called once at startup, not per request
- `enums` declared for every categorical and boolean column
- payloads under ~1 KB left as JSON (the default threshold does this)
- `encodeColumnar` + `decodeColumnar` used together where data is numeric
- content type set to `application/tron`
- in the browser, `setWasmBinary` called or the fallback consciously accepted
- measured with your own data before relying on these figures

## Methodology

A naive benchmark gave contradictory results (two identical code paths differing by 43%) because running several decoders in one process makes V8's inline caches polymorphic. The numbers here use one child process per data set, interleaved A/B/A/B pairs with alternating order, and the median of 15 rounds. Correctness: 220,118 adversarial and fuzz checks across the suite, 22 dedicated schema-mode tests and 1,500 fuzz round-trips, zero failures.
