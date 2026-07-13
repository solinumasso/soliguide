<script lang="ts">
  import MoreHoriz from 'svelte-google-materialdesign-icons/More_horiz.svelte';
  import { Button, Text } from '@soliguide/design-system';
  import { createEventDispatcher, getContext } from 'svelte';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import { CategoryIcon } from '$lib/components';
  import { getCategoryTranslationKey, type Categories } from '@soliguide/common';
  import type { I18nStore } from '$lib/client/types';

  export let category: Categories | null = null;

  const i18n: I18nStore = getContext(I18N_CTX_KEY);
  const dispatch = createEventDispatcher();
</script>

<div class="category-selector-item">
  <Button
    type="primaryGradientFill"
    iconPosition="iconOnly"
    on:click={() => dispatch('click', category)}
  >
    <svelte:fragment slot="icon">
      {#if category}
        <CategoryIcon categoryId={category} variation="filled" size={22} />
      {:else}
        <MoreHoriz />
      {/if}
    </svelte:fragment>
  </Button>
  <Text type="caption2Bold">{$i18n.t(category ? getCategoryTranslationKey(category) : 'ALL')}</Text>
</div>

<style lang="scss">
  .category-selector-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacingSM);
    padding: 0 var(--spacing3XS);
    text-align: center;
    width: 70px;
  }
</style>
