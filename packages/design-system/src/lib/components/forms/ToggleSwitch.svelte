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

  $: sizeClass = size === 'medium' ? 'toggle-switch-medium' : 'toggle-switch-small';
  $: checkmarkSize = size === 'medium' ? 16 : 12;
  $: iconColor = disabled ? $theme.color.shy : $theme.color.success;
</script>

<label class={`toggle-switch ${sizeClass}`}>
  <input
    type="checkbox"
    role="switch"
    bind:checked
    class="sr-only"
    {disabled}
    on:change
    {...$$restProps}
  />
  <span class="toggle-switch-handle"
    ><span class="toggle-switch-checkmark"
      ><CheckMark color={iconColor} size={checkmarkSize} tabindex="-1" inert /></span
    ></span
  >
</label>

<style>
  /* .toggle-switch {
    cursor: pointer;
    display: flex;
    align-items: center;
    border-radius: var(--radiusFull);
    background-color: var(--color-textNeutral);

    &.disabled,
    &:disabled,
    &:disabled:hover {
      cursor: not-allowed;
    }

    &:hover {
      cursor: pointer;
    }
    &:focus,
    &:active {
      outline: none;
    }

    &:has(input:checked) {
      background-color: var(--color-textSuccess);
      .toggle-switch-handle {
        transform: translateX(100%);
        .toggle-switch-checkmark {
          display: inline-flex;
        }
      }
    }

    &:has(input:disabled),
    &:has(input:disabled):hover,
    &:has(input:disabled):focus,
    &:has(input:disabled):active {
      background-color: var(--color-interactionDisable);
    }

    .toggle-switch-handle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      background-color: var(--color-surfaceWhite);
      border-radius: var(--radiusFull);
      transition: transform 0.15s;
      .toggle-switch-checkmark {
        display: none;
      }
    }
  }

  .toggle-switch-small {
    height: 24px;
    width: 42px;
    padding: 0 3px;

    .toggle-switch-handle {
      $toggle-switch-handle-size: 18px;
      height: $toggle-switch-handle-size;
      width: $toggle-switch-handle-size;
    }
  }

  .toggle-switch-medium {
    height: 32px;
    width: 56px;
    padding: 0 4px;

    .toggle-switch-handle {
      $toggle-switch-handle-size: 24px;
      height: $toggle-switch-handle-size;
      width: $toggle-switch-handle-size;
    }
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    border: 0;
    clip: rect(0, 0, 0, 0);
    overflow: hidden;
  } */
</style>
