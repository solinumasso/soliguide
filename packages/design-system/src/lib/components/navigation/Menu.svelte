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
  import type { MenuItem } from '$lib/types/Menu';
  import { createEventDispatcher } from 'svelte';
  import Badge from '../dataDisplay/Badge.svelte';
  import Text from '../Text.svelte';

  export let menuItems: MenuItem[] = [];
  export let activeItem: string;
  export let showBadge = false;

  const dispatch = createEventDispatcher();

  const handleClick = (item: MenuItem) => {
    dispatch('menuClick', {
      item: item.id
    });
  };
</script>

<nav class="bg-surfaceWhite h-menu-height shadow-xl">
  <ul role="menu" class="h-menu-height flex justify-between items-center px-lg pt-2xs pb-xs">
    {#each menuItems as item}
      {@const active = item.route === activeItem}
      <li
        class={`text-dark ${active ? 'text-highlightPrimary!' : ''}`}
        aria-label={active ? item.ariaLabelActive : item.ariaLabel}
        role="menuitem"
      >
        {#if active}
          <span class="flex min-w-[64px] flex-col items-center gap-4xs">
            <span
              class="flex items-center justify-center h-7 rounded-rounded bg-surfacePrimary2 relative px-xs"
            >
              <svelte:component this={item.iconActive} size="20" />
            </span>
            <span class="text-highlightPrimary2">
              <Text type="caption2Medium">{item.label}</Text>
            </span>
          </span>
        {:else}
          <a
            class="flex min-w-[64px] flex-col items-center gap-4xs no-underline"
            href={item.route}
            on:click={() => handleClick(item)}
          >
            <span
              class="flex items-center justify-center h-7 rounded-rounded bg-transparent relative group"
            >
              {#if item.hasBadge && showBadge}
                <span class="absolute -top-1 right-1.5"><Badge type="focus" /></span>
              {/if}
              <span class="flex group-hover:hidden"
                ><svelte:component this={item.icon} size="20" /></span
              >
              <span class="hidden group-hover:flex"
                ><svelte:component this={item.iconActive} size="20" /></span
              >
            </span>
            <span class="group-hover:text-highlightPrimary2">
              <Text type="caption2Medium">{item.label}</Text>
            </span>
          </a>
        {/if}
      </li>
    {/each}
  </ul>
</nav>
