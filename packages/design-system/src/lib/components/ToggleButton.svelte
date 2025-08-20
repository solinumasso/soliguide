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
  import type { ComponentType, SvelteComponent } from 'svelte';
  import type { ToggleButtonSize, ToggleButtonType } from '$lib/types/ToggleButton';

  export let size: ToggleButtonSize = 'medium';
  export let type: ToggleButtonType = 'secondaryBordered';
  export let icon: ComponentType<SvelteComponent> | null = null;
  export let iconOnly = false;
  export let disabled = false;
  export let singleSelect = false;
  export let checked = false;
  export let value: unknown | null = null;
  export let block = false;

  const sizeMapping: Record<ToggleButtonSize, string> = {
    xsmall: 'btn-xsmall',
    medium: 'btn-medium',
    large: 'btn-large'
  };

  const typeMapping: Record<ToggleButtonType, string> = {
    secondaryBordered: 'btn-secondary-bordered',
    secondaryOutline: 'btn-secondary-shadowed',
    primaryShy: 'btn-primary-shy',
    primaryReversed: 'btn-primary-reversed'
  };

  $: btnClass = `btn ${sizeMapping[size]} ${typeMapping[type]}`;
  $: iconOnly = type === 'primaryShy' || type === 'primaryReversed' || iconOnly;
</script>

<label
  class={btnClass}
  class:btn-disabled-state={disabled}
  class:btn-active={checked}
  class:btn-icon={iconOnly}
  class:btn-block={block}
