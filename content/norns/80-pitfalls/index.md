---
title: Pitfalls
description: The handful of Civet and Pug constructs that compile to the wrong thing, and the verification order that catches them.
---

Civet is a good fit for app code and has rough edges on advanced syntax. The rule that saves the most time: **when something does not parse or compile in Civet, drop to plain `.js` for that file**. Libraries and dense generator, stream or type-heavy code belong in `.js`; routes, components and feature code stay in `.c` / `.n`.

- [Civet pitfalls](/norns/pitfalls/civet)
- [Pug pitfalls](/norns/pitfalls/pug)
- [Verification workflow](/norns/pitfalls/verification)

`norns lint` catches the mechanical cases; `norns check` catches everything that fails to compile. The `CLAUDE.md` shipped with the starter and the demo carries the same tables so coding agents see them.
