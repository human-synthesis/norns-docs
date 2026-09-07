---
title: UI presets
description: A preset is a function returning a components map; compose it with your own options and shadow any component by file name.
---

A preset returns a config slice, usually just a `components` map. norns-ui ships one:

```js
// vite.config.js and svelte.config.js
import { presetUI } from '@human-synthesis/norns-ui/auto-import';

const ui = presetUI();

nornsAutoImport({
  componentDirs: ['src/lib/components', 'src/routes'],
  components: ui.components   // { Btn: '@human-synthesis/norns-ui/components/Btn.n', ... }
});
```

After that, every norns-ui component is available by name in `.n` files:

```pug
Form(action="?/save" form!="{form}")
  Field(label="Title" name="title" required)
    Input(name="title" required)
  Btn(type="submit" variant="primary" icon="lucide:save") Save
```

## Shadowing a library component

`componentDirs` resolves before the preset map. Put `src/lib/components/Btn.n` in your project and every `<Btn>` now points at your file, silently. Use this to restyle or extend a component without forking the library.

## Helpers from presets

`presetUI()` also returns a `helpers` entry (`toast`, `notify`, `dismiss` from `@human-synthesis/norns-ui/toast`), but because the `helpers` option replaces the defaults it is not wired in by default. Import those explicitly for now; see the note on the [options](/norns/auto-imports/options) page.
