---
title: Toast
description: Mount ToastProvider once and call toast(), notify() or dismiss() from anywhere.
---

```pug
//- src/routes/+layout.n
ToastProvider
| {@render children?.()}
```

```civet
import { toast, notify, dismiss } from '@human-synthesis/norns-ui/toast'

toast 'Saved', { variant: 'success' }
id := notify 'Uploading…', { duration: 0 }
dismiss id
```

`ToastOpts` is `{ variant?: 'info' | 'success' | 'warning' | 'error', duration?: number }`. `clear()` removes every toast. The store behind it is a Svelte 5 runes module (`toast.svelte.js`), so it works from `.c` modules and components alike.

`presetUI()` lists these helpers, but the auto-importer's `helpers` option replaces rather than extends the defaults, so import them explicitly (see the [auto-import options](/norns/auto-imports/options)).
