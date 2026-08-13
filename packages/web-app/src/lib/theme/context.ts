import { getContext, setContext } from 'svelte';
import type { Readable } from 'svelte/store';

import type { ThemeDefinition, ThemeLegalLinks } from './types';

const THEME_CTX_KEY = Symbol('themeContext');
const LEGAL_LINKS_CTX_KEY = Symbol('legalLinksContext');

/**
 * The theme is resolved per request from the hostname, and a different hostname
 * means a different document, so it cannot change while a page is alive. A plain
 * immutable object is therefore enough — no store, and no `$theme` in markup.
 */
export const setThemeContext = (theme: ThemeDefinition): void => {
  setContext(THEME_CTX_KEY, theme);
};

export const getThemeContext = (): ThemeDefinition => getContext(THEME_CTX_KEY);

/** Legal links do change with the language, so they are exposed as a store. */
export const setLegalLinksContext = (legalLinks: Readable<ThemeLegalLinks>): void => {
  setContext(LEGAL_LINKS_CTX_KEY, legalLinks);
};

export const getLegalLinksContext = (): Readable<ThemeLegalLinks> =>
  getContext(LEGAL_LINKS_CTX_KEY);
