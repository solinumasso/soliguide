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
    IconBurgerOff,
    IconBurgerOn,
    IconFavoriteOff,
    IconFavoriteOn
  } from '@soliguide/design-system';
  import { ROUTES_CTX_KEY } from '$lib/client';

  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import type { I18nStore, RoutingStore } from '$lib/client/types';
  import { getHomePageController } from './pageController';

  const routes: RoutingStore = getContext(ROUTES_CTX_KEY);
  const i18n: I18nStore = getContext(I18N_CTX_KEY);

  const pageStore = getHomePageController();

  setContext('CAPTURE_FCTN_CTX_KEY', pageStore.captureEvent);

  // Search, search results and place detail are in the same menu
  $: activeItem =
    $page.url.pathname.startsWith($routes.ROUTE_PLACES) ||
    $page.url.pathname === $routes.ROUTE_SEARCH
      ? $routes.ROUTE_PLACES
      : $page.url.pathname;

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
    {
      icon: IconFavoriteOff,
      iconActive: IconFavoriteOn,
      label: $i18n.t('MENU_FAVORITES'),
      ariaLabel: $i18n.t('MENU_FAVORITES_ARIA'),
      ariaLabelActive: `${$i18n.t('MENU_FAVORITES_ARIA')} ${$i18n.t('MENU_PAGE_ACTIVE')}`,
      route: $routes.ROUTE_FAVORITES,
      id: 'favorites'
    },
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

<div class="sticky">
  <Menu {menuItems} {activeItem} on:menuClick={handleMenuClick} />
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
