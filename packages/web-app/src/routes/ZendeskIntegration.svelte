<script lang="ts">
  import { getContext } from 'svelte';
  import { ROUTES_CTX_KEY } from '$lib/client/index';
  import { zendeskService } from '$lib/services';
  import { beforeNavigate, goto } from '$app/navigation';
  import { COOKIE_CTX_KEY } from '$lib/client/cookie';
  import { CookieModal } from '$lib/components';
  import { themeStore } from '$lib/theme';
  import { get } from 'svelte/store';
  import type { ThemeDefinition } from '$lib/theme/types';
  import type { CookieConsentStore, RoutingStore } from '$lib/client/types';

  const theme: ThemeDefinition = get(themeStore.getTheme());
  const routes: RoutingStore = getContext(ROUTES_CTX_KEY);
  const cookieConsent: CookieConsentStore = getContext(COOKIE_CTX_KEY);

  let ready = false;
  let showCookieModal = false;

  $: useChat = Boolean(theme.chatWebsiteId);
  $: scriptSrc = `https://static.zdassets.com/ekr/snippet.js?key=${theme.chatWebsiteId}`;
  $: showContent = (useChat && ready && $cookieConsent) || !$cookieConsent || !useChat;

  beforeNavigate(({ to, cancel }) => {
    const destination = to?.url.pathname;
    if (destination === $routes.ROUTE_TALK) {
      if (!$cookieConsent) {
        // Cancel navigation
        cancel();
        showCookieModal = true;
      }
    }
  });

  const load = () => {
    zendeskService.init();
    ready = true;
  };

  const closeCookieModal = () => {
    showCookieModal = false;
    if ($cookieConsent) {
      // We can now go to Talk page
      goto($routes.ROUTE_TALK);
    }
  };
</script>

<svelte:head>
  {#if $cookieConsent && useChat}
    <script id="ze-snippet" src={scriptSrc} on:load={load}></script>
  {/if}
</svelte:head>

{#if showCookieModal}
  <CookieModal
    cookiePolicyLink={theme.links.cookiePolicy}
    zendeskChatbotLink={$routes.ROUTE_TALK}
    on:close={closeCookieModal}
  />
{/if}

<!-- make sure the script is loaded before we use it -->
{#if showContent}
  <slot />
{/if}

<style lang="scss">
  :global(#launcher) {
    // Hide the default Chat button
    // /!\ On large screens, we lose the close button
    // as it is no longer attached to the zendesk header
    visibility: hidden;
  }
</style>
