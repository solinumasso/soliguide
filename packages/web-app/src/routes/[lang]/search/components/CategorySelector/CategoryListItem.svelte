<script lang="ts">
  import { ListItem } from '@soliguide/design-system';

  export let title;
  export let subTitle = '';
  export let navigable = false;
</script>

<ListItem {subTitle} {title} shape="default" type={navigable ? 'actionFull' : 'display'} on:click>
  <span class="icon-container" slot="icon">
    <slot name="icon" />
  </span>
</ListItem>

<style lang="scss">
  .icon-container {
    color: var(--color-textHighlightSecondary);
    display: flex;
    align-items: center;

    :global(svg) {
      height: 24px;
      width: 24px;
    }
  }
</style>
