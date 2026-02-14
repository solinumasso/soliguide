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
    ButtonLink,
    InfoIcon,
    IconFavoriteOff,
    IconFavoriteOn,
    ToggleButton
  } from '@soliguide/design-system';
  import NearMe from 'svelte-google-materialdesign-icons/Near_me.svelte';
  import PinDrop from 'svelte-google-materialdesign-icons/Pin_drop.svelte';
  import { TodayInfo, PlaceStatus } from '$lib/components';
  import PhoneButton from '$lib/components/PhoneButton.svelte';
  import ResultsCardServices from './ResultsCardServices.svelte';
  import DisplaySource from '$lib/components/DisplaySource.svelte';
  import {
    GeoTypes,
    kmOrMeters,
    TempInfoStatus,
    PlaceStatus as PlaceStatusEnum
  } from '@soliguide/common';

  import { favorites, toggleFavorite } from '$lib/client/favorites';
  import { notifyFavoriteChange } from '$lib/toast/toast.store';
  import type { I18nStore, RoutingStore } from '$lib/client/types';
  import type { SearchResultPlaceCard } from '$lib/models/types';
  import { favoriteMatches } from '$lib/models/favorite';
  import type { PosthogCaptureFunction } from '$lib/services/types';

  const captureEvent = getContext('CAPTURE_FCTN_CTX_KEY') as PosthogCaptureFunction;

  const routes: RoutingStore = getContext(ROUTES_CTX_KEY);
  const i18n: I18nStore = getContext(I18N_CTX_KEY);

  export let place: SearchResultPlaceCard;
  export let id: string;
  export let category: string;

  $: isPlaceUnavailable =
    place.placeStatus === PlaceStatusEnum.DRAFT ||
    place.placeStatus === PlaceStatusEnum.OFFLINE ||
    place.placeStatus === PlaceStatusEnum.PERMANENTLY_CLOSED;

  /**
   * Redirect user to place he clicked on
   */
  const gotoPlace = (seoUrl: string, categorySearched: string) => {
    if (isPlaceUnavailable) {
      return;
    }
    goto(`${$routes.ROUTE_PLACES}/${seoUrl}?categorySearched=${categorySearched}`);
  };

  const isDisabled = place.banners.orientation;
  const urlWithItinerary = `${typeof place.crossingPointIndex === 'number' ? `&crossingPointIndex=${place.crossingPointIndex}` : ''}`;
  const href = `${$routes.ROUTE_PLACES}/${place.seoUrl}?categorySearched=${category}${urlWithItinerary}`;

  $: isFavorite = $favorites.some((favorite) =>
    favoriteMatches(favorite, place.id, place.crossingPointIndex)
  );
</script>

