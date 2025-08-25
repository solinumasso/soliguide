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
  import Spinner from '$lib/components/Spinner.svelte';
  import {
    baseClasses,
    sizeMapping,
    typeMapping,
    disabledClasses,
    spinnerSizeMapping,
    iconSizeMapping
  } from './buttonsTailwindMapping';
  import type { ButtonShape, ButtonSize, ButtonType, IconPosition } from '$lib/types/Button';
  import type { SpinnerType } from '$lib/types/Spinner';

  export let size: ButtonSize = 'medium';
  export let type: ButtonType = 'primaryFill';
  export let shape: ButtonShape = 'square';
  export let iconPosition: IconPosition | null = null;
  export let disabled = false;
  export let block = false;
  export let submit = false;
  export let isLoading = false;

  const getSpinnerType = (buttonType: ButtonType): SpinnerType => {
    switch (buttonType) {
      case 'neutralFill':
        return 'reversed';
      case 'neutralOutlined':
      case 'primaryOutline':
        return 'primary';
      case 'reversed':
        return 'reversed';
      default:
        return 'neutral';
    }
  };

  $: isRounded = iconPosition === 'iconOnly' || shape === 'rounded';
  $: isIconOnly = iconPosition === 'iconOnly';
  $: iconSize = iconSizeMapping[size];

  $: buttonClasses = [
    baseClasses,
    sizeMapping[size],
    disabled ? disabledClasses[type] : typeMapping[type],
    block ? 'w-full' : '',
    isRounded ? 'rounded-full!' : '',
    isIconOnly ? `aspect-square p-0 ${iconSize.width} ${iconSize.height}` : '',
    iconPosition === 'reversed' ? 'flex-row-reverse' : ''
  ]
    .filter(Boolean)
    .join(' ');

  $: spinnerType = getSpinnerType(type);
  $: spinnerSize = spinnerSizeMapping[size];
</script>

<button
  type={submit ? 'submit' : 'button'}
  on:click
  class={buttonClasses}
  {disabled}
  {...$$restProps}
>
  <span
    class={`absolute transition-opacity duration-200 ${isLoading ? 'opacity-100' : 'opacity-0'}`}
  >
    <Spinner size={spinnerSize} type={spinnerType} />
  </span>

  <span class={`inline-flex items-center gap-xs ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
    {#if $$slots.icon}
      <span class={`flex items-center justify-center ${iconSize.width} ${iconSize.height}`}>
        <slot name="icon" />
      </span>
    {/if}
    {#if !isIconOnly}
      <slot />
    {/if}
  </span>
</button>
