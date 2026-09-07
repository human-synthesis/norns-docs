---
title: Motion
description: Five animated components that are opt-in imports, not part of the auto-import preset.
---

The motion tier depends on the `motion` package and is kept out of `presetUI()` so apps that do not use it never pay for it. Import what you need:

```civet
import { Reveal, AnimatedNumber, Sparkles, GradientBackground, LiquidButton } from '@human-synthesis/norns-ui/motion'
```

```pug
Reveal(direction="up" delay!="{0.1}")
	Card ...

AnimatedNumber(value!="{stats.users}" duration!="{1.2}" decimals!="{0}")
```

| Component | Props |
|---|---|
| `Reveal` | `direction` (`up`, `down`, `left`, `right`), `distance` px, `duration` s, `delay` s, `once` (default true), `threshold` for the IntersectionObserver |
| `AnimatedNumber` | `value`, `from`, `duration`, `decimals`, `format` |
| `Sparkles` | `density`, `colors`, `minSize`, `maxSize`, wraps `children` |
| `GradientBackground` | `colors`, `duration`, `angle`, wraps `children` |
| `LiquidButton` | the `Btn` props (`variant`, `size`, `type`, `disabled`, `icon`, `onclick`) with a liquid hover effect |

`ShinyButton`, `RippleButton`, `GradientText` and `ThemeToggler` are CSS-only and live in the regular component set.
