---
title: Node and other adapters
description: The runtime needs AsyncLocalStorage and a SQLite driver; beyond that any SvelteKit adapter works.
---

Norns is plain SvelteKit at build time, so `@sveltejs/adapter-node`, `adapter-static`, `adapter-vercel`, `adapter-netlify` and `adapter-auto` all apply. The runtime has two platform requirements:

1. **`AsyncLocalStorage`** from `node:async_hooks`, for the per-request scope. Node and Bun have it natively; Cloudflare needs the `nodejs_als` flag; other edge runtimes vary.
2. **A database driver** if you use one. `better-sqlite3` is a native module that must be built for the deployment platform when the app runs under Node; under Bun the runtime picks `bun:sqlite` instead and no native build is involved.

## adapter-node

```js
import adapter from '@sveltejs/adapter-node';
export default nornsConfig({ kit: { adapter: adapter() } });
```

```sh
bun run build
DATABASE_URL=file:./data/app.db bunx norns migrate up
node build
```

Run migrations as a release step before starting the new version. `norns migrate` needs `better-sqlite3` installed when it runs under Node.

## adapter-static

Works for fully prerendered sites. Server-only code still runs at build time, so `boot()` and the container behave normally during prerendering.

## Environment

- Behind a reverse proxy in development, set `server.allowedHosts: true` in `vite.config.js`.
- Container environments read `.env` at create time; a restart does not pick up changes, a recreate does.
