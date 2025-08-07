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
  import { convertHoursToDisplay } from '$lib/client';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import type { I18nStore } from '$lib/client/types';
  import type { PlaceDetailsOpeningHours } from '$lib/models/types';
  import type { DayName } from '@soliguide/common';
  import { Text } from '@soliguide/design-system';
  import { getContext } from 'svelte';
  import Schedule from 'svelte-google-materialdesign-icons/Schedule.svelte';

  export let hours: PlaceDetailsOpeningHours = {};
  export let currentDay: DayName;

  const i18n: I18nStore = getContext(I18N_CTX_KEY);
</script>

<section class="opening-hours">
  <div class="header">
    <Schedule size="16" />
    <Text type="caption1Medium" color="dark">{$i18n.t('SPECIFIC_TIMETABLES')}</Text>
  </div>
  <ul>
    {#each Object.entries(hours) as [day, openingHours]}
      <li class="open-hours" class:highlight={day === currentDay}>
        <Text type="caption1" color="neutral">{$i18n.t(`DAY_${day.toUpperCase()}`)}</Text>
        <span class="hours-container">
          <Text type="caption1Medium" color="neutral">
            {convertHoursToDisplay(openingHours, $i18n.t)}
          </Text>
        </span>
      </li>
    {/each}
  </ul>
</section>

<style lang="scss">
  .header {
    display: flex;
    align-items: center;
    gap: var(--spacingXS);
  }
  .opening-hours {
    margin-top: var(--spacingMD);
    display: flex;
    flex-direction: column;
    gap: var(--spacing2XS);
  }

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
    display: flex;
    align-items: center;
    gap: var(--spacingXS);
  }
</style>
