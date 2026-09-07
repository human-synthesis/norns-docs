---
title: Setup
description: Register presetUI() with the auto-importer in both config files and import the stylesheet.
---

## Auto-imports

`presetUI()` returns a `components` map from name to import path. Pass it to `nornsAutoImport` in **both** `svelte.config.js` and `vite.config.js` (the same instance rules apply as for the [auto-importer](/norns/auto-imports/how-it-works)):

```js
// svelte.config.js
import { nornsConfig } from '@human-synthesis/norns/config';
import { nornsPreprocess } from '@human-synthesis/norns/preprocess';
import { nornsAutoImport } from '@human-synthesis/norns/auto-import';
import { presetUI } from '@human-synthesis/norns-ui/auto-import';

const ui = presetUI();

export default nornsConfig({
  preprocess: [
    ...nornsPreprocess(),
    nornsAutoImport({
      componentDirs: ['src/lib/components', 'src/routes'],
      components: ui.components
    })
  ]
});
```

```js
// vite.config.js
import { nornsCivetPlugin, pugTailwindExtract } from '@human-synthesis/norns/vite';
import { nornsAutoImport } from '@human-synthesis/norns/auto-import';
import { presetUI } from '@human-synthesis/norns-ui/auto-import';
import tailwindcss from '@tailwindcss/vite';

const ui = presetUI();

export default {
  plugins: [
    pugTailwindExtract(),
    nornsCivetPlugin(),
    nornsAutoImport({ components: ui.components }),
    tailwindcss(),
    sveltekit()
  ]
};
```

## Styles

```css
/* src/app.css */
@import 'tailwindcss';
@import '@fontsource-variable/outfit';
@import '@human-synthesis/norns-ui/styles';

@source "./**/*.n";
@source "../node_modules/.cache/norns/tailwind-pug-classes.html";
```

The library's tokens set `html` / `body` colour and background from role tokens; the two `@source` lines make Tailwind see the classes used in `.n` files (see [class shorthand](/norns-core/guide/class-shorthand)). The Outfit font import is optional.

## Use it

```pug
Form(action="?/save" form!="{form}")
	Field(label="Title" name="title" required)
		Input(name="title" placeholder="title…" required)
	Btn(type="submit" variant="primary" icon="lucide:save") Save
```

> [!NOTE] Versions before 0.0.6 required a `scopeToProject` wrapper around the preprocessors to keep them off Bits UI's TypeScript source. Bits UI is gone and the wrapper is no longer needed; remove it if you still have it. See the [migration note](/norns-ui/reference/migration-0-0-6).
