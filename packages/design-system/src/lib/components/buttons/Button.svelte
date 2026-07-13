<script lang="ts">
  import Spinner from '$lib/components/Spinner.svelte';
  import { sizeMapping, typeMapping, spinnerSizeMapping } from './buttonsMapping';
  import type { ButtonShape, ButtonSize, ButtonType, IconPosition } from '$lib/types/Button';
  import type { SpinnerType } from '$lib/types/Spinner';

  export let size: ButtonSize = 'medium';
  export let type: ButtonType = 'primaryFill';
  export let shape: ButtonShape = 'square';
  export let iconPosition: IconPosition | null = null;
  export let disabled = false;
  export let block = false;
  export let submit = false;
  export let isLoading = false;

  const getSpinnerType = (buttonType: ButtonType): SpinnerType => {
    switch (buttonType) {
      case 'neutralFill':
        return 'reversed';
      case 'neutralOutlined':
      case 'primaryOutline':
        return 'primary';
      case 'reversed':
        return 'reversed';
      default:
        return 'neutral';
    }
  };
  // Shape is forced for icon buttons
  $: btnShapeIsRounded = iconPosition === 'iconOnly' || shape === 'rounded';
  $: btnClass = `btn ${sizeMapping[size]} ${typeMapping[type]}`;
  // Parameters for loading button
  $: spinnerType = getSpinnerType(type);
  $: spinnerSize = spinnerSizeMapping[size];
</script>

<button
  type={submit ? 'submit' : 'button'}
  on:click
  class={btnClass}
  class:btn-disabled-state={disabled}
  class:btn-block={block}
  class:btn-rounded={btnShapeIsRounded}
  class:btn-icon={iconPosition === 'iconOnly'}
  {disabled}
  {...$$restProps}
>
  <span class="btn-loader-container" class:loading={isLoading}>
    <Spinner size={spinnerSize} type={spinnerType}></Spinner>
  </span>
  <span
    class="btn-content-container"
    class:reversed={iconPosition === 'reversed'}
    class:hidden={isLoading}
  >
    {#if $$slots.icon}
      <span class="btn-icon-container">
        <slot name="icon" />
      </span>
    {/if}
    {#if iconPosition !== 'iconOnly'}
      <slot />
    {/if}
  </span>
</button>

<style lang="scss">
  @import '../../styles/typography.scss';
  @import '../../styles/components/buttons.scss';
  // Basic styles

  // All button types have the same disabled state
  .btn-disabled-state {
    &:disabled,
    &:disabled:hover,
    &:disabled:focus,
    &:disabled:focus:hover {
      background: var(--color-interactionDisable);
      color: var(--color-textShy);
      box-shadow: none;
      border: 1px solid transparent;
      &.btn-shy.btn-icon,
      &.btn-reversed.btn-icon {
        box-shadow: none;
        background: none;
      }
      &.btn-shy {
        background: none;
      }
    }
  }
</style>
