---
title: Verification workflow
description: The order to run checks before calling a change done, and the runtime gotchas that type checks do not catch.
---

1. **`bun run lint`** (`norns lint`). Must show 0 errors. `--json` for machine-readable output.
2. **`bun run check`** (`norns check`). Must exit 0. Pug and Civet errors point at the line you wrote; Svelte errors inside Pug-rendered markup are reported against the preprocessed output, which `norns diag --template` prints.
3. **`bunx norns diag <file>`** when an error message is unhelpful, to see whether the source is right and the bug is elsewhere.
4. **`bun run build`**. A few seconds on a small app and the final word on whether everything compiles.
5. **`curl` through the dev server** for any request-path change, including POST and form actions. That is where Bun-versus-Node and Pug-versus-Svelte differences surface.

## Gotchas type checks do not catch

- `event.locals.container` is the per-request DI scope set by `contextHandle` in `boot()`. Take `container` from the wrapper context; do not destructure DI out of raw event arguments.
- Body parsing is content-type driven. Form actions read `formData()`; a client that posts JSON must call a `+server.c` endpoint wrapped in `route()`.
- `svelte-check` never reads `.n` or `.c` files. In a workspace checkout it also reports framework-source errors reached through symlinks. It is not the pass signal for Norns code.
- Keep a single owner for the database handle. One `module.c` registers `db`; everyone else resolves it.
- `Bun.password.hash` is undefined when Vite launches under Node; use `node:crypto.scrypt` for passwords.
