<script lang="ts">
  import { createEventDispatcher, getContext } from 'svelte';
  import PinDrop from 'svelte-google-materialdesign-icons/Pin_drop.svelte';
  import { Text, ListItem, AppIcon, PageLoader } from '@soliguide/design-system';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import { capitalize } from '@soliguide/common';
  import type { LocationSuggestion } from '$lib/models/locationSuggestion';
  import type { I18nStore } from '$lib/client/types';

  export let items: LocationSuggestion[] = [];
  export let loading = false;

  const i18n: I18nStore = getContext(I18N_CTX_KEY);
  const dispatch = createEventDispatcher();
</script>

<PageLoader {loading}>
  <div class="results-list">
    {#if items.length}
      <span class="result-title">
        <Text type="text1Bold" as="h2">{$i18n.t('LOCATION_SUGGESTIONS')}</Text>
      </span>
    {/if}

    {#each items as item}
      <ListItem
        title={item.suggestionLine1}
        subTitle={capitalize($i18n.t(item.suggestionLine2))}
        shape="bordered"
        type="actionFull"
        size="small"
        on:click={() => dispatch('click', item)}
      >
        <AppIcon slot="icon" icon={PinDrop} type="secondary" />
      </ListItem>
    {/each}
  </div>
</PageLoader>

<style lang="scss">
  .results-list {
    padding-top: var(--spacingXL);
  }

  .result-title {
    display: inline-block;
    margin-bottom: var(--spacingXS);
  }
</style>
