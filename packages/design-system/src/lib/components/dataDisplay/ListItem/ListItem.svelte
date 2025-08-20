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
  import ChevronRight from 'svelte-google-materialdesign-icons/Chevron_right.svelte';
  import Text from '$lib/components/Text.svelte';
  import Button from '$lib/components/buttons/Button.svelte';
  import ListItemContainer from './ListItemContainer.svelte';
  import type { ListItemSize, ListItemType, ListItemShape } from '$lib/types/ListItem';
  import type { TextType } from '$lib/types/Text';
  import { createEventDispatcher } from 'svelte';

  export let size: ListItemSize = 'medium';
  export let type: ListItemType = 'display';
  export let shape: ListItemShape = 'default';

  // States
  export let disabled = false;

  // Url to redirect
  export let href: string | null = null;

  // Subtext
  export let title: string | null = null;
  export let subTitle: string | null = null;

  const itemTextSizeMapping: Record<ListItemSize, TextType> = {
    small: 'caption1Medium',
    medium: 'text2Medium'
  };

  const itemSubTextSizeMapping: Record<ListItemSize, TextType> = {
    small: 'caption1',
    medium: 'text2'
  };

  $: itemClass = `item ${shape} ${type}`;

  const dispatch = createEventDispatcher();
  const handleClick = (event: Event) => {
    dispatch('click', event); // Forward click event
  };
</script>

<li class={itemClass} class:disabled role="list">
  <ListItemContainer on:click={handleClick} {href} {type} {disabled}>
    {#if $$slots.icon}
      <span aria-hidden="true" class="item-icon-container left-icon-container">
        <slot name="icon" />
      </span>
    {/if}
    <div class="item-texts">
      <Text type={itemTextSizeMapping[size]} as="p">{title}</Text>
      {#if subTitle}
        <Text type={itemSubTextSizeMapping[size]} color="shy" as="p">{subTitle}</Text>
      {/if}
    </div>

    {#if type === 'actionRight'}
      <span class="action-btn">
        <Button size="xsmall" iconPosition="iconOnly" on:click={handleClick} type="shy" {disabled}>
          <slot name="actionIcon" slot="icon" />
        </Button>
      </span>
    {:else if type === 'link' || type === 'externalLink' || type === 'actionFull'}
      <span class="item-icon-container">
        <ChevronRight size="20" />
      </span>
    {/if}
  </ListItemContainer>
</li>

<style>
  /* .item {
    background-color: transparent;
    list-style: none;
    border-bottom: 1px solid transparent;

    &.bordered {
      border-bottom: 1px solid var(--color-borderNeutral);
    }

    &.rounded {
      border-radius: var(--radiusRounded);
      background-color: var(--color-interactionReversedHover);
    }

    // The item's hover state is triggered only when hovering the action button
    &.action {
      pointer-events: none;

      & .action-btn {
        border-radius: var(--radiusFull);
        pointer-events: auto;
      }

      &:hover {
        background-color: deeppink;
      }
    }

    &:not(.disabled):not(.display) {
      &:hover {
        cursor: pointer;
        background-color: var(--color-interactionOutlinedHover);
      }

      &:active {
        background-color: var(--color-interactionOutlinedPress);
      }
    }

    &.disabled {
      cursor: not-allowed;

      &.rounded {
        background-color: var(--color-interactionDisable);
      }

      .item-icon-container {
        color: var(--color-textShy);
        background-color: transparent;
      }

      .item-texts {
        color: var(--color-textShy);
      }
    }
  }

  .item-texts {
    flex-grow: 2;
    word-break: break-all;
  }

  .item-icon-container {
    display: flex;
    align-items: center;
  } */
</style>
