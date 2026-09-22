# CLAUDE.md, web-app

Public SvelteKit site of Soliguide. One deployment serves every country: the
theme is resolved per request from the hostname.

Read `Recommendations.md` for the reasoning behind the architecture and
`CONTRIBUTING.md` for the folder conventions. This file only lists what is easy
to get wrong.

## Stack

SvelteKit 2 on adapter-node, **Svelte 4**, TypeScript, SCSS, vitest,
`@soliguide/design-system` for the UI, i18next for the translations,
`@soliguide/common` for the types, the taxonomy and the translation catalogs.

## Architecture, from the inside out

- **Models** (`$lib/models`): business objects and the functions that build them
  from raw data. No Svelte, no service, no fetch.
- **Controllers** (`<route>/pageController.ts`): the state and the use cases.
  They expose a store (subscribe only, so the state cannot be tampered with from
  the outside) plus functions that match a user intention. Services are injected
  into the factory (`getXxxPageController(serviceA, serviceB)`), never imported
  at the top of the controller.
- **Services** (`$lib/services`, `$lib/server/services`): everything that talks
  to the outside world. Each one has an interface in the neighbouring `types.ts`
  and controllers depend on that interface only. `$lib/server` runs server side
  only and may read private environment variables.
- **UI** (`+page.svelte`, components): dumb. It renders the state and calls the
  controller. No business calculation in a component.

A route folder holds `+page.svelte`, `pageController.ts`, `pageController.spec.ts`,
`types.ts` and `index.ts` (the factory wiring the real services in).

## Rules that bite

1. **Svelte 4, not Svelte 5.** `export let`, `$:`, `on:click`, slots, stores.
   No runes, no `$props()`, no snippets, no `{@render}`.
2. **`eslint-plugin-fp` is on.** No `let`, no `for` or `while`, no mutation, no
   class, no `this`, no `push`/`sort`/`splice`. Use `const`, `map`/`filter`/
   `reduce`, spread, `[...list].sort()`. A deliberate exception is written as a
   narrow `eslint-disable-next-line` with a comment saying why, as in
   `hooks.server.ts`. `js.configs.all` is enabled too, so unusual rules fire.
3. **New components go in `$lib/components`**, exported from its `index.ts`.
   The route-local `components/` folders are historical.
4. **Check the design system first.** If a generic component is missing, add it
   to `@soliguide/design-system` rather than growing a local one.
5. **Translation keys live in `@soliguide/common`** (`src/translations/locales`)
   and must be added to **every** locale file, not only fr, en, es and ca.
   Rebuild common before expecting a new key here.
6. **The theme is per request.** Never keep it in module level state, concurrent
   requests would leak into each other. Server side it comes from
   `resolveThemeFromRequest`, in components from `getThemeContext()`.
7. **Build `@soliguide/common` before this package.** The `$locales` and
   `$suggestions-data` aliases point at its `dist/esm`.

## Tests

vitest picks up `src/**/*.spec.ts` only, and there is no DOM test. Testable
logic therefore belongs in the controller or in a model, not in a component.
Start from the acceptance criteria of the issue, test the intention rather than
the implementation, and inject fake services instead of mocking modules.

## Commands

```bash
yarn workspace @soliguide/web-app dev        # FR localhost:5173, ES es.localhost, AD ad.localhost
yarn workspace @soliguide/web-app test:unit  # add --run for a single pass
yarn workspace @soliguide/web-app check      # svelte-check, the type safety net
yarn workspace @soliguide/web-app lint       # check + eslint
yarn workspace @soliguide/web-app format:fix
```

## The mobile application

This site is also served inside a React Native webview (repository
`soliguide-webview`, sibling of this one). `$lib/services/nativeBridgeService.ts`
is the only door between the two, and every call returns a boolean saying
whether the native application took over, so the plain web behaviour is always
the fallback. A new message means a change in both repositories plus a store
release, and users stay on old versions for months: gate every capability on the
advertised version, never assume the shell answers.
