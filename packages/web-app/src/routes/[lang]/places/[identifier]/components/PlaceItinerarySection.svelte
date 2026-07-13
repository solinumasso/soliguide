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
