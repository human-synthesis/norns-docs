---
title: Migrating 0.0.5 → 0.0.6
description: Bits UI was removed in 0.0.6; overlays moved to @floating-ui/dom plus the in-tree behaviors.
---

Most APIs are unchanged. The breaking changes:

- `<Drawer>` is gone. Use `<Sheet side="left">`; `Sheet` now defaults to `'right'`, so pass the side you want.
- `<RichTooltip>` is gone. Use `<Tooltip rich>`.
- `<PreviewCard>` is gone. Use `<Tooltip rich>` with the trigger as a link:

  ```pug
  Tooltip(rich!="{true}" content="...")
  	+snippet('trigger')
  		a(href="/profile") @daniel
  ```

- `<ContextMenu>` no longer renders nested submenus. The `children` field on items is accepted but ignored.
- The `scopeToProject` wrapper in `svelte.config.js` is no longer needed. It existed only to keep svelte-preprocess from corrupting Bits UI's TypeScript source; remove it.
