<script lang="ts">
  import Menu from './Menu.svelte';
</script>

<Menu />
<section>
  <slot />
</section>

<style lang="scss">
  section {
    min-height: 100vh;
    padding-bottom: var(--menu-height);
    background: var(--color-gradientBackground);
  }
</style>
