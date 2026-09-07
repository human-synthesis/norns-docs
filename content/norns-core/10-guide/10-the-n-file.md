---
title: The .n file
description: A .n file is Pug on top, a Civet script block below, and an optional style block — no wrappers, no lang attributes.
---

```pug
section.space-y-4
	h1.text-4xl.font-bold Notes
	+each('data.notes as note (note.id)')
		Card(href!="/notes/{note.id}")
			.font-semibold {note.title}

<script>
	{ data } := $props()
</script>
```

## What the preprocessor does with it

The `norns-default-langs` step runs first on every file whose name ends in `.n`:

1. **Auto-close.** If the file ends inside a `<script>` or `<style>` block with no closing tag, the tag is appended. The reference apps use this: a component can end with the script block and nothing else.
2. **Rewrites.** `+if` chains, `+snippet` blocks and class shorthand are rewritten (next pages).
3. **Auto-wrap.** When there is no `<template>` tag, everything outside `<script>` and `<style>` blocks is wrapped in `<template lang="pug">` and the blocks are appended after it.
4. **Defaults.** A `<script>` without `lang` gets `lang="civet"`; a `<template>` without `lang` gets `lang="pug"`.

Then `norns-civet-script` compiles every `<script lang="civet">` (or `lang="cv"`) block to JavaScript with source maps and drops the `lang` attribute so svelte-preprocess does not look for a Civet transformer. Finally svelte-preprocess renders the Pug template (and handles `lang="ts"` scripts, should you write one).

## Writing it explicitly

All of these are equivalent to the defaults and allowed:

```pug
<template lang="pug">
section ...
</template>

<script lang="civet">
</script>
```

A `.svelte` file never goes through the `.n` defaults; it is compiled exactly as Svelte would, even with this preprocessor installed. Use that when you want a plain Svelte component next to your `.n` ones.

## Styles

`<style>` blocks work as in Svelte and are scoped. Both reference apps keep styling in Tailwind utilities and per-feature CSS files instead.
