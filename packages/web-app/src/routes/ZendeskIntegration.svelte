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
