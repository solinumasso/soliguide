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
  import type { BadgeType } from '$lib/types/Badge';
  import type { TagSize, TagType, TagVariant } from '$lib/types/Tag';
  import Badge from './Badge.svelte';

  export let size: TagSize = 'medium';
  export let type: TagType = 'icon';
  export let variant: TagVariant = 'neutral';

  const sizeMapping: Record<TagSize, string> = {
    small: 'text-secondary-caption2-medium',
    medium: 'text-secondary-caption1-medium'
  };

  const variantMapping: Record<TagVariant, BadgeType> = {
    neutral: 'reversed',
    success: 'success',
    warning: 'warning',
    error: 'error'
  };

  $: tagClass = `tag ${sizeMapping[size]} ${variant} ${size}`;
  $: iconContainerClass = `icon-container ${size}`;
  $: badgeType = variantMapping[variant];
</script>

<span class={tagClass}>
  {#if $$slots.icon}
    <span class={iconContainerClass}>
      <slot name="icon" />
    </span>
  {:else if type === 'badge'}
    <Badge type={badgeType} />
  {/if}
  <slot />
</span>

<style>
  /* .tag {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing3XS);
    border-radius: var(--radiusFull);


    &.neutral {
      background-color: var(--color-surfaceGray2);
      color: var(--color-textInverse);
    }
    &.success {
      background-color: var(--color-surfaceSuccess1);
      color: var(--color-textDark);
    }
    &.warning {
      background-color: var(--color-surfaceWarning1);
      color: var(--color-textDark);
    }
    &.error {
      background-color: var(--color-surfaceError1);
      color: var(--color-textDark);
    }


    &.small {
      height: 16px;
      padding: 0 var(--spacingXS);
    }
    &.medium {
      height: 26px;
      padding: 0 var(--spacingMD);
    }
  }  */

  /* Icon sizing
  .icon-container {
    display: flex;
    justify-content: center;
    align-items: center;

    &.small {
      :global(svg) {
        width: 10px;
        height: 10px;
      }
    }
    &.medium {
      :global(svg) {
        width: 14px;
        height: 14px;
      }
    }
  } */
</style>
