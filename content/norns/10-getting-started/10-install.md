---
title: Install
description: Create a Norns app from the starter template, or add norns to an existing SvelteKit project.
---

## Requirements

- [bun](https://bun.sh) as package manager and script runner. The norns CLI spawns Vite under Node, so Node 18 or newer must be installed too.
- A SvelteKit 2 / Svelte 5 project (the starter provides one).

## The starter template

```sh
bun create human-synthesis/norns-app my-app
cd my-app
bun install
bun run dev          # http://localhost:5173
```

`bun create` clones [norns-app](/norns-app), a one-page app with a single feature folder and everything wired: `svelte.config.js`, `vite.config.js`, `hooks.server.c`, Tailwind v4 and [norns-ui](/norns-ui). Delete the example feature and start from there.

## Manual setup in an existing SvelteKit app

```sh
bun add -D @human-synthesis/norns @sveltejs/kit svelte vite
```

`svelte.config.js`:

```js
import { nornsConfig } from '@human-synthesis/norns/config';

export default nornsConfig({
  // your overrides here
});
```

`vite.config.js`:

```js
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { nornsCivetPlugin } from '@human-synthesis/norns/vite';

export default defineConfig({
  plugins: [nornsCivetPlugin(), sveltekit()]
});
```

`package.json` scripts:

```json
{
  "scripts": {
    "dev": "norns dev",
    "build": "norns build",
    "preview": "norns preview",
    "migrate": "norns migrate",
    "lint": "norns lint",
    "check": "norns check"
  }
}
```

That is enough to write `.n` components and `.c` modules. To use the runtime (DI, wrappers, migrations) add a `src/hooks.server.c` as shown in [boot](/norns/runtime/boot). To get auto-imports, register `nornsAutoImport` in both config files as shown in [Auto-imports](/norns/auto-imports/how-it-works).

> [!NOTE] The starter runs the CLI with `NODE_OPTIONS='--preserve-symlinks'`. That flag only matters inside the framework's own development workspace, where the packages are symlinked; a normal install does not need it.
