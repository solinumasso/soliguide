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
  import { createEventDispatcher, getContext } from 'svelte';
  import MoreHoriz from 'svelte-google-materialdesign-icons/More_horiz.svelte';
  import { Topbar } from '@soliguide/design-system';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import CategoryListItem from './CategoryListItem.svelte';
  import { CategoryIcon } from '$lib/components';
  import { getCategoryBrowserController } from './CategoryBrowserController';
  import { CategoryBrowserState } from './types';
  import { getCategoryTranslationKey, type Categories } from '@soliguide/common';
  import type { I18nStore } from '$lib/client/types';
  import type { PosthogCaptureFunction } from '$lib/services/types';
  import { categoryService } from '$lib/services/categoryService';

  export let state: CategoryBrowserState = CategoryBrowserState.CLOSED;
  export let parentCategory: Categories | null = null;
  export let categories: Categories[] = [];

  const i18n: I18nStore = getContext(I18N_CTX_KEY);
  const dispatch = createEventDispatcher();
  const pageStore = getCategoryBrowserController();

  const capture: PosthogCaptureFunction =
    getContext('CAPTURE_FCTN_CTX_KEY') || pageStore.captureEvent;

  const goBack = () => {
    dispatch('navigateParent', parentCategory);
  };

  const clickCategory = (category: Categories | null) => {
    if (!category) {
      return;
    }

    // Check if the category has children
    const categoryHasChildren = categoryService.hasChildren(category);

    // If the category has children, navigate to them
    if (categoryHasChildren) {
      dispatch('navigateChild', category);
      capture('browsecategory', { category });
    } else {
      // If no children, select the category for search
      dispatch('selectCategory', category);
    }
  };

  const selectParentCategory = () => {
    if (!parentCategory) {
      return;
    }
    dispatch('selectCategory', parentCategory);
  };
</script>

<section class="category-browser">
  <div class="topbar">
    <Topbar type="transparent" title={$i18n.t('CATEGORIES')} on:navigate={goBack} />
  </div>

  <div class="browser-body">
    <CategoryListItem
      title={$i18n.t(parentCategory ? getCategoryTranslationKey(parentCategory) : 'ALL_CATEGORIES')}
    >
      <svelte:fragment slot="icon">
        {#if parentCategory}
          <CategoryIcon categoryId={parentCategory} variation="filled" />
        {:else}
          <MoreHoriz />
        {/if}
      </svelte:fragment>
    </CategoryListItem>

    {#if state === CategoryBrowserState.OPEN_CATEGORY_DETAIL}
      <CategoryListItem title={$i18n.t('ALL_CATEGORY')} navigable on:click={selectParentCategory} />
    {/if}

    {#each categories as category}
      <CategoryListItem
        title={$i18n.t(getCategoryTranslationKey(category))}
        navigable
        on:click={() => clickCategory(category)}
      >
        <svelte:fragment slot="icon">
          {#if state === CategoryBrowserState.OPEN_ROOT_CATEGORIES}
            <CategoryIcon categoryId={category} variation="filled" />
          {/if}
        </svelte:fragment>
      </CategoryListItem>
    {/each}
  </div>
</section>

<style lang="scss">
  .category-browser {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-color: var(--color-surfaceWhite);
    z-index: 2;
    overflow: auto;
  }

  .topbar {
    background-color: var(--color-surfaceWhite);
    height: var(--topbar-height);
    position: fixed;
    top: 0;
    width: 100vw;
  }

  .browser-body {
    padding: calc(var(--topbar-height) + var(--spacingXL)) var(--spacingLG) var(--spacing4XL)
      var(--spacingLG);

    display: flex;

    flex-direction: column;
    gap: var(--spacingSM);
  }
</style>
