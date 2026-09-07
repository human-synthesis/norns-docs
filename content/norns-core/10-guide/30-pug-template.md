---
title: Pug template
description: Pug syntax as used in .n files, including the Svelte-specific attribute and text forms.
---

The template is rendered by svelte-preprocess's Pug support; norns-core adds the rewrites described on the next pages. The forms below are the ones used throughout the reference apps.

## Elements, classes, attributes

```pug
section.animate-in.space-y-4
	h1.text-4xl.font-bold(class="text-fg") Notes
	p.max-w-prose(class="text-fg-muted")
		| SQLite-backed CRUD with SvelteKit form
		code actions
		|  and SSR load.
```

- `tag.class-a.class-b` is the class shorthand; `(name="value")` is the attribute list. Both can appear on the same element.
- `| text` emits a text line; use it to mix text with inline elements and to emit Svelte block syntax.
- `//- comment` is a Pug comment that never reaches the output.

## Svelte expressions

| Form | Meaning |
|---|---|
| `{expr}` in text | Svelte interpolation (runtime) |
| `attr!="{expr}"` | attribute bound to an expression; `!=` is Pug's unescaped attribute |
| `class!="{cond ? 'a' : ''}"` | dynamic class next to static shorthand classes |
| `bind:value!="{value}"` | two-way binding |
| `onclick!="{handler}"` | event handler (Svelte 5 attribute events) |
| `\| {@render children?.()}` | render a snippet |
| `\| {@html html}` | raw HTML |

Never use Pug's own `#{expr}`; it runs at preprocess time with no runtime data.

## Components

A capitalised tag is a component. With auto-imports on, no import line is needed:

```pug
Form(action="?/create" form!="{form}")
	Field(label="Title" name="title" required)
		Input(name="title" placeholder="title…" required)
	Btn(type="submit" variant="primary" icon="lucide:save") Create note
```

Boolean props are passed as `prop!="{true}"`; a bare attribute like `required` passes the string form, which is what native inputs want.

## Special elements

```pug
svelte:head
	title Notes · My app
	meta(name="description" content!="{description}")
```

`svelte:head`, `svelte:window`, `svelte:element` and friends are ordinary tag names to Pug.

## Multi-line attribute lists

```pug
a.nav-link(
	href="https://github.com/human-synthesis/norns"
	target="_blank"
	rel="noopener"
)
	Icon(name="lucide:github")
```

Attributes may span lines inside the parentheses. Everything else is one element per line.
