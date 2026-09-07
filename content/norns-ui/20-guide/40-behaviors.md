---
title: Behaviors
description: Headless Svelte 5 actions and a floating-ui factory, exported at @human-synthesis/norns-ui/behaviors.
---

```civet
import {
	portal, clickOutside, escape, focusTrap,
	scrollLock, useFloating, rovingTabindex
} from '@human-synthesis/norns-ui/behaviors'
```

| Export | Use as | Does |
|---|---|---|
| `portal` | `use:portal` | moves the element to `document.body` (or a target) |
| `clickOutside` | `use:clickOutside={handler}` | calls the handler on pointer-down outside the element |
| `escape` | `use:escape={handler}` | calls the handler on the Escape key |
| `focusTrap` | `use:focusTrap` | keeps Tab focus inside the element while mounted |
| `scrollLock` | `use:scrollLock` | locks body scroll while mounted |
| `rovingTabindex` | `use:rovingTabindex` | arrow-key navigation across the element's focusable children |
| `useFloating` | `useFloating(options)` | a small factory over `@floating-ui/dom` returning position state for a reference / floating pair |

Each behavior is also importable on its own from `@human-synthesis/norns-ui/behaviors/<name>.svelte.js`.

These are what every overlay in the library is built on, so building your own popover-like thing from them gives you the same keyboard and dismissal semantics for free.

```pug
.menu(use:portal use:clickOutside!="{close}" use:escape!="{close}")
	...
```
