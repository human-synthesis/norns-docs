---
title: Install
description: Add norns-ui to a Norns app.
---

```sh
bun add -D @human-synthesis/norns-ui
```

Peer dependencies: `@human-synthesis/norns`, `@human-synthesis/norns-core`, `svelte` 5 and `tailwindcss` 4. The starter template has all of them.

The package ships source, not a build: `.n` components under `src/components/`, motion components under `src/motion/`, behaviors and helpers under `src/lib/`, styles under `src/styles/`, and hand-rolled `.d.ts` shims under `src/types/`. Because the components are Civet + Pug, they require the Norns preprocess pipeline in the consuming app; that is why `@human-synthesis/norns` is a non-optional peer.

## Subpath exports

| Import | Contents |
|---|---|
| `@human-synthesis/norns-ui` | barrel of every component and helper |
| `@human-synthesis/norns-ui/auto-import` | `presetUI()` |
| `@human-synthesis/norns-ui/components/<Name>.n` | one component (what the preset maps to) |
| `@human-synthesis/norns-ui/motion` | motion components, opt-in |
| `@human-synthesis/norns-ui/behaviors` | headless behaviors |
| `@human-synthesis/norns-ui/toast` | `toast`, `notify`, `dismiss`, `clear` |
| `@human-synthesis/norns-ui/cn` | `cn()` |
| `@human-synthesis/norns-ui/styles` | tokens + atoms CSS (`/styles/tokens`, `/styles/atoms` separately) |
