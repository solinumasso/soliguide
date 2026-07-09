<script lang="ts">
  import type { TodayInfo } from '$lib/models/types';
  import PlaceClosingDays from './PlaceClosingDays.svelte';
  import PlaceOpeningHours from './PlaceOpeningHours.svelte';

  export let todayInfo: TodayInfo;
</script>

{#if todayInfo.openingHours && todayInfo.openingHours.length > 0}
  <PlaceOpeningHours openingRange={todayInfo.openingHours}><slot /></PlaceOpeningHours>
{:else if todayInfo.closingDays}
  <PlaceClosingDays closingRange={todayInfo.closingDays}><slot /></PlaceClosingDays>
{/if}
