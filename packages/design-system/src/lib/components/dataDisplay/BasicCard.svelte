<script lang="ts">
  import type { BasicCardType } from '$lib/types/BasicCard';

  export let type: BasicCardType = 'default';
</script>

<section class:primary={type === 'primary'} class:secondary={type === 'secondary'}>
  <slot />
</section>

<style lang="scss">
  section {
    padding: var(--spacingLG);
    border-radius: var(--radiusRounded);
    box-shadow: var(--shadowMD);
    background-color: var(--color-surfaceWhite);

    &.primary {
      background-color: var(--color-surfacePrimary2);
    }
    &.secondary {
      background-color: var(--color-surfaceSecondary2);
    }
  }
</style>
