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
  import { goto } from '$app/navigation';

  import { Topbar } from '@soliguide/design-system';
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
  import { getPlaceDetailsPageController } from './pageController';
  import { ROUTES_CTX_KEY } from '$lib/client/index';
  import type { PageData } from './$types';
  import type { RoutingStore } from '$lib/client/types';

  export let data: PageData;

  const pageStore = getPlaceDetailsPageController();
  pageStore.init(data);

  setContext('CAPTURE_FCTN_CTX_KEY', pageStore.captureEvent);

  let headerHeight = 0;
  let scrolled = false;

  onMount(() => {
    // window.TallyConfig = {
    //   formId: 'nPGQB5',
    //   popup: {
    //     width: 340,
    //     emoji: { text: '👋', animation: 'wave' },
    //     open: { trigger: 'scroll', scrollPercent: 30 },
    //     layout: 'modal',
    //     hideTitle: true,
    //     autoClose: 3000,
    //     showOnce: true,
    //     doNotShowAfterSubmit: true
    //   }
    //};

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
    goto(`${$routes.ROUTE_PLACES}#${$pageStore.placeDetails.id}`);
  };
</script>

<svelte:head>
  <title>{$pageStore.placeDetails.name}</title>
  <meta name="description" content={$pageStore.placeDetails.description} />
  <!-- <script src="https://tally.so/widgets/embed.js"></script> -->
</svelte:head>

<Topbar type="reversedGradient" on:navigate={goBack} />

<div class="place-detail-page" class:with-footer={scrolled}>
  <PlaceHeader
    name={$pageStore.placeDetails.name}
    todayInfo={$pageStore.placeDetails.todayInfo}
    phones={$pageStore.placeDetails.phones}
    address={$pageStore.placeDetails.address}
    status={$pageStore.placeDetails.status}
    onOrientation={$pageStore.placeDetails.onOrientation}
  />
  <section class="sections">
    <PlaceInfoSection
      info={$pageStore.placeDetails.info}
      placeDetails={$pageStore.placeDetails}
      lastUpdate={$pageStore.placeDetails.lastUpdate}
      sources={$pageStore.placeDetails.sources}
    />
    <PlaceDescriptionSection description={$pageStore.placeDetails.description} />
    <OpeningHoursSection
      openHours={$pageStore.placeDetails.hours}
      currentDay={$pageStore.currentDay}
      status={$pageStore.placeDetails.status}
    />
    <PlaceServices services={$pageStore.placeDetails.services} currentDay={$pageStore.currentDay} />

    <PlaceHowToGoSection
      address={$pageStore.placeDetails.address}
      onOrientation={$pageStore.placeDetails.onOrientation}
    />

    <PlaceContact
      phones={$pageStore.placeDetails.phones}
      facebook={$pageStore.placeDetails.facebook}
      instagram={$pageStore.placeDetails.instagram}
      email={$pageStore.placeDetails.email}
      website={$pageStore.placeDetails.website}
    />
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
  }

  .footer {
    position: fixed;
    width: 100%;
    height: $footer-height;
    bottom: 0;
  }
</style>
