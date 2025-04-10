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

  $: tileClass = `tile ${variant}`;
  $: iconClass = `tile-icon ${variant}`;
</script>

<div class={tileClass}>
  {#if withIcon}
    <span class={iconClass}>
      <slot />
    </span>
  {/if}
  <p class="tile-text text-secondary-text2-medium">
    {label}
  </p>
</div>

<style lang="scss">
  .tile {
    width: 100%;
    padding: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: center;
    gap: var(--spacingXS);
    border-radius: var(--spacingXS);
    box-shadow: var(--shadowXS);

    &.primary {
      background-color: var(--color-surfacePrimary2);
    }

    &.secondary {
      background-color: var(--color-surfaceSecondary1);
    }

    &.tertiary {
      background-color: var(--color-surfaceTertiary2);
    }

    .tile-text {
      color: var(--textNeutral);
    }

    .tile-icon {
      border-radius: var(--radiusFull);
      width: 24px;
      height: 24px;
      padding: var(--spacing3XS);
      gap: 10px;

      &.primary {
        background-color: var(--color-surfaceSecondary1);
        color: var(--color-textHighlightTertiary);
      }

      &.secondary {
        background-color: var(--color-surfaceTertiary1);
        color: var(--color-textHighlightSecondary);
      }

      &.tertiary {
        background-color: var(--color-surfacePrimary1);
        color: var(--color-textHighlightPrimary);
      }
    }
  }
</style>
