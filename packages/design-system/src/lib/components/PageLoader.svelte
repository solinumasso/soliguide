<script lang="ts">
  import Spinner from './Spinner.svelte';

  export let loading = false;
  export let fullPage = false;
</script>

{#if loading}
  <section class="loader" class:full-page={fullPage}>
    <Spinner type="primaryWithBackground" />
  </section>
{:else}
  <slot />
{/if}

<style lang="scss">
  .loader {
    display: flex;
    justify-content: center;
    padding-top: var(--spacingLG);

    &.full-page {
      padding-top: var(--spacing2XL);
    }
  }
</style>
