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
  import Text from '$lib/components/Text.svelte';
  import type { BadgeType } from '$lib/types/Badge';

  export let type: BadgeType = 'focus';
  export let text: string | null = null;
  export let offset: [number, number] = [0, 0];

  const typeMapping: Record<BadgeType, string> = {
    focus: 'badge-focus',
    success: 'badge-success',
    error: 'badge-error',
    warning: 'badge-warning',
    reversed: 'badge-reversed'
  };

  $: badgeClass = `badge ${typeMapping[type]}`;
  $: offsetStyle = `top: ${offset[0]}px; right: ${offset[1]}px;`;
</script>

<div class="badge-container">
  <div class:adjusted-position={$$slots.default} style={$$slots.default ? offsetStyle : ''}>
    {#if text}
      <span class={`${badgeClass} pill`}><Text type="caption1Bold">{text}</Text></span>
    {:else}
      <span class={`${badgeClass} dot`} />
    {/if}
  </div>
  <slot />
</div>

<style>
  /* .badge-container {
    position: relative;
    display: inline-flex;
  }

  .badge {
    display: flex;
    align-items: center;
    justify-content: center;

    &.badge-focus {
      background: var(--color-textFocus);
      color: var(--color-textInverse);
    }

    &.badge-success {
      background: var(--color-textSuccess);
      color: var(--color-textInverse);
    }

    &.badge-error {
      background: var(--color-textError);
      color: var(--color-textInverse);
    }

    &.badge-warning {
      background: var(--color-textWarning);
      color: var(--color-textInverse);
    }

    &.badge-reversed {
      background: var(--color-textInverse);
      color: var(--color-textDark);
    }
  }

  .dot {
    border-radius: var(--radiusFull);
    width: 0.5rem;
    height: 0.5rem;
  }

  .pill {
    border-radius: var(--radiusFull);
    min-width: 1.125rem;
    min-height: 1.125rem;
    padding: 0 var(--spacing2XS);
  }

  .adjusted-position {
    position: absolute;
    transform: translate(50%, -50%);
    transform-origin: 100% 0;
  } */
</style>
