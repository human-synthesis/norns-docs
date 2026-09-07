---
title: norns-ui
description: Component library for the Norns ecosystem — Pug + Civet components on Tailwind v4, headless behaviors on @floating-ui/dom, Iconify icons, theming tokens and motion.
---

`@human-synthesis/norns-ui` ships around seventy components written as `.n` files, so they compile through the same pipeline as your app and can be shadowed by dropping a file with the same name into your project.

## Stack

- Svelte 5 components and runes, Pug templates, Civet scripts.
- Tailwind CSS v4 as a hard peer dependency; tokens are a Tailwind `@theme` block.
- `@floating-ui/dom` for every overlay (Popover, Dropdown, Tooltip, ContextMenu, pickers).
- In-tree headless behaviors: focus trap, scroll lock, click outside, escape, portal, roving tabindex.
- Iconify with the Lucide set bundled.
- `tailwind-merge` behind `cn()` for class deduplication.
- `@human-synthesis/norns` as a peer, for `nornsAutoImport` and `presetUI()`.

## What is in the box

| Tier | Components |
|---|---|
| Atoms (CSS only) | `.btn`, `.input`, `.field`, `.form`, `.checkbox`, `.radio`, `.switch`, `.card`, `.surface-elevated`, `.badge`, `.chip`, `.avatar`, `.skeleton`, `.progress`, `.norns-header`, `.hero`, `.stepper`, `.breadcrumbs`, `.pagination`, `.accordion`, `.carousel`, with variants and sizes |
| Forms | `Btn`, `Form`, `Field`, `FieldGroup`, `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`, `NumberInput`, `OtpField`, `TagsInput`, `Autocomplete`, `MultiSelect`, `DatePicker`, `DateRangePicker`, `TimePicker`, `Calendar`, `ColorPicker`, `Uploader` |
| Behavior | `Dialog`, `Sheet`, `Popover`, `Dropdown`, `Tooltip`, `Tabs`, `Accordion`, `ContextMenu`, `Collapsible`, `ScrollArea` |
| Display | `Card`, `Surface`, `Window`, `Banner`, `Badge`, `Chip`, `Avatar`, `AvatarGroup`, `Skeleton`, `Progress`, `ProgressCircular`, `Icon`, `Image`, `Audio`, `Video`, `Separator`, `GradientText`, `Timeline`, `DataTable`, `Tree` |
| Composite | `Header`, `HeroBanner`, `Stepper`, `Breadcrumbs`, `Pagination`, `Carousel`, `Toolbar`, `ButtonGroup`, `ToggleButton`, `ToggleButtonGroup`, `HierarchicalMenu`, `MegaMenu`, `CopyButton`, `ThemeToggler`, `ShinyButton`, `RippleButton` |
| Toast | `ToastProvider` plus `toast()` / `notify()` / `dismiss()` |
| Motion (opt-in) | `AnimatedNumber`, `GradientBackground`, `LiquidButton`, `Reveal`, `Sparkles` |

Every component accepts `class` and merges it with `cn()`. The [component reference](/norns-ui/reference/components) lists each one with its props; the live gallery is `/examples/ui` in [norns-demo](/norns-demo/ui-showcase).
