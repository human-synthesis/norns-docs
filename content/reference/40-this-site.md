---
title: About this site
description: The docs are a Norns app — markdown under content/, a docs feature folder, prerendered on Cloudflare Workers.
---

`norns-docs` is a Norns app like any other. It dogfoods the stack: the content is a feature folder, the pages are `.n` files, the shell is norns-ui.

## How it is put together

- **Content** is markdown under `content/<package>/NN-section/NN-page.md`, with `title` and `description` frontmatter. The numeric prefix orders sections and pages and is stripped from the URL; `index.md` is the page for its folder. Callouts use `> [!NOTE]`, `[!TIP]`, `[!WARNING]`, `[!IMPORTANT]`, `[!CAUTION]`.
- **The docs feature** (`src/lib/norns/docs/`) is a normal feature folder: a `shared/` content model, a `server/repo.js` that bundles the markdown at build time through `import.meta.glob`, a `service.c` that renders pages and builds the sidebar, and a `public.c` facade the routes import. Because the routes only see the facade, the content source can be swapped (a database, or the planned norns-cms) without touching them.
- **Rendering** is marked plus shiki with a dual light/dark theme. Civet blocks use the CoffeeScript grammar until a Civet grammar exists.
- **Every page is prerendered** and served as a static asset from Cloudflare Workers; the worker only answers misses.
- **Agent-readable:** every page has a Markdown twin at `/md/<package>/<slug>`, listed in [`/llms.txt`](/llms.txt); [`/llms-full.txt`](/llms-full.txt) is the whole corpus in one file.
- **Generated reference:** the norns-ui [component reference](/norns-ui/reference/components) is copied from the installed package's `COMPONENTS.md` by `scripts/gen-reference.mjs` before every dev run and build, so it always matches the installed version.

## Contributing a page

1. Add or edit a file under `content/`. Links between pages are site-absolute (`/norns/runtime/container`).
2. `bun run dev` and check the page and the sidebar.
3. `bun run lint`, `bun run check`, `bun run build`.
4. Open a pull request against `human-synthesis/norns-docs`. Deploys happen from `main`.

The "Edit this page" link at the bottom of every page opens the file on GitHub.

## Planned

- Move each package's pages into that package's repository and pull them at build time, so docs change in the same commit as the code.
- One page per norns-ui component with a live demo next to the props.
- The norns CLI reference generated from the CLI's own help text.
- Once norns-cms exists, this site is a candidate first tenant: its packages, sections and pages map directly onto content types.
