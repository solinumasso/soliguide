<script lang="ts">
  import type { ListItemType } from '$lib/types/ListItem';
  import { createEventDispatcher } from 'svelte';

  export let type: ListItemType;
  export let href: string | null = null;
  export let disabled = false;

  const dispatch = createEventDispatcher();
</script>

{#if href && (type === 'link' || type === 'externalLink')}
  <a
    {href}
    target={type === 'externalLink' ? '_blank' : '_self'}
    class="item-container"
    class:disabled
    on:click={() => dispatch('click')}
  >
    <slot />
  </a>
{:else if type === 'actionFull'}
  <button on:click={() => dispatch('click')} class="item-container" {disabled}>
    <slot />
  </button>
{:else}
  <div class="item-container">
    <slot />
  </div>
{/if}

<style>
  .item-container {
    display: flex;
    align-items: center;
    gap: var(--spacingXS);
    padding: var(--spacingLG) var(--spacingXS);
    min-height: 64px;
  }

  button {
    text-align: left;
    cursor: pointer;
    width: 100%;
    &:disabled {
      cursor: not-allowed;
    }
  }

  a {
    text-decoration: none;
    &.disabled {
      cursor: not-allowed;
    }
  }
</style>
