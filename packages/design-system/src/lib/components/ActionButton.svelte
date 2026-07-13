<script lang="ts">
  import { createEventDispatcher, type SvelteComponent, type ComponentType } from 'svelte';
  import Button from '$lib/components/buttons/Button.svelte';
  import ToggleButton from '$lib/components/ToggleButton.svelte';
  import type { TopbarActionType } from '$lib/types/TopbarAction';

  export let type: TopbarActionType = 'button';
  export let label: string;
  export let reversed = false;
  export let icon: ComponentType<SvelteComponent>;
  export let iconColor: string | null = null;
  export let active = false;

  const dispatch = createEventDispatcher();
</script>

{#if type === 'toggle'}
  <ToggleButton
    aria-label={label}
    type={reversed ? 'primaryReversed' : 'primaryShy'}
    {icon}
    {iconColor}
    checked={active}
    on:change={() => dispatch('action')}
  />
{:else}
  <Button
    iconPosition="iconOnly"
    aria-label={label}
    type={reversed ? 'reversed' : 'shy'}
    on:click={() => dispatch('action')}
  >
    <svelte:component this={icon} slot="icon" {...iconColor ? { color: iconColor } : {}} />
  </Button>
{/if}
