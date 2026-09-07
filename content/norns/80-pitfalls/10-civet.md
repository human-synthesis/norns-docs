---
title: Civet pitfalls
description: Constructs that Civet parses into something other than what you meant.
---

| Do not write | Write | Why |
|---|---|---|
| `if x isnt y` | `if x !== y` | `isnt` compiles to a bare identifier reference at runtime |
| `async *foo()` as a class method | a callback `foo(onEvent)` or a top-level `async function*` | the parser rejects async generators in class method shorthand |
| `value := $state ''` and later `value = 'x'` | `value .= $state ''` | `:=` creates `const`; reassigning `$state` needs `let`, which `.=` produces |
| `raw: unknown` / `raw: any` as a typed `let` | `raw .= null` (no annotation) or `let raw: any = null` | bare type annotations get read as identifier references |
| `# a comment` | `// a comment` | `#` is not a comment in Civet; `# x` compiles to a length shorthand (`this.length(x)`) and either fails or silently changes meaning |
| `import { and } from 'drizzle-orm'` | `import * as dz from 'drizzle-orm'` and `dz.and` | `and`, `or`, `not` are Civet operators and cannot appear bare in brace imports; as object keys quote them |

## Things that work and are worth knowing

- `x := 1` is `const`, `x .= 1` is `let`, `@x` is `this.x`, `constructor(@repo: Repo)` assigns the field.
- Implicit calls: `notes(container).create input` is `notes(container).create(input)`. Add parentheses whenever a chain could be read two ways, especially after `new`.
- `return x unless cond`, `return if cond`, `throw error 404, 'msg' unless doc` are all fine and used throughout the reference apps.
- `x?` is an existence check (`x != null`); `a?.b` is optional chaining.
- Indented object literals: an arrow body or an argument list can be a block of `key: value` lines; that is how `page.load handler: ...` and `boot features: ..., serializer: ...` are written.
- Double-quoted strings do not interpolate; use backtick template literals with `${}`.

When in doubt, `bunx norns diag <file>` prints the JavaScript and settles it.
