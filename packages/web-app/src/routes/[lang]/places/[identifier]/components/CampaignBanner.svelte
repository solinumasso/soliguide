<script lang="ts">
  import { getContext } from 'svelte';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import type { I18nStore } from '$lib/client/types';
  import { InfoBlock } from '@soliguide/design-system';
  import type { PlaceCampaignBannerMessage } from '$lib/models/types';

  const i18n: I18nStore = getContext(I18N_CTX_KEY);

  export let campaignBanner: PlaceCampaignBannerMessage | null;
</script>

{#if campaignBanner}
  <InfoBlock withIcon={true} variant="warning" text={$i18n.t(campaignBanner)}></InfoBlock>
{/if}
