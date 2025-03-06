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

  const handleClick = (item: string) => {
    dispatch('menuClick', {
      item
    });
  };
</script>

<nav class="menu">
  <ul role="menu">
    {#each menuItems as item}
      {@const active = item.route === activeItem}
      <li class:active aria-label={active ? item.ariaLabelActive : item.ariaLabel} role="menuitem">
        {#if active}
          <span class="menu-item">
            <span class="menu-icon active">
              <svelte:component this={item.iconActive} size="20" />
            </span>
            <Text color="highlightSecondary2" type="caption2Medium">{item.label}</Text>
          </span>
        {:else}
          <a class="menu-item" href={item.route} on:click={() => handleClick(item.label)}>
            <span class="menu-icon">
              {#if item.hasBadge && showBadge}
                <span class="icon-badge"><Badge type="focus" /></span>
              {/if}
              <span class="icon-inactive"><svelte:component this={item.icon} size="20" /></span>
              <span class="icon-active"><svelte:component this={item.iconActive} size="20" /></span>
            </span>
            <Text type="caption2Medium">{item.label}</Text>
          </a>
        {/if}
      </li>
    {/each}
  </ul>
</nav>

<style lang="scss">
  nav {
    background-color: var(--color-surfaceWhite);
    height: var(--menu-height);
    box-shadow: var(--shadowXL);
  }
  ul {
    height: var(--menu-height);
    padding: var(--spacing2XS) var(--spacingLG) var(--spacingXS);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  li {
    color: var(--color-textDark);

    .menu-item {
      min-width: 64px;
      display: flex;
      align-items: center;
      flex-direction: column;
      gap: var(--spacing4XS);
    }

    .menu-icon {
      height: 28px;
      border-radius: var(--radiusRounded);
      background-color: transparent;
      padding: 0 var(--spacingXS);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      &.active {
        background-color: var(--color-surfacePrimary2);
      }
    }

    a {
      text-decoration: none;
      .icon-inactive {
        display: flex;
      }
      .icon-active {
        display: none;
      }
    }

    &:hover:not(.active),
    &:active {
      color: var(--color-textHighlightPrimary);
      a {
        .menu-icon {
          background-color: var(--color-surfaceGray3);
        }

        @media (pointer: fine) {
          .icon-inactive {
            display: none;
          }
          .icon-active {
            display: flex;
          }
        }
      }
    }

    &.active {
      color: var(--color-textHighlightPrimary);
    }
  }

  .icon-badge {
    position: absolute;
    top: -0.25rem;
    right: 0.375rem;
  }
</style>
