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
  import { getContext } from 'svelte';
  import { Text } from '@soliguide/design-system';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import PlaceDetailsSection from './PlaceDetailsSection.svelte';
  import TempInfoBanner from './TempInfoBanner.svelte';
  import { formatTimeRangeToLocale } from '$lib/client';
  import {
    PlaceOpeningStatus,
    TempInfoStatus,
    TempInfoType,
    type DayName
  } from '@soliguide/common';
  import {
    DisplayMode,
    type HoursRange,
    type PlaceDetailsOpeningHours,
    type PlaceDetailsTempInfo
  } from '$lib/models/types';

  import type { I18nStore } from '$lib/client/types';

  export let status: PlaceOpeningStatus;
  export let tempInfo: PlaceDetailsTempInfo;
  export let openHours: PlaceDetailsOpeningHours = {};
  export let currentDay: DayName;
  export let closureDisplayMode: DisplayMode;
  export let hoursDisplayMode: DisplayMode;

  const i18n: I18nStore = getContext(I18N_CTX_KEY);

  const convertHours = (hours: HoursRange[]) =>
    formatTimeRangeToLocale(hours)
      .map((range) => `${$i18n.t('OPENING_RANGE', { start: range.start, end: range.end })}`)
      .join(' - ');
</script>

<PlaceDetailsSection>
  <section class="opening-hours" id="openingHoursSection">
    <Text type="title3PrimaryExtraBold">{$i18n.t('OPEN_HOURS_AND_DAYS')}</Text>
    {#if tempInfo.closure.status === TempInfoStatus.CURRENT || tempInfo.closure.status === TempInfoStatus.INCOMING}<TempInfoBanner
        tempInfo={tempInfo.closure}
        tempInfoType={TempInfoType.CLOSURE}
        {closureDisplayMode}
        {hoursDisplayMode}
      ></TempInfoBanner>{/if}
    {#if tempInfo.hours.status === TempInfoStatus.CURRENT || tempInfo.hours.status === TempInfoStatus.INCOMING}
      <TempInfoBanner
        tempInfo={tempInfo.hours}
        tempInfoType={TempInfoType.HOURS}
        {closureDisplayMode}
        {hoursDisplayMode}
      ></TempInfoBanner>{/if}
    <ul>
      {#each Object.entries(openHours) as [day, openingHours]}
        <li class="open-hours" class:highlight={day === currentDay}>
          <Text type="caption1" color="neutral">{$i18n.t(`DAY_${day.toUpperCase()}`)}</Text>
          <span class="hours-container">
            <Text type="caption1Medium" color="neutral">
              {#if status === PlaceOpeningStatus.UNKNOWN}
                {$i18n.t('TIME_UNKNOWN')}
              {:else if closureDisplayMode === DisplayMode.TEMPORARY}
                {$i18n.t('TEMPORARILY_CLOSED')}
              {:else if openingHours.length > 0}
                {convertHours(openingHours)}
              {:else}
                {$i18n.t('CLOSED')}
              {/if}
            </Text>
          </span>
        </li>
      {/each}
    </ul>
  </section>
</PlaceDetailsSection>

<style lang="scss">
  .open-hours {
    padding: var(--spacingXS) var(--spacingLG);
    display: flex;
    justify-content: space-between;
    border-left: 4px solid transparent;
    &.highlight {
      border-radius: var(--radiusMiddle);
      border-left: 4px solid var(--color-textHighlightSecondary);
      background: var(--color-surfaceTertiary2);
    }
  }

  .hours-container {
    display: inline-flex;
    gap: var(--spacingXS);
  }
  .opening-hours {
    scroll-margin-top: var(--topbar-height);
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
