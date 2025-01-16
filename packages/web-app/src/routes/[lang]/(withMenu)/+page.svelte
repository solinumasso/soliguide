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
  import { getContext, setContext } from 'svelte';
  import { goto } from '$app/navigation';
  import { Text } from '@soliguide/design-system';
  import { ROUTES_CTX_KEY } from '$lib/client';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import SearchButtonInput from './SearchButtonInput.svelte';
  import { getHomePageController } from './pageController';
  import type { I18nStore, RoutingStore } from '$lib/client/types';
  import type { ThemeDefinition } from '$lib/theme/types';
  import { get } from 'svelte/store';
  import { themeStore } from '$lib/theme';

  const i18n: I18nStore = getContext(I18N_CTX_KEY);
  const theme: ThemeDefinition = get(themeStore.getTheme());
  const routes: RoutingStore = getContext(ROUTES_CTX_KEY);

  const pageStore = getHomePageController();

  setContext('CAPTURE_FCTN_CTX_KEY', pageStore.captureEvent);

  const goSearch = () => {
    pageStore.captureEvent('start-search');
    goto($routes.ROUTE_SEARCH);
  };
</script>

<svelte:head>
  <title>{$i18n.t('SOLIGUIDE_THE_SOLIDARITY_GUIDE_ONLINE', { brandName: theme.brandName })}</title>
  <meta
    name="description"
    content={$i18n.t('HOME_PAGE_DESCRIPTION', {
      brandName: theme.brandName
    })}
  />
</svelte:head>

<section>
  <div class="header">
    <span class="title">
      <Text as="h1" type="title3PrimaryExtraBold">{$i18n.t('HOME_TITLE')}</Text>
    </span>
    <img src={`/images/${theme.media.homeIllustration}`} alt="Soliguide" />
  </div>
  <div class="hello">
    <Text as="h2" type="title3PrimaryBold">{$i18n.t('HELLO')} 👋</Text>
  </div>
  <div class="search-block">
    <Text type="title2PrimaryExtraBold">{$i18n.t('START_A_SEARCH')}</Text>
    <SearchButtonInput on:click={goSearch} />
  </div>
</section>

<style lang="scss">
  section {
    padding: var(--spacingXL) var(--spacingLG);
  }

  .header {
    margin-bottom: var(--spacing3XL);
    display: flex;
    flex-direction: column;
    align-items: center;

    .title {
      text-align: center;
      display: inline-block;
      max-width: 250px;
      margin-bottom: var(--spacingXL);
    }
    img {
      width: 280px;
      height: 280px;
    }
  }
  .hello {
    margin-bottom: var(--spacingXS);
  }
  .search-block {
    display: flex;
    flex-direction: column;
    gap: var(--spacingXS);
    margin-bottom: var(--spacing3XL);
  }
</style>
