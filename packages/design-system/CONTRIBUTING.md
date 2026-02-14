<!--
Soliguide: Useful information for those who need it

SPDX-FileCopyrightText: © 2024 Solinum

SPDX-License-Identifier: AGPL-3.0-only

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
-->

# Contributing to the design system

Make sure you are familiar with the information contained in the parent `CONTRIBUTING.md` file located at the root folder of the Soliguide project.

This file presents how contribute to the design system : how to setup, run and create new code.

## Setup development environment

### Installation and development server

Clone the repository and install dependencies with `yarn install`

Use the dev server to work on the components:

```bash
# Launch the dev server at http://localhost:5173
yarn dev
```

The app live reloads as sources change.

This dev app can be used as a playground to test components, but won't be part of the design system once built.

### Build

To create a production version of the design system:

```bash
yarn build
```

### Test

Tests are run when using `yarn test`.

_Note: Unit tests run in watch mode when launched locally. This feature is disabled when running in the CI.
You can run unit tests without watch mode by issuing this command : `yarn vitest run`._

### Type checking

This app is written in JavaScript but uses Typescript as a type-checker. Types are declared in JSDoc.

To check type-safety throughout the app, run `yarn check` or `yarn check:watch` to have it in watch-mode.

NB: You can declare custom types in .d.ts files.
Make sure they are exported from `src/lib/types/index.d.ts` if you plan to use them outside the design system.

---

## Contribution guidelines

### Folder structure

See https://kit.svelte.dev/docs/project-structure for general info.

Since we are building a library, all components are created in the `lib` folder.
Only components, types and other items exported by `src/lib/index.js` can be used outside the design system.

### Architecture

The app architecture is meant to be easy to reason with. The main rules are:

- have the needed code as close as where it is used
- when a component or a file is reused, it is hoisted at the level immediately visible by its consumers
- When a component or a file is not reused, it is nested

This organization ensures that a subtree can be moved with no excessive refactoring needed.

Separate business logic and UI as much as possible to ease testability

Utilities: `util` namespace is not allowed. Prefer small topic-oriented namespaces, i.e `mail`, `date`, `text`, `media`
