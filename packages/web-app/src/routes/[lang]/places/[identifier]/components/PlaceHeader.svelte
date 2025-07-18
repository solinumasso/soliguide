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
  import { InfoIcon, Text } from '@soliguide/design-system';
  import { PhoneButton, PlaceStatus, TodayInfo } from '$lib/components';
  import GoToButton from './GoToButton.svelte';
  import { getPlaceDetailsPageController } from '../pageController';

  import type {
    Phone,
    TodayInfo as TodayInfoType,
    PlaceDetailsTempInfo,
    PlaceCampaignBannerMessage
  } from '$lib/models/types';
  import { TempInfoStatus, type PlaceOpeningStatus, isObjectEmpty } from '@soliguide/common';

  import type { I18nStore } from '$lib/client/types';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import { getContext } from 'svelte';

  export let todayInfo: TodayInfoType = {};
  export let name: string;
  export let status: PlaceOpeningStatus;
  export let phones: Phone[];
  export let address: string;
  export let onOrientation: boolean;
  export let tempInfo: PlaceDetailsTempInfo;
  export let campaignBanner: PlaceCampaignBannerMessage | null;

  const placeController = getPlaceDetailsPageController();
  const i18n: I18nStore = getContext(I18N_CTX_KEY);
</script>

<header class="card-header">
  <div class="details-container">
    <div class="name-container">
      <Text type="title1PrimaryExtraBold">{name}</Text>
      {#if campaignBanner}
        <a href="#bannerMessage"
          ><InfoIcon altTag={$i18n.t('NO_RECENT_SCHEDULE_UPDATE')} variant="warning" size="medium"
          ></InfoIcon></a
        >
      {:else if tempInfo.message}
        <a href="#bannerMessage"
          ><InfoIcon altTag={$i18n.t('PLACE_HAVE_IMPORTANT_INFO')} variant="warning" size="medium"
          ></InfoIcon></a
        >
      {/if}
    </div>
    <div class="tag-container">
      <PlaceStatus {status} />
    </div>
    {#if !isObjectEmpty(todayInfo)}
      <div class="today-info-container">
        <TodayInfo {todayInfo}>
          {#if tempInfo.hours?.status === TempInfoStatus.CURRENT && !tempInfo.message}
            <a href={`#openingHoursSection`}
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
    {/if}
  </div>

  <div class="actions">
    <GoToButton
      {address}
      {onOrientation}
      reversed
      on:click={() => {
        placeController.captureEvent('header-go-to-click');
      }}
    />
    <PhoneButton
      {phones}
      on:click={() => {
        placeController.captureEvent('header-phone-click');
      }}
    />
  </div>
</header>

<style lang="scss">
  .card-header {
    display: flex;
    flex-direction: column;
    gap: var(--spacingXL);

    padding: 0 var(--spacingLG) var(--spacingLG);
    background: var(--color-surfaceSecondaryGradient);
    color: var(--color-textInverse);
  }

  .name-container {
    display: flex;
    justify-content: space-between;
  }

  .details-container {
    display: flex;
    flex-direction: column;
    padding: 0 var(--spacingLG);
  }

  .actions {
    display: flex;
    justify-content: center;
    gap: var(--spacingXL);
  }

  .tag-container {
    padding-top: var(--spacingXS);
  }

  .today-info-container {
    padding-top: var(--spacing3XS);
  }
</style>
