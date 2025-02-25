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
  import { get } from 'svelte/store';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { InputText, Topbar, PageLoader, FormControl } from '@soliguide/design-system';
  import pageStore from './index';
  import { Steps, Focus } from './types';
  import { ROUTES_CTX_KEY, getGeolocation } from '$lib/client';
  import { themeStore } from '$lib/theme';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import {
    CategorySelector,
    MyPositionTile,
    LocationSuggestionList,
    CategorySuggestionList
  } from './components/index';
  import type { I18nStore, RoutingStore } from '$lib/client/types';
  import type { ThemeDefinition } from '$lib/theme/types';
  import type { LocationSuggestion } from '$lib/models/locationSuggestion';
  import type { Categories } from '@soliguide/common';
  import { CategoriesErrors, LocationErrors } from '$lib/services/types';

  setContext('CAPTURE_FCTN_CTX_KEY', pageStore.captureEvent);

  const theme: ThemeDefinition = get(themeStore.getTheme());
  const i18n: I18nStore = getContext(I18N_CTX_KEY);
  const routes: RoutingStore = getContext(ROUTES_CTX_KEY);
  const { url } = $page;

  pageStore.init(theme.country, theme.defaultLanguage, {
    geoValue: url.searchParams.get('location'),
    label: url.searchParams.get('label'),
    category: url.searchParams.get('category')
  });

  $: categoryLabel = $i18n.t(($pageStore.selectedCategory || '').toUpperCase());
  $: topbarTitleKey =
    $pageStore.currentStep === Steps.STEP_LOCATION
      ? 'WHERE_ARE_YOU_LOOKING'
      : 'WHAT_ARE_YOU_LOOKING_FOR';

  const goBack = () => {
    pageStore.captureEvent('go-back', {
      fromStep: $pageStore.currentStep === Steps.STEP_LOCATION ? 'location' : 'category'
    });

    if (pageStore.getPreviousStep() === Steps.HOME) {
      goto($routes.ROUTE_HOME);
    } else {
      pageStore.goToPreviousStep();
    }
  };

  /** If the last criterion is set, we have search params and we can navigate */
  const postSelectSuggestion = () => {
    if ($pageStore.searchParams !== null) {
      const searchParams = new URLSearchParams(
        $pageStore.searchParams as unknown as Record<string, string>
      ).toString();
      goto(`${$routes.ROUTE_PLACES}?${searchParams}`);
    }
  };

  const selectLocation = (locationSuggestion: LocationSuggestion): void => {
    pageStore.selectLocationSuggestion(locationSuggestion);

    pageStore.captureEvent('location-selected', {
      completeLocation: {
        geoValue: locationSuggestion.geoValue,
        latitude: locationSuggestion.coordinates[0],
        longitude: locationSuggestion.coordinates[1],
        type: locationSuggestion.geoType,
        label: locationSuggestion.suggestionLabel
      }
    });

    postSelectSuggestion();
  };

  const selectCategory = (categorySuggestion: Categories): void => {
    pageStore.selectCategorySuggestion(categorySuggestion);
    postSelectSuggestion();
  };
</script>

<PageLoader loading={$pageStore.loading} fullPage>
  <Topbar type="gradient" title={$i18n.t(topbarTitleKey)} on:navigate={goBack} />
  <section>
    <div class="search-fields">
      <FormControl
        errorMessage={$pageStore.locationSuggestionError === LocationErrors.NO_RESULTS
          ? $i18n.t('LOCALISATION_SUGGESTION_NO_RESULTS')
          : ''}
      >
        <InputText
          name="search-location"
          placeholder={$i18n.t('SEARCH_LOCATION')}
          on:input={(event) => pageStore.getLocationSuggestions(event.target)}
          on:clear={pageStore.clearLocation}
          value={$pageStore.locationLabel}
          width="100%"
          autofocus={$pageStore.focus === Focus.FOCUS_LOCATION}
          {...$pageStore.locationSuggestionError === LocationErrors.NO_RESULTS
            ? { state: 'error' }
            : {}}
          on:focus={pageStore.editLocation}
          record="true"
        />
      </FormControl>
      {#if $pageStore.currentStep === Steps.STEP_CATEGORY}
        <FormControl
          errorMessage={$pageStore.categorySuggestionError === CategoriesErrors.NO_RESULTS
            ? $i18n.t('CATEGORY_SUGGESTION_NO_RESULTS')
            : ''}
        >
          <InputText
            name="search-category"
            placeholder={$i18n.t('SEARCH_CATEGORY')}
            on:input={(event) => pageStore.getCategorySuggestions(event.target)}
            on:clear={pageStore.clearCategory}
            value={categoryLabel}
            width="100%"
            autofocus={$pageStore.focus === Focus.FOCUS_CATEGORY}
            {...$pageStore.categorySuggestionError === CategoriesErrors.NO_RESULTS
              ? { state: 'error' }
              : {}}
            record="true"
          />
        </FormControl>
      {/if}
    </div>
    <div class="context-block">
      {#if $pageStore.currentStep === Steps.STEP_LOCATION}
        <MyPositionTile
          headline={$i18n.t('MY_CURRENT_LOCATION')}
          on:click={() => pageStore.useCurrentLocation(getGeolocation)}
          loading={$pageStore.loadingGeolocation}
        />
      {:else if $pageStore.currentStep === Steps.STEP_CATEGORY}
        <CategorySelector on:selectCategory={(event) => selectCategory(event.detail)} />
      {/if}
    </div>
    <div
      class="divider"
      class:category-context={$pageStore.currentStep === Steps.STEP_CATEGORY}
    ></div>

    {#if $pageStore.currentPositionError}
      <span>Geoloc error: {$i18n.t($pageStore.currentPositionError)}</span>
    {/if}

    {#if $pageStore.currentStep === Steps.STEP_LOCATION}
      <LocationSuggestionList
        items={$pageStore.locationSuggestions}
        on:click={(event) => selectLocation(event.detail)}
        loading={$pageStore.loadingLocationSuggestions}
      />
    {/if}
    {#if $pageStore.currentStep === Steps.STEP_CATEGORY}
      <CategorySuggestionList
        items={$pageStore.categorySuggestions}
        on:click={(event) => {
          selectCategory(event.detail);
          pageStore.captureEvent('category-suggestion-click', {
            category: event.detail
          });
        }}
        loading={$pageStore.loadingCategorySuggestions}
      />
    {/if}
  </section>
</PageLoader>

<style lang="scss">
  section {
    --input-height: 52px;

    min-height: 100vh;
    padding: var(--topbar-height) var(--spacingLG) var(--spacingLG);
    background-color: var(--color-surfaceWhite);
  }

  .search-fields {
    position: sticky;
    top: var(--topbar-height);
    background-color: var(--color-surfaceWhite);
    padding-bottom: 1px;
    padding-top: 1px;
    display: flex;
    flex-direction: column;
    gap: var(--spacingXS);
    z-index: 1;
  }

  .context-block {
    padding-top: var(--spacingXS);
    background-color: var(--color-surfaceWhite);
  }

  .divider {
    position: sticky;
    top: calc(var(--topbar-height) + var(--input-height) + 2px);
    background-color: var(--color-surfaceWhite);
    height: var(--spacingLG);
    border-bottom: 1px solid var(--color-borderNeutral);
    z-index: 1;

    &.category-context {
      top: calc(
        var(--topbar-height) + var(--input-height) + var(--spacingXS) + var(--input-height) + 2px
      );
    }
  }
</style>
