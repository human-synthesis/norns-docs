---
title: Control flow
description: +if / +elseif / +else chains, +each, and +snippet blocks with {@render}.
---

## `+if` chains

```pug
+if('data.notes.length === 0')
	Banner(variant="info") No notes yet
+elseif('data.filtered')
	p Showing a filtered list
+else
	.space-y-2
		+each('data.notes as note (note.id)')
			Card {note.title}
```

norns-core rewrites the chain, at any nesting depth, into Svelte blocks emitted as Pug text:

```pug
| {#if data.notes.length === 0}
Banner(variant="info") No notes yet
| {:else if data.filtered}
p Showing a filtered list
| {:else}
.space-y-2
	...
| {/if}
```

The condition is the string inside the parentheses; quotes are stripped. The rewrite exists because svelte-preprocess's own `+if` mixin does not support chaining.

## `+each`

```pug
+each('data.notes as note (note.id)')
	li {note.title}
```

`+each` is svelte-preprocess's Pug mixin and its argument is copied verbatim into `{#each ...}`, so it must be in Svelte's `items as item` form, optionally with a `(key)`. The `item of items` form compiles to a block the Svelte compiler rejects; `norns lint` flags it.

Other svelte-preprocess mixins (`+await`, `+key`, `+html`, `+debug`) exist upstream but are not part of the vetted subset the framework tests pin; prefer `| {#key x}` text lines if you need them.

## `+snippet`

Svelte 5 snippets are how norns-ui components take named content. Define one with `+snippet` and render it with `{@render}` behind a pipe:

```pug
Header(sticky!="{true}")
	+snippet('brand')
		a(href="/") Norns
	+snippet('nav')
		a(href="/docs") Docs

DataTable(rows!="{rows}")
	+snippet('cell', row, key)
		span {row[key]}
```

`+snippet('name')` becomes `{#snippet name()}` and `+snippet('row', user, idx)` becomes `{#snippet row(user, idx)}`; the argument list may contain parentheses. Snippets nest, so a `Tabs` item snippet can contain a `Card` with its own `header` snippet.

Inside a component, render what you received:

```pug
header(class!="{classes}")
	.brand
		| {@render brand?.()}
	+if('nav')
		nav
			| {@render nav()}
```
