<script lang="ts">
  import { createEventDispatcher, getContext } from 'svelte';
  import { Text, ListItem, PageLoader } from '@soliguide/design-system';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import { CategoryIcon } from '$lib/components';
  import { AutoCompleteType, type FormattedSuggestion } from '@soliguide/common';
  import type { I18nStore } from '$lib/client/types';

  export let items: FormattedSuggestion[] = [];
  export let loading = false;

  const i18n: I18nStore = getContext(I18N_CTX_KEY);
  const dispatch = createEventDispatcher();
</script>

<PageLoader {loading}>
  <div class="results-list">
    {#if items.length}
      <span class="result-title">
        <Text type="text1Bold" as="h2">{$i18n.t('CATEGORY_SUGGESTIONS')}</Text>
      </span>
    {/if}

    {#each items as item}
      <ListItem
        title={item.label}
        shape="bordered"
        type="actionFull"
        size="small"
        on:click={() => dispatch('click', item)}
      >
        <svelte:fragment slot="icon">
          <span class="result-item-icon">
            {#if item.type === AutoCompleteType.CATEGORY && item.categoryId}
              <CategoryIcon categoryId={item.categoryId} variation="filled" />
            {/if}
          </span>
        </svelte:fragment>
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

  .result-item-icon {
    height: 24px;
    width: 24px;
    border-radius: var(--radiusFull);
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-surfaceTertiary1);
    color: var(--color-textHighlightTertiary);
  }
</style>
