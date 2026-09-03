<script lang="ts">
  // Layout full page
  import { page } from '$app/stores';
  import { afterNavigate } from '$app/navigation';
  import { browser } from '$app/environment';
  import { onMount, setContext } from 'svelte';
  import { derived, get } from 'svelte/store';
  import ZendeskIntegration from './ZendeskIntegration.svelte';
  import { posthogService } from '$lib/services/posthogService';
  import { ThemeContext } from '@soliguide/design-system';
  import '../assets/styles/main.scss';
  import { I18N_CTX_KEY, getI18nStore, i18nReady } from '$lib/client/i18n';
  import {
    ROUTES_CTX_KEY,
    getRoutes,
    isLanguageSelected,
    getZDCookieConsent,
    getGeolocationPermissionState
  } from '$lib/client';
  import { cookieConsent, COOKIE_CTX_KEY } from '$lib/client/cookie';
  import { buildLegalLinks, setLegalLinksContext, setThemeContext } from '$lib/theme';
  import {
    CATEGORY_SERVICE_CTX_KEY,
    getCategoryServiceForTheme
  } from '$lib/services/categoryService';
  import ToastContainer from '$lib/components/ToastContainer.svelte';

  export let data;

  // Resolved per request from the hostname in `hooks.server.ts`
  const { theme } = data;

  export const i18nStore = getI18nStore(theme.defaultLanguage, theme.supportedLanguages);

  // Derived store for keeping routes synced with language choosed by user
  const routesStore = derived(i18nStore, (i18n) => getRoutes(i18n.language));

  // Legal documents are published under a localized path on each website
  const legalLinks = buildLegalLinks(theme);

  // No lang selected, init with theme default
  if (!isLanguageSelected() && theme.defaultLanguage) {
    $i18nStore.changeLanguage(String(theme.defaultLanguage));
  }

  /**
   * The URL owns the language, and this layout never remounts, so the sync has to
   * happen on every navigation rather than once on the first render.
   *
   * The instance is read through `get` instead of `$i18nStore` on purpose: this
   * must only re-run when the URL language changes, not on every catalog load,
   * which would re-enter while a change is still pending.
   *
   * The design system follows through the `languageChanged` handler installed in
   * `getI18nStore`, so it needs no separate sync here.
   */
  const syncLanguageWithUrl = (langParam: string | undefined): void => {
    const i18nInstance = get(i18nStore);

    if (langParam && i18nInstance.language !== langParam) {
      i18nInstance.changeLanguage(langParam);
    }
  };

  $: syncLanguageWithUrl($page.params.lang);

  cookieConsent.set(getZDCookieConsent());

  setThemeContext(theme);
  setLegalLinksContext(legalLinks);
  setContext(CATEGORY_SERVICE_CTX_KEY, getCategoryServiceForTheme(theme.name));
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
  <meta property="og:site_name" content={theme.brandName} />
  <link rel="canonical" href={$page.url.href} />
</svelte:head>

<!-- Catalogs are loaded on demand, so nothing renders until the initial language
     is available, otherwise raw translation keys would flash on first paint -->
{#await i18nReady then}
  <ThemeContext>
    <ZendeskIntegration>
      <main>
        <slot />
      </main>
      <ToastContainer />
    </ZendeskIntegration>
  </ThemeContext>
{/await}

<style lang="scss">
  main {
    height: 100%;
  }
</style>
