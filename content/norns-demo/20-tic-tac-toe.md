---
title: Tic-tac-toe
description: Component composition, Svelte stores in a Civet module, $effect, a toggle group and a small AI.
---

`src/routes/examples/norns/tic-tac-toe/` has no server side; it is a client-side game built from `Game.n`, `Board.n`, `Cell.n`, `store.c` and `ai.c`.

## The store

`store.c` uses Svelte stores from a Civet module. `writable`, `derived` and `get` are auto-imported from `svelte/store`:

```civet
mode := writable '1v1'
board := writable newBoard()
turn := writable 'X'
stats := writable { X: 0, O: 0, draw: 0 }

result := derived board, ($b) =>
	for [a, x, y] of LINES
		if $b[a]? and $b[a] is $b[x] and $b[x] is $b[y]
			return { winner: $b[a], line: [a, x, y] }
	if $b.every((c) => c?) then { winner: null, line: [] } else null

play := (idx) =>
	return if get(result)?
	$b := get board
	return if $b[idx]?
	...
```

Note the Civet idioms: `is` for `===`, `x?` existence checks, `return if cond`, and `if ... then ... else` as an expression.

## The component

`Game.n` subscribes with the `$store` syntax in the template (`{$stats.X}`, `$board`), uses a `ToggleButtonGroup` for the mode, and a `$effect` that increments the stats once per finished game:

```civet
notified .= $state false

$effect =>
	if $result?
		unless notified
			incrementStats $result.winner
			notified = true
	else
		notified = false
```

`notified` is declared with `.=` because it is reassigned; `:=` would make it a `const` and `norns lint` would flag it.

`Board.n` and `Cell.n` are colocated components picked up by the auto-importer because `src/routes` is in `componentDirs`; `ai.c` exports `scheduleAiMove`, imported explicitly.

## The vanilla twin

`src/routes/examples/svelte/tic-tac-toe/` implements the same game in `.svelte` / `.ts`.
