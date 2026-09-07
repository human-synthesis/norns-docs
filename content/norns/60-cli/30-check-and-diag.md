---
title: check and diag
description: norns check compiles every file the way the build does and maps errors to the line you wrote; norns diag shows the compiled output.
---

## `norns check`

For every component file (each extension in your `svelte.config.js` `extensions`, so `.n` and `.svelte`) the command runs the project's own `preprocess` chain and then the Svelte compiler. For every `.c` / `.civet` module it runs the Civet compiler. Nothing is written; the result is a diagnostics list.

Each diagnostic carries `file`, `line`, `column`, `message`, `stage` (`civet`, `pug`, `preprocess` or `svelte`), a code frame, and `mapped`:

- **Pug and Civet errors** are mapped by norns-core to the source line you wrote, including inside `<script>` blocks of `.n` files (see [error mapping](/norns-core/guide/error-mapping)).
- **Svelte compile errors** are mapped back through the preprocess source map when the mapped line plausibly contains the offending text. Template positions usually cannot be mapped; those are reported against the preprocessed output with `mapped: false` and a hint to run `norns diag --template`.

```
src/routes/+page.n:18:7  error  Pug: Unexpected token ...
    > 18| 		li.rounded-md.border(
      19| 			.text-sm {item.text}

norns check: 1 error(s), 0 warning(s) across 12 file(s).
```

Flags: `--warnings` includes Svelte compiler warnings; `--json` prints `{ ok, files, errors, warnings }`. Exit code 1 on errors, 2 when the check could not run (for example a broken `svelte.config.js`).

`svelte-check` does not read `.n` or `.c` files at all. `norns check` is the pass signal for Norns code; keep `svelte-check` for the `.svelte` / `.ts` parts of a mixed project.

## `norns diag`

```sh
bunx norns diag src/lib/norns/notes/server/service.c
bunx norns diag src/routes/+page.n                  # the <script> block only
bunx norns diag --template src/routes/+page.n       # the whole component after preprocessing
```

The first form prints the JavaScript Civet emits. Use it when a Civet error is unhelpful or when the code compiles but behaves unexpectedly: the output proves whether your source means what you think it means.

`--template` runs the file through the project's `svelte.config.js` preprocess chain and prints the Svelte source the compiler sees: Pug rendered to markup, Civet compiled, auto-imports injected. This is the place to look when a Svelte error quotes markup you never wrote.
