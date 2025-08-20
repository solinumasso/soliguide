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
<script lang="ts">
  import { setContext, onMount } from 'svelte';
  import { writable } from 'svelte/store';

  import { theme as defaultTheme } from './theme';
  import type { Theme, ThemeContext } from '$lib/types/theme';
  import '../styles/theme.css';

  export let currentTheme = defaultTheme;

  const themeKeys: (keyof Theme)[] = [
    'color',
    'text',
    'leading',
    'fontWeight',
    'spacing',
    'radius',
    'shadow'
  ];
  const themeStore = writable<Theme>();

  const applyTheme = (themeToApply: Theme): void => {
    themeStore.set(themeToApply);

    themeKeys.forEach((key) => {
      Object.entries(themeToApply[key]).forEach(([prop, value]) => {
        // add prefix only for typography and colors
        const varString = ['color', 'text', 'leading', 'fontWeight'].includes(key)
          ? key === 'fontWeight'
            ? `--font-weight-${prop}`
            : `--${key}-${prop}`
          : `--${prop}`;
        document.documentElement.style.setProperty(varString, value.toString());
      });
    });
  };

  onMount(() => {
    applyTheme(currentTheme);
  });

  setContext<ThemeContext>('theme', {
    theme: themeStore,
    setTheme: (theme = defaultTheme) => {
      // Merge values to avoid missing items or bad structure
      const mergedTheme = { ...defaultTheme, ...theme };
      applyTheme(mergedTheme);
    }
  });
</script>

<!-- Wait for the theme to be set -->
{#if $themeStore}
  <slot />
{/if}
