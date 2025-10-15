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
  import { getContext } from 'svelte';
  import { Text } from '@soliguide/design-system';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import type { Source } from '$lib/models/types';
  import type { I18nStore } from '$lib/client/types';

  const i18n: I18nStore = getContext(I18N_CTX_KEY);

  export let sources: Source[] = [];
  export let color: 'neutral' | 'inverse' = 'neutral';
</script>

<Text type="caption2" {color}>
  {$i18n.t('SOURCE')}
  {#each sources as source, index}
    {#if source.url}
      <a class="display-source-link" href={source.url} target="_blank">{source.label}</a>
    {:else}
      {source.label}
    {/if}
    {#if source.licenseLabel && source.licenseLink}(<a
        class="display-source-license-link"
        href={source.licenseLink}
        target="_blank">{source.licenseLabel}</a
      >){/if}
    {#if index < sources.length - 1}<span>, </span>{/if}
  {/each}
</Text>

<style lang="scss">
  .display-source-link {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  .display-source-license-link {
    text-decoration: revert;
  }
</style>
