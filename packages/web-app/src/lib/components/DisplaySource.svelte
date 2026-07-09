<script lang="ts">
  import { getContext } from 'svelte';
  import { Text } from '@soliguide/design-system';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import type { Source } from '$lib/models/types';
  import type { I18nStore } from '$lib/client/types';

  const i18n: I18nStore = getContext(I18N_CTX_KEY);

  export let sources: Source[] = [];
  export let color: 'neutral' | 'inverse' = 'neutral';
</script>

<Text type="caption2" {color}>
  {$i18n.t('SOURCE')}
  {#each sources as source, index}
    {#if source.url}
      <a class="display-source-link" href={source.url} target="_blank">{source.label}</a>
    {:else}
      {source.label}
    {/if}
    {#if source.licenseLabel && source.licenseLink}(<a
        class="display-source-license-link"
        href={source.licenseLink}
        target="_blank">{source.licenseLabel}</a
      >){/if}
    {#if index < sources.length - 1}<span>, </span>{/if}
  {/each}
</Text>

<style lang="scss">
  .display-source-link {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  .display-source-license-link {
    text-decoration: revert;
  }
</style>
