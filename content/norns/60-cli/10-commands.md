---
title: Commands
description: norns dev, build, preview, migrate, lint, check, diag, and the help screen.
---

```
norns <command>

Commands:
  dev                                start vite dev with framework-source watching (default)
  build                              run vite build
  preview                            run vite preview
  migrate status                     list applied + pending migrations
  migrate up                         apply pending migrations
  migrate create <feature>/<name>    scaffold a new SQL migration
  lint [--json]                      scan .c/.civet/.n (templates + script blocks) and vite.config for known pitfalls
  check [--json] [--warnings]        preprocess + compile every .n/.c/.civet through svelte.config.js; file:line:column errors
  diag <file>                        print the JS Civet compiles a .c/.civet/.n script to
  diag --template <file.n>           print the Svelte source the compiler sees after Pug/Civet/auto-import preprocessing
```

Running `norns` with no command is `norns dev`. `--flag` options are collected for the norns-owned commands; `dev`, `build` and `preview` pass everything through to Vite untouched, so `norns dev --port 3000 --host` works.

## `dev`

Spawns `vite dev` under Node using the Vite binary resolved from your project. Two extras exist for the framework's own workspace and are no-ops elsewhere: if the framework packages resolve to symlinks outside `node_modules`, their `src/` folders are watched and the dev server is respawned when they change (Node's ESM cache survives a plain Vite restart); and a published copy of a framework package that shadows a workspace symlink in the local `node_modules` is removed with a log line.

## `build`, `preview`

`vite build` and `vite preview`, with the same shadow cleanup.

## `migrate`

`status`, `up` and `create <feature>/<name>`; `status` is the default. Reads `DATABASE_URL` (SQLite `file:` URLs only in v1, default `file:./data/app.db`). See [Migrations](/norns/data/migrations).

## `lint [--json]`

Scans `src/` (or the project root when there is no `src/`) for `.c`, `.civet` and `.n` files plus `vite.config.{js,ts,mjs}` and prints findings grouped by file. Exit code 1 when there is at least one error. `--json` prints `{ ok, errors, warnings, findings }`. See [Lint rules](/norns/cli/lint-rules).

## `check [--json] [--warnings]`

Compiles every component and Civet module the way the build would, without running the build, and reports `file:line:column` diagnostics. Exit code 1 on errors, 2 when the check itself could not run. See [check and diag](/norns/cli/check-and-diag).

## `diag [--template] <file>`

Prints the JavaScript Civet emits for a `.c` / `.civet` file or for the `<script>` block of a `.n` / `.svelte` file. With `--template` (components only) prints the Svelte source after the project's whole preprocess chain: Pug rendered, Civet compiled, auto-imports injected.
