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
  import { page } from '$app/stores';
  import { getContext, setContext } from 'svelte';
  import {
    Menu,
    IconHomeOff,
    IconHomeOn,
    IconSearchOff,
    IconSearchOn,
    IconTalkOff,
    IconTalkOn,
    IconBurgerOff,
    IconBurgerOn
  } from '@soliguide/design-system';
  import { ROUTES_CTX_KEY } from '$lib/client';

  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import type { I18nStore, RoutingStore } from '$lib/client/types';
  import type { ThemeDefinition } from '$lib/theme/types';
  import { themeStore } from '$lib/theme/index';
  import { getHomePageController } from './pageController';
  import { zendeskService } from '$lib/services';
  import { get } from 'svelte/store';
  import { BottomNav, BottomNavItem } from 'flowbite-svelte';
  import { DarkMode } from 'flowbite-svelte';

  let btnClass =
    'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-xl p-2';
  const routes: RoutingStore = getContext(ROUTES_CTX_KEY);
  const i18n: I18nStore = getContext(I18N_CTX_KEY);
  const theme: ThemeDefinition = get(themeStore.getTheme());

  const pageStore = getHomePageController();

  setContext('CAPTURE_FCTN_CTX_KEY', pageStore.captureEvent);

  // Search, search results and place detail are in the same menu
  $: activeItem =
    $page.url.pathname.startsWith($routes.ROUTE_PLACES) ||
    $page.url.pathname === $routes.ROUTE_SEARCH
      ? $routes.ROUTE_PLACES
      : $page.url.pathname;

  // Remove menu item if Chat is not available
  const talkMenu = theme.chatWebsiteId
    ? [
        {
          icon: IconTalkOff,
          iconActive: IconTalkOn,
          label: $i18n.t('MENU_TALK'),
          ariaLabel: $i18n.t('MENU_TALK_ARIA'),
          ariaLabelActive: `${$i18n.t('MENU_TALK_ARIA')} ${$i18n.t('MENU_PAGE_ACTIVE')}`,
          route: $routes.ROUTE_TALK,
          hasBadge: true,
          id: 'chat'
        }
      ]
    : [];

  const menuItems = [
    {
      icon: IconHomeOff,
      iconActive: IconHomeOn,
      label: $i18n.t('ACCUEIL'),
      ariaLabel: $i18n.t('ACCUEIL'),
      ariaLabelActive: `${$i18n.t('ACCUEIL')} ${$i18n.t('MENU_PAGE_ACTIVE')}`,
      route: $routes.ROUTE_HOME,
      id: 'home'
    },
    {
      icon: IconSearchOff,
      iconActive: IconSearchOn,
      label: $i18n.t('SEARCH'),
      ariaLabel: $i18n.t('MENU_SEARCH_ARIA'),
      ariaLabelActive: `${$i18n.t('MENU_SEARCH_ARIA')} ${$i18n.t('MENU_PAGE_ACTIVE')}`,
      route: $routes.ROUTE_PLACES,
      id: 'search'
    },
    ...talkMenu,
    {
      icon: IconBurgerOff,
      iconActive: IconBurgerOn,
      label: $i18n.t('MENU_MORE_OPTIONS'),
      ariaLabel: $i18n.t('MENU_MORE_OPTIONS_ARIA'),
      ariaLabelActive: `${$i18n.t('MENU_MORE_OPTIONS_ARIA')} ${$i18n.t('MENU_PAGE_ACTIVE')}`,
      route: $routes.ROUTE_MORE_OPTIONS,
      id: 'more-options'
    }
  ];

  const handleMenuClick = (event: { detail: { item: string } }) => {
    const clickedItem = event.detail.item;
    pageStore.captureEvent('menu-clicked', { clickedItem });
  };
</script>

<DarkMode {btnClass} />
<BottomNav position="absolute" classInner="grid-cols-4" activeUrl="">
  <BottomNavItem btnName="Home">
    <IconHomeOn
      class="group-hover:text-primary-600 dark:group-hover:text-primary-500 mb-1 h-6 w-6 text-gray-500 dark:text-gray-400"
    /></BottomNavItem
  >
  <BottomNavItem btnName="Wallet">
    <IconHomeOn
      class="group-hover:text-primary-600 dark:group-hover:text-primary-500 mb-1 h-6 w-6 text-gray-500 dark:text-gray-400"
    /></BottomNavItem
  >
  <BottomNavItem btnName="Profile">
    <IconHomeOn
      class="group-hover:text-primary-600 dark:group-hover:text-primary-500 mb-1 h-6 w-6 text-gray-500 dark:text-gray-400"
    />
  </BottomNavItem>
</BottomNav>

<div class="sticky">
  <Menu
    {menuItems}
    {activeItem}
    showBadge={$zendeskService.hasNewMessage}
    on:menuClick={handleMenuClick}
  />
</div>

<style lang="scss">
  .sticky {
    background-color: var(--color-surfaceWhite);
    overflow: hidden;
    position: fixed;
    bottom: 0;
    height: var(--menu-height);
    width: 100vw;
    z-index: 2;
  }
</style>
