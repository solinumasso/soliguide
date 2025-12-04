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
  import MoreHoriz from 'svelte-google-materialdesign-icons/More_horiz.svelte';
  import { Button, Text } from '@soliguide/design-system';
  import { createEventDispatcher, getContext } from 'svelte';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import { CategoryIcon } from '$lib/components';
  import type { Categories } from '@soliguide/common';
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
  <Text type="caption2Bold">{$i18n.t((category || 'ALL').toUpperCase())}</Text>
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
