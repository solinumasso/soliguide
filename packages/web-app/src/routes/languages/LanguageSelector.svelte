<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { ToggleButton } from '@soliguide/design-system';
  import type { LanguageOption } from './types';

  export let options: LanguageOption[] = [];
  export let selectedOption: string | null = null;

  const dispatch = createEventDispatcher();
</script>

<section>
  {#each options as option, i}
    <button
      class:odd-last={i === options.length - 1 && options.length % 2 === 1}
      role="radio"
      tabindex={i}
      aria-checked={selectedOption === option.code}
      type="button"
    >
      <ToggleButton
        checked={selectedOption === option.code}
        value={option.code}
        block
        icon={option.flag}
        on:change={() => dispatch('change', option.code)}
      >
        {option.nativeName}
      </ToggleButton>
    </button>
  {/each}
</section>

<style lang="scss">
  $column-gap: var(--spacingXL);
  section {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: var(--spacingLG);
    column-gap: $column-gap;
    justify-items: stretch;

    // When total of options is odd, center the last element
    .odd-last {
      transform: translateX(calc(50% + ($column-gap / 2)));
    }
  }
</style>
