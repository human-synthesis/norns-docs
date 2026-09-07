---
title: Dark mode
description: Every component swaps on <html data-theme="dark">; persist the choice with an inline script and the ThemeToggler component.
---

The tokens define light values at the root and dark values under `[data-theme='dark']`. Toggle that attribute and every component follows.

## Avoid the flash

Set the attribute before first paint with an inline script in `app.html`:

```html
<script>
  (function () {
    try {
      var t = localStorage.getItem('norns-theme');
      if (t === 'dark' || (t === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.dataset.theme = 'dark';
      }
    } catch (_) {}
  })();
</script>
```

## Toggle

```pug
ThemeToggler(size="sm")
ThemeToggler(showLabel!="{true}" labelLight="Light" labelDark="Dark")
```

`ThemeToggler` reads and writes the same `norns-theme` localStorage key by default (`storageKey` changes it) and swaps between `lightIcon` and `darkIcon`.

## Your own styles

Reach for the role tokens rather than raw colours so your components swap too: `var(--color-fg)`, `var(--color-bg-elevated)`, `var(--color-border)` and the rest listed under [Theming](/norns-ui/guide/theming). Scope overrides with `[data-theme='dark'] .my-thing { ... }` when a token is not enough.
