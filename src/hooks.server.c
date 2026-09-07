// Boots the norns runtime and registers every feature module under
// src/lib/norns/*/server/module.c. The docs feature is the only one today;
// the CMS phase adds its own feature folders and this file stays as is.
features := import.meta.glob './lib/norns/*/server/module.c', { eager: true }

app := await boot { features }

{ handle, handleError } := app
export { handle, handleError }
