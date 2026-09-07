---
title: Lint rules
description: The static checks behind norns lint, each tied to a documented Civet or Pug pitfall.
---

`norns lint` is a fast regex scan, not a compiler. It exists because the pitfalls below either compile to something wrong at runtime or fail with an error that points at the wrong line. Every rule maps to an entry on the [Civet](/norns/pitfalls/civet) or [Pug](/norns/pitfalls/pug) pitfalls page.

## Civet rules

Applied to whole `.c` / `.civet` files and to `<script>` blocks whose language is Civet (the default in `.n` files). Comment lines and string contents are ignored.

| Rule | Severity | Trigger | Fix |
|---|---|---|---|
| `civet/no-isnt` | error | `isnt` anywhere in code | use `!==`; `isnt` compiles to a bare identifier reference |
| `civet/no-async-generator-method` | error | an indented `async *name(` (class method shorthand) | a callback API or a top-level `async function*` |
| `civet/state-const-reassign` | error | `name := $state ...` followed later by an assignment to `name` | declare it with `.=`, which emits `let` |

## Pug rules

Applied to template lines of `.n` / `.svelte` files, outside `<script>` and `<style>` blocks.

| Rule | Severity | Trigger | Fix |
|---|---|---|---|
| `pug/svelte-block-needs-pipe` | error | a line starting with `{@`, `{#`, `{:` or `{/` | prefix with `\| ` so Pug emits it as text |
| `pug/no-pug-interpolation` | error | `#{` not escaped as `\#{` | Svelte `{expr}`; Pug interpolation runs at preprocess time with no runtime data |
| `pug/each-as-form` | error | `+each('item of items')` | `+each('items as item')`, optionally with a `(item.id)` key |

## Vite config

| Rule | Severity | Trigger |
|---|---|---|
| `vite/allowed-hosts` | warning | `server.allowedHosts` is neither `true` nor a list; reverse-proxied dev requests will be blocked |

## Scope

The walk skips `node_modules`, `.svelte-kit`, `.git`, `build`, `dist`, `static`, `.next`, `.cache`, `.turbo`, `data`, `coverage` and every dot-directory. A file that cannot be read produces a `lint/read-error` warning instead of aborting the run.

## Output

```
src/routes/+page.n
    18  error  pug/each-as-form  Svelte `{#each}` takes `items as item`, not `item of items`. ...

norns lint: 1 error(s), 0 warning(s) across 1 file(s).
```

`--json` returns the same findings as `{ file, line, severity, rule, msg }` records with `file` relative to the project root.
