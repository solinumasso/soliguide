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
<script>
  // Layout full page
  import { page } from '$app/stores';
  import { beforeNavigate, afterNavigate } from '$app/navigation';
  import { browser } from '$app/environment';

  import { setContext } from 'svelte';
  import { derived } from 'svelte/store';
  import ZendeskIntegration from './ZendeskIntegration.svelte';
  import { posthogService } from '$lib/services/posthogService';

  import {
    ThemeContext,
    getDesignSystemLocale,
    changeDesignSystemLocale
  } from '@soliguide/design-system';
  import '../assets/styles/main.scss';
  import { THEME_CTX_KEY, resolveTheme } from '$lib/theme';
  import { I18N_CTX_KEY, getI18nStore } from '$lib/client/i18n.js';
  import { ROUTES_CTX_KEY, getRoutes, isLanguageSelected, getZDCookieConsent } from '$lib/client';
  import { cookieConsent, COOKIE_CTX_KEY } from '$lib/client/cookie.js';
  import { GTM } from '$lib/components';

  /** @typedef {import('@soliguide/common').SupportedLanguagesCode} SupportedLanguagesCode */

  const theme = resolveTheme($page.url.origin);
  const i18nStore = getI18nStore(
    /** @type {SupportedLanguagesCode} */ (theme?.defaultLanguage),
    /** @type {SupportedLanguagesCode[]} */ (theme?.supportedLanguages)
  );

  // Derived store for keeping routes synced with language choosed by user
  const routesStore = derived(i18nStore, (i18n) => getRoutes(i18n.language));

  // No lang selected, init with theme default
  if (!isLanguageSelected() && !!theme?.defaultLanguage) {
    $i18nStore.changeLanguage(String(theme.defaultLanguage));
  }

  if ($page.params.lang) {
    const langParam = $page.params.lang;
    if (getDesignSystemLocale() !== langParam || $i18nStore.language !== langParam) {
      $i18nStore.changeLanguage(/** @type {SupportedLanguagesCode} */ langParam);
    }
  } else if (getDesignSystemLocale() !== $i18nStore.language) {
    // Sync design system lang
    changeDesignSystemLocale($i18nStore.language);
  }

  cookieConsent.set(!!getZDCookieConsent());

  setContext(I18N_CTX_KEY, i18nStore);
  setContext(ROUTES_CTX_KEY, routesStore);
  setContext(THEME_CTX_KEY, theme);
  setContext(COOKIE_CTX_KEY, cookieConsent);

  if (browser) {
    beforeNavigate(() => posthogService.capture('$pageleave'));
    afterNavigate(() => posthogService.capture('$pageview'));
  }
</script>

<svelte:head>
  <meta property="og:url" content={$page.url.href} />
  <link rel="canonical" href={$page.url.href} />
</svelte:head>

<GTM />
<ThemeContext>
  <ZendeskIntegration>
    <main>
      <slot />
    </main>
  </ZendeskIntegration>
</ThemeContext>

<style lang="scss">
  main {
    height: 100%;
  }
</style>
