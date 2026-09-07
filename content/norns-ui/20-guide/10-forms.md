---
title: Forms
description: Form derives an error map from the page's form prop; each Field finds its own error by name; inputs inherit the field's id and name.
---

```pug
Form(action="?/create" form!="{form}")
	Field(label="Title" name="title" required)
		Input(name="title" value!="{form?.values?.title ?? ''}" required)
	Field(label="Body" name="body" help="Optional")
		Textarea(name="body" rows="3" value!="{form?.values?.body ?? ''}")
	Btn(type="submit" variant="primary") Create note

<script>
	{ data, form } := $props()
</script>
```

## How errors flow

1. `page.actions` validates the body with valibot and, on failure, returns `fail(400, { errors, values })` (see [validation](/norns/runtime/validation)).
2. SvelteKit hands that object to the page as `form`.
3. `<Form form={form}>` derives a `name → message` map from `errors[*].path[0].key` and exposes it through context.
4. `<Field name="title">` looks its message up from the context and switches the inner control to error styling. An explicit `error="..."` prop overrides the lookup.
5. `values` lets you echo what the user typed.

No per-page boilerplate; the same wiring works for every action.

## Field

| Prop | Notes |
|---|---|
| `label` | rendered above the control; used to derive an id when neither `id` nor `name` is set |
| `name` | key for the error lookup and the default id of the inner control |
| `help` | helper text shown when there is no error |
| `error` | explicit message, overrides the context |
| `required` | cosmetic asterisk; also set `required` on the input itself |
| `children` | snippet that renders the control |

`FieldGroup(legend="...")` wraps several fields in a `<fieldset>`.

## Inputs

`Input`, `Textarea`, `Select`, `Checkbox`, `Radio` and `Switch` are thin wrappers over the native elements: they accept the native attributes, an `error` boolean, `class`, and sizes where it makes sense. `Radio` takes `group` for `bind:group`. `Select` renders `<option>` children from its Pug body.

The richer inputs (`NumberInput`, `OtpField`, `TagsInput`, `Autocomplete`, `MultiSelect`, the date and time pickers, `ColorPicker`, `Uploader`) are custom components with bindable `value` props; see the [reference](/norns-ui/reference/components) for each prop list.
