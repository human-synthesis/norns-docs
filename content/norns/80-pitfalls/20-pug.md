---
title: Pug pitfalls
description: Template lines that Pug parses differently from what a Svelte author expects.
---

| Do not write | Write | Why |
|---|---|---|
| `{@html foo}` as a top-level Pug line | `\| {@html foo}` | Pug parses a leading `{` as a malformed tag; the pipe emits the line as text |
| `#{expr}` in text | `{expr}` | Pug interpolation runs at preprocess time with no runtime data in scope, and SSR fails with a 500 |
| `attr="#{expr}"` | `attr!="{expr}"` | same reason; `!=` is Pug's unescaped attribute, which Svelte then reads as an expression |
| `+each('row of rows')` | `+each('rows as row')`, optionally `+each('rows as row (row.id)')` | the `of` form is copied verbatim into the Svelte block and the compiler rejects it |
| a `.a.b` chain or `{expr}` split across a line break | one element per line | Pug is line-oriented; the parse error surfaces on the next line |

## Template syntax that works

- `+if('cond')` / `+elseif('cond')` / `+else`, nested to any depth.
- `+each('items as item (item.id)')`.
- `+snippet('name', arg)` to define, `| {@render name(x)}` to render.
- `attr!="{expr}"` for Svelte expressions; `bind:value!="{x}"`; `onclick!="{handler}"`.
- `.a.b` class shorthand, including Tailwind variants and fractions like `.hover:bg-x.gap-2.5`, which norns-core rewrites for you.
- `svelte:head` as a tag, with `title`, `meta(...)` and `link(...)` children.
- Components as tags: `Btn(variant="primary" href="/x") Save`.

See the norns-core [Pug template](/norns-core/guide/pug-template) and [control flow](/norns-core/guide/control-flow) pages for the details.
