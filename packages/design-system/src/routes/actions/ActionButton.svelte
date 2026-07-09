<script lang="ts">
  import { createEventDispatcher, type SvelteComponent, type ComponentType } from 'svelte';
  import Button from '$lib/components/buttons/Button.svelte';
  import ToggleButton from '$lib/components/ToggleButton.svelte';
  import type { ActionButtonType } from '../types';

  export let type: ActionButtonType = 'button';
  export let label: string;
  export let reversed = false;
  export let icon: ComponentType<SvelteComponent>;

  const dispatch = createEventDispatcher();
</script>

{#if type === 'toggle'}
  <ToggleButton
    aria-label={label}
    type={reversed ? 'primaryReversed' : 'primaryShy'}
    {icon}
    on:change={() => dispatch('action')}
  />
{:else}
  <Button
    iconPosition="iconOnly"
    {icon}
    aria-label={label}
    type={reversed ? 'reversed' : 'shy'}
    on:click={() => dispatch('action')}
  >
    <svelte:component this={icon} slot="icon" />
  </Button>
{/if}
