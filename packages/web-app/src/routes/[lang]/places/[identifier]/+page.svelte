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
  import { getContext, onMount, setContext } from 'svelte';
  import { goto, afterNavigate } from '$app/navigation';
  import { page } from '$app/stores';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import { ROUTES_CTX_KEY } from '$lib/client/index';
  import type { I18nStore, RoutingStore } from '$lib/client/types';
  import { Topbar, InfoBlock, IconFavoriteOff, IconFavoriteOn, type types as DSTypes } from '@soliguide/design-system';
  import { favorites, toggleFavorite } from '$lib/client/favorites';
  import { notifyFavoriteChange } from '$lib/toast/toast.store';
  import {
    PlaceInfoSection,
    PlaceDescriptionSection,
    OpeningHoursSection,
    PlaceHowToGoSection,
    PlaceHeader,
    PlaceFooter,
    PlaceContact,
    PlaceServices
  } from './components';
  import type { PageData } from './$types';
  import { getPlaceDetailsPageController } from './pageController';
  import CampaignBanner from './components/CampaignBanner.svelte';
  import PlaceItinerarySection from './components/PlaceItinerarySection.svelte';
  import { favoriteMatches } from '$lib/models/favorite';

  export let data: PageData;
  const i18n: I18nStore = getContext(I18N_CTX_KEY);
  const pageStore = getPlaceDetailsPageController();

  // initialize and update on data change (necessary for reloading when query params change)
  $: {
    pageStore.init(data);
  }

  setContext('PLACE_CONTROLLER_CTX_KEY', pageStore);
  setContext('CAPTURE_FCTN_CTX_KEY', pageStore.captureEvent);

  let headerHeight = 0;
  let scrolled = false;
  let previousRoute = '/';

  afterNavigate(({ from }) => {
    previousRoute = from?.url.pathname || '/';
  });

  onMount(() => {
    // window.TallyConfig = {
    //   formId: 'nrk8d2',
    //   popup: {
    //     width: 340,
    //     emoji: {
    //       text: '👋',
    //       animation: 'wave'
    //     },
    //     layout: 'modal',
    //     open: {
    //       trigger: 'scroll',
    //       scrollPercent: 40
    //     },
    //     autoClose: 3000,
    //     showOnce: true,
    //     doNotShowAfterSubmit: true,
    //     hideTitle: true
    //   }
    // };
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      scrolled = scrollY > headerHeight * 1.1;
    };

    headerHeight = document.querySelector('.card-header')?.clientHeight || 0;
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const routes: RoutingStore = getContext(ROUTES_CTX_KEY);

  const goBack = () => {
    pageStore.captureEvent('go-back', { fromPlace: $pageStore.placeDetails.id });
    
    if (previousRoute === `/${$page.params.lang}/favorites`) {
      goto(`/${$page.params.lang}/favorites`);
    } else {
      goto(`${$routes.ROUTE_PLACES}#${$pageStore.placeDetails.id}`);
    }
  };

  $: isFavorite = $favorites.some((favorite) =>
    favoriteMatches(
      favorite,
      $pageStore.placeDetails.id,
      $pageStore.placeDetails.crossingPointIndex
    )
  );

  $: favoriteAction = {
    label: $i18n.t('TOGGLE_FAVORITES'),
    type: 'toggle' as DSTypes.TopbarActionType,
    icon: isFavorite ? IconFavoriteOn : IconFavoriteOff,
    ...(isFavorite ? {} : { iconColor: "var(--color-textInverse)" }),
    eventKey: 'favorite' as DSTypes.TopbarActionEventKey,
    active: isFavorite
  };

  $: topbarActions = $pageStore.placeDetails.id ? [favoriteAction] : [];
</script>

<svelte:head>
  <title>{$pageStore.placeDetails.name}</title>
  <meta name="description" content={$pageStore.placeDetails.description} />
  <!-- <script src="https://tally.so/widgets/embed.js"></script> -->
</svelte:head>

<Topbar
  type="reversedGradient"
  actions={topbarActions}
  on:navigate={goBack}
  on:favorite={() => {
    if ($pageStore.placeDetails.id) {
      const status = toggleFavorite(
        $pageStore.placeDetails.id,
        $pageStore.placeDetails.crossingPointIndex
      );
      pageStore.captureEvent('manage-favorite', {
        action: status === 'added' ? 'add' : 'remove',
        placeId: $pageStore.placeDetails.id
      });
      notifyFavoriteChange(status, i18n);
    }
  }}
/>

<div class="place-detail-page" class:with-footer={scrolled}>
  <PlaceHeader
    name={$pageStore.placeDetails.name}
    todayInfo={$pageStore.placeDetails.todayInfo}
    phones={$pageStore.placeDetails.phones}
    address={$pageStore.placeDetails.address}
    status={$pageStore.placeDetails.status}
    onOrientation={$pageStore.placeDetails.onOrientation}
    tempInfo={$pageStore.placeDetails.tempInfo}
    campaignBanner={$pageStore.placeDetails.campaignBanner}
  />
  <section class="sections">
    <div>
      <div class="info-block" id="bannerMessage">
        <CampaignBanner campaignBanner={$pageStore.placeDetails.campaignBanner}></CampaignBanner>
        {#if $pageStore.placeDetails.tempInfo.message}
          <InfoBlock
            variant="warning"
            withClamp
            title={$pageStore.placeDetails.tempInfo.message.name}
            text={$pageStore.placeDetails.tempInfo.message.description || ''}
            withIcon={true}
            showMoreLabel={$i18n.t('SEE_MORE')}
            showLessLabel={$i18n.t('SEE_LESS')}
          />
        {/if}
      </div>
      <PlaceInfoSection
        info={$pageStore.placeDetails.info}
        lastUpdate={$pageStore.placeDetails.lastUpdate}
        sources={$pageStore.placeDetails.sources}
      />
      <PlaceDescriptionSection description={$pageStore.placeDetails.description} />
      <OpeningHoursSection
        openHours={$pageStore.hoursToDisplay}
        currentDay={$pageStore.currentDay}
        status={$pageStore.placeDetails.status}
        tempInfo={$pageStore.placeDetails.tempInfo}
        closureDisplayMode={$pageStore.closureDisplayMode}
        hoursDisplayMode={$pageStore.hoursDisplayMode}
        placeType={$pageStore.placeDetails.placeType}
      />

      <PlaceServices
        services={$pageStore.placeDetails.services}
        currentDay={$pageStore.currentDay}
      />

      <PlaceHowToGoSection
        address={$pageStore.placeDetails.address}
        onOrientation={$pageStore.placeDetails.onOrientation}
      />

      <PlaceItinerarySection place={$pageStore.placeDetails} />

      <PlaceContact
        phones={$pageStore.placeDetails.phones}
        facebook={$pageStore.placeDetails.facebook}
        instagram={$pageStore.placeDetails.instagram}
        email={$pageStore.placeDetails.email}
        website={$pageStore.placeDetails.website}
      />
    </div>
  </section>
</div>

{#if scrolled}
  <div class="footer">
    <PlaceFooter
      phones={$pageStore.placeDetails.phones}
      address={$pageStore.placeDetails.address}
      onOrientation={$pageStore.placeDetails.onOrientation}
    />
  </div>
{/if}

<style lang="scss">
  $footer-height: 64px;

  .place-detail-page {
    padding-top: var(--topbar-height);

    &.with-footer {
      padding-bottom: $footer-height;
    }
  }

  .sections {
    display: flex;
    flex-direction: column;
    gap: var(--spacingLG);

    .info-block {
      display: flex;
      flex-direction: column;
      gap: var(--spacingSM);
      background-color: var(--color-surfaceWhite);
      padding: var(--spacingLG) var(--spacingLG) 0 var(--spacingLG);
    }
  }

  .footer {
    position: fixed;
    width: 100%;
    height: $footer-height;
    bottom: 0;
  }

  #bannerMessage {
    scroll-margin-top: var(--topbar-height);
  }
</style>
