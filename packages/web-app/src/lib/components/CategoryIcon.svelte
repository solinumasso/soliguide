<script lang="ts">
  import { type types as DSTypes } from '@soliguide/design-system';
  import { Categories } from '@soliguide/common';

  export let categoryId: Categories;

  export let variation: DSTypes.VariationType = 'outlined';
  // eslint-disable-next-line no-undef-init, no-undefined
  export let size: number | undefined = undefined;

  $: icon = `category-icon-${categoryId.toLowerCase()}${variation === 'outlined' ? '_outlined' : ''}`;
</script>

<span class={icon} style={size ? `font-size: ${size}px` : ''} aria-hidden="true"></span>
