---
title: svelte.config.js
description: nornsConfig() builds a SvelteKit config with the Norns defaults; spread your own overrides on top.
---

```js
import { nornsConfig } from '@human-synthesis/norns/config';

export default nornsConfig({
  kit: {
    adapter: adapter()
  }
});
```

## Defaults

| Key | Default | Notes |
|---|---|---|
| `extensions` | `['.svelte', '.n']` | both vanilla and Norns components |
| `preprocess` | `nornsPreprocess()` | Pug + Civet, from norns-core |
| `kit.moduleExtensions` | `['.js', '.ts', '.c', '.civet']` | makes `+page.server.c`, `+server.c`, `+layout.c` valid |
| `kit.files.hooks.server` | `src/hooks.server.c` or `.civet` when the file exists | SvelteKit only searches `.js` / `.ts` for hooks, so the path is set explicitly |
| `kit.files.hooks.client`, `kit.files.hooks.universal` | same rule for `hooks.client.*` and `hooks.*` | |

Anything you pass is merged: `kit` keys are spread over the defaults, `kit.files` is merged so your own `files` entries survive, and a `preprocess` or `extensions` you pass replaces the default outright.

## Replacing `preprocess`

You will replace `preprocess` whenever you add the auto-importer, because it is a Svelte preprocessor too. Keep `nornsPreprocess()` first:

```js
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

`@human-synthesis/norns/preprocess` re-exports `nornsPreprocess` from norns-core so you do not have to depend on norns-core directly.
