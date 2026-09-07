---
title: Vetted subset
description: The Civet and Pug constructs the norns-core test suite pins, and the documented traps it keeps trapped.
---

`norns-core` carries a test suite that compiles each construct below through Civet, the preprocessor and the Svelte compiler on every run, so an upgrade of civet, pug or svelte-preprocess cannot silently break apps written in this subset.

## Civet modules (`.c`)

| Construct | Pinned behaviour |
|---|---|
| header comments | pass through |
| `import * as dz from '...'`, `import { eq } from '...'`, default imports | emitted verbatim |
| `export x := { a: 1 }` | `export const x = { a: 1 }` |
| quoted operator keywords as object keys, `{ 'and': 1, 'or': 2, 'not': 3 }` | safe |
| JS-style async arrow bodies with braces and `return` | compile |
| template literals, including tagged (`` dz.sql`1 = 1` ``) | survive |

Traps pinned as traps:

- `x := a isnt b` does not compile to `!==` (the generated JavaScript references a bare identifier). If a Civet upgrade ever changes that, the ban can be lifted.
- `import { and } from 'drizzle-orm'` is a parse error. Use a namespace import.
- Async generator method shorthand currently compiles; it is excluded from the subset for minimalism, not breakage.

## Components (`.n`)

| Construct | Pinned behaviour |
|---|---|
| `section.norns-page` with children | `<section class="norns-page">` |
| `Kanban(data!="{data.board}" onMove="?/submit")` | attributes preserved for Svelte |
| `+if('data.ok')` / `+else` | `{#if data.ok}` / `{:else}` / `{/if}` |
| `+each('data.rows as row')` | `{#each data.rows as row}` and compiles |
| `{ data, form } := $props()` | `const { data, form } = $props()` |
| `selected := $state(null)` | `const selected = $state(null)` |
| bare Pug with no `<template>` block | auto-wrapped |
| `div.gap-2.5` | `class="gap-2.5"` (class rewriter) |

Traps pinned as traps:

- `+each('row of data.rows')` maps verbatim to `{#each row of data.rows}` and the Svelte compiler throws.
- A leading `{#if data.ok}` on a template line is not a Svelte block after Pug; prefix with `| `.

The same tables, phrased as do-and-don't rules, live on the [pitfalls](/norns/pitfalls) pages and in every app's `CLAUDE.md`.
