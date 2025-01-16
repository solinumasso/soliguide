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
  import { goto } from '$app/navigation';
  import { getContext, setContext } from 'svelte';
  import IntersectionObserver from './components/IntersectionObserver.svelte';
  import pageStore from './index';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import { ROUTES_CTX_KEY } from '$lib/client';
  import { Text, PageLoader } from '@soliguide/design-system';
  import Card from './components/card/ResultsCard.svelte';
  import ResultsTopBar from './components/ResultsTopBar.svelte';
  import { get } from 'svelte/store';
  import { themeStore } from '$lib/theme';
  import type { I18nStore, RoutingStore } from '$lib/client/types';
  import type { ThemeDefinition } from '$lib/theme/types';

  const { url } = $page;

  const routes: RoutingStore = getContext(ROUTES_CTX_KEY);
  const i18n: I18nStore = getContext(I18N_CTX_KEY);
  const theme: ThemeDefinition = get(themeStore.getTheme());

  setContext('CAPTURE_FCTN_CTX_KEY', pageStore.captureEvent);

  // When there is no params, try to rebuild url and reuse store, or redirect to search tunnel
  if (url.searchParams.size === 0) {
    if ($pageStore.urlParams) {
      // We passing here only when coming back from a place
      // Recover id of the last place visited
      const { hash } = $page.url;
      // Sync url params with store params
      const searchParams = new URLSearchParams(
        $pageStore.urlParams as unknown as Record<string, string>
      ).toString();

      goto(`${url.pathname}?${searchParams}${hash}`, { replaceState: true });
    } else {
      // don't have params in store and in URL -> redirect to tunnel
      goto($routes.ROUTE_SEARCH, { replaceState: true });
    }
  }

  pageStore.init({
    location: url.searchParams.get('location') ?? '',
    category: url.searchParams.get('category') ?? '',
    lang: url.searchParams.get('lang') ?? '',
    latitude: url.searchParams.get('latitude') ?? '',
    longitude: url.searchParams.get('longitude') ?? '',
    type: url.searchParams.get('type') ?? '',
    label: url.searchParams.get('label') ?? ''
  });

  const handleIntersection = () => {
    if ($pageStore.hasMorePages) {
      pageStore.getNextResults();
    }
  };

  /**
   * Navigate to edit the search
   */
  const modifySearch = () => {
    pageStore.captureEvent(`modify-search`);

    if ($pageStore.search.location && $pageStore.search.category) {
      const searchParams = new URLSearchParams({
        location: $pageStore.search.location,
        category: $pageStore.search.category,
        label: $pageStore.adressLabel
      }).toString();
      goto(`${$routes.ROUTE_SEARCH}?${searchParams}`);
    } else {
      goto($routes.ROUTE_SEARCH);
    }
  };
</script>

<svelte:head>
  <title
    >{$i18n.t('SEARCH_CATEGORY_AROUND_LOCALISATION', {
      category: $i18n.t($pageStore.search.category.toUpperCase()),
      localisation: $pageStore.adressLabel
    })}</title
  >
  <meta
    name="description"
    content={$i18n.t('SEARCH_HELP_STRUCTURE', {
      brandName: theme.brandName
    })}
  />
</svelte:head>

{#if $pageStore.urlParams}
  <ResultsTopBar
    title={$i18n.t('CATEGORY_AND_ADRESS', {
      category: $i18n.t($pageStore.search.category.toUpperCase()),
      adress: $pageStore.adressLabel
    })}
    on:goBack={modifySearch}
  />
  <section id="result-page">
    <PageLoader loading={$pageStore.initializing}>
      <div class="result-page-content">
        <div class="title">
          <Text type="text2Medium"
            >{$i18n.t('PLACES_FOUND', { nbResults: $pageStore.searchResult.nbResults })}</Text
          >
        </div>
        <div class="list">
          {#each $pageStore.searchResult.places as place, index}
            <div>
              <Card {place} id={place.id?.toString()} />
              {#if index === $pageStore.searchResult.places.length - 1}
                <IntersectionObserver on:intersect={handleIntersection} />
              {/if}
            </div>
          {/each}
          <PageLoader loading={$pageStore.isLoading} />
        </div>
      </div>
    </PageLoader>
  </section>
{/if}

<style lang="scss">
  #result-page {
    padding: var(--topbar-height) var(--spacingLG) var(--spacingLG);
  }

  .result-page-content {
    padding-top: var(--spacingLG);
  }

  .list {
    display: flex;
    flex-direction: column;
    padding-top: var(--spacingXL);
    gap: var(--spacingXL);
  }

  .title {
    text-align: center;
  }
</style>
