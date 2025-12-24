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
  import { Text, ListItem, PageLoader } from '@soliguide/design-system';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import { CategoryIcon } from '$lib/components';
  import { getCategoryTranslationKey, type Categories } from '@soliguide/common';
  import type { I18nStore } from '$lib/client/types';

  export let items: Categories[] = [];
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
        title={$i18n.t(getCategoryTranslationKey(item))}
        shape="bordered"
        type="actionFull"
        size="small"
        on:click={() => dispatch('click', item)}
      >
        <svelte:fragment slot="icon">
          <span class="result-item-icon">
            <CategoryIcon categoryId={item} variation="filled" />
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
