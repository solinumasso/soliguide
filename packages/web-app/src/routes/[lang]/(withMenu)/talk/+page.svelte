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
