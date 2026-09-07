---
title: Civet script
description: The subset of Civet that Norns code is written in, and the JavaScript it becomes.
---

[Civet](https://civet.dev) is a TypeScript-flavoured, indentation-based language that compiles to plain JavaScript. Norns uses it for `<script>` blocks in `.n` files and for `.c` modules. Types are optional and erased.

## Emit characteristics that matter for Svelte

| You write | Civet emits |
|---|---|
| `count .= $state 0` | `let count = $state(0)` |
| `count := $state 0` | `const count = $state(0)` |
| `{ a, b = 0 } := $props()` | `const { a, b = 0 } = $props()` |
| `total := $derived a + b` | `const total = $derived(a + b)` |
| `$effect =>` with an indented body | `$effect(() => { ... })` |
| `results := $derived.by =>` with a body | `const results = $derived.by(() => { ... })` |

Imports stay where you write them. Civet emits ESM-correct output, so runes need no extra fusion or lifting passes.

## The everyday subset

```civet
import { notes } from '$lib/norns/notes/server/public'

export class NotesService
	repo: NotesRepo
	constructor(@repo: NotesRepo)

	list(): Promise<Note[]>
		@repo.list()

	async create(input: NoteInput): Promise<number>
		id := await @repo.create input.title, input.body
		throw new Error 'failed' unless id
		id

export notes := (c: Container) => {
	list: () => svc(c).list()
	create: (input: NoteInput) => svc(c).create(input)
}
```

- `:=` declares `const`, `.=` declares `let`; the last expression of a function is its return value.
- `@repo` is `this.repo`; `constructor(@repo: NotesRepo)` declares and assigns the field.
- Calls may omit parentheses when unambiguous. Prefer parentheses after `new` and inside longer chains.
- `unless`, postfix `if` / `unless`, `x?` existence checks, `if c then a else b` as an expression.
- Indented object literals as arguments and arrow bodies, which is how `page.load` and `route` calls read.
- Template literals use backticks and `${}`.

## Where to stop

Dense generator, stream or type-level code hits parser edges. Put that in a `.js` file next to the `.c` files; the [Civet pitfalls](/norns/pitfalls/civet) page lists the known traps and `norns diag` prints the emitted JavaScript when you need to see it.
