---
title: Class shorthand
description: The rewriter that lets Tailwind variants, slashes and fractions live in Pug's .class chains, and the extractor that tells Tailwind about them.
---

Pug's lexer rejects `:` and `/` inside class shorthand and mis-parses a fractional `.5` as a new class. norns-core rewrites element lines so the offending classes move into the `(class="...")` attribute before Pug sees them:

| You write | Pug receives |
|---|---|
| `.text-blue.hover:bg-red(href="/")` | `.text-blue(class="hover:bg-red" href="/")` |
| `.gap-2.5.flex` | `.flex(class="gap-2.5")` |
| `.bg-white/40.text-4xl(class="static")` | `.text-4xl(class="bg-white/40 static")` |
| `.a.sm:px-8(class!="{extra}")` | `.a(class!="sm:px-8 {extra}")` |

Routed classes are prepended to an existing static `class="..."`, or to a dynamic `class!="{...}"` where Svelte reads the result as text plus interpolation. Lines inside `<script>` / `<style>`, text lines (`|`), raw HTML (`<`), comments and mixin calls (`+if`) are left alone. Ids (`#main`) are always safe and stay in shorthand.

## Tailwind extraction

Tailwind v4's scanner cannot read a dotted chain as separate candidates, so the classes would render in the HTML without any CSS behind them. `extractPugClasses(content)` returns the set of shorthand classes plus the values of any `class="..."` / `class!="..."` attribute on the same line; the [`pugTailwindExtract()`](/norns/config/vite-plugin) Vite plugin in norns runs it over every `.n` file and writes a sidecar that Tailwind scans through `@source`.

Both functions share the same grammar for a class segment (`[\w/:-]` plus `.digits` continuations), so what the rewriter accepts the extractor also reports.
