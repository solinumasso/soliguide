<!-- <script lang="ts">
  import PlaceDetailsSection from './PlaceDetailsSection.svelte';
  import { Text } from '@soliguide/design-system';

  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import { getContext } from 'svelte';
  import type { I18nStore } from '$lib/client/types';
  import { PlaceType, type CommonPlaceParcours } from '@soliguide/common';
  import ParcoursCard from './ParcoursCard.svelte';

  const i18n: I18nStore = getContext(I18N_CTX_KEY);

  export let placetype: PlaceType;
  export let parcours: CommonPlaceParcours[] | [];
</script>

{#if parcours.length > 0 && placetype === PlaceType.ITINERARY}
  <PlaceDetailsSection>
    <Text type="title3PrimaryExtraBold">{$i18n.t('OTHER_CROSSING_POINTS')}</Text>
    <div>
      {#each parcours as point}
        <ParcoursCard parcours={point} />
      {/each}
    </div>
  </PlaceDetailsSection>
{/if} -->
