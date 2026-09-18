<script lang="ts">
  import { getThemeContext } from '$lib/theme';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { getContext, setContext } from 'svelte';
  import IntersectionObserver from './components/IntersectionObserver.svelte';
  import pageStore from './index';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import { ROUTES_CTX_KEY } from '$lib/client';
  import { Text, PageLoader } from '@soliguide/design-system';
  import Card from './components/card/ResultsCard.svelte';
  import ResultsFilters from './components/ResultsFilters.svelte';
  import ResultsTopBar from './components/ResultsTopBar.svelte';
  import type { I18nStore, RoutingStore } from '$lib/client/types';
  import { getCategorySearchTranslationKey } from '$lib/utils/categoryTranslation';
  import {
    getAllSearchResultFilterNames,
    getAvailableSearchResultFilters,
    type SearchResultFilter
  } from './filters';
  import { getEmergencyContext } from '$lib/emergency';

  const { url } = $page;

  const routes: RoutingStore = getContext(ROUTES_CTX_KEY);
  const i18n: I18nStore = getContext(I18N_CTX_KEY);
  const theme = getThemeContext();

  setContext('CAPTURE_FCTN_CTX_KEY', pageStore.captureEvent);

  // When there is no params, try to rebuild url and reuse store, or redirect to search tunnel
  if (url.searchParams.size === 0) {
    if ($pageStore.urlParams) {
      // We passing here only when coming back from a place
      // Recover id of the last place visited
      const { hash } = $page.url;
      // Sync url params with store params
      const searchParams = new URLSearchParams($pageStore.urlParams).toString();

      goto(`${url.pathname}?${searchParams}${hash}`, { replaceState: true });
    } else {
      // don't have params in store and in URL -> redirect to tunnel
      goto($routes.ROUTE_SEARCH, { replaceState: true });
    }
  }

  const availableFilters = getAvailableSearchResultFilters(getEmergencyContext());

  // A filter the country does not expose has no toggle to turn it off again, so
  // its URL parameter is never read rather than silently applied
  const selectedFilterParams = Object.fromEntries(
    availableFilters.flatMap(({ name }) => {
      const value = url.searchParams.get(name);

      return value === null ? [] : [[name, value]];
    })
  );

  pageStore.init(
    {
      location: url.searchParams.get('location') ?? '',
      category: url.searchParams.get('category') ?? '',
      lang: $page.params.lang ?? '',
      latitude: url.searchParams.get('latitude') ?? '',
      longitude: url.searchParams.get('longitude') ?? '',
      type: url.searchParams.get('type') ?? '',
      label: url.searchParams.get('label') ?? '',
      ...selectedFilterParams
    },
    availableFilters
  );

  const handleIntersection = () => {
    if ($pageStore.hasMorePages) {
      pageStore.getNextResults();
    }
  };

  const toggleFilter = (filter: SearchResultFilter): void => {
    const filterIsSelected = $pageStore.selectedFilters.includes(filter);

    const selectedFilters = filterIsSelected
      ? $pageStore.selectedFilters.filter((selectedFilter) => selectedFilter !== filter)
      : [...$pageStore.selectedFilters, filter];

    const currentUrl = $page.url;
    const filterNames = getAllSearchResultFilterNames();
    const currentSearchParams = Array.from(currentUrl.searchParams.entries()).filter(
      ([name]) => !filterNames.includes(name)
    );
    const selectedSearchParams = selectedFilters.map((selectedFilter) => [selectedFilter, 'true']);
    const searchParams = new URLSearchParams([...currentSearchParams, ...selectedSearchParams]);

    const newUrl = `${currentUrl.pathname}?${searchParams.toString()}`;
    goto(newUrl, { keepFocus: true, noScroll: true });

    pageStore.updateSearchFilters(selectedFilters);

    pageStore.captureEvent('filter-toggle', {
      clickedItem: filter,
      action: filterIsSelected ? 'unselect' : 'select'
    });
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
      category: $i18n.t(getCategorySearchTranslationKey($pageStore.search.category)),
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
      category: $i18n.t(getCategorySearchTranslationKey($pageStore.search.category)),
      adress: $pageStore.adressLabel
    })}
    on:goBack={modifySearch}
  />
  <section id="result-page">
    <PageLoader loading={$pageStore.initializing}>
      <div class="result-page-content">
        <ResultsFilters
          {availableFilters}
          selectedFilters={$pageStore.selectedFilters}
          on:toggle={(event) => toggleFilter(event.detail)}
        />
        <div class="title">
          <Text type="text2Medium"
            >{$i18n.t('PLACES_FOUND', { nbResults: $pageStore.searchResult.nbResults })}</Text
          >
        </div>
        <div class="list">
          {#each $pageStore.searchResult.places as place, index}
            <div>
              <Card {place} id={place.id?.toString()} category={$pageStore.search.category} />
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
    padding-top: var(--spacingLG);
    gap: var(--spacingXL);
  }

  .title {
    text-align: center;
    padding-top: var(--spacingLG);
  }
</style>
