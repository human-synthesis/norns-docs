---
title: Packages
description: Every repository in the Norns platform, what it publishes, and how it is consumed.
---

| Package / repository | Contents | Distribution |
|---|---|---|
| `@human-synthesis/norns` (`human-synthesis/norns`, `packages/norns`) | config, Civet Vite plugin, auto-imports, server runtime, migrations, CLI | npm |
| `@human-synthesis/norns-core` (`human-synthesis/norns-core`, `packages/norns-core`) | the Pug + Civet preprocessor | npm |
| `@human-synthesis/norns-ui` (`human-synthesis/norns-ui`) | component library | npm |
| `@human-synthesis/norns-tron` (`human-synthesis/norns-tron`) | TRON wire format | npm |
| `norns-app` | starter template | `bun create human-synthesis/norns-app` |
| `norns-demo` | reference app | `git clone`; hosted at `norns-demo.humansynthesis.ai` |
| `norns-docs` | this site | `git clone`; hosted at `norns-docs.humansynthesis.ai` |

The installed versions this site was built against are shown on the [landing page](/). Releases are manual and user-gated; see the [policy](/reference/upstream-policy).

## Peer relationships

- `norns` depends on `norns-core` and on `@danielx/civet`; it has `@sveltejs/kit`, `svelte` and `vite` as peers.
- `norns-ui` has `norns`, `norns-core`, `svelte` and `tailwindcss` as peers (the first two non-optional, because its components need the Norns pipeline to compile).
- `norns-tron` has no runtime dependencies and `valibot` as an optional peer.

## Test suites

Every framework repository has a `bun test` suite: norns (boot, container and scopes, wrappers, validation, migrate, drivers, Vite plugin, auto-import), norns-core (preprocessor, vetted subset and known traps), norns-ui (`presetUI()` map, `cn()`), norns-tron (encode/decode round-trips, server and client glue, valibot derivation). norns-app carries one bun test that exercises its feature through the DI container; norns-demo has no suite. Every app is verified through `norns lint`, `norns check` and the build.
