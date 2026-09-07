---
title: Overriding components
description: Shadow any library component by file name, or extend one with class merging.
---

## Shadowing

`nornsAutoImport` resolves `componentDirs` before the preset map, first match wins. Put `src/lib/components/Btn.n` in your project and every `<Btn>` in your app now renders your file, with no configuration and no import changes. Copy the library file as a starting point:

```
node_modules/@human-synthesis/norns-ui/src/components/Btn.n  →  src/lib/components/Btn.n
```

The library's other components keep importing their own `Btn` through their explicit paths, so shadowing affects your markup only.

## Extending with `class`

Every component accepts `class` and merges it with `cn()` (tailwind-merge), so a utility you pass wins over the same utility in the component:

```pug
Card(class="p-8 bg-bg-subtle")
Btn(variant="primary" class="w-full") Continue
```

`cn` is exported for your own components:

```civet
import { cn } from '@human-synthesis/norns-ui/cn'

{ class: extra = '', ...rest } := $props()
classes := cn 'card p-4', extra
```

## Atoms without components

The CSS atoms (`.btn.btn-primary`, `.input`, `.card`, `.badge`, ...) work on plain elements. Use them where a component would be overkill, for example a bare `a.btn.btn-secondary(href="/")`.
