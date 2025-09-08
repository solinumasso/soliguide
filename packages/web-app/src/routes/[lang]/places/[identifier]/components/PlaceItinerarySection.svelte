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
  import PlaceDetailsSection from './PlaceDetailsSection.svelte';
  import { Text } from '@soliguide/design-system';

  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import { getContext } from 'svelte';
  import type { I18nStore } from '$lib/client/types';
  import LightCard from './LightCard.svelte';
  import type { PlaceDetails } from '$lib/models/types';
  import { PlaceType } from '@soliguide/common';

  const i18n: I18nStore = getContext(I18N_CTX_KEY);

  export let place: PlaceDetails;
</script>

{#if place.placeType === PlaceType.ITINERARY}
  <PlaceDetailsSection>
    <div class="itinerary-section">
      <Text type="title3PrimaryExtraBold">{$i18n.t('OTHER_CROSSING_POINTS')}</Text>
      <div class="itinerary-cards-container">
        {#each place.linkedPlaces as crossingPoint}
          <LightCard place={crossingPoint} />
        {/each}
      </div>
    </div>
  </PlaceDetailsSection>
{/if}

<style>
  .itinerary-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacingLG);
  }

  .itinerary-cards-container {
    display: flex;
    gap: var(--spacingSM);
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding: 0 0 var(--spacingXL) 0;
  }
</style>
