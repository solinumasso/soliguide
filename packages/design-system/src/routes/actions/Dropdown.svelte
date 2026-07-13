<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Text from '$lib/components/Text.svelte';
  import type { DropdownOption } from '../types';

  export let options: DropdownOption[] = [];

  const dispatch = createEventDispatcher<{ clickMenu: string }>();
</script>

<ul>
  {#each options as option}
    <li>
      <button on:click={() => dispatch('clickMenu', option.eventKey)}>
        <svelte:component this={option.icon} />
        <Text type="text1">{option.label}</Text>
      </button>
    </li>
  {/each}
</ul>

<style lang="scss">
  ul {
    list-style: none;
    background-color: white;
    border-radius: var(--radiusMiddle);
    padding: var(--spacingXS) 0;
  }

  button {
    text-wrap: nowrap;
    display: flex;
    gap: var(--spacingXS);
    width: 100%;

    padding: var(--spacingXS) var(--spacingLG);
    &:hover {
      cursor: pointer;
      background-color: var(--color-surfaceGray1);
    }
  }
</style>
