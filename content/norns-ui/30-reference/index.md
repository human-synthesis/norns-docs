---
title: Reference
description: The generated component reference and migration notes.
---

- [Component reference](/norns-ui/reference/components) — every component with its import path and prop types. Generated from the library's type shims at build time.
- [Migrating 0.0.5 → 0.0.6](/norns-ui/reference/migration-0-0-6)

`.d.ts` shims under `src/types/` are the source of the prop tables; they are hand-maintained in the library until a `svelte-package` build exists for Civet + Pug source, and `bun run check:shims` in the norns-ui repo keeps them aligned with the components.
