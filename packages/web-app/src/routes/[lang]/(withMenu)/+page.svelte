<script lang="ts">
  import { getContext, setContext, type ComponentType } from 'svelte';
  import { goto } from '$app/navigation';
  import { Text, Tile, PageLoader } from '@soliguide/design-system';
  import { ROUTES_CTX_KEY, getGeolocation } from '$lib/client';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import SearchButtonInput from './SearchButtonInput.svelte';
  import pageStore from './index';
  import { searchParamsService } from '$lib/services';
  import { showToast } from '$lib/toast/toast.store';
  import type { I18nStore, RoutingStore } from '$lib/client/types';
  import type { ThemeDefinition } from '$lib/theme/types';
  import type { QuickSearchFilters } from './types';
  import { get } from 'svelte/store';
  import { themeStore } from '$lib/theme';
  import {
    Categories,
    getCategoryTranslationKey,
    shouldDisplayThermalComfort,
    SupportedLanguagesCode
  } from '@soliguide/common';
  import { CategoryIcon, HeatwaveEmergencyCard, GeolocationBlockedModal } from '$lib/components';
  import MoreHoriz from 'svelte-google-materialdesign-icons/More_horiz.svelte';

  const i18n: I18nStore = getContext(I18N_CTX_KEY);
  const theme: ThemeDefinition = get(themeStore.getTheme());
  const routes: RoutingStore = getContext(ROUTES_CTX_KEY);

  setContext('CAPTURE_FCTN_CTX_KEY', pageStore.captureEvent);

  let isSearching = false;
  let showGeolocationModal = false;
  // Remember the last quick-search so the modal's "retry" can re-run it.
  let lastQuickSearch: { category: Categories; filters: QuickSearchFilters } | null = null;

  // The heatwave card groups seasonal 1-click searches; shown only for FR/ES during summer.
  const shouldDisplayHeatwaveCard = shouldDisplayThermalComfort(theme.country);

  const goSearch = () => {
    pageStore.captureEvent('start-search');
    goto($routes.ROUTE_SEARCH);
  };

  /**
   * Launch a search directly from a category tile.
   * Uses the user's position; if geolocation is not authorized, shows the recovery modal.
   */
  const launchCategorySearch = async (category: Categories, filters: QuickSearchFilters = {}) => {
    if (isSearching) {
      return;
    }
    isSearching = true;
    lastQuickSearch = { category, filters };

    try {
      const outcome = await pageStore.buildQuickSearch(
        category,
        theme.country,
        $i18n.language as SupportedLanguagesCode,
        getGeolocation,
        filters
      );

      if (outcome.status === 'ready') {
        goto(
          `${$routes.ROUTE_PLACES}?${searchParamsService.toPlacesSearchQueryString(outcome.params)}`
        );
      } else if (outcome.status === 'permissionRequired') {
        showGeolocationModal = true;
      } else {
        showToast({ description: $i18n.t('SEARCH_FAIL_TRY_LATER'), variant: 'error' });
      }
    } finally {
      // Safe: concurrent runs are prevented by the `isSearching` guard at the top of the function
      // eslint-disable-next-line require-atomic-updates
      isSearching = false;
    }
  };

  const retryQuickSearch = () => {
    showGeolocationModal = false;
    if (lastQuickSearch) {
      launchCategorySearch(lastQuickSearch.category, lastQuickSearch.filters);
    }
  };

  /**
   * Handle a click on a regular quick-search category tile (outside the emergency card).
   * Tracks the clicked category, then launches the search.
   */
  const handleQuickSearchClick = (category: Categories) => {
    pageStore.captureEvent('quick-search-clicked', { category });
    launchCategorySearch(category);
  };

  /**
   * Handle a click on a quick-search button inside the emergency (heatwave) card.
   * Tracks the clicked category, then launches the search with the card's filters.
   */
  const handleEmergencyQuickSearchClick = (
    event: CustomEvent<{ category: Categories; airConditioned: boolean }>
  ) => {
    pageStore.captureEvent('emergency-quick-search-clicked', { category: event.detail.category });
    launchCategorySearch(event.detail.category, {
      airConditioned: event.detail.airConditioned
    });
  };

  const categoriesToDisplay: {
    label: string;
    iconCategory?: Categories;
    iconComponent: ComponentType;
    variant: 'primary' | 'secondary' | 'tertiary';
  }[] = [
    {
      label: $i18n.t(getCategoryTranslationKey(Categories.FOOD)),
      iconCategory: Categories.FOOD,
      iconComponent: CategoryIcon,
      variant: 'primary'
    },
    {
      label: $i18n.t(getCategoryTranslationKey(Categories.TRAINING_AND_JOBS)),
      iconCategory: Categories.TRAINING_AND_JOBS,
      iconComponent: CategoryIcon,
      variant: 'secondary'
    },
    {
      label: $i18n.t(getCategoryTranslationKey(Categories.COUNSELING)),
      iconCategory: Categories.COUNSELING,
      iconComponent: CategoryIcon,
      variant: 'tertiary'
    },
    {
      label: $i18n.t(
        `${getCategoryTranslationKey(Categories.EQUIPMENT)}_${Categories.CLOTHING.toUpperCase()}`
      ),
      iconCategory: Categories.EQUIPMENT,
      iconComponent: CategoryIcon,
      variant: 'primary'
    },
    {
      label: $i18n.t(getCategoryTranslationKey(Categories.HEALTH)),
      iconCategory: Categories.HEALTH,
      iconComponent: CategoryIcon,
      variant: 'secondary'
    },
    {
      label: $i18n.t(getCategoryTranslationKey(Categories.HYGIENE_AND_WELLNESS)),
      iconCategory: Categories.HYGIENE_AND_WELLNESS,
      iconComponent: CategoryIcon,
      variant: 'tertiary'
    },
    {
      label: $i18n.t('MANY_OTHERS'),
      iconComponent: MoreHoriz,
      variant: 'primary'
    }
  ];
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

<PageLoader loading={isSearching} fullPage>
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
    {#if shouldDisplayHeatwaveCard}
      <div class="heatwave-block">
        <HeatwaveEmergencyCard disabled={isSearching} on:search={handleEmergencyQuickSearchClick} />
      </div>
    {/if}
    <div class="categories">
      <span class="categories-text">
        <Text type="title3PrimaryExtraBold" as="h3"
          >{$i18n.t('MORE_THAN_50_SOCIAL_EMERGENCY_CATEGORIES')}</Text
        >
      </span>
      <div class="categories-tiles">
        {#each categoriesToDisplay as { label, variant, iconCategory, iconComponent }}
          <Tile
            {label}
            {variant}
            clickable
            on:click={() => (iconCategory ? handleQuickSearchClick(iconCategory) : goSearch())}
          >
            {#if iconCategory}
              <svelte:component
                this={iconComponent}
                categoryId={iconCategory}
                variation="filled"
                size={'16'}
              />
            {:else}
              <svelte:component this={iconComponent} size={'16'} />
            {/if}</Tile
          >
        {/each}
      </div>
    </div>
  </section>

  <GeolocationBlockedModal
    open={showGeolocationModal}
    brandName={theme.brandName}
    on:close={() => (showGeolocationModal = false)}
    on:retry={retryQuickSearch}
  />
</PageLoader>

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

  .heatwave-block {
    margin-bottom: var(--spacing3XL);
  }

  .categories {
    .categories-text {
      text-align: center;
    }

    .categories-tiles {
      margin-top: var(--spacingXL);
      display: flex;
      flex-direction: column;
      gap: var(--spacingLG);
      align-items: center;
    }
  }
</style>
