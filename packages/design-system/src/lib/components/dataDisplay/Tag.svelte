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

  const variantMapping: Record<TagVariant, BadgeType> = {
    neutral: 'reversed',
    success: 'success',
    warning: 'warning',
    error: 'error'
  };

  const variantClassesMapping: Record<TagVariant, string> = {
    neutral: 'bg-surfaceGray2 text-inverse',
    success: 'bg-surfaceSuccess1 text-dark',
    warning: 'bg-surfaceWarning1 text-dark',
    error: 'bg-surfaceError1 text-dark'
  };

  const sizeClassesMapping: Record<TagSize, string> = {
    small: 'h-[16px] px-xs text-secondary-caption2-medium',
    medium: 'h-[26px] px-md text-secondary-caption1-medium'
  };

  const iconSizeClassesMapping: Record<TagSize, string> = {
    small: '[&>svg]:w-[10px] [&>svg]:h-[10px]',
    medium: '[&>svg]:w-[14px] [&>svg]:h-[14px]'
  };

  $: baseClasses = 'inline-flex items-center gap-3xs rounded-full';
  $: tagClasses = `${baseClasses} ${sizeClassesMapping[size]} ${variantClassesMapping[variant]}`;
  $: iconContainerClasses = `flex justify-center items-center ${iconSizeClassesMapping[size]}`;
  $: badgeType = variantMapping[variant];
</script>

<span class={tagClasses}>
  {#if $$slots.icon}
    <span class={iconContainerClasses}>
      <slot name="icon" />
    </span>
  {:else if type === 'badge'}
    <Badge type={badgeType} />
  {/if}
  <slot />
</span>
