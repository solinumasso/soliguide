<!--
Soliguide: Useful information for those who need it

SPDX-FileCopyrightText: © 2024 Solinum

SPDX-License-Identifier: AGPL-3.0-only

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
-->
<script lang="ts">
  import AccessTime from 'svelte-google-materialdesign-icons/Access_time.svelte';
  import AccessibleForward from 'svelte-google-materialdesign-icons/Accessible_forward.svelte';
  import AcUnit from 'svelte-google-materialdesign-icons/Ac_unit.svelte';
  import Pets from 'svelte-google-materialdesign-icons/Pets.svelte';
  import {
    createEventDispatcher,
    getContext,
    type ComponentType,
    type SvelteComponent
  } from 'svelte';
  import { ToggleButton } from '@soliguide/design-system';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import type { I18nStore } from '$lib/client/types';
  import { SEARCH_RESULT_FILTERS, type SearchResultFilter } from '../filters';

  export let selectedFilters: SearchResultFilter[] = [];

  const i18n: I18nStore = getContext(I18N_CTX_KEY);
  const dispatch = createEventDispatcher<{ toggle: SearchResultFilter }>();

  const filterIcons: Record<SearchResultFilter, ComponentType<SvelteComponent>> = {
    openToday: AccessTime,
    pmr: AccessibleForward,
    animal: Pets,
    airConditioned: AcUnit
  };

  const isSelected = (filter: SearchResultFilter): boolean => selectedFilters.includes(filter);
</script>

<nav class="results-filters" aria-label={$i18n.t('FILTERS_USED')}>
  <div class="filters-list">
    {#each SEARCH_RESULT_FILTERS as filter}
      {@const label = $i18n.t(filter.translationKey)}
      {@const selected = isSelected(filter.name)}
      <ToggleButton
        size="xsmall"
        type="secondaryOutline"
        icon={filterIcons[filter.name]}
        checked={selected}
        value={filter.name}
        aria-label={label}
        title={label}
        on:change={() => dispatch('toggle', filter.name)}
      >
        {label}
      </ToggleButton>
    {/each}
  </div>
</nav>

<style lang="scss">
  .results-filters {
    margin: var(--spacingMD) calc(var(--spacingLG) * -1) 0;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .filters-list {
    display: flex;
    gap: var(--spacingXS);
    min-width: max-content;
    padding: var(--spacing2XS) var(--spacingLG) var(--spacingXS);
  }
</style>
