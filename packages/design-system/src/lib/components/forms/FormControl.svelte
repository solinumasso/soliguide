<script lang="ts">
  import Dangerous from 'svelte-google-materialdesign-icons/Dangerous.svelte';
  import Text from '../Text.svelte';

  export let label = '';
  export let required = false;
  export let helper = '';
  export let errorMessage = '';
  let htmlFor = '';
  // Because the prop name is a reserved word
  export { htmlFor as for };
</script>

<div class="form-control" {...$$restProps}>
  <label class="label text-secondary-text2-regular" for={htmlFor}>
    <span class:required>{label}</span>
    {#if helper}
      <span class="helper text-secondary-caption2-regular">{helper}</span>
    {/if}
  </label>

  <slot />

  {#if errorMessage}
    <div class="error">
      <Dangerous size="10px" class="error-dangerous-icon" variation="filled" />
      <Text type="caption1">{errorMessage}</Text>
    </div>
  {/if}
</div>

<style lang="scss">
  .form-control {
    display: flex;
    flex-direction: column;
    gap: var(--spacing3XS);

    .label {
      display: flex;
      flex-direction: column;
      gap: var(--spacing3XS);
      color: var(--color-textDark);
      padding: 0 0 var(--spacing3XS) var(--spacing3XS);
      width: fit-content;

      .required:after {
        content: ' *';
        color: var(--color-textError);
      }
    }
    .helper {
      display: block;
      color: var(--color-textNeutral);
    }
    .error {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      color: var(--color-textError);
      padding-left: var(--spacing3XS);
      gap: var(--spacing3XS);
      overflow-wrap: anywhere;
    }
  }

  .error-dangerous-icon {
    flex-shrink: 0;
  }
</style>
