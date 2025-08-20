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
  import { sizeMapping, typeMapping } from './buttonsMapping';
  import type { ButtonShape, ButtonSize, ButtonType, IconPosition } from '../../types/Button';
  import { createEventDispatcher } from 'svelte';

  export let size: ButtonSize = 'medium';
  export let href: string;
  export let type: ButtonType = 'primaryFill';
  export let shape: ButtonShape = 'square';
  export let iconPosition: IconPosition | null = null;
  export let disabled = false;
  export let block = false;
  export let blank = false;

  // Shape is forced for icon buttons
  $: btnShapeIsRounded = iconPosition === 'iconOnly' || shape === 'rounded';
  $: btnClass = `btn ${sizeMapping[size]} ${typeMapping[type]}`;

  const dispatch = createEventDispatcher();
</script>

<a
  href={disabled ? null : href}
  target={blank ? '_blank' : null}
  class={btnClass}
  tabindex={disabled ? -1 : 0}
  class:btn-disabled-state={disabled}
  class:btn-block={block}
  class:btn-rounded={btnShapeIsRounded}
  class:btn-icon={iconPosition === 'iconOnly'}
  {...$$restProps}
  on:click={(event) => {
    dispatch('click', event);
  }}
>
  <span class="btn-content-container" class:reversed={iconPosition === 'reversed'}>
    {#if $$slots.icon}
      <span class="btn-icon-container">
        <slot name="icon" />
      </span>
    {/if}
    {#if iconPosition !== 'iconOnly'}
      <slot />
    {/if}
  </span>
</a>

<style>
  /* @import '../../styles/typography.scss';
  @import '../../styles/components/buttons.scss';

  // All button types have the same disabled state
  .btn-disabled-state {
    background: var(--color-interactionDisable);
    color: var(--color-textShy);
    box-shadow: none;
    border: 1px solid transparent;

    &:hover,
    &:focus,
    &:active {
      background: var(--color-interactionDisable);
      color: var(--color-textShy);
      cursor: not-allowed;
    }

    &.btn-shy.btn-icon,
    &.btn-reversed.btn-icon {
      box-shadow: none;
      background: none;
    }
    &.btn-shy {
      background: none;
    }
  } */
</style>
