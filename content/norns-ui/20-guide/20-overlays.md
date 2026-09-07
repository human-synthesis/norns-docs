---
title: Overlays
description: Dialog, Sheet, Popover, Dropdown, Tooltip, ContextMenu, Tabs, Accordion and Collapsible, all positioned by @floating-ui/dom and driven by the in-tree behaviors.
---

Every overlay takes a `trigger` snippet and renders its content from `children`; open state is a bindable `open` prop.

```pug
Dialog(title="Delete note" description="This cannot be undone.")
	+snippet('trigger')
		Btn(variant="danger" size="sm") Delete
	p Are you sure?
	+snippet('actions')
		Btn(variant="danger" onclick!="{confirm}") Delete

Popover(side="bottom" align="start")
	+snippet('trigger')
		Btn(variant="secondary") Filters
	.p-2 filter controls here

Tooltip(content="Save (⌘S)")
	+snippet('trigger')
		Btn(icon="lucide:save")

Dropdown(items!="{items}")
	+snippet('trigger')
		Btn(variant="ghost" icon="lucide:more-horizontal")
```

| Component | Notes |
|---|---|
| `Dialog` | modal with `title`, `description`, `actions` snippet, `dismissable` (overlay click and Escape, default true), `hideClose` |
| `Sheet` | side panel; `side` defaults to `'right'`, pass `'left'` for the old Drawer behaviour |
| `Popover` | `side`, `align`, `sideOffset` |
| `Dropdown` | menu from `items` (`{ label, icon, separator, disabled, onSelect }`) or custom `children` |
| `Tooltip` | `content` string, `delay`, `rich` for wider multiline styling; trigger can be a link |
| `ContextMenu` | right-click menu from `items`; nested submenus are accepted but ignored since 0.0.6 |
| `Tabs` | `items` with `panel` snippets, `value` bindable |
| `Accordion` | `items` with `content` snippets, `multiple` |
| `Collapsible` | `title` or `trigger`, `open`, `onopenchange` |

All of them use the [behaviors](/norns-ui/guide/behaviors) module underneath: portal into `body`, focus trap and scroll lock for modals, click-outside and Escape to dismiss, roving tabindex inside menus. Reuse the same actions in your own components so interactions stay consistent.
