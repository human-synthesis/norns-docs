# norns-docs

**Documentation site for the Norns platform** — [norns-docs.humansynthesis.ai](https://norns-docs.humansynthesis.ai). One section per package: `norns`, `norns-core`, `norns-ui`, `norns-tron`, `norns-app`, `norns-demo`, plus cross-cutting reference pages.

It is a Norns app. The `docs` feature folder (content model, file-backed repo, service, facade) follows the same shape as any other feature, so the content source can be swapped (for example for a database, or for the planned norns-cms) without touching the routes.

## Run

```sh
bun install
bun run dev          # generates the norns-ui component reference, then norns dev
bun run build        # same, then a full prerender into .svelte-kit/cloudflare
bun run preview
```

## Check

```sh
bun run lint         # norns lint
bun run check        # norns check — every .n / .c through svelte.config.js
bun run build        # the final word
```

## Layout

```
content/<package>/NN-section/NN-page.md   the docs; frontmatter: title, description
scripts/gen-reference.mjs                 copies norns-ui's COMPONENTS.md into content/ (gitignored output)
src/
  hooks.server.c                          boots the runtime
  lib/norns/docs/
    shared/{site,packages}.js             site constants, the package list
    server/repo.js                        content source: import.meta.glob over content/**/*.md
    server/markdown.js                    marked + shiki (dual theme), callouts, heading ids
    server/service.c, public.c, module.c  service, facade, DI registration
  lib/components/                         SiteHeader, Sidebar, Toc, Search, SiteFooter
  routes/
    +layout.*                             shell; nav for the current package
    +page.n                               landing
    [package]/[...slug]/                  every docs page
    md/[package]/[...slug]/+server.c      Markdown twin of every page
    search.json, llms.txt, llms-full.txt, sitemap.xml
wrangler.toml                             Workers config, custom domain
.github/workflows/deploy.yml              lint, check, build, deploy on push to main
```

## Content conventions

- `NN-` prefixes order sections and pages and are stripped from the URL. `index.md` is the page for its folder.
- Links between pages are site-absolute: `/norns/runtime/container`.
- Callouts: `> [!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]`.
- Code fences: `civet`, `pug`, `sh`, `js`, `ts`, `json`, `sql`, `css`, `toml`, `yaml`.
- `content/norns-ui/30-reference/10-components.md` is generated; edit the shims in norns-ui instead.

## Deploy

Cloudflare Workers with static assets, everything prerendered. `bun run deploy` builds and runs `wrangler deploy`; the workflow does the same on push to `main` and needs the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets.

## License

MIT © Daniel Teodoroiu / [Human Synthesis](https://humansynthesis.ai).
