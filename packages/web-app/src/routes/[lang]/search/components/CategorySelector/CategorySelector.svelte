<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import { getCategorySelectorController } from './CategorySelectorController';
  import CategoryButton from './CategoryButton.svelte';
  import CategoryBrowser from './CategoryBrowser.svelte';
  import { CategoryBrowserState } from './types';
  import { categoryService } from '$lib/services/categoryService';
  import type { CategorySearch } from '$lib/constants';

  const pageStore = getCategorySelectorController(categoryService);

  const dispatch = createEventDispatcher();

  pageStore.init();

  const selectCategory = (category: CategorySearch): void => {
    pageStore.selectCategory(category);
    dispatch('selectCategory', category);
  };
</script>

<div class="category-selector">
  {#each $pageStore.categoryButtons as category}
    <CategoryButton {category} on:click={(event) => selectCategory(event.detail)} />
  {/each}
  <CategoryButton on:click={() => pageStore.openCategoryBrowser()} />
</div>

{#if $pageStore.browserState !== CategoryBrowserState.CLOSED}
  <CategoryBrowser
    state={$pageStore.browserState}
    categories={$pageStore.categories}
    parentCategory={$pageStore.parentCategory}
    on:navigateChild={(event) => pageStore.navigateToDetail(event.detail)}
    on:navigateParent={pageStore.navigateBack}
    on:selectCategory={(event) => selectCategory(event.detail)}
  />
{/if}

<style lang="scss">
  .category-selector {
    padding: var(--spacingXS) 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
</style>
