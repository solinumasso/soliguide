<script lang="ts">
  import type { TileVariant } from '$lib/types/Tile';

  export let withIcon = true;
  export let label: string;
  export let variant: TileVariant;
  /** When true, the tile becomes an interactive button and forwards its click event */
  export let clickable = false;

  $: tileClass = `tile ${variant}`;
  $: iconClass = `tile-icon ${variant}`;
</script>

{#if clickable}
  <button type="button" class={tileClass} on:click>
    {#if withIcon}
      <span class={iconClass}>
        <slot />
      </span>
    {/if}
    <p class="tile-text text-secondary-text2-medium">
      {label}
    </p>
  </button>
{:else}
  <div class={tileClass}>
    {#if withIcon}
      <span class={iconClass}>
        <slot />
      </span>
    {/if}
    <p class="tile-text text-secondary-text2-medium">
      {label}
    </p>
  </div>
{/if}

<style lang="scss">
  .tile {
    width: 100%;
    padding: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: center;
    gap: var(--spacingXS);
    border-radius: var(--spacingXS);
    box-shadow: var(--shadowXS);
  }

  button.tile {
    border: none;
    font: inherit;
    cursor: pointer;
    text-align: center;
  }

  .tile {
    &.primary {
      background-color: var(--color-surfacePrimary2);
    }

    &.secondary {
      background-color: var(--color-surfaceSecondary1);
    }

    &.tertiary {
      background-color: var(--color-surfaceTertiary2);
    }

    .tile-text {
      color: var(--textNeutral);
    }

    .tile-icon {
      border-radius: var(--radiusFull);
      width: 24px;
      height: 24px;
      padding: var(--spacing3XS);
      gap: 10px;

      &.primary {
        background-color: var(--color-surfaceSecondary1);
        color: var(--color-textHighlightTertiary);
      }

      &.secondary {
        background-color: var(--color-surfaceTertiary1);
        color: var(--color-textHighlightSecondary);
      }

      &.tertiary {
        background-color: var(--color-surfacePrimary1);
        color: var(--color-textHighlightPrimary);
      }
    }
  }
</style>
