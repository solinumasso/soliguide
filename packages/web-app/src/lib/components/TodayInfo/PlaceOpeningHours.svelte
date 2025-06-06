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
  import { Text } from '@soliguide/design-system';
  import QueryBuilder from 'svelte-google-materialdesign-icons/Query_builder.svelte';
  import { formatTimeRangeToLocale } from '$lib/client';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import { getContext } from 'svelte';
  import type { I18nStore } from '$lib/client/types';
  import type { HoursRange } from '$lib/models/types';

  const i18n: I18nStore = getContext(I18N_CTX_KEY);

  export let openingRange: HoursRange[];

  $: formatedContent = formatTimeRangeToLocale(openingRange)
    .map((range) => `${$i18n.t('OPENING_RANGE', { start: range.start, end: range.end })}`)
    .join(' - ');
</script>

<div class="opening-hours-container">
  <div class="opening-hours">
    <QueryBuilder size="16" />
    <Text ellipsis type="text2Medium"
      >{$i18n.t('TODAY_OPENING_RANGE', { openingRange: formatedContent })}</Text
    >
  </div>
  <slot />
</div>

<style lang="scss">
  .opening-hours-container {
    display: flex;
    gap: var(--spacing3XS);
  }

  .opening-hours {
    max-width: 100%;
    display: flex;
    align-items: center;
    gap: var(--spacing4XS);
  }
</style>
