<script lang="ts">
  // Layout full page
  import { page } from '$app/stores';
  import { afterNavigate } from '$app/navigation';
  import { browser } from '$app/environment';
  import { onMount, setContext } from 'svelte';
  import { derived, get } from 'svelte/store';
  import ZendeskIntegration from './ZendeskIntegration.svelte';
  import { posthogService } from '$lib/services/posthogService';
  import {
    ThemeContext,
    getDesignSystemLocale,
    changeDesignSystemLocale
  } from '@soliguide/design-system';
  import '../assets/styles/main.scss';
  import { I18N_CTX_KEY, getI18nStore } from '$lib/client/i18n';
  import {
    ROUTES_CTX_KEY,
    getRoutes,
    isLanguageSelected,
    getZDCookieConsent,
    getGeolocationPermissionState
  } from '$lib/client';
  import { cookieConsent, COOKIE_CTX_KEY } from '$lib/client/cookie';
  import { themeStore } from '$lib/theme';
  import ToastContainer from '$lib/components/ToastContainer.svelte';

  themeStore.init($page.url.origin);
  const theme = get(themeStore.getTheme());

  export const i18nStore = getI18nStore(theme?.defaultLanguage, theme?.supportedLanguages);

  // Derived store for keeping routes synced with language choosed by user
  const routesStore = derived(i18nStore, (i18n) => getRoutes(i18n.language));

  // No lang selected, init with theme default
  if (!isLanguageSelected() && theme?.defaultLanguage) {
    $i18nStore.changeLanguage(String(theme.defaultLanguage));
  }

  if ($page.params.lang) {
    const langParam = $page.params.lang;
    if (getDesignSystemLocale() !== langParam || $i18nStore.language !== langParam) {
      $i18nStore.changeLanguage(langParam);
    }
  } else if (getDesignSystemLocale() !== $i18nStore.language) {
    // Sync design system lang
    changeDesignSystemLocale($i18nStore.language);
  }

  cookieConsent.set(getZDCookieConsent());

  setContext(I18N_CTX_KEY, i18nStore);
  setContext(ROUTES_CTX_KEY, routesStore);
  setContext(COOKIE_CTX_KEY, cookieConsent);

  if (browser) {
    onMount(() => {
      getGeolocationPermissionState()
        .then((geolocationPermissionState) => {
          posthogService.setPersonProperties({
            geolocationPermissionState
          });
        })
        .catch(console.error);
    });

    afterNavigate(() => posthogService.capture('$pageview'));
  }
</script>

<svelte:head>
  <meta property="og:url" content={$page.url.href} />
  <link rel="canonical" href={$page.url.href} />
</svelte:head>

<ThemeContext>
  <ZendeskIntegration>
    <main>
      <slot />
    </main>
    <ToastContainer />
  </ZendeskIntegration>
</ThemeContext>

<style lang="scss">
  main {
    height: 100%;
  }
</style>
