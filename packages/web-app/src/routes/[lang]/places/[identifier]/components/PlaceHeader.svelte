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
  import { Text } from '@soliguide/design-system';
  import { PhoneButton, PlaceStatus, TodayInfo } from '$lib/components';
  import { isObjectEmpty } from '$lib/utils';
  import GoToButton from './GoToButton.svelte';
  import { getPlaceDetailsPageController } from '../pageController';
  import type { Phone, TodayInfo as TodayInfoType } from '$lib/models/types';
  import type { PlaceOpeningStatus } from '@soliguide/common';

  export let todayInfo: TodayInfoType = {};

  export let name: string;

  export let status: PlaceOpeningStatus;

  export let phones: Phone[];

  export let address: string;

  export let onOrientation: boolean;

  const placeController = getPlaceDetailsPageController();

</script>

<header class="card-header">
  <div class="details-container">
    <Text type="title1PrimaryExtraBold">{name}</Text>
    <div class="tag-container">
      <PlaceStatus {status} />
    </div>
    {#if !isObjectEmpty(todayInfo)}
    <div class="today-info-container">
      <TodayInfo {todayInfo} />
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
