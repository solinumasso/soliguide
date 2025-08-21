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
  import Text from '$lib/components/Text.svelte';
  import type { BadgeType } from '$lib/types/Badge';

  export let type: BadgeType = 'focus';
  export let text: string | null = null;
  export let offset: [number, number] = [0, 0];

  const typeMapping: Record<BadgeType, string> = {
    focus: 'bg-focus text-inverse',
    success: 'bg-success text-inverse',
    error: 'bg-error text-inverse',
    warning: 'bg-warning text-inverse',
    reversed: 'bg-inverse text-dark'
  };

  $: badgeClass = `flex items-center justify-center ${typeMapping[type]}`;
  $: offsetStyle = `top: ${offset[0]}px; right: ${offset[1]}px;`;
</script>

<div class="relative inline-flex">
  <div
    class={$$slots.default ? 'absolute translate-x-1/2 -translate-y-1/2 origin-top-right' : ''}
    style={$$slots.default ? offsetStyle : ''}
  >
    {#if text}
      <span class={`${badgeClass} rounded-full min-w-[1.125rem] min-h-[1.125rem] px-2xs`}
        ><Text type="caption1Bold">{text}</Text></span
      >
    {:else}
      <span class={`${badgeClass} rounded-full w-2 h-2`} />
    {/if}
  </div>
  <slot />
</div>
