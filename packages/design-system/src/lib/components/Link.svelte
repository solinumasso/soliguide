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
  import type { SvelteComponent, ComponentType } from 'svelte';

  import type { LinkColor, LinkSize } from '$lib/types';

  export let isExternal = false;
  export let href = '';
  export let iconLeft = false;
  export let disabled = false;
  export let underline = false;
  export let icon: ComponentType<SvelteComponent> | null = null;
  export let size: LinkSize = 'small';
  export let color: LinkColor = 'primary';

  const colorMapping: Record<LinkColor, string> = {
    primary: 'link-primary',
    neutral: 'link-neutral',
    reversed: 'link-reversed'
  };

  const sizeMapping: Record<LinkSize, { text: string; icon: number }> = {
    xsmall: { text: 'text-secondary-caption1-bold', icon: 16 },
    small: { text: 'text-secondary-text2-bold', icon: 20 }
  };

  $: linkClass = `link ${colorMapping[color]} ${sizeMapping[size].text} ${iconLeft ? 'link-icon-left' : 'link-icon-right'}`;
  $: target = isExternal ? '_blank' : '_self';
</script>

{#if !disabled}
  <a {href} class={linkClass} {target} class:underline>
    {#if icon && iconLeft}
      <svelte:component this={icon} size={sizeMapping[size].icon} />
    {/if}
    <slot />
    {#if icon && !iconLeft}
      <svelte:component this={icon} size={sizeMapping[size].icon} />
    {/if}
  </a>
{:else}
  <span class={linkClass} class:disabled>
    {#if icon && iconLeft}
      <svelte:component this={icon} size={sizeMapping[size].icon} />
    {/if}
    <slot />
    {#if icon && !iconLeft}
      <svelte:component this={icon} size={sizeMapping[size].icon} />
    {/if}
  </span>
{/if}

<style>
  /* .link {
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: var(--spacing3XS);

    &:hover {
      cursor: pointer;
    }

    &:focus,
    &:active {
      outline: none;
    }
    &.link-primary {
      color: var(--color-interactionHighlightPrimary);

      &:hover {
        color: var(--color-interactionHighlightPrimaryHover);
      }

      &:active,
      &:focus-visible {
        color: var(--color-interactionHighlightPrimaryPress);
      }
    }

    &.link-neutral {
      color: var(--color-interactionNeutral);
      &:hover {
        color: var(--color-interactionNeutralHover);
      }

      &:active,
      &:focus-visible {
        color: var(--color-interactionNeutralPress);
      }
    }

    &.link-reversed {
      color: var(--color-textInverse);

      &:hover {
        color: var(--color-interactionReversedHover);
      }

      &:active,
      &:focus-visible {
        color: var(--color-interactionReversedPress);
      }
    }

    &.underline {
      text-decoration: underline;
    }
    &.disabled {
      color: var(--color-textShy);
      pointer-events: none;
    }
  } */
</style>
