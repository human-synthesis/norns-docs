---
title: Error mapping
description: Pug and Civet errors are mapped back to the file, line and column you wrote, with a code frame.
---

Two things make raw errors useless in a `.n` file. svelte-preprocess renders Pug with a ~50-line mixin prelude prepended, so Pug's line numbers point ~50 lines past the real one, on top of the `+if` / `+snippet` rewrites that move lines. And a Civet error inside a `<script>` block is relative to the block, not the file.

norns-core keeps the original source of each `.n` file it processes and maps both kinds of errors back:

- **Pug errors** become `PugError` with `code: 'norns_pug_error'`, `line`, `column`, a `frame` over your source, and a message of the form `Page.n:18:7: Pug: <message>`. The prelude offset is voted from the lines of Pug's own code frame that can be found verbatim in the template; rewritten lines (`| {#if x}` from `+if('x')`) are searched in their original spelling. When the exact line cannot be found the nearest plausible one is used and the message says `(approximate line)`.
- **Civet script errors** keep Civet's `ParseError` but get `code: 'norns_civet_error'` and a file-relative `line`, `column` and `frame`.

`norns check` prints these as `file:line:column` diagnostics, and the `stage` field tells you which compiler produced them. Svelte compile errors are a separate case handled by `norns check` through the preprocess source map; see [check and diag](/norns/cli/check-and-diag).
