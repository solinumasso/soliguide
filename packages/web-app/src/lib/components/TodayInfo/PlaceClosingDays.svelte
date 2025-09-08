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
  import Block from 'svelte-google-materialdesign-icons/Block.svelte';
  import { formatDateRangeToLocale } from '$lib/client';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import { getContext } from 'svelte';
  import { page } from '$app/stores';
  import type { I18nStore } from '$lib/client/types';
  import type { DaysRange } from '$lib/models/types';

  const i18n: I18nStore = getContext(I18N_CTX_KEY);

  export let closingRange: DaysRange;

  $: formatedContent = formatDateRangeToLocale(closingRange, $page.params.lang);
</script>

<div class="closing-days">
  <span class="closing-days-icon">
    <Block id="closing-days-icon" size="16" />
  </span>
  <span class="closing-days-text text-secondary-text2-medium"
    >{formatedContent.end
      ? $i18n.t('CLOSING_DAYS_RANGE', {
          startDate: formatedContent.start,
          endDate: formatedContent.end
        })
      : $i18n.t('CLOSING_DAYS_RANGE_WITHOUT_END_DATE', {
          startDate: formatedContent.start
        })}</span
  >
</div>

<style lang="scss">
  .closing-days {
    gap: var(--spacing4XS);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
  .closing-days-text {
    vertical-align: middle;
  }
  .closing-days-icon {
    vertical-align: middle;
  }
</style>
