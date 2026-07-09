<script lang="ts">
  import { getContext, onMount, onDestroy } from 'svelte';
  import { goto, beforeNavigate, afterNavigate } from '$app/navigation';
  import { ROUTES_CTX_KEY } from '$lib/client';
  import { zendeskService } from '$lib/services';
  import { COOKIE_CTX_KEY } from '$lib/client/cookie';
  import type { ThemeDefinition } from '$lib/theme/types';
  import type { CookieConsentStore, RoutingStore } from '$lib/client/types';
  import { themeStore } from '$lib/theme/index';
  import { get } from 'svelte/store';

  const routes: RoutingStore = getContext(ROUTES_CTX_KEY);
  const cookieConsent: CookieConsentStore = getContext(COOKIE_CTX_KEY);
  const theme: ThemeDefinition = get(themeStore.getTheme());

  $: useChat = Boolean(theme.chatWebsiteId);

  let previousPage: string;
  let nextPage: string;

  beforeNavigate((beforeData) => {
    // Used when we navigate via the menu (large screens)
    nextPage = beforeData?.to?.url.pathname ?? '';
  });

  afterNavigate(({ from }) => {
    previousPage = from?.url.pathname ?? '';
  });

  $: if (!useChat) {
    // Do not stay on this page
    goto($routes.ROUTE_HOME);
  }

  onMount(() => {
    if (useChat && $cookieConsent) {
      zendeskService.openChat();
      zendeskService.registerCloseCallback(() => {
        goto(nextPage || previousPage || $routes.ROUTE_HOME);
      });
    }
  });

  onDestroy(() => {
    if (useChat && $cookieConsent) {
      zendeskService.closeChat();
    }
  });
</script>
