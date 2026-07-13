<script lang="ts">
  import type { VariationType } from '$lib/types/Icons';
  export let size = '24';
  export let color = 'currentColor';
  export let variation: VariationType = 'outlined';
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  {...$$restProps}
  width={size}
  height={size}
  fill={color}
  aria-hidden="true"
  viewBox="0 0 24 24"
>
  {#if variation === 'outlined'}
    <path d="m12.36 6 .4 2H18v6h-3.36l-.4-2H7V6h5.36M14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6L14 4z" />
  {:else if variation === 'filled'}
    <path d="M14.4 6 14 4H5v17h2v-7h5.6l.4 2h7V6z" />
  {/if}
</svg>
