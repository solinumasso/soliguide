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
  import type { TileVariant } from '$lib/types/Tile';

  export let withIcon = true;
  export let label: string;
  export let variant: TileVariant;

  $: tileClass = `w-full p-xs flex justify-center items-center self-center gap-xs rounded-xs shadow-xs
    ${variant === 'primary' ? 'bg-surfacePrimary2' : ''}
    ${variant === 'secondary' ? 'bg-surfaceSecondary1' : ''}
    ${variant === 'tertiary' ? 'bg-surfaceTertiary2' : ''}`;

  $: iconClass = `rounded-full w-6 h-6 p-3xs flex items-center justify-center gap-sm
    ${variant === 'primary' ? 'bg-surfaceSecondary1 text-highlightTertiary' : ''}
    ${variant === 'secondary' ? 'bg-surfaceTertiary1 text-highlightSecondary' : ''}
    ${variant === 'tertiary' ? 'bg-surfacePrimary1 text-highlightPrimary' : ''}`;
</script>

<div class={tileClass}>
  {#if withIcon}
    <span class={iconClass}>
      <slot />
    </span>
  {/if}
  <p class="text-secondary-text2-medium text-neutral">
    {label}
  </p>
</div>
