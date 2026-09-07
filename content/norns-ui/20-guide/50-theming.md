---
title: Theming
description: The Tailwind v4 @theme tokens the library exposes and how to override them.
---

Tokens live in `src/styles/tokens.css` as a Tailwind `@theme` block, imported through `@human-synthesis/norns-ui/styles`.

| Group | Tokens |
|---|---|
| Colour scales | `primary`, `success`, `warning`, `danger`, `info`, each 50–950, in `oklch`. Use as `bg-primary-500`, `text-danger-700`, ... |
| Role tokens | `--color-fg`, `--color-fg-muted`, `--color-fg-subtle`, `--color-bg`, `--color-bg-muted`, `--color-bg-subtle`, `--color-bg-elevated`, `--color-border`, `--color-border-strong`, `--color-ring`. Atoms reference these; so should your components. They swap automatically in dark mode. |
| Feedback tokens | `--color-{success,warning,danger,info}-{bg,fg,border}` for tinted surfaces |
| Typography | `--font-sans`, `--font-mono` |
| Sizing | `--ui-radius-{sm,,lg,full}`, `--ui-h-{sm,md,lg}` (button heights), `--ui-icon-btn-{sm,md,lg}` |
| Motion | `--ui-motion-{fast,med,slow}` durations and `--ui-motion-ease`; every component transition uses them |
| Elevation | `--ui-elev-{1,2,3}` (subtle, floating, modal), deeper in dark mode |
| Focus | `--ui-focus-ring`, the one canonical focus indicator: `box-shadow: var(--ui-focus-ring)` on `:focus-visible` |

## Overriding

Re-declare in your `app.css` after the library import:

```css
@import '@human-synthesis/norns-ui/styles';

@theme {
  --color-primary-500: oklch(0.6 0.2 250);
  --font-sans: 'Inter Variable', sans-serif;
  --ui-radius-lg: 1rem;
}
```

Because the tokens are Tailwind theme variables, the generated utilities (`bg-primary-500`, `rounded-[var(--ui-radius-lg)]`) follow the override too.
