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
  import CheckMark from '$lib/components/icons/CheckMark.svelte';
  import type { ToggleSwitchSize } from '$lib/types/ToggleSwitch';
  import type { ThemeContext } from '$lib/types/theme';

  export let size: ToggleSwitchSize = 'medium';
  export let disabled = false;
  export let checked = false;

  const { theme } = getContext<ThemeContext>('theme');

  // Size configuration mapping - following design tokens from theme.css
  const sizeConfig: Record<
    ToggleSwitchSize,
    { container: string; handle: string; checkmarkSize: number }
  > = {
    small: {
      container: 'h-[24px] w-[42px] px-[3px]',
      handle: 'h-[18px] w-[18px]',
      checkmarkSize: 12
    },
    medium: {
      container: 'h-[32px] w-[56px] px-[4px]',
      handle: 'h-[24px] w-[24px]',
      checkmarkSize: 16
    }
  };

  // Base classes using design tokens from theme.css
  const baseClasses = 'cursor-pointer flex items-center rounded-full transition-all duration-150';
  const handleClasses =
    'inline-flex items-center justify-center bg-surfaceWhite rounded-full transition-transform duration-150';
  const hiddenInputClasses = 'sr-only';

  // Dynamic classes based on state and props
  $: containerClasses = [
    baseClasses,
    sizeConfig[size].container,
    checked ? 'bg-success' : 'bg-neutral',
    disabled ? '!cursor-not-allowed !bg-interactionDisable' : 'hover:cursor-pointer'
  ]
    .filter(Boolean)
    .join(' ');

  $: toggleHandleClasses = [
    handleClasses,
    sizeConfig[size].handle,
    checked ? 'translate-x-full' : 'translate-x-0'
  ]
    .filter(Boolean)
    .join(' ');

  $: checkmarkClasses = checked ? 'flex items-center justify-center' : 'hidden';
  $: iconColor = disabled ? $theme.color.shy : $theme.color.success;
</script>

<label class={containerClasses}>
  <input
    type="checkbox"
    role="switch"
    bind:checked
    class={hiddenInputClasses}
    {disabled}
    on:change
    {...$$restProps}
  />
  <span class={toggleHandleClasses}>
    <span class={checkmarkClasses}>
      <CheckMark color={iconColor} size={sizeConfig[size].checkmarkSize} tabindex="-1" inert />
    </span>
  </span>
</label>
