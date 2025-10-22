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
  import { onMount, getContext } from 'svelte';
  import { get } from 'svelte/store';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { ROUTES_CTX_KEY } from '$lib/client';
  import { favorites, FAVORITES_LIMIT } from '$lib/client/favorites';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import type { I18nStore, RoutingStore } from '$lib/client/types';
  import { themeStore } from '$lib/theme';
  import type { ThemeDefinition } from '$lib/theme/types';
  import { SupportedLanguagesCode } from '@soliguide/common';
  import { Button, Text, PageLoader, InfoBlock } from '@soliguide/design-system';
  import ResultsCard from '../places/components/card/ResultsCard.svelte';
  import pageStore from './index';
  
  const i18n: I18nStore = getContext(I18N_CTX_KEY);
  const theme: ThemeDefinition = get(themeStore.getTheme());
  const routes: RoutingStore = getContext(ROUTES_CTX_KEY);

  const goSearch = () => {
    goto($routes.ROUTE_SEARCH);
  };

  onMount(async () => {
    await pageStore.loadFavoritePlaces($favorites, $page.params.lang as SupportedLanguagesCode);
  });

  $: pageStore.syncWithFavorites($favorites);
  $: isFavoritesLimitReached = $favorites.length >= FAVORITES_LIMIT;
</script>

<svelte:head>
  <title>{$i18n.t('FAVORITES_TITLE')}</title>
  <meta
    name="description"
    content={$i18n.t('FAVORITES_DESCRIPTION', {
      brandName: theme.brandName
    })}
  />
</svelte:head>

<section id="favorites-page">
  <PageLoader loading={$pageStore.loading}>
    <div class="favorites-page-content">
      <div class="header">
        <Text as="h1" type="title2PrimaryExtraBold">{$i18n.t('FAVORITES_TITLE')}</Text>

        {#if $pageStore.favoritePlaces.length > 0}
          <Text type="text2Medium">
            {$i18n.t('FAVORITES_COUNT', { count: $pageStore.favoritePlaces.length })}
          </Text>
        {/if}
      </div>

      {#if $favorites.length === 0}
        <div class="no-results">
          <Text type="title3PrimaryExtraBold">
            {$i18n.t('FAVORITES_DESCRIPTION')}
          </Text>
          <img src={`/images/${theme.media.favoritesIllustration}`} alt="favorites illustration" />

          <div class="no-results-description">
            <Text type="text1">
              <!-- eslint-disable-next-line svelte/no-at-html-tags -->
              {@html $i18n.t('FAVORITES_EMPTY_LIST')}
            </Text>
          </div>

          <div class="no-results-button">
            <Button role="link" on:click={goSearch} size="medium" type="primaryGradientFill">
              {$i18n.t('FAVORITES_START_SEARCH')}
            </Button>
          </div>
        </div>
      {:else}
        <div class="list">
          {#if isFavoritesLimitReached}
            <div class="favorites-limit-banner">
              <InfoBlock
                withIcon={true}
                variant="error"
                text={$i18n.t('FAVORITES_LIMIT_REACHED_BANNER')}
              />
            </div>
          {/if}
          {#each $pageStore.favoritePlaces as place}
            <div class="card-wrapper">
              <ResultsCard {place} id={place.id?.toString()} category={''} />
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </PageLoader>
</section>

<style lang="scss">
  .favorites-page-content {
    padding: var(--spacing2XL) var(--spacingLG);
    display: flex;
    flex-direction: column;
  }

  .header {
    margin-bottom: var(--spacing2XL);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: var(--spacingXL);
    width: 100%;
  }

  .favorites-limit-banner {
    margin-bottom: var(--spacingLG);
  }

  .no-results {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 400px;
    width: 100%;
    padding: var(--spacingXL) var(--spacingLG);
    gap: var(--spacingMD);
    margin: 0 auto;

    img {
      width: 180px;
      height: auto;
    }
  }

  .no-results-description {
    margin-top: var(--spacingSM);
  }

  .no-results-button {
    margin-top: var(--spacingMD);
  }

</style>
