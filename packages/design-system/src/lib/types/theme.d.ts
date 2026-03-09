import type { Writable } from 'svelte/store';
import type { theme as defaultTheme } from '$lib/theme/theme.ts';

export type Theme = typeof defaultTheme;
export type ThemeColor = typeof defaultTheme.color;
export interface ThemeContext {
  theme: Writable<Theme>;
  setTheme: (theme: Theme) => void;
}
