# Design-system

This project was generated with [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

This app is the design system component library for Soliguide.

## Usage

Within the Soliguide workspace, the `design-system` package can be used by adding the following dependency in `package.json`:

```json
{
  "dependencies": {
    "@soliguide/design-system": "workspace:*"
  }
}
```

### Theme and style

The design system has its own styles and exposes a theming feature.
Put your application within the design system's context to use it.

```sveltehtml
<script>
  // src/routes/+layout.svelte
  import { ThemeContext } from '@soliguide/design-system';
  import { awesomeTheme } from './theme.js';
</script>

<!-- Use the ThemeContext component around your app -->
<ThemeContext theme={awesomeTheme}>
  <!-- your app -->
</ThemeContext>
```

If not theme is provided to the `ThemeContext`, the Soliguide default theme will be applied.

### Change the theme

Theme is accessed and changed by accessing the context within a child component:

```sveltehtml
<script>
  import { getContext } from 'svelte';
  const { theme, setTheme } = getContext('theme');
  import { exampleTheme, otherExampleTheme } from './theme.js';

  const switchTheme = () => {
    setTheme($theme === exampleTheme ? otherExampleTheme : exampleTheme);
  }
</script>

<button on:click={switchTheme}>Click me!</button>

<pre>Current theme: {JSON.stringify($theme, null, 2)}</pre>
```

### Components

All the components and other exports are imported the same way :

```js
import { ComponentA, ComponentB, jsHelperFunction } from '@soliguide/design-system';
```

About types, there is several ways to use them:

```js
// Within JSDoc
import { types } from '@soliguide/design-system';

// Using imported types
/** @type {types.CustomType} */
const btnType2 = 'primary';

// Import the type directly
/** @type {import('@soliguide/design-system').types.CustomType} */
const btnType = 'primary';
```

```ts
// In Typescript files
import { types } from '@soliguide/design-system';

const myObject: types.CustomType = { a: 1 };
```
