---
title: Options
description: Every nornsAutoImport() option with its default.
---

| Option | Default | Notes |
|---|---|---|
| `helpers` | the five default modules | Pass `false` to disable. Each entry is `{ from, imports: [...], match? }` where `match` is a regex tested against the file name. Passing your own list **replaces** the defaults. |
| `componentDirs` | `['src/lib/components']` | Directories scanned for capitalised component files. `false` or `[]` disables the scan. |
| `componentExtensions` | `['.svelte', '.n']` | |
| `components` | `null` | `Record<name, importPath>` — a bare-specifier preset map, typically `presetUI().components`. |
| `exportGlobs` | `[]` | Off by default. Project-relative glob patterns (POSIX separators) for files to scan for named exports; opt in with e.g. `['src/lib/**/public.c']`. Replaced the older `exportDirs` in 0.0.11. |
| `exportExtensions` | `['.c', '.civet', '.js']` | `.ts` is excluded: regex scanning cannot tell value exports from type-only ones under `verbatimModuleSyntax`. |
| `libRoot` | `'src/lib'` | Project-relative root that `libAlias` maps to. |
| `libAlias` | `'$lib'` | Alias prefix emitted in import paths. |
| `root` | `process.cwd()` | Project root. |

## Notes on `exportGlobs`

SvelteKit route and hook files (`+*`, `hooks.*`) are excluded from the export scan, because their named exports (`load`, `actions`, `handle`, ...) are consumed by the framework and must never be imported. Server-path files are never auto-imported into client files, and a name exported from two files in the same scope is logged and excluded rather than guessed.

The starter and demo leave `exportGlobs` off and import project code explicitly (`import { notes } from '$lib/norns/notes/server/public'`). Only framework helpers and components are auto-imported there. Both styles are supported; explicit imports keep the dependency graph visible, which is why the reference apps use them. If you opt in, keep the scope to barrels (`public.c`) so a feature's internals stay private.

## Notes on `helpers`

Because `helpers` replaces the default list, a UI library's helpers (for example `toast()` from norns-ui) cannot be merged in today without restating the defaults. A `presets` or `additionalHelpers` option that extends instead of replacing is a planned follow-up; until then, presets deliver components only and you import `toast` explicitly.
