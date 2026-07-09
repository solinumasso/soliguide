<script lang="ts">
  import { getContext } from 'svelte';
  import CheckMark from '$lib/components/icons/CheckMark.svelte';
  import type { ToggleSwitchSize } from '$lib/types/ToggleSwitch';
  import type { ThemeContext } from '$lib/types/theme';

  export let size: ToggleSwitchSize = 'medium';
  export let disabled = false;
  export let checked = false;

  const { theme } = getContext<ThemeContext>('theme');

  $: sizeClass = size === 'medium' ? 'toggle-switch-medium' : 'toggle-switch-small';
  $: checkmarkSize = size === 'medium' ? 16 : 12;
  $: iconColor = disabled ? $theme.color.textShy : $theme.color.textSuccess;
</script>

<label class={`toggle-switch ${sizeClass}`}>
  <input
    type="checkbox"
    role="switch"
    bind:checked
    class="sr-only"
    {disabled}
    on:change
    {...$$restProps}
  />
  <span class="toggle-switch-handle"
    ><span class="toggle-switch-checkmark"
      ><CheckMark color={iconColor} size={checkmarkSize} tabindex="-1" inert /></span
    ></span
  >
</label>

<style lang="scss">
  .toggle-switch {
    cursor: pointer;
    display: flex;
    align-items: center;
    border-radius: var(--radiusFull);
    background-color: var(--color-textNeutral);

    &.disabled,
    &:disabled,
    &:disabled:hover {
      cursor: not-allowed;
    }

    &:hover {
      cursor: pointer;
    }
    &:focus,
    &:active {
      outline: none;
    }

    &:has(input:checked) {
      background-color: var(--color-textSuccess);
      .toggle-switch-handle {
        transform: translateX(100%);
        .toggle-switch-checkmark {
          display: inline-flex;
        }
      }
    }

    &:has(input:disabled),
    &:has(input:disabled):hover,
    &:has(input:disabled):focus,
    &:has(input:disabled):active {
      background-color: var(--color-interactionDisable);
    }

    .toggle-switch-handle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      background-color: var(--color-surfaceWhite);
      border-radius: var(--radiusFull);
      transition: transform 0.15s;
      .toggle-switch-checkmark {
        display: none;
      }
    }
  }

  .toggle-switch-small {
    height: 24px;
    width: 42px;
    padding: 0 3px;

    .toggle-switch-handle {
      $toggle-switch-handle-size: 18px;
      height: $toggle-switch-handle-size;
      width: $toggle-switch-handle-size;
    }
  }

  .toggle-switch-medium {
    height: 32px;
    width: 56px;
    padding: 0 4px;

    .toggle-switch-handle {
      $toggle-switch-handle-size: 24px;
      height: $toggle-switch-handle-size;
      width: $toggle-switch-handle-size;
    }
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    border: 0;
    clip: rect(0, 0, 0, 0);
    overflow: hidden;
  }
</style>
