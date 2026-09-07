---
title: Icons
description: Iconify through @iconify/svelte, with the Lucide collection bundled; register it once, then use <Icon> anywhere.
---

The library depends on `@iconify/svelte` and `@iconify-json/lucide`. Register the collection once in your app entry so icons render on the server and the client:

```civet
// src/routes/+layout.c (or any module loaded once)
import { addCollection } from '@iconify/svelte'
import lucide from '@iconify-json/lucide/icons.json'
addCollection lucide
```

Then:

```pug
Icon(name="lucide:check" size="size-5")
Btn(icon="lucide:save") Save
Banner(variant="info" icon="lucide:info") No notes yet
```

`name` is Iconify's `<set>:<name>`; `size` is any Tailwind size utility (default `size-4`); `flip` and `rotate` are supported.

To use another set, install its JSON package (for example `@iconify-json/heroicons`) and `addCollection` it the same way. Components that take an `icon` prop (`Btn`, `Banner`, `Chip`, `Dropdown` items, `Timeline` items, ...) accept any registered icon name.
