# norns-docs — agent guide

The documentation site for the Norns platform, itself a Norns app. Content is markdown under `content/`; the app renders it through the `docs` feature folder in `src/lib/norns/docs/`.

## Layout

```
content/<package>/NN-section/NN-page.md    docs pages; frontmatter title + description
content/<package>/index.md                 package landing page
scripts/gen-reference.mjs                  writes content/norns-ui/30-reference/10-components.md (gitignored)
src/lib/norns/docs/server/repo.js          content source (import.meta.glob over content/**/*.md), nav tree, search index, llms.txt
src/lib/norns/docs/server/markdown.js      marked + shiki renderer
src/lib/norns/docs/server/service.c        page rendering, prev/next
src/lib/norns/docs/server/public.c         the facade routes import
src/routes/[package]/[...slug]/            page route; md/[package]/[...slug] is the Markdown twin
```

Routes import only the facade (`docs(container)`); the one exception is `allEntries()` from `repo.js`, used for prerender entries. Keep it that way: the CMS phase replaces `repo.js` with a database-backed repo and nothing else should notice.

## Editing content

- Add or edit files under `content/`. `NN-` prefixes order pages; `index.md` is the folder's page. Links are site-absolute (`/norns/runtime/container`).
- Document only what the package source does. When in doubt, read the package in the workspace (`../norns/packages/norns`, `../norns-core/packages/norns-core`, `../norns-ui`, `../norns-tron`) before writing.
- Do not hand-edit the generated component reference; fix the `.d.ts` shim in norns-ui.

## Commands

```sh
bun run dev              # gen-reference, then norns dev at http://localhost:5173
bun run lint             # norns lint — Civet / Pug pitfall scan
bun run check            # norns check — preprocess + compile every .n / .c
bun run build            # gen-reference, then full prerender
bunx norns diag <file>            # JS that Civet emits for a .c / .n script
bunx norns diag --template <f.n>  # Svelte source the compiler sees after Pug / Civet / auto-import
```

Deploys and pushes are user-gated: never push or run `wrangler deploy` without an explicit go-ahead in the current conversation.

## Working with norns (Civet + Pug + Svelte 5)

Civet is great for app code but has rough edges on advanced syntax. **When something doesn't parse or compile in Civet, drop to plain `.js` for that file — don't fight the parser.** Libraries and dense generator/stream/type code belong in `.js` (this repo keeps `repo.js` and `markdown.js` in JavaScript for that reason); routes, components, and feature glue stay in `.c`/`.n`.

### Civet pitfalls — do not write these

| Don't | Do | Why |
|---|---|---|
| `if x isnt y` | `if x !== y` | `isnt` compiles to a bare identifier reference at runtime |
| `async *foo()` as class method | callback `foo(onEvent)` or top-level `async function*` | parser rejects async generators in class shorthand |
| `value := $state ''` then later `value = 'x'` | `value .= $state ''` | `:=` creates `const`; reassigning `$state` needs `let` (which `.=` produces) |
| `raw: unknown` / `raw: any` as a let-with-type | `raw .= null` (no annotation) or `let raw: any = null` | bare `Type` annotations get read as identifier references |
| `# comment` | `// comment` | `#` is not a comment in Civet (`# x` compiles to `this.length(x)`); the build fails with "Missing property name after '.'" |

### Pug / `.n` pitfalls — do not write these

| Don't | Do | Why |
|---|---|---|
| `{@html foo}` as a top-level Pug line | `\| {@html foo}` (pipe-prefix) | Pug parses leading `{` as a malformed tag |
| `#{expr}` interpolation in template | `{expr}` (Svelte interpolation) | `#{...}` evaluates at preprocess time, with no runtime data in scope; SSR 500s |
| `attr="#{expr}"` attribute interpolation | `attr!="{expr}"` (Svelte) | same reason |
| `+each('row of rows')` | `+each('rows as row')` (Svelte `as` form, optionally `(row.id)` key) | the `of` form is copied verbatim into the block and the Svelte compiler rejects it |
| `#{expr}` or `.a.b` shorthand across a line break | keep one element per line | Pug is line-oriented; parse errors surface on the *next* line |

Template syntax that works: `+if('cond')` / `+elseif('cond')` / `+else`, `+each('items as item (item.id)')`, `+snippet('name', arg)` with `| {@render name(x)}`, `attr!="{expr}"` for Svelte expressions, `.a.b` class shorthand (Tailwind variants and fractions like `.hover:bg-x.gap-2.5` are rewritten for you), `svelte:head` as a tag.

### SvelteKit / norns gotchas

- **`event.locals.container`** is the per-request DI scope set by `contextHandle` in `boot()`. Take `container` from the wrapper context.
- **`svelte-check` never reads `.n` or `.c` files.** `norns check` is the pass signal for Norns code.
- **Everything is prerendered.** A route that reads request state at runtime will not work in production; the worker only serves misses.

### Verification workflow — run before claiming done

1. **`bun run lint`** — must show 0 errors.
2. **`bun run check`** — must exit 0.
3. **`bun run build`** — the final word; also catches broken internal links (reported as warnings until `handleHttpError` is switched to `'fail'` in `svelte.config.js`).
4. **`curl` through the dev server** — `curl -s localhost:5173/norns/runtime/container | head`, and `/md/...`, `/llms.txt`, `/search.json`.
