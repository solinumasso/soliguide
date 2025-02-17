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
  import { goto } from '$app/navigation';
  import { getContext } from 'svelte';
  import { getMapLink, ROUTES_CTX_KEY } from '$lib/client';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Text,
    ButtonLink
  } from '@soliguide/design-system';
  import NearMe from 'svelte-google-materialdesign-icons/Near_me.svelte';
  import PinDrop from 'svelte-google-materialdesign-icons/Pin_drop.svelte';
  import { TodayInfo, PlaceStatus } from '$lib/components';
  import PhoneButton from '$lib/components/PhoneButton.svelte';
  import ResultsCardServices from './ResultsCardServices.svelte';
  import { kmOrMeters } from '@soliguide/common';
  import { getSearchResultPageController } from '../../pageController';
  import { searchService } from '$lib/services';

  import type { I18nStore, RoutingStore } from '$lib/client/types';
  import type { SearchResultItem } from '$lib/models/types';

  const { captureEvent } = getSearchResultPageController(searchService);

  const routes: RoutingStore = getContext(ROUTES_CTX_KEY);
  const i18n: I18nStore = getContext(I18N_CTX_KEY);

  export let place: SearchResultItem;
  export let id: string;
  export let category: string;

  /**
   * Redirect user to place he clicked on
   */
  const gotoPlace = (seoUrl: string) => {
    captureEvent('card-info-click', { placeId: place.id });
    goto(`${$routes.ROUTE_PLACES}/${seoUrl}`);
  };

  const isDisabled = place.banners.orientation;
</script>

<Card>
  <a
    {id}
    class="card-link"
    href={`${$routes.ROUTE_PLACES}/${place.seoUrl}?categorySearched=${category}`}
  >
    <CardHeader
      on:click={() => {
        captureEvent('card-header-click', { placeId: place.id });
      }}
    >
      <div class="card-header-container">
        {#if place?.sources.length}
          <div class="card-header-source">
            <Text type="caption2" color="inverse">
              {$i18n.t('SOURCE')}
              {#each place.sources as source, index}
                {source.label}
                {#if source.licenseLabel && source.licenseLink}(<a
                    href={source.licenseLink}
                    target="_blank">{source.licenseLabel}</a
                  >){/if}{#if index < place.sources.length - 1}<span>, </span>
                {/if}
              {/each}
            </Text>
          </div>
        {/if}
        <div class="card-title">
          <Text ellipsis type="title2PrimaryExtraBold">{place.name}</Text>
        </div>
        <div class="card-header-infos-container">
          <PlaceStatus status={place.status} />
          <TodayInfo todayInfo={place.todayInfo} />
        </div>
      </div>
    </CardHeader>
  </a>
  <CardBody>
    <div class="card-body">
      <div class="card-body-adress">
        <span class="card-body-adress-text">
          <Text type="text1Medium">{place.address}</Text>
          {#if place.distance > 0}
            <div class="card-body-adress-distance">
              <span class="card-body-adress-distance-icon"
                ><PinDrop aria-hidden="true" size={'12'} /></span
              ><Text type="text2" color="neutral">{kmOrMeters(place.distance)}</Text>
            </div>
          {/if}
        </span>
        <ButtonLink
          size="small"
          iconPosition="iconOnly"
          type="primaryOutline"
          href={getMapLink(place.address)}
          disabled={place.banners.orientation}
          ><NearMe
            slot="icon"
            on:click={() => {
              captureEvent('go-to-click', { isDisabled });
            }}
          /></ButtonLink
        >
      </div>
      <ResultsCardServices services={place.services} />
    </div>
  </CardBody>
  <CardFooter>
    <div class="card-footer">
      <PhoneButton
        type="neutralOutlined"
        phones={place.phones}
        on:click={() => {
          captureEvent('phone-click');
        }}
      />
      <Button
        role="link"
        on:click={() => gotoPlace(place.seoUrl)}
        size="small"
        type="primaryGradientFill"
        >{$i18n.t('PLUS_INFOS')}
      </Button>
    </div>
  </CardFooter>
</Card>

<style lang="scss">
  $cardHeaderHeight: 90px;

  .card-link {
    text-decoration: none;
  }

  .card-header-container {
    position: relative;
    height: $cardHeaderHeight;
  }

  .card-header-source {
    position: absolute;
    top: -14px;
    right: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }

  .card-header-source a {
    text-decoration: revert;
  }

  .card-header-infos-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing3XS);
  }

  .card-body {
    padding: 0 var(--spacingLG);
    display: flex;
    flex-direction: column;
    gap: var(--spacingLG);
    width: 100%;
  }

  .card-body-adress {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacingXS);
  }

  .card-body-adress-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-body-adress-distance {
    padding-top: var(--spacing3XS);
    display: flex;
    align-items: center;
    gap: var(--spacing4XS);
  }
  .card-body-adress-distance-icon {
    color: var(--color-interactionHighlightPrimary);
  }

  .card-footer {
    gap: var(--spacingXL);
    display: flex;
    justify-content: center;
    width: 100%;
  }

  [id] {
    scroll-margin-top: var(--topbar-height);
  }
</style>
