<script lang="ts">
  import LocationOn from 'svelte-google-materialdesign-icons/Location_on.svelte';
  import { Text } from '@soliguide/design-system';
  import { getContext } from 'svelte';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import type { I18nStore } from '$lib/client/types';

  const i18n: I18nStore = getContext(I18N_CTX_KEY);
</script>

<button on:click class="search-input-button">
  <span class="sib-content">
    <LocationOn size="16px" class="sib-icon" variation="filled" />
    <Text type="caption1">{$i18n.t('WHERE_YOU_NEED_TO_SEARCH')}</Text>
  </span>
</button>

<style lang="scss">
  .search-input-button {
    border-radius: var(--radiusFull);
    padding: var(--spacingLG) var(--spacing2XL);
    background-color: var(--color-interactionReversed);
    // ShadowXS is not visible enough
    box-shadow: 2px 2px 4px -4px rgba(23, 23, 23, 0.9);
    cursor: pointer;
    .sib-content {
      display: flex;
      gap: var(--spacingXS);
      :global(.sib-icon) {
        color: var(--color-surfacePrimary3);
      }
    }
  }
</style>
