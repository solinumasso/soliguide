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

  // Mapping Tailwind classes pour la taille
  const sizeMapping: Record<ToggleButtonSize, string> = {
    xsmall: 'h-6 min-w-6 px-md rounded-middle text-secondary-caption1-bold',
    medium: 'h-10 min-w-10 px-lg rounded-middle text-secondary-text1-bold',
    large: 'h-13 min-w-13 px-xl rounded-rounded text-secondary-text1-bold'
  };

  // Mapping Tailwind classes pour le type
  const typeMapping: Record<ToggleButtonType, string> = {
    secondaryBordered:
      'border border-borderNeutral bg-transparent text-dark hover:bg-interactionOutlinedSecondaryHover focus-visible:bg-interactionOutlinedSecondaryPress active:bg-interactionOutlinedSecondaryPress',
    secondaryOutline:
      'bg-interactionOutlinedSecondary shadow-xs text-dark hover:bg-interactionOutlinedSecondaryHover focus-visible:bg-interactionOutlinedSecondaryPress active:bg-interactionOutlinedSecondaryPress',
    primaryShy:
      'bg-transparent text-interactionNeutral hover:bg-interactionReversedHover hover:text-highlightPrimary focus-visible:bg-interactionReversedPress focus-visible:text-interactionHighlightPrimaryPress active:bg-interactionReversedPress',
    primaryReversed:
      'bg-surfaceWhiteAlphaLight text-interactionReversed hover:bg-interactionReversedHover focus-visible:bg-interactionReversedPress active:bg-interactionReversedPress'
  };

  $: btnClass = `inline-flex items-center justify-center font-secondary border border-transparent cursor-pointer whitespace-nowrap select-none transition-colors duration-100 ${sizeMapping[size]} ${typeMapping[type]}${disabled ? ' bg-interactionDisable text-shy cursor-not-allowed shadow-none border-transparent' : ''}`;
  $: iconOnly = type === 'primaryShy' || type === 'primaryReversed' || iconOnly;
</script>

<label
  class={`${btnClass}${checked ? ' bg-interactionOutlinedSecondaryActive text-inverse' : ''}${iconOnly ? ' p-0 w-full rounded-full justify-center' : ''}${block ? ' w-full' : ''}`}
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
  <span class="flex items-center gap-xs justify-center">
    {#if !!icon}
      <span class="inline-flex items-center">
        <svelte:component
          this={icon}
          class={iconOnly
            ? 'w-6 h-6'
            : size === 'xsmall'
              ? 'w-4 h-4'
              : size === 'large'
                ? 'w-8 h-8'
                : 'w-5 h-5'}
          aria-hidden="true"
        />
      </span>
    {/if}
    {#if !iconOnly}
      <slot />
    {/if}
  </span>
</label>
