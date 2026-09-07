---
title: Fork and release policy
description: Two forks that never modify upstream, four npm packages published by hand, and the apps consumed from GitHub.
---

## The two forks

- `human-synthesis/norns-core` is a fork of `sveltejs/svelte`. `packages/svelte/` is an untouched mirror of upstream; `packages/norns-core/` is ours.
- `human-synthesis/norns` is a fork of `sveltejs/kit`. `packages/kit/` and the upstream `packages/adapter-*/` are untouched; `packages/norns/` is ours.

They are separate forks because their upstreams are separate repositories with independent release cycles. The forks exist to track upstream (`git fetch upstream && git merge upstream/main`) and to develop the Norns packages alongside the upstream packages in the same monorepo. **Nothing in the upstream packages is modified** beyond minimal package-manager script tweaks; every change there would be a future merge conflict.

We do not publish `svelte` or `@sveltejs/kit`. Users get those from the official packages through peer dependencies, and they never know the forks exist.

## What is published

| Published to npm | Not published |
|---|---|
| `@human-synthesis/norns-core`, `@human-synthesis/norns`, `@human-synthesis/norns-ui`, `@human-synthesis/norns-tron` | `norns-app` (consumed through `bun create`), `norns-demo` and `norns-docs` (cloned) |

Releases are manual: bump the version, verify locally (lint, check, build, the reference apps), commit and push, then publish from the package directory. Nothing is pushed or published without an explicit decision.

## Decisions baked in

- **No new component extension.** `.n` and `.c` are aliases on SvelteKit's `extensions` and `moduleExtensions`; forking the Svelte compiler for a `.norns` format would be high cost for no value.
- **Civet, not CoffeeScript** (since May 2026). Civet emits ESM-correct output and supports optional types, which removed two preprocessor passes that existed only to paper over CoffeeScript's emit.
- **norns-ui is standalone**, not a fork, and iterates faster than the framework; it only requires a compatible range of `norns` and `norns-core`.
- **Starter and demo are split** (May 2026) so each can be honest: `norns-app` is the smallest complete app, `norns-demo` is the showcase and comparison.
- **The runtime is opinionated.** Feature folders, DI, validated input and the facade boundary are the product, not syntax sugar.
