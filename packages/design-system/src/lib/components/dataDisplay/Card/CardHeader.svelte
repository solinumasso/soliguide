<script lang="ts">
  export let disabled = false;
</script>

<section class="card-header" class:disabled on:click role="button" tabindex="0" on:keydown>
  <slot />
</section>

<style lang="scss">
  .card-header {
    background: var(--color-surfaceSecondaryGradient);
    color: var(--color-textInverse);
    padding: var(--spacingXL, 24px) var(--spacingLG, 16px);
    border-radius: var(--radiusRounded) var(--radiusRounded) 0 0;

    &:hover {
      cursor: pointer;
      background: var(--color-interactionHighlightSecondary);
    }
    &:active {
      background: var(--color-interactionHighlightSecondaryPress);
    }

    &.disabled {
      background: var(--color-overlayStrong);
      cursor: default;
    }

    &.disabled:hover,
    &.disabled:active {
      background: var(--color-OverlayStrong);
    }
  }
</style>