<Card>
  <a
    {id}
    class="card-link"
    {href}
    aria-disabled={isPlaceUnavailable}
    on:click|preventDefault={() => gotoPlace(place.seoUrl, category)}
    data-sveltekit-preload-data="off"
  >
    <CardHeader
      disabled={isPlaceUnavailable}
      on:click={() => {
        if (isPlaceUnavailable) {
          return;
        }
        captureEvent('card-header-click', { placeId: place.id });
      }}
    >
      <div class="card-header-container">
        <div class="card-header-infos-container">
          <div class="card-infos-left">
            <PlaceStatus openingStatus={place.status} placeStatus={place.placeStatus} />
            <div>
              <TodayInfo todayInfo={place.todayInfo}>
                {#if place.tempInfo.hours === TempInfoStatus.CURRENT && place.tempInfo.message !== TempInfoStatus.CURRENT}
                  <a
                    href={`${$routes.ROUTE_PLACES}/${place.seoUrl}?categorySearched=${category}#openingHoursSection`}
                    ><InfoIcon
                      size="small"
                      variant="warning"
                      withShadow
                      altTag={$i18n.t('TEMPORARY_HOURS_CURRENTLY_ACTIVE')}
                    ></InfoIcon></a
                  >
                {/if}</TodayInfo
              >
            </div>
          </div>
          <div
            class="card-infos-right"
            on:click|stopPropagation
            on:change|stopPropagation
            on:keydown|stopPropagation
            role="button"
            tabindex="-1"
          >
            <ToggleButton
              type="primaryReversed"
              size="medium"
              icon={isFavorite ? IconFavoriteOn : IconFavoriteOff}
              {...isFavorite ? {} : { iconColor: 'var(--color-textInverse)' }}
              checked={isFavorite}
              aria-label={$i18n.t('TOGGLE_FAVORITES')}
              on:change={() => {
                const status = toggleFavorite(place.id, place.crossingPointIndex);
                if (status === 'added' || status === 'removed') {
                  captureEvent('manage-favorite', {
                    action: status === 'added' ? 'add' : 'remove',
                    placeId: place.id
                  });
                }
                notifyFavoriteChange(status, i18n);
              }}
            />
          </div>
        </div>
        <div class="card-title">
          <Text ellipsis type="title2PrimaryExtraBold">{place.name}</Text>
          {#if place.banners.campaign}
            <a
              href={`${$routes.ROUTE_PLACES}/${place.seoUrl}?categorySearched=${category}#bannerMessage`}
              data-sveltekit-preload-data="off"
              ><InfoIcon
                size="medium"
                variant="warning"
                withShadow
                altTag={$i18n.t('NO_RECENT_SCHEDULE_UPDATE_OPEN_DETAIL', { name: place.name })}
              ></InfoIcon></a
            >
          {:else if place.tempInfo.message === TempInfoStatus.CURRENT}
            <a
              href={`${$routes.ROUTE_PLACES}/${place.seoUrl}?categorySearched=${category}#tempMessage`}
              data-sveltekit-preload-data="off"
              ><InfoIcon
                size="medium"
                variant="warning"
                withShadow
                altTag={$i18n.t('OPEN_PLACE_WHO_HAVE_IMPORTANT_INFO', { name: place.name })}
              ></InfoIcon></a
            >
          {/if}
        </div>
        {#if place?.sources.length}
          <div class="card-header-source">
            <DisplaySource sources={place.sources} color="inverse" />
          </div>
        {/if}
      </div>
    </CardHeader>
  </a>
  <CardBody>
    <div class="card-body">
      <div class="card-body-adress">
        <span class="card-body-adress-text">
          <Text type="text1Medium">{place.address}</Text>
          {#if place.searchGeoType === GeoTypes.POSITION && !isDisabled}
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
          href={getMapLink(place.address, place.coordinates)}
          disabled={isDisabled || isPlaceUnavailable}
          ><NearMe
            slot="icon"
            on:click={() => {
              if (!isDisabled && !isPlaceUnavailable) {
                captureEvent('go-to-click', { place: { ...place.dataForLogs } });
              }
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
        phones={isPlaceUnavailable ? [] : place.phones}
        on:click={() => {
          captureEvent('phone-click', { place: { ...place.dataForLogs } });
        }}
      />
      <Button
        role="link"
        on:click={() => {
          gotoPlace(place.seoUrl, category);
          captureEvent('card-info-click', { placeId: place.id });
        }}
        size="small"
        type="primaryGradientFill"
        aria-disabled={isPlaceUnavailable}
        disabled={isPlaceUnavailable}
        data-sveltekit-preload-data="off"
        >{$i18n.t('PLUS_INFOS')}
      </Button>
    </div>
  </CardFooter>
</Card>

<style lang="scss">
  $cardHeaderHeight: 90px;
  .card-title {
    display: flex;
    align-items: center;
    gap: var(--spacing3XS);
    align-self: stretch;
  }

  .card-link {
    text-decoration: none;
  }

  .card-link[aria-disabled='true'] {
    cursor: default;
  }

  .card-header-container {
    position: relative;
    height: $cardHeaderHeight;
    display: flex;
    flex-direction: column;
    gap: var(--spacing3XS);
  }

  .card-header-source {
    position: absolute;
    bottom: -14px;
    right: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }

  .card-header-infos-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--spacingXS);
    align-self: stretch;
  }

  .card-infos-left {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: var(--spacingXS);
  }

  .card-infos-right {
    display: flex;
    align-items: center;
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