>
  {#if singleSelect}
    <input
      type="radio"
      {value}
      class="sr-only"
      bind:group={checked}
      {disabled}
      aria-checked={checked}
      on:change
      {...$$restProps}
    />
  {:else}
    <input
      type="checkbox"
      {value}
      class="sr-only"
      bind:checked
      {disabled}
      aria-checked={checked}
      on:change
      {...$$restProps}
    />
  {/if}
  <span class="btn-content-container">
    {#if !!icon}
      <span class="btn-icon-container">
        <svelte:component this={icon} class="icon" aria-hidden="true" />
      </span>
    {/if}
    {#if !iconOnly}
      <slot />
    {/if}
  </span>
</label>

<style>
  /* @import '../styles/typography.scss';

  .btn {
    text-decoration: none;
    cursor: pointer;
    white-space: nowrap;
    font-family: var(--typography-fontFamilySecondary);
    border: 1px solid transparent;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &.disabled,
    &:disabled,
    &:disabled:hover {
      cursor: not-allowed;
    }

    &:hover {
      text-decoration: none;
      cursor: pointer;
      color: var(--color-textHighlightSecondary2);
    }
    &:focus,
    &:active {
      outline: none;
      color: var(--color-textHighlightSecondary2);
    }
  }

  .btn-xsmall {
    @extend .text-secondary-caption1-bold;
    padding: 0 var(--spacingMD);
    height: 24px;
    min-width: 24px;
    border-radius: var(--radiusMiddle);

    .btn-content-container {
      gap: var(--spacing3XS);
    }

    :global(.icon) {
      width: 16px;
      height: 16px;
    }

    &.btn-icon {
      padding: 0;
      width: 24px;
      border-radius: var(--radiusFull);
    }
  }

  .btn-medium {
    @extend .text-secondary-text1-bold;
    padding: 0 var(--spacingLG);
    height: 40px;
    min-width: 40px;
    border-radius: var(--radiusMiddle);

    :global(.icon) {
      width: 22px;
      height: 22px;
    }

    &.btn-icon {
      padding: 0;
      width: 40px;
      border-radius: var(--radiusFull);

      :global(.icon) {
        width: 24px;
        height: 24px;
      }
    }
  }

  .btn-large {
    @extend .text-secondary-text1-bold;
    padding: 0 var(--spacingXL);
    height: 52px;
    min-width: 52px;
    border-radius: var(--radiusRounded);

    :global(.icon) {
      width: 24px;
      height: 24px;
    }

    &.btn-icon {
      padding: 0;
      width: 52px;
      border-radius: var(--radiusFull);

      :global(.icon) {
        width: 32px;
        height: 32px;
      }
    }
  }

  .btn-secondary-bordered {
    border: 1px solid var(--color-borderNeutral);
    background: transparent;
    color: var(--color-textDark);

    &:hover {
      background: var(--color-interactionOutlinedSecondaryHover);
    }
    &:active,
    &:focus-visible,
    &:focus-visible:hover {
      background: var(--color-interactionOutlinedSecondaryPress);
    }

    &.btn-active {
      color: var(--color-textInverse);
      background: var(--color-interactionOutlinedSecondaryActive);

      &:hover {
        background: var(--color-interactionOutlinedSecondaryActiveHover);
      }

      &:active,
      &:focus-visible,
      &:focus-visible:hover {
        background: var(--color-interactionOutlinedSecondaryActivePress);
      }
    }
  }

  .btn-secondary-shadowed {
    background: var(--color-interactionOutlinedSecondary);
    box-shadow: var(--shadowXS);
    color: var(--color-textDark);

    &:hover {
      background: var(--color-interactionOutlinedSecondaryHover);
    }
    &:active,
    &:focus-visible,
    &:focus-visible:hover {
      background: var(--color-interactionOutlinedSecondaryPress);
    }
    &.btn-active {
      color: var(--color-textInverse);
      background: var(--color-interactionOutlinedSecondaryActive);

      &:hover {
        background: var(--color-interactionOutlinedSecondaryActiveHover);
      }

      &:active,
      &:focus-visible,
      &:focus-visible:hover {
        background: var(--color-interactionOutlinedSecondaryActivePress);
      }
    }
  }

  .btn-primary-shy {
    background: transparent;
    color: var(--color-interactionNeutral);
    &:hover {
      background: var(--color-interactionReversedHover);
      color: var(--color-textHighlightPrimary);
    }
    &:active,
    &:focus-visible,
    &:focus-visible:hover {
      background: var(--color-interactionReversedPress);
      color: var(--color-interactionHighlightPrimaryPress);
    }

    &.btn-active {
      background: var(--color-surfaceSecondary1);
      color: var(--color-textHighlightPrimary);
      &:hover {
        background: var(--color-interactionReversedHover);
        color: var(--color-interactionReversedActiveHover);
      }

      &:active,
      &:focus-visible,
      &:focus-visible:hover {
        background: var(--color-interactionReversedPress);
        color: var(--color-interactionReversedActivePress);
      }
    }
  }

  .btn-primary-reversed {
    background: var(--color-surfaceWhiteAlphaLight);
    color: var(--color-interactionReversed);

    &:hover {
      background: var(--color-interactionReversedHover);
    }
    &:active,
    &:focus-visible,
    &:focus-visible:hover {
      background: var(--color-interactionReversedPress);
    }

    &.btn-active {
      background: var(--color-surfaceWhiteAlphaStrong);
      color: var(--color-interactionReversedActive);
      &:hover {
        background: var(--color-interactionReversedHover);
        color: var(--color-interactionReversedActiveHover);
      }

      &:active,
      &:focus-visible,
      &:focus-visible:hover {
        background: var(--color-interactionReversedActivePress);
      }
    }
  }

  .btn-content-container {
    display: flex;
    align-items: center;
    gap: var(--spacingXS);
    justify-content: center;
  }

  .btn-icon-container {
    display: inline-flex;
    align-items: center;
  }

  .btn-block {
    width: 100%;
    justify-content: center;
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
  }
  .btn-disabled-state,
  .btn-disabled-state:hover,
  .btn-disabled-state:focus,
  .btn-disabled-state:active {
    background: var(--color-interactionDisable);
    color: var(--color-textShy);
    border: 1px solid transparent;
    cursor: not-allowed;
    box-shadow: none;

    &.btn-primary-shy {
      background: none;
    }
  } */
</style>
