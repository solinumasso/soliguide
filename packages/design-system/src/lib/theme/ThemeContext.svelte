<script lang="ts">
  import { setContext, onMount } from 'svelte';
  import { writable } from 'svelte/store';

  import { theme as defaultTheme } from './theme';
  import type { Theme, ThemeContext } from '$lib/types/theme';
  import '../styles/main.scss';

  export let currentTheme = defaultTheme;

  const themeKeys: (keyof Theme)[] = ['color', 'typography', 'spacing', 'radius', 'shadow'];
  const themeStore = writable<Theme>();

  const applyTheme = (themeToApply: Theme): void => {
    themeStore.set(themeToApply);

    themeKeys.forEach((key) => {
      Object.entries(themeToApply[key]).forEach(([prop, value]) => {
        // add prefix only for typography and colors
        const varString = ['color', 'typography'].includes(key) ? `--${key}-${prop}` : `--${prop}`;
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
