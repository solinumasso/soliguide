<script lang="ts">
  import { sizeMapping, typeMapping } from './buttonsMapping';
  import type { ButtonShape, ButtonSize, ButtonType, IconPosition } from '../../types/Button';
  import { createEventDispatcher } from 'svelte';

  export let size: ButtonSize = 'medium';
  export let href: string;
  export let type: ButtonType = 'primaryFill';
  export let shape: ButtonShape = 'square';
  export let iconPosition: IconPosition | null = null;
  export let disabled = false;
  export let block = false;
  export let blank = false;

  // Shape is forced for icon buttons
  $: btnShapeIsRounded = iconPosition === 'iconOnly' || shape === 'rounded';
  $: btnClass = `btn ${sizeMapping[size]} ${typeMapping[type]}`;

  const dispatch = createEventDispatcher();
</script>

<a
  href={disabled ? null : href}
  target={blank ? '_blank' : null}
  class={btnClass}
  tabindex={disabled ? -1 : 0}
  class:btn-disabled-state={disabled}
  class:btn-block={block}
  class:btn-rounded={btnShapeIsRounded}
  class:btn-icon={iconPosition === 'iconOnly'}
  {...$$restProps}
  on:click={(event) => {
    dispatch('click', event);
  }}
>
  <span class="btn-content-container" class:reversed={iconPosition === 'reversed'}>
    {#if $$slots.icon}
      <span class="btn-icon-container">
        <slot name="icon" />
      </span>
    {/if}
    {#if iconPosition !== 'iconOnly'}
      <slot />
    {/if}
  </span>
</a>

<style lang="scss">
  @import '../../styles/typography.scss';
  @import '../../styles/components/buttons.scss';

  // All button types have the same disabled state
  .btn-disabled-state {
    background: var(--color-interactionDisable);
    color: var(--color-textShy);
    box-shadow: none;
    border: 1px solid transparent;

    &:hover,
    &:focus,
    &:active {
      background: var(--color-interactionDisable);
      color: var(--color-textShy);
      cursor: not-allowed;
    }

    &.btn-shy.btn-icon,
    &.btn-reversed.btn-icon {
      box-shadow: none;
      background: none;
    }
    &.btn-shy {
      background: none;
    }
  }
</style>
